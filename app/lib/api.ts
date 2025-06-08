import axios from 'axios';

const API_URL = 'http://192.168.0.37:3006/api';

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

