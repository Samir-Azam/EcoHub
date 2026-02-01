import { useEffect, useState } from 'react';
import { api } from '../api';
import BrandCard from '../components/BrandCard';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.brands
      .list(q ? { q } : {})
      .then(setBrands)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="page brands-page">
      <div className="container">
        <h1>Sustainable brands</h1>
        <p className="page-sub">Brands that use eco-friendly packaging and ethical practices.</p>
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search brands…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="search-input"
          />
        </div>
        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <div className="card-grid">
            {brands.map((b) => (
              <BrandCard key={b._id} brand={b} />
            ))}
          </div>
        )}
        {!loading && brands.length === 0 && (
          <p className="empty">No brands found. Try a different search.</p>
        )}
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .page h1 { margin-bottom: 8px; color: var(--color-earth-800); }
        .page-sub { color: var(--color-ink-muted); margin-bottom: 24px; }
        .filter-bar { margin-bottom: 32px; }
        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border: 1px solid var(--color-earth-300);
          border-radius: var(--radius);
          font-size: 1rem;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-earth-600);
          box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.15);
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .loading, .empty { color: var(--color-ink-muted); }
      `}</style>
    </div>
  );
}
