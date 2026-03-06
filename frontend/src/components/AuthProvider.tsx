'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = { id: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: User) => void;
  setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) setToken(t);
    if (u) try { setUser(JSON.parse(u)); } catch (_) {}
    setReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const { login: apiLogin } = await import('@/lib/api');
    const { user: u, token: t } = await apiLogin(email, password);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const { register: apiRegister } = await import('@/lib/api');
    const { user: u, token: t } = await apiRegister(email, password);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser, setToken }}>
      {ready ? children : <div className="min-h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
