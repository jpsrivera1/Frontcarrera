import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://back-carrera.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inyectar token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido, limpiar sesión y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  }
);

export default api;

