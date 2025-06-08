'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  rol: string;
  token: string; // AÑADIR token
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode<any>(token);
        if (decoded?.sub && decoded?.email && decoded?.rol) {
          setUser({ id: decoded.sub, email: decoded.email, rol: decoded.rol, token }); // AÑADIR token
        }
      } catch (error) {
        console.error('Token inválido o expirado:', error);
        Cookies.remove('token');
      }
    }
  }, []);

  const login = (token: string) => {
    if (!token || typeof token !== 'string') {
      console.error('Token inválido recibido en login()');
      return;
    }

    Cookies.set('token', token);
    try {
      const decoded = jwtDecode<any>(token);
      if (decoded?.sub && decoded?.email && decoded?.rol) {
        setUser({ id: decoded.sub, email: decoded.email, rol: decoded.rol, token }); // AÑADIR token
      }
    } catch (error) {
      console.error('Token inválido al iniciar sesión:', error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};



