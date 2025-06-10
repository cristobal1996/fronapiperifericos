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
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [mostrarScroll, setMostrarScroll] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    axios.get('http://192.168.1.205:3006/api/categorias/con-productos').then((res) => {
      setCategorias(res.data);
      if (res.data.length > 0) setCategoriaActiva(res.data[0].cod);
    });

    axios.get('http://192.168.1.205:3006/api/productos').then((res) => {
      const productos = res.data ?? [];
      const seleccionados = productos.sort(() => 0.5 - Math.random()).slice(0, 15);
      setProductosAleatorios(seleccionados);
    });
  }, []);

  const categoria = categorias.find((cat) => cat.cod === categoriaActiva);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="bg-white shadow p-6 flex flex-col md:flex-row justify-between items-center">
        <h1
          className="text-3xl font-bold text-blue-700 cursor-pointer"
          onClick={() => setMostrarScroll(!mostrarScroll)}
        >
          Click & Connect
        </h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {categorias.map((cat) => (
            <button
              key={cat.cod}
              onClick={() => {
                setCategoriaActiva(cat.cod);
                setMostrarScroll(false);
              }}
              className={`font-medium ${
                categoriaActiva === cat.cod ? 'text-blue-600 underline' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
        <div className="mt-4 md:mt-0">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hola, {user.email}</span>
              {user.rol === 'admin' && (
                <Link href="/admin" className="text-green-600 hover:underline">
                  Panel Admin
                </Link>
              )}
              <button onClick={logout} className="text-red-600 hover:underline">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-blue-600 hover:underline">
                Entrar
              </Link>
              <Link href="/register" className="text-blue-600 hover:underline">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Scroll de productos destacados */}
      {mostrarScroll && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
          <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-4">
            {productosAleatorios.map((prod) => (
              <div key={prod.id} className="bg-white rounded-lg shadow p-4 min-w-[320px] max-w-xs">
                <Image
                  src={prod.imagen || '/placeholder.png'}
                  alt={prod.nombre}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                />
                <h3 className="text-lg font-semibold mt-2">{prod.nombre}</h3>
                <p className="text-blue-600 font-semibold">{prod.precio} €</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Productos por categoría activa */}
      {!mostrarScroll && categoria && (
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            {categoria.nombre}
          </h2>
          {categoria.productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoria.productos.map((prod) => (
                <div key={prod.id} className="bg-white p-4 rounded shadow flex flex-col">
                  <Image
                    src={prod.imagen || '/placeholder.png'}
                    alt={prod.nombre}
                    width={300}
                    height={200}
                    className="object-cover w-full h-48 rounded"
                  />
                  <h3 className="text-lg font-bold mt-2">{prod.nombre}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{prod.descripcion}</p>
                  <p className="text-blue-600 font-semibold mt-1">{prod.precio} €</p>
                  <div className="mt-4 flex justify-between">
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Comprar
                    </button>
                    <button className="text-blue-600 hover:underline">Ver más</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay productos en esta categoría.</p>
          )}
        </div>
      )}
    </main>
  );
}













