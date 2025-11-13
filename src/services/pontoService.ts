import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface ConfiguracaoPonto {
  id: string;
  nome: string;
  descricao?: string;
  tipo_jornada: 'PADRAO' | 'ESCALA' | 'FLEXIVEL';
  horas_dia?: number;
  horas_semana?: number;
  entrada_1?: string;
  saida_1?: string;
  entrada_2?: string;
  saida_2?: string;
  intervalo_minutos?: number;
  tolerancia_atraso_minutos?: number;
  permite_banco_horas: boolean;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  data: string;
  entrada_1?: string;
  saida_1?: string;
  entrada_2?: string;
  saida_2?: string;
  horas_trabalhadas?: number;
  horas_extras_50?: number;
  horas_extras_100?: number;
  tipo_dia: 'NORMAL' | 'FALTA' | 'FERIAS' | 'ATESTADO' | 'DSR' | 'FERIADO';
  falta_justificada: boolean;
  justificativa?: string;
  observacoes?: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  aprovado_por?: string;
  data_aprovacao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EspelhoPonto {
  registros: RegistroPonto[];
  totais: {
    totalHoras: string;
    totalExtras50: string;
    totalExtras100: string;
    totalFaltas: number;
    diasTrabalhados: number;
  };
}

export interface EstatisticasPonto {
  totalRegistros: number;
  porStatus: Array<{
    status: string;
    total: number;
  }>;
  faltasNaoJustificadas: Array<{
    nome_completo: string;
    total_faltas: number;
  }>;
}

export interface FiltrosPonto {
  colaborador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  tipo_dia?: string;
  limit?: number;
  offset?: number;
}

class PontoService {
  private api = axios.create({
    baseURL: `${API_URL}/api/ponto`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ============================================
  // CONFIGURAÇÕES
  // ============================================

  async getConfiguracoes(ativo?: boolean): Promise<ConfiguracaoPonto[]> {
    try {
      const response = await this.api.get('/configuracoes', {
        params: { ativo }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar configurações de ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar configurações');
    }
  }

  async createConfiguracao(config: Partial<ConfiguracaoPonto>): Promise<ConfiguracaoPonto> {
    try {
      const response = await this.api.post('/configuracoes', config);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar configuração:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar configuração');
    }
  }

  // ============================================
  // REGISTROS
  // ============================================

  async getRegistros(filtros?: FiltrosPonto): Promise<{ data: RegistroPonto[]; pagination: any }> {
    try {
      const response = await this.api.get('/', { params: filtros });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar registros de ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar registros');
    }
  }

  async getRegistroById(id: string): Promise<RegistroPonto> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar registro:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar registro');
    }
  }

  async registrarPonto(registro: Partial<RegistroPonto>): Promise<RegistroPonto> {
    try {
      const response = await this.api.post('/', registro);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao registrar ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao registrar ponto');
    }
  }

  async aprovarPonto(id: string, aprovar: boolean): Promise<RegistroPonto> {
    try {
      const response = await this.api.put(`/${id}/aprovar`, { aprovar });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao aprovar ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao aprovar ponto');
    }
  }

  async deleteRegistro(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar registro:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar registro');
    }
  }

  // ============================================
  // RELATÓRIOS
  // ============================================

  async getEspelhoPonto(colaborador_id: string, mes: number, ano: number): Promise<EspelhoPonto> {
    try {
      const response = await this.api.get('/espelho', {
        params: { colaborador_id, mes, ano }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar espelho de ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar espelho de ponto');
    }
  }

  async getEstatisticas(): Promise<EstatisticasPonto> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de ponto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }
}

export default new PontoService();
