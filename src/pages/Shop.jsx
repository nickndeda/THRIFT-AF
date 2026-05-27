import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../api/productApi';
import './Shop.css';

export default function Shop({ isLoggedIn }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        console.log('Fetched products (Shop):', res.data);
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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="shop-container">
      <h1>Shop All Products</h1>
      
      <div className="filter-section">
        <button 
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'clothing' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('clothing')}
        >
          Clothing
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'jewelry' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('jewelry')}
        >
          Jewelry
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'accessories' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('accessories')}
        >
          Accessories
        </button>
      </div>

      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </div>
  );
}
