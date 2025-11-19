import axios from 'axios';
import { HistoricoReajuste, CreateReajusteDTO, UpdateReajusteDTO } from '../types/reajustes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class ReajustesService {
  private api = axios.create({
    baseURL: `${API_URL}/api/colaboradores`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Listar histórico de reajustes de um colaborador
   */
  async getHistorico(colaboradorId: string): Promise<{ data: HistoricoReajuste[]; colaborador: { id: string; nome: string } }> {
    try {
      const response = await this.api.get(`/${colaboradorId}/reajustes`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar histórico de reajustes:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar histórico de reajustes');
    }
  }

  /**
   * Criar novo reajuste
   */
  async create(colaboradorId: string, reajuste: CreateReajusteDTO): Promise<HistoricoReajuste> {
    try {
      const response = await this.api.post(`/${colaboradorId}/reajustes`, reajuste);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar reajuste:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar reajuste');
    }
  }

  /**
   * Atualizar reajuste
   */
  async update(colaboradorId: string, reajusteId: string, reajuste: UpdateReajusteDTO): Promise<HistoricoReajuste> {
    try {
      const response = await this.api.put(`/${colaboradorId}/reajustes/${reajusteId}`, reajuste);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar reajuste:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar reajuste');
    }
  }

  /**
   * Deletar reajuste
   */
  async delete(colaboradorId: string, reajusteId: string): Promise<void> {
    try {
      await this.api.delete(`/${colaboradorId}/reajustes/${reajusteId}`);
    } catch (error: any) {
      console.error('Erro ao deletar reajuste:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar reajuste');
    }
  }
}

export default new ReajustesService();

