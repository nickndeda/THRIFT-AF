import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(() => {
    const sessionUser = sessionStorage.getItem('user')
    return sessionUser ? JSON.parse(sessionUser).email : ''
  })
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (!phone || !email) {
      setCheckoutMessage('Please enter both phone number and email.')
      return
    }

    const amount = calculateTotal() + 500
    const accountReference = `ThriftAF-${Date.now()}`
    setIsCheckingOut(true)
    setCheckoutMessage('Sending STK push...')

    try {
      const response = await fetch('http://localhost:4000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount,
          items: cartItems,
          email,
          accountReference
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Checkout request failed')
      }

      if (data.daraja && data.daraja.ResponseCode === '0') {
        const successState = {
          amount,
          accountReference,
          email,
          phone,
          message: 'STK Push sent. Check your phone and enter your PIN to complete payment.'
        }
        localStorage.removeItem('cart')
        setCartItems([])
        navigate('/checkout-success', { state: successState })
        return
      }

      setCheckoutMessage(`Checkout request sent. Daraja response: ${data.daraja.ResponseDescription || JSON.stringify(data.daraja)}`)
    } catch (err) {
      console.error(err)
      setCheckoutMessage(`Checkout failed: ${err.message}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty 🛒</p>
          <p className="cart-hint">Add some items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      
      <div className="checkout-details">
        <h3>Checkout Details</h3>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Phone number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="2547XXXXXXXX"
          />
        </label>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">KSh {item.price}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <input 
                type="number" 
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                min="1"
              />
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              <p className="total-price">KSh {calculateItemTotal(item)}</p>
            </div>
            <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>KSh {calculateTotal()}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>KSh 500</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>KSh {calculateTotal() + 500}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
        </button>
        {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}
      </div>
    </div>
  );
}
