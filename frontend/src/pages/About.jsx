import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page about-page">
      <div className="container narrow">
        <h1>About EcoHub</h1>
        <p className="lead">
          One place to find brands and products that promote sustainability—so you can buy
          without the endless search and reduce unnecessary harm in the journey of making
          and supplying what we use.
        </p>
        <section className="about-section">
          <h2>The problem</h2>
          <p>
            Finding truly sustainable options—brands that use paper bags, cans, compostable
            packaging, or carbon-neutral supply chains—usually means hours of searching.
            That friction leads to more default choices and more waste.
          </p>
        </section>
        <section className="about-section">
          <h2>Our idea</h2>
          <p>
            EcoHub aggregates vetted sustainable brands and products in one platform. You
            browse by category or brand, see packaging types and certifications, and get
            direct links to buy. Less search, fewer harmful choices, and a shorter path
            from intention to action.
          </p>
        </section>
        <section className="about-section">
          <h2>What we highlight</h2>
          <ul>
            <li><strong>Packaging:</strong> Paper, cans, recyclable, compostable, or packaging-free</li>
            <li><strong>Certifications:</strong> B Corp, Fair Trade, carbon neutral, and more</li>
            <li><strong>Practices:</strong> Ethical sourcing, reduced plastic, sustainable supply chains</li>
          </ul>
        </section>
        <p className="cta">
          <Link to="/products" className="btn btn-primary">Explore products</Link>
          {' '}
          <Link to="/brands" className="btn btn-outline">Explore brands</Link>
        </p>
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .narrow { max-width: 640px; }
        .about-page h1 { margin-bottom: 16px; color: var(--color-earth-800); }
        .lead {
          font-size: 1.15rem;
          color: var(--color-ink-muted);
          margin-bottom: 40px;
          line-height: 1.7;
        }
        .about-section { margin-bottom: 32px; }
        .about-section h2 { font-size: 1.2rem; margin-bottom: 12px; color: var(--color-earth-700); }
        .about-section p, .about-section li { color: var(--color-ink-muted); margin-bottom: 10px; }
        .about-section ul { padding-left: 24px; }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: var(--radius);
          font-weight: 600;
          text-decoration: none;
        }
        .btn:hover { text-decoration: none; }
        .btn-primary { background: var(--color-earth-600); color: white; }
        .btn-primary:hover { background: var(--color-earth-700); }
        .btn-outline { border: 2px solid var(--color-earth-600); color: var(--color-earth-700); }
        .btn-outline:hover { background: var(--color-earth-100); }
        .cta { margin-top: 40px; }
        .cta .btn { margin-right: 12px; }
      `}</style>
    </div>
  );
}
