const express = require('express')
const cors = require('cors')
const { products } = require('../src/data/products')
const path = require('path')
const { parsed: env } = require('dotenv').config({ path: path.join(__dirname, '.env') })
const nodemailer = require('nodemailer')

const app = express()
const PORT = Number(env?.PORT || 4000)
console.log('Server PORT config:', { processEnvPort: process.env.PORT, dotenvPort: env?.PORT, PORT })

app.use(cors())
app.use(express.json())

// Serve product images from public at /images
app.use('/images', express.static(path.join(__dirname, '..', 'public')))

// Simple products API
app.get('/api/products', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`
  const transformed = products.map(p => ({
    ...p,
    image: `${baseUrl}/images/${encodeURIComponent(p.image)}`
  }))
  res.json(transformed)
})

// In-memory map to correlate CheckoutRequestID -> order/email for this demo
const pendingCheckouts = {}

// Helper: get OAuth token from Daraja (sandbox)
async function getDarajaToken() {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET
  if (!consumerKey || !consumerSecret) throw new Error('Daraja consumer key/secret not configured')

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  const url = process.env.DARAJA_OAUTH_URL || 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'

  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
  if (!res.ok) throw new Error('Failed to get Daraja token')
  const data = await res.json()
  return data.access_token
}

function darajaTimestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds())
}

// POST /api/checkout
// body: { phone, amount, items, email, accountReference }
app.post('/api/checkout', async (req, res) => {
  try {
    const { phone, amount, items, email, accountReference } = req.body
    if (!phone || !amount || !email) return res.status(400).json({ error: 'phone, amount, and email are required' })

    const token = await getDarajaToken()

    const shortcode = process.env.DARAJA_SHORTCODE
    const passkey = process.env.DARAJA_PASSKEY
    const callbackUrl = process.env.DARAJA_CALLBACK_URL // must be reachable by Safaricom

    if (!shortcode || !passkey || !callbackUrl) {
      return res.status(500).json({ error: 'Daraja SHORTCODE, PASSKEY or CALLBACK_URL not configured on server' })
    }

    const timestamp = darajaTimestamp()
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || 'ThriftAF',
      TransactionDesc: 'Order payment'
    }

    const stkUrl = process.env.DARAJA_STK_URL || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

    const stkRes = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const stkJson = await stkRes.json()

    // Save mapping so callback can send email when payment completes
    if (stkJson && stkJson.CheckoutRequestID) {
      pendingCheckouts[stkJson.CheckoutRequestID] = { email, items, amount, phone, accountReference }
    }

    res.json({ daraja: stkJson })
  } catch (err) {
    console.error('Checkout error', err)
    res.status(500).json({ error: err.message })
  }
})

// Endpoint for Daraja to POST payment result to
app.post('/api/stkcallback', async (req, res) => {
  try {
    // Daraja sends nested JSON; accept raw body
    const data = req.body
    // respond quickly to Daraja
    res.status(200).json({ Received: true })

    // Extract CheckoutRequestID and result
    const checkoutRequestID = data.Body && data.Body.stkCallback && data.Body.stkCallback.CheckoutRequestID
    if (!checkoutRequestID) return

    const saved = pendingCheckouts[checkoutRequestID]
    if (!saved) return

    const resultCode = data.Body.stkCallback.ResultCode
    const resultDesc = data.Body.stkCallback.ResultDesc

    // send confirmation email depending on result
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      const subject = resultCode === 0 ? 'Payment Successful — Thrift AF order' : 'Payment Update — Thrift AF'
      const text = `Hello,\n\nPayment status: ${resultDesc} (code: ${resultCode})\nAmount: ${saved.amount}\nPhone: ${saved.phone}\nOrder ref: ${saved.accountReference}\n\nThank you for shopping with Thrift AF.`

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
        to: saved.email,
        subject,
        text
      })
    } else {
      console.log('Email not sent — SMTP not configured. Would send to', saved.email)
    }

    // cleanup
    delete pendingCheckouts[checkoutRequestID]
  } catch (err) {
    console.error('stkcallback error', err)
    // still respond 200 to Daraja
    try { res.status(200).json({ ok: true }) } catch (e) {}
  }
})

// For testing: allow manual callback to trigger email (not for production)
app.post('/api/stkcallback/test', async (req, res) => {
  const { checkoutRequestID, resultCode = 0, resultDesc = 'Success' } = req.body
  const saved = pendingCheckouts[checkoutRequestID]
  if (!saved) return res.status(404).json({ error: 'not found' })

  // reuse callback logic by constructing payload shape
  const payload = { Body: { stkCallback: { CheckoutRequestID: checkoutRequestID, ResultCode: resultCode, ResultDesc: resultDesc } } }
  // call internal handler
  try {
    await fetch(`http://localhost:${PORT}/api/stkcallback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return res.json({ triggered: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Products API + checkout running on http://localhost:${PORT}`)
})
