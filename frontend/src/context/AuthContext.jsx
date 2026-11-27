/**
 * context/AuthContext.jsx
 * Global authentication state (user + token) shared by every page.
 *
 * Provides: user, register(), login(), adminLogin(), logout(), updateUser()
 * The token is stored in localStorage so the session survives page reloads.
 */
import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    saveSession(data);
    return data;
  };

  const login = async (formData) => {
    const { data } = await API.post('/auth/login', formData);
    saveSession(data);
    return data;
  };

  const adminLogin = async (formData) => {
    const { data } = await API.post('/auth/admin/login', formData);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updated) => {
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('user', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider value={{ user, register, login, adminLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so pages can do: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
