import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface ColaboradorRegional {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  cargo: string;
  departamento: string;
  local_trabalho: string;
  genero: 'MASCULINO' | 'FEMININO';
  data_admissao: string;
  status: string;
  avatar_url?: string;
}

export interface EstatisticasRegionais {
  totalColaboradores: number;
  totalAdministrativos: number;
  distribuicaoPorEstado: Array<{
    estado: string;
    total: number;
  }>;
  distribuicaoPorGenero: Array<{
    genero: string;
    total: number;
  }>;
}

export interface FiltrosRegionais {
  estado?: string;
  genero?: 'MASCULINO' | 'FEMININO';
  cargo?: string;
  tipo?: 'todos' | 'administrativos';
  search?: string;
}

class RegionaisService {
  private api = axios.create({
    baseURL: `${API_URL}/api/regionais`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Estatísticas gerais
  async getEstatisticasGerais(): Promise<EstatisticasRegionais> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas regionais:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas regionais');
    }
  }

  // Listar colaboradores regionais
  async getColaboradores(filtros?: FiltrosRegionais): Promise<ColaboradorRegional[]> {
    try {
      const response = await this.api.get('/colaboradores', { params: filtros });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar colaboradores regionais:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar colaboradores regionais');
    }
  }

  // Listar apenas administrativos
  async getAdministrativos(filtros?: Omit<FiltrosRegionais, 'tipo'>): Promise<ColaboradorRegional[]> {
    try {
      const response = await this.api.get('/colaboradores', { 
        params: { ...filtros, tipo: 'administrativos' } 
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar colaboradores administrativos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar colaboradores administrativos');
    }
  }

  // ============================================
  // MÉTODOS DE COMPATIBILIDADE (LEGACY)
  // ============================================

  // Alias para compatibilidade com código antigo
  async getRankingEstados() {
    const stats = await this.getEstatisticasGerais();
    return stats.distribuicaoPorEstado.map(item => ({
      estado: item.estado,
      total: item.total,
      crescimento: 0 // Mock - não implementado no backend
    }));
  }

  async getColaboradoresPorEstado(estado: string) {
    return this.getColaboradores({ estado });
  }

  async getAllColaboradores(filtros?: FiltrosRegionais) {
    return this.getColaboradores(filtros);
  }
}

export default new RegionaisService();

