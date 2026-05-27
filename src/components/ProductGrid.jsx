import './ProductGrid.css';

export default function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <div key={product.id} className="product">
          <div className="product-img-wrap">
            <img src={product.image} alt={product.name} />
            {i < 3 && <span className="product-badge">Hot</span>}
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <div className="product-meta">
              <p>KSh {product.price.toLocaleString()}</p>
              <button
                className="add-to-cart"
                onClick={() => onAddToCart(product)}
              >
                + Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
