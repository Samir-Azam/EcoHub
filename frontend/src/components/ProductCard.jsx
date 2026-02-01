import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const brand = product.brand?.name || product.brand;
  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">
            <img src="/leaf.svg" alt="" width="40" height="40" />
          </div>
        )}
        {product.ecoScore && (
          <span className="eco-badge">Eco {product.ecoScore}/10</span>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-brand">{brand}</span>
        <h3>{product.name}</h3>
        {product.packagingType && (
          <span className="product-packaging">{product.packagingType}</span>
        )}
        {product.price != null && (
          <p className="product-price">{product.currency || 'USD'} {product.price}</p>
        )}
      </div>
      <style>{`
        .product-card {
          display: block;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-earth-200);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .product-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-earth-400);
          text-decoration: none;
          color: inherit;
        }
        .product-card-image {
          aspect-ratio: 1;
          background: var(--color-earth-100);
          position: relative;
        }
        .product-card-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-earth-500);
        }
        .eco-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          background: var(--color-earth-600);
          color: white;
          border-radius: 6px;
        }
        .product-card-body { padding: 16px; }
        .product-brand { font-size: 0.8rem; color: var(--color-earth-600); }
        .product-card h3 { font-size: 1rem; margin: 6px 0 4px; }
        .product-packaging { font-size: 0.8rem; color: var(--color-ink-muted); }
        .product-price { font-weight: 600; margin-top: 8px; color: var(--color-earth-700); }
      `}</style>
    </Link>
  );
}
