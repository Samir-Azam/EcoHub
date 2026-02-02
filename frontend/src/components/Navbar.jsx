import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const handleNavClick = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={handleNavClick}>
          <img src="/leaf.svg" alt="" width="28" height="28" />
          <span>EcoHub</span>
        </Link>

        <button
          className={`navbar-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-nav ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={handleNavClick}>Home</NavLink>
          <NavLink to="/brands" onClick={handleNavClick}>Brands</NavLink>
          <NavLink to="/products" onClick={handleNavClick}>Products</NavLink>
          <NavLink to="/categories" onClick={handleNavClick}>Categories</NavLink>
          {isAuthenticated && <NavLink to="/carbon" onClick={handleNavClick}>Carbon Tracker</NavLink>}
          <NavLink to="/about" onClick={handleNavClick}>About</NavLink>
          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-user-name">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-logout">Log out</button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-login" onClick={handleNavClick}>Log in</NavLink>
          )}
        </nav>
      </div>
      <style>{`
        .navbar {
          background: var(--color-white);
          border-bottom: 1px solid var(--color-earth-200);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: relative;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--color-earth-800);
          text-decoration: none;
        }
        .navbar-brand:hover { text-decoration: none; color: var(--color-earth-700); }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .navbar-nav a {
          color: var(--color-ink-muted);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
        }
        .navbar-nav a:hover { color: var(--color-earth-700); text-decoration: none; }
        .navbar-nav a.active { color: var(--color-earth-700); font-weight: 600; }
        .nav-login {
          padding: 8px 16px;
          background: var(--color-earth-100);
          border-radius: var(--radius);
          color: var(--color-earth-800) !important;
        }
        .nav-login:hover { background: var(--color-earth-200); text-decoration: none; }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-user-name {
          color: var(--color-earth-700);
          font-size: 0.9rem;
        }
        .nav-logout {
          padding: 8px 16px;
          background: var(--color-earth-100);
          border: none;
          border-radius: var(--radius);
          color: var(--color-earth-800);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-logout:hover {
          background: var(--color-earth-200);
        }

        /* Toggle button (hidden on desktop) */
        .navbar-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .navbar-toggle span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--color-ink-muted);
          margin: 4px 0;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .navbar-toggle.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .navbar-toggle.open span:nth-child(2) { opacity: 0; }
        .navbar-toggle.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Mobile styles */
        @media (max-width: 768px) {
          .navbar-inner { height: 56px; }
          .navbar-toggle { display: block; }
          .navbar-nav {
            display: none;
            position: absolute;
            top: 56px;
            left: 0;
            right: 0;
            padding: 12px 16px;
            flex-direction: column;
            gap: 12px;
            background: var(--color-white);
            border-bottom: 1px solid var(--color-earth-200);
            z-index: 99;
          }
          .navbar-nav.open {
            display: flex;
          }
          .navbar-nav a { padding: 8px 4px; }
          .nav-user { justify-content: space-between; }
        }
      `}</style>
    </header>
  );
}
