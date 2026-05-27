import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde localStorage al recargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Escuchar evento de sesión expirada disparado por el interceptor de axios
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  /**
   * Primer paso del login: usuario + contraseña.
   * Retorna:
   *   { requires2FA: true, tempToken }  → hay que completar el segundo factor
   *   { done: true }                    → acceso concedido (sin 2FA)
   */
  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const data = res.data;

    if (data.requires2FA) {
      return { requires2FA: true, tempToken: data.tempToken };
    }

    const { user: userData, token } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return { done: true };
  };

  /**
   * Segundo paso: verificar código TOTP con el tempToken del paso 1.
   */
  const verify2FA = async (tempToken, code) => {
    const res = await api.post('/auth/2fa/verify-login', { tempToken, code });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Generar secreto + QR para configurar 2FA.
   */
  const setup2FA = async () => {
    const res = await api.post('/auth/2fa/setup');
    return res.data.data; // { secret, qrCode, otpauthUrl }
  };

  /**
   * Activar 2FA confirmando con un código válido.
   */
  const enable2FA = async (secret, code) => {
    await api.post('/auth/2fa/enable', { secret, code });
  };

  /**
   * Desactivar 2FA confirmando con un código válido.
   */
  const disable2FA = async (code) => {
    await api.post('/auth/2fa/disable', { code });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, verify2FA, setup2FA, enable2FA, disable2FA, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

