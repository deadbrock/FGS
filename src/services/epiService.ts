import axios, { AxiosInstance } from 'axios';
import {
  EPI,
  EntregaEPI,
  Ficha,
  MovimentacaoEstoque,
  CreateEPIDTO,
  UpdateEPIDTO,
  CreateEntregaEPIDTO,
  DevolverEPIDTO,
  CreateFichaDTO,
  UpdateFichaDTO,
  CreateMovimentacaoDTO,
  FiltrosEPI,
  FiltrosEntregaEPI,
  FiltrosFicha,
  EstatisticasEPI,
  HistoricoColaborador,
} from '../types/epi';

import { API_ENDPOINTS } from '../config/api';

class EPIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_ENDPOINTS.epis,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // =============================================
  // EPIs
  // =============================================

  async getEPIs(filtros?: FiltrosEPI): Promise<{ data: EPI[]; total: number }> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/', { params: filtros });
      return {
        data: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (error: any) {
      console.error('Erro ao buscar EPIs:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar EPIs');
    }
  }

  async getEPIById(id: string): Promise<EPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar EPI');
    }
  }

  async createEPI(data: CreateEPIDTO): Promise<EPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar EPI');
    }
  }

  async updateEPI(id: string, data: UpdateEPIDTO): Promise<EPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar EPI');
    }
  }

  async deleteEPI(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao excluir EPI');
    }
  }

  // =============================================
  // Entregas de EPI
  // =============================================

  async getEntregas(filtros?: FiltrosEntregaEPI): Promise<{ data: EntregaEPI[]; total: number }> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/entregas', { params: filtros });
      return {
        data: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (error: any) {
      console.error('Erro ao buscar entregas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar entregas');
    }
  }

  async getEntregaById(id: string): Promise<EntregaEPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/entregas/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar entrega:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar entrega');
    }
  }

  async entregarEPI(data: CreateEntregaEPIDTO): Promise<EntregaEPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/entregas', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao entregar EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao entregar EPI');
    }
  }

  async devolverEPI(id: string, data: DevolverEPIDTO): Promise<EntregaEPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/entregas/${id}/devolver`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao devolver EPI:', error);
      throw new Error(error.response?.data?.error || 'Erro ao devolver EPI');
    }
  }

  async getHistoricoColaborador(colaboradorId: string): Promise<HistoricoColaborador> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/entregas/colaborador/${colaboradorId}/historico`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar histórico');
    }
  }

  // =============================================
  // Fichas
  // =============================================

  async getFichas(filtros?: FiltrosFicha): Promise<{ data: Ficha[]; total: number }> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/fichas', { params: filtros });
      return {
        data: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (error: any) {
      console.error('Erro ao buscar fichas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar fichas');
    }
  }

  async getFichaById(id: string): Promise<Ficha> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/fichas/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar ficha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar ficha');
    }
  }

  async createFicha(data: CreateFichaDTO): Promise<Ficha> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/fichas', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar ficha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar ficha');
    }
  }

  async updateFicha(id: string, data: UpdateFichaDTO): Promise<Ficha> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/fichas/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar ficha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar ficha');
    }
  }

  async deleteFicha(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      await this.api.delete(`/fichas/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir ficha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao excluir ficha');
    }
  }

  // =============================================
  // Movimentações de Estoque
  // =============================================

  async getMovimentacoes(epiId?: string): Promise<MovimentacaoEstoque[]> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/movimentacoes', { params: { epi_id: epiId } });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar movimentações:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar movimentações');
    }
  }

  async createMovimentacao(data: CreateMovimentacaoDTO): Promise<MovimentacaoEstoque> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/movimentacoes', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar movimentação:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar movimentação');
    }
  }

  // =============================================
  // Estatísticas e Relatórios
  // =============================================

  async getEstatisticas(): Promise<EstatisticasEPI> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }

  async getEPIsVencidos(): Promise<EntregaEPI[]> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/entregas/vencidos');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar EPIs vencidos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar EPIs vencidos');
    }
  }

  async getEPIsAVencer(dias: number = 30): Promise<EntregaEPI[]> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/entregas/a-vencer', { params: { dias } });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar EPIs a vencer:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar EPIs a vencer');
    }
  }
}

export default new EPIService();

