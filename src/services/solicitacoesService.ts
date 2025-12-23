import axios, { AxiosInstance } from 'axios';
import {
  SolicitacaoExame,
  Clinica,
  Agendamento,
  CreateSolicitacaoDTO,
  CreateClinicaDTO,
  CreateAgendamentoDTO,
  UpdateResultadoExameDTO,
  FiltrosSolicitacoes,
  EstatisticasSolicitacoes,
} from '../types/solicitacoes';
import { API_ENDPOINTS } from '../config/api';

class SolicitacoesService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_ENDPOINTS.solicitacoes,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // =============================================
  // SOLICITAÇÕES
  // =============================================

  async getAll(filtros?: FiltrosSolicitacoes): Promise<{ data: SolicitacaoExame[]; total: number }> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/', { params: filtros });
      return {
        data: response.data.data,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (error: any) {
      console.error('Erro ao buscar solicitações:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar solicitações');
    }
  }

  async getById(id: string): Promise<SolicitacaoExame> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar solicitação:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar solicitação');
    }
  }

  async create(data: CreateSolicitacaoDTO): Promise<SolicitacaoExame> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar solicitação:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar solicitação');
    }
  }

  async cancelar(id: string, motivo?: string): Promise<SolicitacaoExame> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/${id}/cancelar`, { motivo });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao cancelar solicitação:', error);
      throw new Error(error.response?.data?.error || 'Erro ao cancelar solicitação');
    }
  }

  async atualizarResultado(id: string, data: UpdateResultadoExameDTO): Promise<SolicitacaoExame> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/${id}/resultado`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar resultado:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar resultado');
    }
  }

  async getEstatisticas(): Promise<EstatisticasSolicitacoes> {
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

  // =============================================
  // CLÍNICAS
  // =============================================

  async getClinicas(): Promise<Clinica[]> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/clinicas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar clínicas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar clínicas');
    }
  }

  async getClinicaById(id: string): Promise<Clinica> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/clinicas/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar clínica:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar clínica');
    }
  }

  async createClinica(data: CreateClinicaDTO): Promise<Clinica> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/clinicas', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar clínica:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar clínica');
    }
  }

  async updateClinica(id: string, data: Partial<CreateClinicaDTO>): Promise<Clinica> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/clinicas/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar clínica:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar clínica');
    }
  }

  async deleteClinica(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      await this.api.delete(`/clinicas/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar clínica:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar clínica');
    }
  }

  // =============================================
  // AGENDAMENTOS
  // =============================================

  async createAgendamento(data: CreateAgendamentoDTO): Promise<Agendamento> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/agendamentos', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar agendamento');
    }
  }

  async confirmarAgendamento(id: string): Promise<Agendamento> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/agendamentos/${id}/confirmar`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao confirmar agendamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao confirmar agendamento');
    }
  }

  async cancelarAgendamento(id: string, motivo?: string): Promise<Agendamento> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/agendamentos/${id}/cancelar`, { motivo });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao cancelar agendamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao cancelar agendamento');
    }
  }
}

export default new SolicitacoesService();

