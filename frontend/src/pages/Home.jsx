import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import BrandCard from '../components/BrandCard';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredBrands, setFeaturedBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    Promise.all([
      api.brands.list({ featured: 'true' }),
      api.products.list({ featured: 'true', limit: '6' }),
    ])
      .then(([brands, products]) => {
        setFeaturedBrands(brands);
        setFeaturedProducts(products);
      })
      .catch((err) => {
        setError(err.message || 'Could not load data. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page home">
      <section className="hero">
        <div className="container">
          <h1>One place for sustainable choices</h1>
          <p className="hero-sub">
            Discover brands that use paper bags, cans, and eco-friendly packaging.
            Buy without the search—and without the unnecessary harm.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Browse products</Link>
            <Link to="/brands" className="btn btn-secondary">Explore brands</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Featured sustainable brands</h2>
          <p className="section-sub">Brands that care about packaging and the planet.</p>
          {error ? (
            <p className="error-msg">{error} <br /><small>Start the backend with: cd backend && npm run dev</small></p>
          ) : loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <div className="card-grid brands">
              {featuredBrands.slice(0, 6).map((b) => (
                <BrandCard key={b._id} brand={b} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/brands" className="btn btn-outline">View all brands</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Featured products</h2>
          <p className="section-sub">Eco-friendly products from vetted brands.</p>
          {error ? null : loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <div className="card-grid products">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/products" className="btn btn-outline">View all products</Link>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          background: linear-gradient(135deg, var(--color-earth-800) 0%, var(--color-earth-900) 100%);
          color: var(--color-earth-100);
          padding: 80px 0 100px;
          text-align: center;
        }
        .hero h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 16px;
          color: white;
        }
        .hero-sub {
          max-width: 560px;
          margin: 0 auto 32px;
          font-size: 1.1rem;
          opacity: 0.95;
        }
        .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: var(--radius);
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn:hover { text-decoration: none; transform: translateY(-1px); }
        .btn-primary {
          background: var(--color-earth-500);
          color: white;
        }
        .btn-primary:hover { background: var(--color-earth-600); box-shadow: var(--shadow-md); }
        .btn-secondary {
          background: transparent;
          color: var(--color-earth-200);
          border: 2px solid var(--color-earth-400);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); color: white; }
        .btn-outline {
          border: 2px solid var(--color-earth-600);
          color: var(--color-earth-700);
        }
        .btn-outline:hover { background: var(--color-earth-100); }
        .section { padding: 64px 0; }
        .section-alt { background: var(--color-sand); }
        .section h2 { margin-bottom: 8px; color: var(--color-earth-800); }
        .section-sub { color: var(--color-ink-muted); margin-bottom: 32px; }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .section-cta { margin-top: 32px; text-align: center; }
        .loading { color: var(--color-ink-muted); }
        .error-msg { color: #c53030; margin: 16px 0; }
        .error-msg small { opacity: 0.9; }
      `}</style>
    </div>
  );
}
