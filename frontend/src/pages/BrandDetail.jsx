import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function BrandDetail() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.brands
      .get(slug)
      .then((b) => {
        setBrand(b);
        return api.products.list({ brand: b._id });
      })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page container"><p>Loading…</p></div>;
  if (!brand) return <div className="page container"><p>Brand not found.</p></div>;

  return (
    <div className="page brand-detail">
      <div className="container">
        <Link to="/brands" className="back-link">← All brands</Link>
        <header className="brand-header">
          <div className="brand-header-logo">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} />
            ) : (
              <span className="brand-initial">{brand.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1>{brand.name}</h1>
            {brand.website && (
              <a href={brand.website} target="_blank" rel="noopener noreferrer" className="brand-website">
                Visit website →
              </a>
            )}
          </div>
        </header>
        {brand.description && <p className="brand-desc">{brand.description}</p>}
        {brand.packagingTypes?.length > 0 && (
          <div className="brand-section">
            <h3>Packaging</h3>
            <div className="tag-list">
              {brand.packagingTypes.map((p) => (
                <span key={p} className="tag">{p}</span>
              ))}
            </div>
          </div>
        )}
        {brand.sustainabilityPractices?.length > 0 && (
          <div className="brand-section">
            <h3>Sustainability practices</h3>
            <ul className="practice-list">
              {brand.sustainabilityPractices.map((item, i) => (
                <li key={i}>
                  <strong>{item.label}</strong>: {item.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        {brand.certified?.length > 0 && (
          <div className="brand-section">
            <h3>Certifications</h3>
            <div className="tag-list">
              {brand.certified.map((c) => (
                <span key={c} className="tag certified">{c}</span>
              ))}
            </div>
          </div>
        )}
        {brand.carbonNeutral && (
          <p className="carbon-badge">♻️ Carbon neutral</p>
        )}
        <h2 className="products-heading">Products from {brand.name}</h2>
        {products.length === 0 ? (
          <p className="empty">No products listed yet.</p>
        ) : (
          <div className="card-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
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
        .brand-header {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .brand-header-logo {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          background: var(--color-earth-100);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-header-logo img { width: 100%; height: 100%; object-fit: contain; }
        .brand-initial { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--color-earth-700); }
        .brand-website {
          display: inline-block;
          margin-top: 8px;
          font-weight: 600;
        }
        .brand-desc { font-size: 1.05rem; color: var(--color-ink-muted); margin-bottom: 32px; max-width: 640px; }
        .brand-section { margin-bottom: 28px; }
        .brand-section h3 { font-size: 1rem; margin-bottom: 10px; color: var(--color-earth-800); }
        .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          padding: 6px 12px;
          background: var(--color-earth-100);
          color: var(--color-earth-700);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        .tag.certified { background: var(--color-earth-200); font-weight: 600; }
        .practice-list { margin: 0; padding-left: 20px; }
        .practice-list li { margin-bottom: 6px; }
        .carbon-badge {
          display: inline-block;
          padding: 8px 16px;
          background: var(--color-earth-200);
          border-radius: var(--radius);
          font-weight: 600;
          margin-bottom: 32px;
        }
        .products-heading { margin: 48px 0 24px; }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }
        .empty { color: var(--color-ink-muted); }
      `}</style>
    </div>
  );
}
