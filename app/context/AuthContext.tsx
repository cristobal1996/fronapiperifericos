'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { obtenerCarrito } from '../lib/api'; 

interface User {
  id: string;
  email: string;
  rol: string;
  token: string;
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
    const token = localStorage.getItem('token');
    if (token && typeof token === 'string') {
      try {
        const decoded = jwtDecode<any>(token);
        if (decoded?.sub && decoded?.email && decoded?.rol) {
          const usuario = {
            id: decoded.sub,
            email: decoded.email,
            rol: decoded.rol,
            token,
          };
          setUser(usuario);

          
          obtenerCarrito(usuario.id, token)
            .then((carrito) => {
              localStorage.setItem('carritoId', carrito.id);
            })
            .catch((err) => {
              console.warn('No se pudo obtener el carrito del usuario en useEffect:', err);
              localStorage.removeItem('carritoId');
            });
        }
      } catch (error) {
        console.error('Token inválido o expirado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('carritoId');
      }
    }
  }, []);

  const login = async (token: string) => {
    if (!token || typeof token !== 'string') {
      console.error('Token inválido recibido en login()');
      return;
    }

    localStorage.setItem('token', token);

    try {
      const decoded = jwtDecode<any>(token);
      if (decoded?.sub && decoded?.email && decoded?.rol) {
        const usuario = {
          id: decoded.sub,
          email: decoded.email,
          rol: decoded.rol,
          token,
        };
        setUser(usuario);

        
        try {
          const carrito = await obtenerCarrito(usuario.id, token);
          localStorage.setItem('carritoId', carrito.id);
        } catch (err) {
          console.warn('No se pudo obtener el carrito del usuario en login:', err);
          localStorage.removeItem('carritoId');
        }
      }
    } catch (error) {
      console.error('Token inválido al iniciar sesión:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('carritoId');
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






