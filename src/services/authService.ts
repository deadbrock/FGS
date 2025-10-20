// MODO MOCK - Para usar sem backend
// Para conectar com backend real, descomente o código comentado abaixo

export { default } from './authService.mock';

/* 
// ========================================
// CÓDIGO PARA BACKEND REAL (DESCOMENTE)
// ========================================

import api from './api';
import { LoginCredentials, LoginResponse, User } from '../types';

// Serviço de autenticação
class AuthService {
  // Login do usuário
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Armazena token e dados do usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('@FGS:token', response.data.token);
        localStorage.setItem('@FGS:user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Email ou senha inválidos');
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
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
}

export default new AuthService();
*/

