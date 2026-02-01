import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [packaging, setPackaging] = useState('');

  useEffect(() => {
    api.categories.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (packaging) params.packaging = packaging;
    api.products
      .list(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q, category, packaging]);

  return (
    <div className="page products-page">
      <div className="container">
        <h1>Sustainable products</h1>
        <p className="page-sub">Products from brands that care about packaging and the planet.</p>
        <div className="filters">
          <input
            type="search"
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="search-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
            className="filter-select"
          >
            <option value="">Any packaging</option>
            <option value="paper">Paper</option>
            <option value="can">Can</option>
            <option value="recyclable">Recyclable</option>
            <option value="compostable">Compostable</option>
            <option value="glass">Glass</option>
          </select>
        </div>
        {loading ? (
          <p className="loading">Loading…</p>
        ) : (
          <div className="card-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
        {!loading && products.length === 0 && (
          <p className="empty">No products found. Try different filters.</p>
        )}
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .page h1 { margin-bottom: 8px; color: var(--color-earth-800); }
        .page-sub { color: var(--color-ink-muted); margin-bottom: 24px; }
        .filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          border: 1px solid var(--color-earth-300);
          border-radius: var(--radius);
          font-size: 1rem;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-earth-600);
        }
        .filter-select {
          padding: 12px 16px;
          border: 1px solid var(--color-earth-300);
          border-radius: var(--radius);
          font-size: 1rem;
          background: white;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }
        .loading, .empty { color: var(--color-ink-muted); }
      `}</style>
    </div>
  );
}
