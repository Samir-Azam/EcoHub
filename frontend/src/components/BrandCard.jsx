import { Link } from 'react-router-dom';

export default function BrandCard({ brand }) {
  return (
    <Link to={`/brands/${brand.slug}`} className="brand-card">
      <div className="brand-card-logo">
        {brand.logo ? (
          <img src={brand.logo} alt={brand.name} />
        ) : (
          <span className="brand-initial">{brand.name.charAt(0)}</span>
        )}
      </div>
      <h3>{brand.name}</h3>
      <p className="brand-desc">{brand.description?.slice(0, 100)}{brand.description?.length > 100 ? '…' : ''}</p>
      {brand.packagingTypes?.length > 0 && (
        <div className="brand-tags">
          {brand.packagingTypes.slice(0, 3).map((p) => (
            <span key={p} className="tag">{p}</span>
          ))}
        </div>
      )}
      <style>{`
        .brand-card {
          display: block;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-earth-200);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .brand-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-earth-400);
          text-decoration: none;
          color: inherit;
        }
        .brand-card-logo {
          width: 56px;
          height: 56px;
          border-radius: var(--radius);
          background: var(--color-earth-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .brand-card-logo img { width: 100%; height: 100%; object-fit: contain; }
        .brand-initial {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-earth-700);
        }
        .brand-card h3 { font-size: 1.15rem; margin-bottom: 8px; }
        .brand-desc { font-size: 0.9rem; color: var(--color-ink-muted); margin-bottom: 12px; line-height: 1.5; }
        .brand-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag {
          font-size: 0.75rem;
          padding: 4px 8px;
          background: var(--color-earth-100);
          color: var(--color-earth-700);
          border-radius: 6px;
        }
      `}</style>
    </Link>
  );
}
