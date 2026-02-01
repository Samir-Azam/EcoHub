import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = (localStorage.getItem('ecohub_token') || '').trim();
    const savedUser = localStorage.getItem('ecohub_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Verify token is still valid
        api.auth.me(token)
          .then((user) => {
            setUser(user);
            localStorage.setItem('ecohub_user', JSON.stringify(user));
          })
          .catch(() => {
            // Token invalid, clear auth
            logout();
          })
          .finally(() => setLoading(false));
      } catch (err) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('ecohub_token', token);
    localStorage.setItem('ecohub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ecohub_token');
    localStorage.removeItem('ecohub_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

