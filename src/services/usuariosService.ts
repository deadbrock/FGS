import axios from 'axios';
import { User, UserRole } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  cargo?: string;
  departamento?: string;
  avatar?: string;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
  role?: UserRole;
  cargo?: string;
  departamento?: string;
  avatar?: string;
}

class UsuariosService {
  private api = axios.create({
    baseURL: `${API_URL}/api/usuarios`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Obter todos os usuários
   */
  async getAll(): Promise<User[]> {
    try {
      const response = await this.api.get('/');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Erro ao buscar usuários');
    }
  }

  /**
   * Obter usuário por ID
   */
  async getById(id: string): Promise<User> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Erro ao buscar usuário');
    }
  }

  /**
   * Criar novo usuário
   */
  async create(data: CreateUsuarioDTO): Promise<User> {
    try {
      const response = await this.api.post('/', data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar usuário';
      throw new Error(message);
    }
  }

  /**
   * Atualizar usuário
   */
  async update(id: string, data: UpdateUsuarioDTO): Promise<User> {
    try {
      const response = await this.api.put(`/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao atualizar usuário';
      throw new Error(message);
    }
  }

  /**
   * Deletar usuário
   */
  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao deletar usuário';
      throw new Error(message);
    }
  }

  /**
   * Verificar se email está disponível
   */
  async checkEmailDisponivel(email: string, userId?: string): Promise<boolean> {
    try {
      const params = userId ? { email, userId } : { email };
      const response = await this.api.get('/check-email', { params });
      return response.data.disponivel;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }
}

export default new UsuariosService();

