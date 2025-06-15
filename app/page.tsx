'use client';
import { useCategoria } from './context/CategoriaContext';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { actualizarCarrito } from './lib/api';

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

export default function HomePage() {
  const { categoriaActiva } = useCategoria();
  const { user } = useAuth();
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const categoria = categorias.find((cat) => cat.cod === categoriaActiva);

  useEffect(() => {
    axios.get('http://192.168.0.37:3008/api/categorias/con-productos').then((res) => {
      setCategorias(res.data);
    });
  }, []);

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

  if (!categoria) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">{categoria.nombre}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categoria.productos.map((prod: Producto) => (
          <div key={prod.id} className="bg-white p-4 shadow rounded flex flex-col">
            <Image
              src={prod.imagen || '/placeholder.png'}
              alt={prod.nombre}
              width={300}
              height={200}
              className="object-cover w-full h-48 rounded"
            />
            <h3 className="font-semibold mt-2">{prod.nombre}</h3>
            <p className="text-blue-600 font-semibold">{prod.precio} €</p>
            <div className="mt-auto flex justify-between items-center gap-4 pt-3">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => handleAgregarCarrito(prod.id)}
              >
                Comprar
              </button>
              <button
                onClick={() => router.push(`/products/${prod.id}`)}
              >
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





