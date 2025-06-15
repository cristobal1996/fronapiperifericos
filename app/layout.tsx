// app/layout.tsx
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { CategoriaProvider } from './context/CategoriaContext';
import Header from './components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CategoriaProvider>
            <Header />
            <main className="max-w-7xl mx-auto p-4">{children}</main>
          </CategoriaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}



