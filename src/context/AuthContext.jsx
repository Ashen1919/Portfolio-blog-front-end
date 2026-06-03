import { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]  = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── Login: POST /auth/login ──────────────────────────────────────────────
  // Backend returns only { token } — then fetch current user separately
  const login = useCallback(async (credentials) => {
    // credentials = { email, password } — your LoginRequestDto uses email, not username
    const { data } = await axiosInstance.post('/auth/login', credentials);
    const jwt = data.token;

    localStorage.setItem('token', jwt);
    setToken(jwt);

    // Fetch full user details from /auth/currentUser
    const { data: userData } = await axiosInstance.get('/auth/currentUser', {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  // ── Register: POST /api/users ────────────────────────────────────────────
  const register = useCallback(async (payload) => {
    // payload = { username, email, password }
    const { data } = await axiosInstance.post('/api/users', payload);
    return data;
  }, []);

  // ── Logout: POST /auth/logout ────────────────────────────────────────────
  // Must call backend to blacklist the token
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Even if backend call fails, clear local state
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  // ── Refresh: POST /auth/refresh ──────────────────────────────────────────
  // Called when access token expires — uses httpOnly refreshToken cookie automatically
  const refresh = useCallback(async () => {
    try {
      const { data } = await axiosInstance.post('/auth/refresh');
      const jwt = data.token;

      localStorage.setItem('token', jwt);
      setToken(jwt);
      return jwt;
    } catch {
      // Refresh token expired or invalid — force logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;