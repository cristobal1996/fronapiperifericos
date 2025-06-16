'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCategoria } from '../context/CategoriaContext';
import axios from 'axios';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  categoriaCod: string;
}

interface Categoria {
  cod: string;
  nombre: string;
  descripcion: string;
  productos: Producto[];
}

export default function Header() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { categoriaActiva, setCategoriaActiva } = useCategoria();
  const { user, logout } = useAuth();

  useEffect(() => {
    axios.get('http://192.168.8.205:3008/api/categorias').then((res) => {
      setCategorias(res.data);
      if (!categoriaActiva && res.data.length > 0) {
        setCategoriaActiva(res.data[0].cod);
      }
    });
  }, []);

  return (
    <header className="shadow p-6 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-3xl font-bold cursor-pointer">Click & Connect</h1>

      <div className="flex gap-4 mt-4 md:mt-0">
        {categorias.map((cat) => (
          <button
            key={cat.cod}
            onClick={() => setCategoriaActiva(cat.cod)}
            className={`font-medium transition-colors duration-300 ${
              categoriaActiva === cat.cod
                ? 'text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-4">
        <Link href="/carrito" className="text-black hover:underline">Carrito</Link>
        {user ? (
          <>
            <span className="text-gray-700">Hola, {user.email}</span>
            {user.rol === 'admin' && (
              <Link href="/admin" className="text-green-600 hover:underline">Panel Admin</Link>
            )}
            <button onClick={logout} className="text-red-600 hover:underline">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-black hover:underline">Entrar</Link>
            <Link href="/register" className="text-black hover:underline">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
}


