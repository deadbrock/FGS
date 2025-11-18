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

  async createTipo(tipo: Partial<TipoBeneficio> | any): Promise<TipoBeneficio> {
    try {
      // Mapear campos do frontend (Beneficio) para campos do backend (TipoBeneficio)
      const dadosBackend: any = {
        nome: tipo.nome || tipo.tipo || '',
        categoria: tipo.tipo || tipo.categoria || 'OUTROS',
        descricao: tipo.descricao || '',
        valor_padrao: tipo.valorFixo || tipo.custoEmpresa || tipo.valor_padrao || 0,
        coparticipacao: tipo.custoColaborador ? tipo.custoColaborador > 0 : false,
        percentual_coparticipacao: tipo.percentualSalario || tipo.percentual_coparticipacao || 0,
        fornecedor: tipo.fornecedor || '',
        ativo: tipo.status !== 'INATIVO' && tipo.status !== 'CANCELADO',
      };

      // Validar campos obrigatórios
      if (!dadosBackend.nome) {
        throw new Error('Nome do benefício é obrigatório');
      }
      if (!dadosBackend.categoria) {
        throw new Error('Categoria do benefício é obrigatória');
      }

      const response = await this.api.post('/tipos', dadosBackend);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar tipo de benefício:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao criar tipo de benefício');
    }
  }

  async updateTipo(id: string, tipo: Partial<TipoBeneficio> | any): Promise<TipoBeneficio> {
    try {
      // Mapear campos do frontend (Beneficio) para campos do backend (TipoBeneficio)
      const dadosBackend: any = {};
      
      if (tipo.nome !== undefined) dadosBackend.nome = tipo.nome;
      if (tipo.tipo !== undefined) dadosBackend.categoria = tipo.tipo;
      if (tipo.categoria !== undefined) dadosBackend.categoria = tipo.categoria;
      if (tipo.descricao !== undefined) dadosBackend.descricao = tipo.descricao;
      if (tipo.valorFixo !== undefined) dadosBackend.valor_padrao = tipo.valorFixo;
      if (tipo.custoEmpresa !== undefined) dadosBackend.valor_padrao = tipo.custoEmpresa;
      if (tipo.valor_padrao !== undefined) dadosBackend.valor_padrao = tipo.valor_padrao;
      if (tipo.custoColaborador !== undefined) dadosBackend.coparticipacao = tipo.custoColaborador > 0;
      if (tipo.percentualSalario !== undefined) dadosBackend.percentual_coparticipacao = tipo.percentualSalario;
      if (tipo.percentual_coparticipacao !== undefined) dadosBackend.percentual_coparticipacao = tipo.percentual_coparticipacao;
      if (tipo.fornecedor !== undefined) dadosBackend.fornecedor = tipo.fornecedor;
      if (tipo.status !== undefined) dadosBackend.ativo = tipo.status !== 'INATIVO' && tipo.status !== 'CANCELADO';

      const response = await this.api.put(`/tipos/${id}`, dadosBackend);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar tipo de benefício:', error);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao atualizar tipo de benefício');
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

  async getEstatisticas(): Promise<any> {
    try {
      const response = await this.api.get('/estatisticas');
      const data = response.data.data || {};
      
      // Mapear estrutura do backend para estrutura esperada pelo frontend
      return {
        totalAtivos: data.totalBeneficiosAtivos || data.totalAtivos || 0,
        totalInativos: data.totalInativos || 0,
        totalColaboradoresAtendidos: data.totalColaboradoresAtendidos || 0,
        custoMensalEmpresa: data.custoMensalEmpresa || data.custoTotalMensal || 0,
        custoMensalColaborador: data.custoMensalColaborador || 0,
        custoMensalTotal: data.custoMensalTotal || data.custoTotalMensal || 0,
        distribuicaoPorTipo: Array.isArray(data.porTipo) ? data.porTipo.map((item: any) => ({
          tipo: item.tipo || item.nome,
          nome: item.nome || item.tipo || 'Outros',
          quantidade: item.total || item.quantidade || 0,
          percentual: item.percentual || 0,
        })) : [],
        evolucaoCustos: Array.isArray(data.evolucaoCustos) ? data.evolucaoCustos : [],
        beneficiosProximosVencimento: Array.isArray(data.beneficiosProximosVencimento) ? data.beneficiosProximosVencimento : [],
        beneficiosSemComprovacao: Array.isArray(data.beneficiosSemComprovacao) ? data.beneficiosSemComprovacao : [],
      };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de benefícios:', error);
      // Retornar estrutura vazia ao invés de lançar erro
      return {
        totalAtivos: 0,
        totalInativos: 0,
        totalColaboradoresAtendidos: 0,
        custoMensalEmpresa: 0,
        custoMensalColaborador: 0,
        custoMensalTotal: 0,
        distribuicaoPorTipo: [],
        evolucaoCustos: [],
        beneficiosProximosVencimento: [],
        beneficiosSemComprovacao: [],
      };
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
