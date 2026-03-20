import { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]    = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── Login: POST /auth/login ────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    // credentials = { username, password }
    const { data } = await axiosInstance.post('/auth/login', credentials);
    // Assumes Spring Boot returns { token, user } — adjust field names as needed
    const jwt      = data.token  || data.accessToken  || data.jwt;
    const userData = data.user   || data.userDetails  || { username: credentials.username };

    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  }, []);

  // ── Register: POST /auth/register ─────────────────────────────────────────
  const register = useCallback(async (payload) => {
    // payload = { username, email, password }
    const { data } = await axiosInstance.post('/api/users', payload);
    return data;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
