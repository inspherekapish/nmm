'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    role: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth state from localStorage
    const savedUser = localStorage.getItem('nmm_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          role: user.role
        });
      } catch (error) {
        localStorage.removeItem('nmm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    localStorage.setItem('nmm_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      role: user.role
    });
  };

  const logout = () => {
    localStorage.removeItem('nmm_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      role: null
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};