import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('investerly_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const data = res.data;
          if (data.success) {
            setUser(data);
          } else {
            localStorage.removeItem('investerly_token');
          }
        } catch (error) {
          console.error('Error fetching user', error);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;
      
      if (data.success) {
        localStorage.setItem('investerly_token', data.token);
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed. Is the backend running?' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const data = res.data;
      
      if (data.success) {
        localStorage.setItem('investerly_token', data.token);
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed. Is the backend running?' };
    }
  };

  const logout = () => {
    localStorage.removeItem('investerly_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
