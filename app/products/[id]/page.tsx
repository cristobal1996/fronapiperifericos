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
    fetch(`http://192.168.0.37:3008/api/productos/${id}`)
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

  if (!producto) return <p className="text-gray-500">Cargando producto...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={producto.imagen || '/placeholder.png'}
          alt={producto.nombre}
          width={500}
          height={500}
          className="rounded-lg object-cover"
        />
        <div>
          <p className="text-xl font-semibold mb-2">{producto.precio} €</p>
          <p className="mb-4">{producto.descripcion}</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleAgregarCarrito}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}

