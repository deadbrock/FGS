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
      // Função para mapear TipoBeneficio enum para categoria do banco
      const mapearCategoria = (tipoBeneficio: string): string => {
        const mapeamento: Record<string, string> = {
          'VALE_TRANSPORTE': 'TRANSPORTE',
          'VALE_COMBUSTIVEL': 'TRANSPORTE',
          'VALE_REFEICAO': 'ALIMENTACAO',
          'VALE_ALIMENTACAO': 'ALIMENTACAO',
          'PLANO_SAUDE': 'SAUDE',
          'PLANO_ODONTOLOGICO': 'SAUDE',
          'SEGURO_VIDA': 'SAUDE',
          'AUXILIO_EDUCACAO': 'EDUCACAO',
          'AUXILIO_CRECHE': 'EDUCACAO',
          'PARTICIPACAO_LUCROS': 'OUTROS',
          'BONUS': 'OUTROS',
          'INCENTIVO_PERFORMANCE': 'OUTROS',
          'GYM_PASS': 'OUTROS',
          'OUTROS': 'OUTROS',
        };
        return mapeamento[tipoBeneficio] || 'OUTROS';
      };

      // Obter tipo de benefício (pode vir como tipo ou categoria)
      const tipoBeneficio = tipo.tipo || tipo.categoria || '';
      
      // SEMPRE mapear para categoria válida do banco
      // Se tipo.categoria já for uma categoria válida, usar diretamente
      const categoriasValidas = ['TRANSPORTE', 'ALIMENTACAO', 'SAUDE', 'EDUCACAO', 'OUTROS'];
      let categoria: string;
      
      console.log('🔍 Debug - tipo recebido:', { tipo: tipo.tipo, categoria: tipo.categoria, nome: tipo.nome });
      
      if (tipo.categoria && categoriasValidas.includes(tipo.categoria)) {
        // Já é uma categoria válida
        categoria = tipo.categoria;
        console.log('✅ Usando categoria válida diretamente:', categoria);
      } else {
        // Precisa mapear do enum para categoria
        categoria = mapearCategoria(tipoBeneficio);
        console.log('🔄 Mapeando', tipoBeneficio, '→', categoria);
      }

      // Mapear campos do frontend (Beneficio) para campos do backend (TipoBeneficio)
      const dadosBackend: any = {
        nome: tipo.nome || tipo.tipo || '',
        categoria: categoria,
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

      console.log('📤 Enviando dados para backend:', dadosBackend);

      const response = await this.api.post('/tipos', dadosBackend);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar tipo de benefício:', error);
      console.error('Detalhes do erro:', error.response?.data);
      throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao criar tipo de benefício');
    }
  }

  async updateTipo(id: string, tipo: Partial<TipoBeneficio> | any): Promise<TipoBeneficio> {
    try {
      // Função para mapear TipoBeneficio enum para categoria do banco
      const mapearCategoria = (tipoBeneficio: string): string => {
        const mapeamento: Record<string, string> = {
          'VALE_TRANSPORTE': 'TRANSPORTE',
          'VALE_COMBUSTIVEL': 'TRANSPORTE',
          'VALE_REFEICAO': 'ALIMENTACAO',
          'VALE_ALIMENTACAO': 'ALIMENTACAO',
          'PLANO_SAUDE': 'SAUDE',
          'PLANO_ODONTOLOGICO': 'SAUDE',
          'SEGURO_VIDA': 'SAUDE',
          'AUXILIO_EDUCACAO': 'EDUCACAO',
          'AUXILIO_CRECHE': 'EDUCACAO',
          'PARTICIPACAO_LUCROS': 'OUTROS',
          'BONUS': 'OUTROS',
          'INCENTIVO_PERFORMANCE': 'OUTROS',
          'GYM_PASS': 'OUTROS',
          'OUTROS': 'OUTROS',
        };
        return mapeamento[tipoBeneficio] || 'OUTROS';
      };

      // Mapear campos do frontend (Beneficio) para campos do backend (TipoBeneficio)
      const dadosBackend: any = {};
      
      if (tipo.nome !== undefined) dadosBackend.nome = tipo.nome;
      if (tipo.tipo !== undefined) {
        dadosBackend.categoria = mapearCategoria(tipo.tipo);
      }
      if (tipo.categoria !== undefined) {
        // Se já é uma categoria válida, usar diretamente, senão mapear
        const categoriasValidas = ['TRANSPORTE', 'ALIMENTACAO', 'SAUDE', 'EDUCACAO', 'OUTROS'];
        dadosBackend.categoria = categoriasValidas.includes(tipo.categoria) 
          ? tipo.categoria 
          : mapearCategoria(tipo.categoria);
      }
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
      console.error('Detalhes do erro:', error.response?.data);
      throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao atualizar tipo de benefício');
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
      
      console.log('📊 Dados recebidos do backend:', data);
      
      // Calcular custos do backend
      const custoTotal = parseFloat(data.custoTotal?.total || '0') || 0;
      const custoCoparticipacao = parseFloat(data.custoTotal?.total_coparticipacao || '0') || 0;
      const custoMensalEmpresa = custoTotal - custoCoparticipacao; // O que a empresa paga (total - coparticipação)
      const custoMensalColaborador = custoCoparticipacao; // O que o colaborador paga
      const custoMensalTotal = custoTotal; // Total geral
      
      // Total de colaboradores únicos atendidos (vem do backend)
      const totalColaboradoresAtendidos = data.totalColaboradoresAtendidos || 0;
      
      // Calcular percentuais para distribuição por tipo
      const porTipoArray = Array.isArray(data.porTipo) ? data.porTipo : [];
      const totalGeral = porTipoArray.reduce((sum: number, item: any) => sum + (parseInt(item.total) || 0), 0);
      
      // Mapear estrutura do backend para estrutura esperada pelo frontend
      const estatisticas = {
        totalAtivos: data.totalAtivos || 0,
        totalInativos: 0, // Não temos no backend ainda
        totalColaboradoresAtendidos: totalColaboradoresAtendidos,
        custoMensalEmpresa: custoMensalEmpresa,
        custoMensalColaborador: custoMensalColaborador,
        custoMensalTotal: custoMensalTotal,
        distribuicaoPorTipo: porTipoArray.map((item: any) => {
          const quantidade = parseInt(item.total) || 0;
          const percentual = totalGeral > 0 ? (quantidade / totalGeral) * 100 : 0;
          return {
            tipo: item.nome || 'Outros',
            nome: item.nome || 'Outros',
            quantidade: quantidade,
            percentual: percentual,
          };
        }),
        evolucaoCustos: Array.isArray(data.evolucaoCustos) ? data.evolucaoCustos : [],
        beneficiosProximosVencimento: Array.isArray(data.beneficiosProximosVencimento) ? data.beneficiosProximosVencimento : [],
        beneficiosSemComprovacao: Array.isArray(data.beneficiosSemComprovacao) ? data.beneficiosSemComprovacao : [],
      };
      
      console.log('✅ Estatísticas mapeadas:', estatisticas);
      
      return estatisticas;
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
