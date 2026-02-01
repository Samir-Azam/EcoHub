import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/leaf.svg" alt="" width="28" height="28" />
          <span>EcoHub</span>
        </Link>
        <nav className="navbar-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/brands">Brands</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          {isAuthenticated && <NavLink to="/carbon">Carbon Tracker</NavLink>}
          <NavLink to="/about">About</NavLink>
          {isAuthenticated ? (
            <div className="nav-user">
              <span className="nav-user-name">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-logout">Log out</button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-login">Log in</NavLink>
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
      `}</style>
    </header>
  );
}
