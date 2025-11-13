import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// ============================================
// INTERFACES
// ============================================

export interface Treinamento {
  id: string;
  nome: string;
  descricao?: string;
  carga_horaria: number;
  tipo: 'NR' | 'TECNICO' | 'COMPORTAMENTAL' | 'GESTAO' | 'OPERACIONAL' | 'OUTRO';
  validade_dias?: number;
  obrigatorio: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Turma {
  id: string;
  treinamento_id: string;
  treinamento_nome?: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  instrutor?: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  created_at?: string;
  updated_at?: string;
}

export interface TreinamentoColaborador {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  treinamento_id: string;
  treinamento_nome?: string;
  treinamento_tipo?: string;
  validade_dias?: number;
  turma_id?: string;
  turma_nome?: string;
  turma_data_inicio?: string;
  turma_data_fim?: string;
  data_conclusao: string;
  data_validade?: string;
  status: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'CANCELADO';
  nota?: number;
  certificado_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstatisticasTreinamentos {
  totalTreinamentos: number;
  totalTurmas: number;
  totalColaboradoresTreinados: number;
  treinamentosPorTipo: Array<{
    tipo: string;
    count: number;
  }>;
  treinamentosVencendo: number;
  treinamentosVencidos: number;
}

// ============================================
// SERVICE
// ============================================

class TreinamentosService {
  private api = axios.create({
    baseURL: `${API_URL}/api/treinamentos`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ==========================================
  // TREINAMENTOS (CURSOS)
  // ==========================================

  async getAll(): Promise<Treinamento[]> {
    try {
      const response = await this.api.get('/');
      // Fix: garantir que sempre retorna array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      console.error('Erro ao buscar treinamentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar treinamentos');
    }
  }

  // Alias para criar treinamento (compatibilidade)
  async criarTipo(treinamento: Partial<Treinamento>): Promise<Treinamento> {
    return this.create(treinamento);
  }

  async getById(id: string): Promise<Treinamento> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar treinamento');
    }
  }

  async create(treinamento: Partial<Treinamento>): Promise<Treinamento> {
    try {
      const response = await this.api.post('/', treinamento);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar treinamento');
    }
  }

  async update(id: string, treinamento: Partial<Treinamento>): Promise<Treinamento> {
    try {
      const response = await this.api.put(`/${id}`, treinamento);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar treinamento');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar treinamento');
    }
  }

  // ==========================================
  // TURMAS
  // ==========================================

  async getTurmas(treinamentoId?: string): Promise<Turma[]> {
    try {
      const params = treinamentoId ? { treinamentoId } : {};
      const response = await this.api.get('/turmas', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar turmas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar turmas');
    }
  }

  async createTurma(turma: Partial<Turma>): Promise<Turma> {
    try {
      const response = await this.api.post('/turmas', turma);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar turma');
    }
  }

  async updateTurma(id: string, turma: Partial<Turma>): Promise<Turma> {
    try {
      const response = await this.api.put(`/turmas/${id}`, turma);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar turma:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar turma');
    }
  }

  async deleteTurma(id: string): Promise<void> {
    try {
      await this.api.delete(`/turmas/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar turma:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar turma');
    }
  }

  // ==========================================
  // TREINAMENTOS DE COLABORADORES
  // ==========================================

  async getColaboradorTreinamentos(
    colaboradorId?: string,
    treinamentoId?: string,
    turmaId?: string
  ): Promise<TreinamentoColaborador[]> {
    try {
      const params: any = {};
      if (colaboradorId) params.colaborador_id = colaboradorId; // Fix: usar snake_case
      if (treinamentoId) params.treinamento_id = treinamentoId;
      if (turmaId) params.turma_id = turmaId;

      const response = await this.api.get('/colaboradores', { params });
      // Fix: garantir que sempre retorna array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      console.error('Erro ao buscar treinamentos de colaboradores:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar treinamento');
    }
  }

  async vincularColaborador(vinculo: Partial<TreinamentoColaborador>): Promise<TreinamentoColaborador> {
    try {
      const response = await this.api.post('/colaboradores', vinculo);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao vincular treinamento ao colaborador:', error);
      throw new Error(error.response?.data?.error || 'Erro ao vincular treinamento');
    }
  }

  async updateVinculo(id: string, vinculo: Partial<TreinamentoColaborador>): Promise<TreinamentoColaborador> {
    try {
      const response = await this.api.put(`/colaboradores/${id}`, vinculo);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar vínculo de treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar vínculo');
    }
  }

  async deleteVinculo(id: string): Promise<void> {
    try {
      await this.api.delete(`/colaboradores/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar vínculo de treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar vínculo');
    }
  }

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  async getEstatisticas(): Promise<EstatisticasTreinamentos> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de treinamentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }

  // ==========================================
  // MÉTODOS DE COMPATIBILIDADE (LEGACY)
  // ==========================================

  async listarTipos() {
    // No contexto antigo, tipos = treinamentos/cursos
    return this.getAll();
  }

  async listarAlertas() {
    // Alertas = treinamentos vencendo/vencidos
    const stats = await this.getEstatisticas();
    return {
      vencendo: stats.treinamentosVencendo,
      vencidos: stats.treinamentosVencidos
    };
  }

  async listarTreinamentos(colaboradorId?: string) {
    if (colaboradorId) {
      return this.getColaboradorTreinamentos(colaboradorId);
    }
    return this.getAll();
  }

  async buscarEstatisticas() {
    return this.getEstatisticas();
  }
}

export default new TreinamentosService();
