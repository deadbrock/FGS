// MODO BACKEND REAL
import axios from 'axios';
import { LoginCredentials, LoginResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Serviço de autenticação
class AuthService {
  // Login do usuário
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, credentials);
      
      // Armazena token e dados do usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('@FGS:token', response.data.token);
        localStorage.setItem('@FGS:user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const message = error.response?.data?.error || 'Email ou senha inválidos';
      throw new Error(message);
    }
  }

  // Logout do usuário
  logout(): void {
    localStorage.removeItem('@FGS:token');
    localStorage.removeItem('@FGS:user');
  }

  // Recupera usuário do localStorage
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('@FGS:user');
    
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    
    return null;
  }

  // Verifica se o token é válido
  getStoredToken(): string | null {
    return localStorage.getItem('@FGS:token');
  }

  // Verifica dados do usuário autenticado
  async me(): Promise<User> {
    const token = this.getStoredToken();
    const response = await axios.get<any>(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.user;
  }
}

export default new AuthService();

