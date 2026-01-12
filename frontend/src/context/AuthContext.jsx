import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);


  // src/api/authAPI.js
const API_URL = import.meta.env.VITE_API_URL; // Vercel / local env

const authAPI = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 cross-origin cookies
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 cross-origin cookies
        body: JSON.stringify({ name, email, password }),
      });
      return await res.json();
    } catch (error) {
      return { success: false, message: error.message || "Register failed" };
    }
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

