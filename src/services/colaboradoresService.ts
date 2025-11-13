import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface Colaborador {
  id: string;
  nome_completo: string;
  cpf: string;
  matricula: string;
  data_nascimento?: string;
  genero?: 'MASCULINO' | 'FEMININO';
  email_pessoal?: string;
  telefone_pessoal?: string;
  
  // Endereço
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  endereco_cep?: string;
  
  // Dados Contratuais
  data_admissao: string;
  data_demissao?: string;
  cargo: string;
  departamento: string;
  salario: number;
  tipo_contrato?: string;
  jornada_trabalho?: string;
  local_trabalho?: string;
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO';
  
  // Documentos
  rg?: string;
  orgao_emissor_rg?: string;
  data_emissao_rg?: string;
  titulo_eleitor?: string;
  zona_eleitoral?: string;
  secao_eleitoral?: string;
  pis?: string;
  ctps_numero?: string;
  ctps_serie?: string;
  ctps_uf?: string;
  
  // Dados Adicionais
  estado_civil?: string;
  nacionalidade?: string;
  escolaridade?: string;
  email_corporativo?: string;
  telefone_corporativo?: string;
  
  // Bancários
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: string;
  
  // Emergência
  nome_emergencia?: string;
  telefone_emergencia?: string;
  parentesco_emergencia?: string;
  
  observacoes?: string;
  avatar_url?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface ColaboradorFiltros {
  status?: string;
  departamento?: string;
  cargo?: string;
  local_trabalho?: string;
  genero?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface EstatisticasColaboradores {
  totalAtivos: number;
  porGenero: { genero: string; count: string }[];
  porEstado: { local_trabalho: string; count: string }[];
  topCargos: { cargo: string; count: string }[];
}

class ColaboradoresService {
  private api = axios.create({
    baseURL: `${API_URL}/api/colaboradores`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Listar colaboradores
  async getAll(filtros?: ColaboradorFiltros): Promise<{ data: Colaborador[]; pagination: any }> {
    try {
      const response = await this.api.get('/', { params: filtros });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar colaboradores:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar colaboradores');
    }
  }

  // Buscar por ID
  async getById(id: string): Promise<Colaborador> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar colaborador:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar colaborador');
    }
  }

  // Criar colaborador
  async create(colaborador: Partial<Colaborador>): Promise<Colaborador> {
    try {
      const response = await this.api.post('/', colaborador);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar colaborador:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar colaborador');
    }
  }

  // Atualizar colaborador
  async update(id: string, colaborador: Partial<Colaborador>): Promise<Colaborador> {
    try {
      const response = await this.api.put(`/${id}`, colaborador);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar colaborador:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar colaborador');
    }
  }

  // Deletar colaborador
  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar colaborador:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar colaborador');
    }
  }

  // Estatísticas
  async getEstatisticas(): Promise<EstatisticasColaboradores> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }
}

export default new ColaboradoresService();

