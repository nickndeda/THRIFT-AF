import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ onLogout, session }) {
  const navigate = useNavigate();
  
  // Get username from session metadata or sessionStorage
  let displayName = '';
  
  if (session?.user?.user_metadata?.username) {
    displayName = session.user.user_metadata.username;
  } else {
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    displayName = storedUser.username || storedUser.email || '';
  }

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="logo">
        <h1>THRIFT <span>AF</span></h1>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/collections">Collections</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="nav-icons">
        <span className="user-info">{displayName} 👋</span>
        <Link to="/cart" className="cart-icon">🛒</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
