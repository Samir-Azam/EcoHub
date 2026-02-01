import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page categories-page">
      <div className="container">
        <h1>Shop by category</h1>
        <p className="page-sub">Find sustainable products by category.</p>
        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <div className="category-grid">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/products?category=${c._id}`}
                className="category-card"
              >
                <span className="category-icon">🌿</span>
                <h3>{c.name}</h3>
                {c.description && <p>{c.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .page h1 { margin-bottom: 8px; color: var(--color-earth-800); }
        .page-sub { color: var(--color-ink-muted); margin-bottom: 32px; }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .category-card {
          display: block;
          padding: 32px;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-earth-200);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .category-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-earth-400);
          text-decoration: none;
          color: inherit;
        }
        .category-icon { font-size: 2rem; display: block; margin-bottom: 12px; }
        .category-card h3 { margin-bottom: 8px; }
        .category-card p { font-size: 0.9rem; color: var(--color-ink-muted); }
        .loading { color: var(--color-ink-muted); }
      `}</style>
    </div>
  );
}
