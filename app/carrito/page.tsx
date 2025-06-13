'use client';

import { useEffect, useState } from 'react';
import { actualizarCarrito, eliminarProductoDelCarrito, obtenerCarrito } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCarrito = async () => {
      if (!user?.token || !user?.id) return;

      try {
        const data = await obtenerCarrito(user.id, user.token);
        setCarrito(data);

        if (data?.id) {
          localStorage.setItem('carritoId', data.id);
        }
      } catch (error) {
        console.error('❌ Error al obtener el carrito:', error);
        setCarrito(null);
        localStorage.removeItem('carritoId');
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, [user]);

  const handleCantidadChange = async (productoId: string, nuevaCantidad: number) => {
    if (!carrito?.id || !user?.token || !productoId) return;

    if (nuevaCantidad < 1) return handleEliminarProducto(productoId);

    try {
      await actualizarCarrito({
        carritoId: carrito.id,
        token: user.token,
        productoId,
        cantidad: nuevaCantidad,
      });

      setCarrito((prev: any) => ({
        ...prev,
        productos: prev.productos.map((item: any) =>
          item.producto.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
        ),
      }));
    } catch (error) {
      console.error('❌ Error al actualizar cantidad:', error);
      alert('No se pudo actualizar la cantidad del producto.');
    }
  };

  const handleEliminarProducto = async (productoId: string) => {
    if (!carrito?.id || !user?.token || !productoId) return;

    try {
      await eliminarProductoDelCarrito({
        carritoId: carrito.id,
        productoId,
        token: user.token,
      });

      setCarrito((prev: any) => ({
        ...prev,
        productos: prev.productos.filter((item: any) => item.producto.id !== productoId),
      }));
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto del carrito.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mi Carrito</h2>

      {loading ? (
        <p className="text-gray-500">Cargando carrito...</p>
      ) : !carrito || carrito.productos.length === 0 ? (
        <p className="text-gray-500">No tienes productos en tu carrito.</p>
      ) : (
        <div className="space-y-6">
          {carrito.productos.map((item: any) => (
            <div key={item.producto.id} className="flex items-center space-x-4 p-4 border-b">
              <Image
                src={item.producto.imagen || '/placeholder.png'}
                alt={item.producto.nombre}
                width={100}
                height={100}
                className="object-cover w-20 h-20"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.producto.nombre}</h3>
                <p className="text-gray-600">{item.producto.descripcion}</p>
                <p className=" font-semibold">{item.producto.precio} €</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className=" text-white px-2 py-1 rounded "
                  onClick={() => handleCantidadChange(item.producto.id, item.cantidad + 1)}
                >
                  +
                </button>
                <span>{item.cantidad}</span>
                <button
                  className=" text-white px-2 py-1 rounded "
                  onClick={() => handleCantidadChange(item.producto.id, item.cantidad - 1)}
                >
                  -
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleEliminarProducto(item.producto.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

