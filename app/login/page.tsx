'use client';

import { useState } from 'react';
import { login as loginService } from '../lib/api'; 
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService(email, password);
      const token = data?.token;

      if (typeof token === 'string') {
        login(token); 
        router.push('/');
      } else {
        alert('Token inválido recibido del servidor.');
        console.error('Token inválido:', token);
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
