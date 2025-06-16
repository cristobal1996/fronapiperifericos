'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { actualizarCarrito } from '../../lib/api';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  categoriaCod: string;
}

export default function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [producto, setProducto] = useState<Producto | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`http://192.168.8.205:3008/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => {
        console.error(err);
        router.push('/');
      });
  }, [id, router]);

  const handleAgregarCarrito = async () => {
    if (!user?.token) {
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
        productoId: id,
        cantidad: 1,
      });
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('No se pudo agregar al carrito');
    }
  };

  const handleVolver = () => {
    router.push('/');
  };

  if (!producto) return <p className="text-gray-500">Cargando producto...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{producto.nombre}</h1>

      <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
        <Image
          src={producto.imagen || '/placeholder.png'}
          alt={producto.nombre}
          width={500}
          height={500}
          className="rounded-lg object-cover"
        />
        <div className="w-full md:w-1/2">
          <p className="text-xl font-semibold text-green-700 mb-4">{producto.precio} €</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mb-4"
            onClick={handleAgregarCarrito}
          >
            Añadir al carrito
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            onClick={handleVolver}
          >
            Volver a categorías
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Descripción</h2>
        <p className="text-gray-700">{producto.descripcion}</p>
      </div>
    </main>
  );
}


