'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductoAdminTable from '../components/ProductoAdminTable';
import CategoriaAdminTable from '../components/CategoriaAdminTable';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<'productos' | 'categorias'>('productos');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.rol !== 'admin') {
      router.push('/');
    }
  }, [user]);

  if (!user || user.rol !== 'admin') {
    return null;
  }

  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center ">Panel de Administración</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView('productos')}
          className={`px-4 py-2 rounded ${view === 'productos' ? ' text-white' : 'bg-white border '}`}
        >
          Productos
        </button>
        <button
          onClick={() => setView('categorias')}
          className={`px-4 py-2 rounded ${view === 'categorias' ? ' text-white' : 'bg-white border '}`}
        >
          Categorías
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
        >
          Ir al Home
        </button>
      </div>

      {view === 'productos' && (
        <section>
          <ProductoAdminTable />
        </section>
      )}

      {view === 'categorias' && (
        <section>
          <CategoriaAdminTable />
        </section>
      )}
    </main>
  );
}



