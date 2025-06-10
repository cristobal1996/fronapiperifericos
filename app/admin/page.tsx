'use client';

import { useAuth } from '../context/AuthContext';
import ProductoAdminTable from '../components/ProductoAdminTable';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return <p className="p-6 text-red-600">Debes iniciar sesión para acceder al panel de administración.</p>;
  }

  if (user.rol !== 'admin') {
    return <p className="p-6 text-red-600">No tienes permisos para acceder a esta sección.</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <ProductoAdminTable />
    </main>
  );
}


