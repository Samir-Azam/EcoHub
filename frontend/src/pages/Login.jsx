import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login({ _id: data._id, name: data.name, email: data.email }, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="container narrow">
        <h1>Log in</h1>
        <p className="page-sub">Access your EcoHub account.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
      <style>{`
        .page { padding: 48px 0 64px; }
        .narrow { max-width: 400px; }
        .auth-page h1 { margin-bottom: 8px; color: var(--color-earth-800); }
        .page-sub { color: var(--color-ink-muted); margin-bottom: 24px; }
        .auth-form label {
          display: block;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .auth-form input {
          display: block;
          width: 100%;
          margin-top: 6px;
          padding: 12px 16px;
          border: 1px solid var(--color-earth-300);
          border-radius: var(--radius);
          font-size: 1rem;
        }
        .auth-form input:focus {
          outline: none;
          border-color: var(--color-earth-600);
        }
        .auth-form .btn { width: 100%; margin-top: 8px; padding: 14px; }
        .auth-error { color: #c53030; margin-bottom: 16px; }
        .auth-switch { margin-top: 24px; text-align: center; color: var(--color-ink-muted); }
      `}</style>
    </div>
  );
}
