import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.products
      .get(slug)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page container"><p>Loading…</p></div>;
  if (!product) return <div className="page container"><p>Product not found.</p></div>;

  const brand = product.brand;

  return (
    <div className="page product-detail">
      <div className="container">
        <Link to="/products" className="back-link">← All products</Link>
        <div className="product-layout">
          <div className="product-image-wrap">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-placeholder">
                <img src="/leaf.svg" alt="" width="80" height="80" />
              </div>
            )}
            {product.ecoScore && (
              <span className="eco-badge">Eco score: {product.ecoScore}/10</span>
            )}
          </div>
          <div className="product-info">
            <span className="product-brand-link">
              {brand && (
                <Link to={`/brands/${brand.slug}`}>{brand.name}</Link>
              )}
            </span>
            <h1>{product.name}</h1>
            {product.description && <p className="product-desc">{product.description}</p>}
            {product.packagingType && (
              <p className="packaging-info">
                <strong>Packaging:</strong> {product.packagingType}
              </p>
            )}
            {product.price != null && (
              <p className="product-price">
                {product.currency || 'USD'} {product.price}
              </p>
            )}
            {product.buyUrl && (
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Buy from {brand?.name || 'brand'} →
              </a>
            )}
            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .back-link {
          display: inline-block;
          margin-bottom: 24px;
          color: var(--color-earth-700);
          font-weight: 500;
        }
        .back-link:hover { text-decoration: none; }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) { .product-layout { grid-template-columns: 1fr; } }
        .product-image-wrap {
          position: relative;
          aspect-ratio: 1;
          background: var(--color-earth-100);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
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
          top: 16px;
          right: 16px;
          padding: 8px 12px;
          background: var(--color-earth-600);
          color: white;
          font-weight: 600;
          border-radius: 8px;
        }
        .product-brand-link { font-size: 0.9rem; }
        .product-brand-link a { font-weight: 600; }
        .product-info h1 { margin: 8px 0 16px; }
        .product-desc { color: var(--color-ink-muted); margin-bottom: 16px; }
        .packaging-info { margin-bottom: 12px; }
        .product-price { font-size: 1.25rem; font-weight: 700; color: var(--color-earth-700); margin-bottom: 24px; }
        .btn {
          display: inline-block;
          padding: 14px 28px;
          border-radius: var(--radius);
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn:hover { text-decoration: none; transform: translateY(-1px); }
        .btn-primary {
          background: var(--color-earth-600);
          color: white;
        }
        .btn-primary:hover { background: var(--color-earth-700); box-shadow: var(--shadow-md); }
        .product-tags { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          padding: 6px 12px;
          background: var(--color-earth-100);
          color: var(--color-earth-700);
          border-radius: 8px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
