import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/leaf.svg" alt="" width="24" height="24" />
          <span>EcoHub</span>
        </div>
        <p className="footer-tagline">
          One place for sustainable brands. Less search, less waste, better choices.
        </p>
        <nav className="footer-links">
          <Link to="/brands">Brands</Link>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} EcoHub. For the planet.</p>
      </div>
      <style>{`
        .footer {
          background: var(--color-earth-900);
          color: var(--color-earth-200);
          padding: 48px 0 24px;
          margin-top: 64px;
        }
        .footer-inner { text-align: center; }
        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--color-earth-300);
          margin-bottom: 12px;
        }
        .footer-tagline {
          max-width: 400px;
          margin: 0 auto 24px;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .footer-links a {
          color: var(--color-earth-300);
          text-decoration: none;
        }
        .footer-links a:hover { color: var(--color-earth-100); text-decoration: underline; }
        .footer-copy { font-size: 0.85rem; opacity: 0.7; }
      `}</style>
    </footer>
  );
}
