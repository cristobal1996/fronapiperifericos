import axios from 'axios';

const API_URL = 'http://192.168.8.205:3008/api';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const register = async (dto: {
  email: string;
  password: string;
  nombre: string;
}) => {
  const res = await axios.post(`${API_URL}/auth/register`, dto);
  return res.data;
};


export const actualizarCarrito = async ({
  carritoId,
  token,
  productoId,
  cantidad = 1,
}: {
  carritoId: string;
  token: string;
  productoId: string;
  cantidad?: number;
}) => {
  if (!carritoId || !token || !productoId) {
    throw new Error('Faltan datos para actualizar el carrito');
  }

  const res = await axios.patch(
    `${API_URL}/carritos/${carritoId}`,
    {
      productos: [
        {
          productoId,
          cantidad,
          accion: 'agregar', 
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const eliminarProductoDelCarrito = async ({
  carritoId,
  productoId,
  token,
}: {
  carritoId: string;
  productoId: string;
  token: string;
}) => {
  const res = await axios.patch(
    `${API_URL}/carritos/${carritoId}`,
    {
      productos: [
        {
          productoId,
          accion: 'eliminar', 
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const obtenerCarrito = async (usuarioId: string, token: string) => {
  if (!usuarioId || !token) {
    throw new Error('Faltan datos para obtener el carrito');
  }

  const res = await axios.get(`${API_URL}/carritos/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};



