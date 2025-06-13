'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  tamaño: string;
  imagen: string;
  categoriaCod: string;
}

export default function ProductoAdminTable() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Producto>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_URL = 'http://192.168.0.37:3009/api/productos';

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('Error al obtener productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProductos();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      await fetchProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm(producto);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({});
    setError(null);
  };

  const handleSave = async () => {
    const payload = {
      nombre: form.nombre?.trim() ?? '',
      precio: Number(form.precio),
      descripcion: form.descripcion?.trim() ?? '',
      stock: Number(form.stock) || 0,
      tamaño: form.tamaño?.trim() ?? '',
      imagen: form.imagen?.trim() ?? '',
      categoriaCod: form.categoriaCod?.trim() ?? '',
    };

    if (!payload.nombre || !payload.categoriaCod) {
      setError('Nombre y Categoría son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = {
        Authorization: `Bearer ${user?.token}`,
      };

      if (editingId) {
        await axios.patch(`${API_URL}/${editingId}`, payload, { headers });
      } else {
        await axios.post(API_URL, payload, { headers });
      }

      setForm({});
      setEditingId(null);
      await fetchProductos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('Error al guardar producto. Verifica los campos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 text-center text-gray-500">Cargando...</div>
      )}

      <table className="w-full border table-auto mb-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Imagen</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id} className="border-t">
              <td className="p-2">
                <Image
                  src={prod.imagen || '/placeholder.png'}
                  alt={prod.nombre}
                  width={50}
                  height={50}
                  unoptimized
                />
              </td>
              <td className="p-2">{prod.nombre}</td>
              <td className="p-2">{prod.precio} €</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="text-red-600 hover:underline"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre || ''}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.precio ?? ''}
          onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock ?? ''}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion || ''}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={form.imagen || ''}
          onChange={(e) => setForm({ ...form, imagen: e.target.value })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Tamaño"
          value={form.tamaño || ''}
          onChange={(e) => setForm({ ...form, tamaño: e.target.value })}
          className="w-full border p-2"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Código Categoría"
          value={form.categoriaCod || ''}
          onChange={(e) => setForm({ ...form, categoriaCod: e.target.value })}
          className="w-full border p-2"
          disabled={loading}
        />

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {editingId ? 'Guardar Cambios' : 'Añadir Producto'}
          </button>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




