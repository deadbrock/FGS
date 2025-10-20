import axios from 'axios';

// URL base da API (configurável via variável de ambiente)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

// Instância do Axios com configurações padrão
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@FGS:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('@FGS:token');
      localStorage.removeItem('@FGS:user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

