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
      const dados = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Mapear campos do backend para frontend
      return dados.map((item: any) => ({
        id: item.id,
        nome: item.titulo || item.nome, // Backend usa 'titulo', frontend espera 'nome'
        titulo: item.titulo, // Manter também para compatibilidade
        descricao: item.descricao,
        carga_horaria: item.carga_horaria,
        cargaHoraria: item.carga_horaria, // Alias para compatibilidade
        tipo: item.tipo,
        nr: item.nr, // Número da NR (ex: NR-10, NR-35)
        categoria: this.mapearTipoParaCategoria(item.tipo), // Converter tipo para categoria
        validade_dias: item.validade_meses ? item.validade_meses * 30 : null, // Converter meses para dias
        validadeDias: item.validade_meses ? item.validade_meses * 30 : null, // Alias
        validade_meses: item.validade_meses,
        obrigatorio: item.obrigatorio !== undefined ? item.obrigatorio : (item.tipo === 'NR' || !!item.nr), // NR são obrigatórios
        modalidade: item.modalidade,
        local: item.local,
        instrutor: item.instrutor,
        instituicao: item.instituicao,
        ativo: item.ativo !== false,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error: any) {
      console.error('Erro ao buscar treinamentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar treinamentos');
    }
  }

  // Mapear tipo do backend para categoria do frontend
  private mapearTipoParaCategoria(tipo?: string): string {
    const mapeamento: Record<string, string> = {
      'NR': 'Segurança do Trabalho',
      'TECNICO': 'Técnico',
      'COMPORTAMENTAL': 'Comportamental',
      'LIDERANCA': 'Gestão',
      'GESTAO': 'Gestão',
      'COMPLIANCE': 'Compliance',
      'OPERACIONAL': 'Operacional',
      'OUTROS': 'Outro',
      'OUTRO': 'Outro',
    };
    return mapeamento[tipo || ''] || tipo || 'Outro';
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
      // Mapear categoria do frontend para tipo do backend
      const mapearCategoriaParaTipo = (categoria?: string): string => {
        const mapeamento: Record<string, string> = {
          'Segurança do Trabalho': 'NR',
          'Técnico': 'TECNICO',
          'Comportamental': 'COMPORTAMENTAL',
          'Gestão': 'LIDERANCA',
          'Compliance': 'COMPLIANCE',
          'Tecnologia': 'TECNICO',
          'Operacional': 'TECNICO',
          'Outro': 'OUTROS',
        };
        return mapeamento[categoria || ''] || treinamento.tipo || 'OUTROS';
      };

      // Mapear campos do frontend para o backend
      const dadosBackend: any = {
        titulo: treinamento.nome || treinamento.titulo, // Frontend usa 'nome', backend espera 'titulo'
        descricao: treinamento.descricao,
        tipo: mapearCategoriaParaTipo(treinamento.categoria), // Mapear categoria para tipo
        carga_horaria: treinamento.cargaHoraria || treinamento.carga_horaria,
        validade_meses: treinamento.validadeDias ? Math.ceil(treinamento.validadeDias / 30) : null, // Converter dias para meses
        ativo: treinamento.ativo !== false,
      };

      // Campos opcionais
      if (treinamento.nr) dadosBackend.nr = treinamento.nr;
      if (treinamento.instrutor) dadosBackend.instrutor = treinamento.instrutor;
      if (treinamento.instituicao) dadosBackend.instituicao = treinamento.instituicao;
      if (treinamento.modalidade) dadosBackend.modalidade = treinamento.modalidade;
      if (treinamento.local) dadosBackend.local = treinamento.local;

      const response = await this.api.post('/', dadosBackend);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar treinamento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar treinamento');
    }
  }

  async update(id: string, treinamento: Partial<Treinamento>): Promise<Treinamento> {
    try {
      // Mapear categoria do frontend para tipo do backend
      const mapearCategoriaParaTipo = (categoria?: string): string => {
        const mapeamento: Record<string, string> = {
          'Segurança do Trabalho': 'NR',
          'Técnico': 'TECNICO',
          'Comportamental': 'COMPORTAMENTAL',
          'Gestão': 'LIDERANCA',
          'Compliance': 'COMPLIANCE',
          'Tecnologia': 'TECNICO',
          'Operacional': 'TECNICO',
          'Outro': 'OUTROS',
        };
        return mapeamento[categoria || ''] || treinamento.tipo || 'OUTROS';
      };

      // Mapear campos do frontend para o backend (mesmo mapeamento do create)
      const dadosBackend: any = {};
      
      if (treinamento.nome || treinamento.titulo) {
        dadosBackend.titulo = treinamento.nome || treinamento.titulo;
      }
      if (treinamento.descricao !== undefined) dadosBackend.descricao = treinamento.descricao;
      if (treinamento.categoria || treinamento.tipo) {
        dadosBackend.tipo = mapearCategoriaParaTipo(treinamento.categoria);
      }
      if (treinamento.cargaHoraria || treinamento.carga_horaria) {
        dadosBackend.carga_horaria = treinamento.cargaHoraria || treinamento.carga_horaria;
      }
      if (treinamento.validadeDias !== undefined) {
        dadosBackend.validade_meses = treinamento.validadeDias ? Math.ceil(treinamento.validadeDias / 30) : null;
      }
      if (treinamento.ativo !== undefined) dadosBackend.ativo = treinamento.ativo;
      if (treinamento.nr) dadosBackend.nr = treinamento.nr;
      if (treinamento.instrutor) dadosBackend.instrutor = treinamento.instrutor;
      if (treinamento.instituicao) dadosBackend.instituicao = treinamento.instituicao;
      if (treinamento.modalidade) dadosBackend.modalidade = treinamento.modalidade;
      if (treinamento.local) dadosBackend.local = treinamento.local;

      const response = await this.api.put(`/${id}`, dadosBackend);
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
      // Fix: garantir que sempre retorna array
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: any) {
      console.error('Erro ao buscar turmas:', error);
      // Em caso de erro, retornar array vazio ao invés de lançar exceção
      return [];
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
      const dados = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Mapear campos do backend (snake_case) para frontend (camelCase)
      return dados.map((item: any) => ({
        id: item.id,
        colaborador_id: item.colaborador_id,
        colaboradorNome: item.colaborador_nome || item.nome_completo || '-',
        colaborador_cpf: item.colaborador_cpf,
        treinamento_id: item.treinamento_id,
        tipoTreinamentoNome: item.treinamento_titulo || item.titulo || '-',
        treinamento_tipo: item.treinamento_tipo,
        treinamento_nr: item.treinamento_nr,
        turma_id: item.turma_id,
        data_realizacao: item.data_realizacao,
        dataRealizacao: item.data_realizacao, // Alias
        data_validade: item.data_validade,
        dataValidade: item.data_validade, // Alias
        presenca: item.presenca,
        percentual_presenca: item.percentual_presenca,
        status: item.status,
        nota: item.nota,
        aprovado: item.aprovado,
        certificado_url: item.certificado_url,
        certificado_numero: item.certificado_numero,
        observacoes: item.observacoes,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
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
    // Já faz mapeamento de campos no getAll()
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

  async listarTreinamentos(colaboradorId?: string | any, filtros?: any) {
    // Se colaboradorId é um objeto (paginação), busca todos os treinamentos realizados
    if (typeof colaboradorId === 'object') {
      // Buscar treinamentos realizados (colaboradores_treinamentos)
      const dados = await this.getColaboradorTreinamentos();
      return { dados, total: dados.length };
    }
    
    // Se tem colaboradorId string, busca treinamentos do colaborador específico
    if (colaboradorId && typeof colaboradorId === 'string') {
      const dados = await this.getColaboradorTreinamentos(colaboradorId);
      return { dados, total: dados.length };
    }
    
    // Senão, busca todos os treinamentos realizados (não os cursos)
    const dados = await this.getColaboradorTreinamentos();
    return { dados, total: dados.length };
  }

  async buscarEstatisticas() {
    return this.getEstatisticas();
  }
}

export default new TreinamentosService();
