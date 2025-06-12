'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProductoAdminTable from '../components/ProductoAdminTable';
import CategoriaAdminTable from '../components/CategoriaAdminTable';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.rol !== 'admin') {
      router.push('/');
    }
  }, [user]);

  if (!user || user.rol !== 'admin') {
    return null; // Evita mostrar nada mientras se redirige
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Panel de Administración</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>
        <ProductoAdminTable />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Gestión de Categorías</h2>
        <CategoriaAdminTable />
      </section>
    </main>
  );
}


