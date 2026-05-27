import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Cart.css'

export default function CheckoutSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}
  const { amount, accountReference, email, phone, message } = state

  useEffect(() => {
    if (!amount || !accountReference) {
      navigate('/cart', { replace: true })
    }
  }, [amount, accountReference, navigate])

  if (!amount || !accountReference) {
    return null
  }

  return (
    <div className="cart-container">
      <div className="checkout-success">
        <h2>Checkout Started</h2>
        <p>{message || 'Your payment is in progress.'}</p>
        <div className="success-details">
          <p><strong>Order reference:</strong> {accountReference}</p>
          <p><strong>Total amount:</strong> KSh {amount}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
        <p className="success-note">Please complete the Mpesa prompt on your phone to finish the payment.</p>
      </div>
    </div>
  )
}
