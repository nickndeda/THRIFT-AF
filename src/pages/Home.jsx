import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../api/productApi';
import './Home.css';

 

export default function Home({ isLoggedIn }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        console.log('Fetched products (Home):', res.data);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <div className="home-container">

      <section className="hero">
        <p className="hero-eyebrow">New Arrivals 2026</p>
        <h2>
          Stay <em>fresh</em>,<br />
          stay ahead.
        </h2>
        <p>
          Shop exclusive thrifted fashion, jewelry, and accessories curated for modern streetwear culture
        </p>
        <div className="hero-actions">
          <button className="shop-btn" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
          <Link to="/collections" className="hero-link">
            View Collections →
          </Link>
        </div>
      </section>

      <section className="deals">
        <div className="section-header">
          <h2>🔥 Today's Deals</h2>
          <span>Limited drops</span>
        </div>
        <ProductGrid products={products.slice(0, 9)} onAddToCart={handleAddToCart} />
      </section>

      <footer className="footer">
        <p>© 2026 Thrift AF. All Rights Reserved. · Nairobi, Kenya</p>
      </footer>

    </div>
  );
}
