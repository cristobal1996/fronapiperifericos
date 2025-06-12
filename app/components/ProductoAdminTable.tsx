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
  const { user } = useAuth();

  const fetchProductos = async () => {
    try {
      const res = await axios.get('http://192.168.0.37:3009/api/productos', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProductos();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://192.168.0.37:3009/api/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm(producto);
  };

  const handleSave = async () => {
    try {
      const payload = {
        nombre: form.nombre?.trim() ?? '',
        precio: Number(form.precio),
        descripcion: form.descripcion ?? '',
        stock: Number(form.stock) || 0,
        tamaño: form.tamaño ?? '',
        imagen: form.imagen ?? '',
        categoriaCod: form.categoriaCod?.trim() ?? '',
      };

      if (!payload.nombre || !payload.categoriaCod) {
        alert('Nombre y Categoría son obligatorios');
        return;
      }

      if (editingId) {
        await axios.patch(
          `http://192.168.0.37:3009/api/productos/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      } else {
        await axios.post(
          `http://192.168.0.37:3009/api/productos`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
      }

      setForm({});
      setEditingId(null);
      fetchProductos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar producto. Verifica los campos.');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
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
                <Image src={prod.imagen || '/placeholder.png'} alt={prod.nombre} width={50} height={50} unoptimized />
              </td>
              <td className="p-2">{prod.nombre}</td>
              <td className="p-2">{prod.precio} €</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:underline">Editar</button>
                <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:underline">Eliminar</button>
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
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.precio ?? ''}
          onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
          className="w-full border p-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock ?? ''}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion || ''}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={form.imagen || ''}
          onChange={(e) => setForm({ ...form, imagen: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Tamaño"
          value={form.tamaño || ''}
          onChange={(e) => setForm({ ...form, tamaño: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Código Categoría"
          value={form.categoriaCod || ''}
          onChange={(e) => setForm({ ...form, categoriaCod: e.target.value })}
          className="w-full border p-2"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Guardar Cambios' : 'Añadir Producto'}
        </button>
      </div>
    </div>
  );
}



