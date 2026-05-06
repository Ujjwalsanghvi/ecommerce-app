import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/Mainview';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = api.mockAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await api.mockAuth.login(email, password);
    setUser(userData);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userData = await api.mockAuth.signup(email, password, name);
    setUser(userData);
  };

  const logout = () => {
    api.mockAuth.logout();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await api.mockAuth.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      resetPassword,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};