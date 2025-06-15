'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { actualizarCarrito, eliminarProductoDelCarrito, obtenerCarrito } from '../lib/api';

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCarrito = async () => {
      if (!user?.token || !user?.id) return;

      try {
        const data = await obtenerCarrito(user.id, user.token);
        setCarrito(data);
        if (data?.id) localStorage.setItem('carritoId', data.id);
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

  useEffect(() => {
    if (carrito?.productos?.length > 0) {
      const nuevoTotal = carrito.productos.reduce(
        (acc: number, item: any) => acc + item.producto.precio * item.cantidad,
        0
      );
      setTotal(nuevoTotal);
    } else {
      setTotal(0);
    }
  }, [carrito?.productos]);

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
    }
  };

  const handleComprar = () => {
    alert('Compra realizada (simulada)');
  };

  const handleSeguirComprando = () => {
    router.push('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mi Carrito</h2>

      {loading ? (
        <p className="text-gray-500">Cargando carrito...</p>
      ) : !carrito || carrito.productos.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No tienes productos en tu carrito.</p>
          <button
            onClick={handleSeguirComprando}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-10">
            {carrito.productos.map((item: any) => (
              <div key={item.producto.id} className="flex items-center gap-4 bg-white p-4 rounded shadow">
                <Image
                  src={item.producto.imagen || '/placeholder.png'}
                  alt={item.producto.nombre}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.producto.nombre}</h3>
                  <p>{item.producto.precio} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleCantidadChange(item.producto.id, item.cantidad + 1)}
                    className="bg-blue-600 text-white px-2 py-1 rounded">+</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => handleCantidadChange(item.producto.id, item.cantidad - 1)}
                    className="bg-blue-600 text-white px-2 py-1 rounded">-</button>
                  <button onClick={() => handleEliminarProducto(item.producto.id)}
                    className="text-red-600 hover:underline">Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right text-xl font-bold text-gray-800 mb-6">
            Total: {total.toFixed(2)} €
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={handleComprar}
              className="bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-green-700 w-full sm:w-auto"
            >
              Comprar
            </button>
            <button
              onClick={handleSeguirComprando}
              className="bg-gray-800 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 w-full sm:w-auto"
            >
              Seguir comprando
            </button>
          </div>
        </>
      )}
    </div>
  );
}









