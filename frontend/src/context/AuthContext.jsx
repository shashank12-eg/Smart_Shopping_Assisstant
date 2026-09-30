import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartshopping_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartshopping_token');
    if (token) {
      api.auth.me()
        .then((res) => {
          setUser(res.user);
          localStorage.setItem('smartshopping_user', JSON.stringify(res.user));
        })
        .catch(() => {
          // Token invalid
          localStorage.removeItem('smartshopping_token');
          localStorage.removeItem('smartshopping_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem('smartshopping_token', data.token);
    localStorage.setItem('smartshopping_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password, confirm_password) => {
    const data = await api.auth.signup({ name, email, password, confirm_password });
    localStorage.setItem('smartshopping_token', data.token);
    localStorage.setItem('smartshopping_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartshopping_token');
    localStorage.removeItem('smartshopping_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
