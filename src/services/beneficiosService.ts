import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// ============================================
// INTERFACES
// ============================================

export interface TipoBeneficio {
  id: string;
  nome: string;
  descricao?: string;
  valor_padrao?: number;
  elegibilidade_cargo?: string;
  elegibilidade_tempo_servico?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BeneficioColaborador {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  colaborador_matricula?: string;
  tipo_beneficio_id: string;
  tipo_beneficio_nome?: string;
  tipo_beneficio_descricao?: string;
  valor?: number;
  data_inicio: string;
  data_fim?: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO' | 'CANCELADO';
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstatisticasBeneficios {
  totalBeneficiosAtivos: number;
  porTipo: Array<{
    nome: string;
    total: number;
  }>;
  custoTotalMensal: number;
}

// ============================================
// SERVICE
// ============================================

class BeneficiosService {
  private api = axios.create({
    baseURL: `${API_URL}/api/beneficios`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ==========================================
  // TIPOS DE BENEFÍCIOS
  // ==========================================

  async getTipos(): Promise<TipoBeneficio[]> {
    try {
      const response = await this.api.get('/tipos');
      // Fix: garantir que sempre retorna array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      console.error('Erro ao buscar tipos de benefícios:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar tipos de benefícios');
    }
  }

  async createTipo(tipo: Partial<TipoBeneficio>): Promise<TipoBeneficio> {
    try {
      const response = await this.api.post('/tipos', tipo);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar tipo de benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar tipo de benefício');
    }
  }

  async updateTipo(id: string, tipo: Partial<TipoBeneficio>): Promise<TipoBeneficio> {
    try {
      const response = await this.api.put(`/tipos/${id}`, tipo);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar tipo de benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar tipo de benefício');
    }
  }

  async deleteTipo(id: string): Promise<void> {
    try {
      await this.api.delete(`/tipos/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar tipo de benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar tipo de benefício');
    }
  }

  // ==========================================
  // BENEFÍCIOS DE COLABORADORES
  // ==========================================

  async getAll(colaboradorId?: string): Promise<BeneficioColaborador[]> {
    try {
      const params = colaboradorId ? { colaboradorId } : {};
      const response = await this.api.get('/', { params });
      // Fix: garantir que sempre retorna array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      console.error('Erro ao buscar benefícios de colaboradores:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar benefícios');
    }
  }

  async create(beneficio: Partial<BeneficioColaborador>): Promise<BeneficioColaborador> {
    try {
      const response = await this.api.post('/', beneficio);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar benefício');
    }
  }

  async update(id: string, beneficio: Partial<BeneficioColaborador>): Promise<BeneficioColaborador> {
    try {
      const response = await this.api.put(`/${id}`, beneficio);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar benefício');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar benefício:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar benefício');
    }
  }

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  async getEstatisticas(): Promise<EstatisticasBeneficios> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de benefícios:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }

  // ==========================================
  // MÉTODOS DE COMPATIBILIDADE (LEGACY)
  // ==========================================

  async buscarEstatisticas() {
    return this.getEstatisticas();
  }

  async listarBeneficios() {
    return this.getTipos();
  }

  async listarBeneficiosColaborador(colaboradorId?: string) {
    return this.getAll(colaboradorId);
  }

  async associarBeneficio(dados: Partial<BeneficioColaborador>) {
    return this.create(dados);
  }

  async buscarHistorico(colaboradorId: string) {
    // Não implementado no backend - retorna lista de benefícios do colaborador
    return this.getAll(colaboradorId);
  }

  async gerarRelatorioCustos(dataInicio?: string, dataFim?: string) {
    // Mock - retorna estatísticas
    const stats = await this.getEstatisticas();
    return {
      custoTotal: stats.custoTotalMensal,
      porTipo: stats.porTipo
    };
  }
}

export default new BeneficiosService();
