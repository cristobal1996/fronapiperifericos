'use client';
import { createContext, useState, useContext } from 'react';

export const CategoriaContext = createContext<{
  categoriaActiva: string | null;
  setCategoriaActiva: (cod: string) => void;
}>({
  categoriaActiva: null,
  setCategoriaActiva: () => {},
});

export const CategoriaProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  return (
    <CategoriaContext.Provider value={{ categoriaActiva, setCategoriaActiva }}>
      {children}
    </CategoriaContext.Provider>
  );
};

export const useCategoria = () => useContext(CategoriaContext);
