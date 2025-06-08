'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../app/context/AuthContext';

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

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosAleatorios, setProductosAleatorios] = useState<Producto[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    axios.get('http://192.168.0.37:3006/api/categorias/con-productos').then((res) => {
      setCategorias(res.data);
    });

    axios.get('http://192.168.0.37:3006/api/productos').then((res) => {
      const productos = res.data ?? [];
      const seleccionados = productos.sort(() => 0.5 - Math.random()).slice(0, 10);
      setProductosAleatorios(seleccionados);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      {/* Encabezado con nombre de tienda y login/logout */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Click & Connect</h1>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-gray-800">Hola, {user.email}</span>
              {user.rol === 'admin' && (
                <Link href="/admin" className="text-green-600 hover:underline">
                  Panel Admin
                </Link>
              )}
              <button onClick={logout} className="text-red-600 hover:underline">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600 hover:underline">
                Entrar
              </Link>
              <Link href="/register" className="text-blue-600 hover:underline">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Navegación por categorías */}
      <nav className="flex justify-center flex-wrap gap-4 mb-10">
        {categorias.map((cat) => (
          <a
            key={cat.cod}
            href={`#${cat.cod}`}
            className="text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            {cat.nombre}
          </a>
        ))}
      </nav>

      {/* Secciones de productos por categoría */}
      {categorias.map((cat) => (
        <section key={cat.cod} id={cat.cod} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{cat.nombre}</h2>
          {cat.productos && cat.productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cat.productos.map((prod) => (
                <div key={prod.id} className="bg-white p-4 rounded-lg shadow">
                  <Image
                    src={prod.imagen || '/placeholder.png'}
                    alt={prod.nombre}
                    width={300}
                    height={200}
                    className="object-cover w-full h-48 rounded"
                  />
                  <h3 className="text-lg font-bold mt-2">{prod.nombre}</h3>
                  <p className="text-sm text-gray-600">{prod.descripcion}</p>
                  <p className="text-blue-600 font-semibold mt-1">{prod.precio} €</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto whitespace-nowrap py-4">
              <div className="inline-flex space-x-4">
                {productosAleatorios.map((prod) => (
                  <div key={prod.id} className="w-64 bg-white p-4 rounded-lg shadow">
                    <Image
                      src={prod.imagen || '/placeholder.png'}
                      alt={prod.nombre}
                      width={256}
                      height={160}
                      className="object-cover w-full h-40 rounded"
                    />
                    <h3 className="text-md font-bold mt-2">{prod.nombre}</h3>
                    <p className="text-blue-600 font-semibold">{prod.precio} €</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}




