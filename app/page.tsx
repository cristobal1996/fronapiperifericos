'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../app/context/AuthContext';
import { actualizarCarrito } from '../app/lib/api';

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
    axios.get('http://192.168.0.37:3009/api/categorias/con-productos').then((res) => {
      setCategorias(res.data);
      if (res.data.length > 0) setCategoriaActiva(res.data[0].cod);
    });

    axios.get('http://192.168.0.37:3009/api/productos').then((res) => {
      const productos = res.data ?? [];
      const seleccionados = productos.sort(() => 0.5 - Math.random()).slice(0, 15);
      setProductosAleatorios(seleccionados);
    });
  }, []);

  const categoria = categorias.find((cat) => cat.cod === categoriaActiva);

  const handleAgregarCarrito = async (productoId: string) => {
    if (!user || !user.token) {
      alert('Debes iniciar sesión para comprar.');
      return;
    }

    const carritoId = localStorage.getItem('carritoId');
    if (!carritoId) {
      alert('Carrito no encontrado');
      return;
    }

    try {
      await actualizarCarrito({
        carritoId,
        token: user.token,
        productoId,
        cantidad: 1,
      });
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('No se pudo agregar al carrito');
    }
  };

  return (
    <main className="min-h-screen">
      <header className="shadow p-6 flex flex-col md:flex-row justify-between items-center">
        <h1
          className="text-3xl font-bold cursor-pointer"
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
        className={`font-medium transition-colors duration-300 ${
        categoriaActiva === cat.cod
          ? 'text-white'
          : 'text-black'
      }`}
      >
        {cat.nombre}
      </button>
      ))}
    </div>


        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Link href="/carrito">
             Carrito
          </Link>

          {user ? (
            <>
              <span className="text-gray-700">Hola, {user.email}</span>
              {user.rol === 'admin' && (
                <Link href="/admin" className="text-green-600">
                  Panel Admin
                </Link>
              )}
              <button onClick={logout} className="text-red-600">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                Entrar
              </Link>
              <Link href="/register" >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      {mostrarScroll && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
          <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-4">
            {productosAleatorios.map((prod) => (
              <div key={prod.id} >
                <Image
                  src={prod.imagen || '/placeholder.png'}
                  alt={prod.nombre}
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-48"
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <p className="font-semibold mt-1">{prod.precio} €</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleAgregarCarrito(prod.id)}
                    >
                      Comprar
                    </button>
                    <button className="hover:underline">Ver más</button>
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

