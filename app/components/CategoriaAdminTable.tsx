'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que esta ruta sea correcta

interface Categoria {
  cod: string;
  nombre: string;
  descripcion: string;
}

export default function CategoriaAdminTable() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Partial<Categoria>>({});
  const [editingCod, setEditingCod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Obtenemos el token del usuario
  const API_URL = 'http://192.168.0.37:3008/api/categorias';

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL); // pública
      setCategorias(res.data);
    } catch (err) {
      setError('Error al obtener categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSave = async () => {
    const payload = {
      cod: form.cod?.trim(),
      nombre: form.nombre?.trim(),
      descripcion: form.descripcion?.trim(),
    };

    if (!payload.cod || !payload.nombre || !payload.descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        setError('No autorizado');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      if (editingCod) {
        await axios.patch(`${API_URL}/${editingCod}`, payload, { headers });
      } else {
        await axios.post(API_URL, payload, { headers });
      }

      setForm({});
      setEditingCod(null);
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      setError('Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setForm(categoria);
    setEditingCod(categoria.cod);
    setError(null);
  };

  const handleDelete = async (cod: string) => {
    if (!confirm(`¿Seguro que quieres eliminar la categoría "${cod}"?`)) return;

    setLoading(true);
    setError(null);

    try {
      if (!user?.token) {
        setError('No autorizado');
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      await axios.delete(`${API_URL}/${cod}`, { headers });
      await fetchCategorias();

      if (editingCod === cod) {
        setForm({});
        setEditingCod(null);
      }
    } catch (err) {
      console.error(err);
      setError('Error al eliminar categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({});
    setEditingCod(null);
    setError(null);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 text-center text-gray-500">Cargando...</div>
      )}

      <table className="w-full mb-6 border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Código</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.cod} className="border-t">
              <td className="p-2">{cat.cod}</td>
              <td className="p-2">{cat.nombre}</td>
              <td className="p-2">{cat.descripcion}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.cod)}
                  className="text-red-600 hover:underline"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {categorias.length === 0 && !loading && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No hay categorías disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Código"
          value={form.cod || ''}
          onChange={(e) => setForm({ ...form, cod: e.target.value })}
          className="w-full border p-2"
          disabled={!!editingCod || loading}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre || ''}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {editingCod ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
          {editingCod && (
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


