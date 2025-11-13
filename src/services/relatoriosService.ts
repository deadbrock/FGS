import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface DashboardData {
  totais: {
    colaboradoresAtivos: number;
    colaboradoresInativos: number;
    beneficiosAtivos: number;
    colaboradoresTreinados: number;
  };
  ultimos30Dias: {
    admissoes: number;
    demissoes: number;
  };
  distribuicao: {
    porEstado: Array<{ local_trabalho: string; total: number }>;
    porDepartamento: Array<{ departamento: string; total: number }>;
    porGenero: Array<{ genero: string; total: number }>;
  };
}

export interface FiltrosRelatorioColaboradores {
  status?: string;
  departamento?: string;
  cargo?: string;
  local_trabalho?: string;
  genero?: string;
  data_admissao_inicio?: string;
  data_admissao_fim?: string;
  formato?: 'json' | 'csv';
}

export interface FiltrosRelatorioBeneficios {
  tipo_beneficio_id?: string;
  status?: string;
  data_inicio_inicio?: string;
  data_inicio_fim?: string;
}

export interface FiltrosRelatorioTreinamentos {
  treinamento_id?: string;
  status?: string;
  data_conclusao_inicio?: string;
  data_conclusao_fim?: string;
  vencidos?: boolean;
}

export interface FiltrosRelatorioFerias {
  colaborador_id?: string;
  status?: string;
  periodo_inicio?: string;
  periodo_fim?: string;
}

class RelatoriosService {
  private api = axios.create({
    baseURL: `${API_URL}/api/relatorios`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Dashboard geral
  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await this.api.get('/dashboard');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar dashboard:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar dashboard');
    }
  }

  // Relatório de colaboradores
  async getRelatorioColaboradores(filtros?: FiltrosRelatorioColaboradores): Promise<any[]> {
    try {
      if (filtros?.formato === 'csv') {
        // Para CSV, fazer download direto
        const response = await this.api.get('/colaboradores', {
          params: filtros,
          responseType: 'blob',
        });

        // Criar download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'colaboradores.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return [];
      } else {
        const response = await this.api.get('/colaboradores', { params: filtros });
        return response.data.data;
      }
    } catch (error: any) {
      console.error('Erro ao buscar relatório de colaboradores:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar relatório de colaboradores');
    }
  }

  // Relatório de benefícios
  async getRelatorioBeneficios(filtros?: FiltrosRelatorioBeneficios): Promise<{
    data: any[];
    total: number;
    custoTotalMensal: string;
  }> {
    try {
      const response = await this.api.get('/beneficios', { params: filtros });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de benefícios:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar relatório de benefícios');
    }
  }

  // Relatório de treinamentos
  async getRelatorioTreinamentos(filtros?: FiltrosRelatorioTreinamentos): Promise<any[]> {
    try {
      const response = await this.api.get('/treinamentos', { params: filtros });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de treinamentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar relatório de treinamentos');
    }
  }

  // Relatório de aniversariantes
  async getRelatorioAniversariantes(mes: number): Promise<any[]> {
    try {
      const response = await this.api.get('/aniversariantes', { params: { mes } });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de aniversariantes:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar relatório de aniversariantes');
    }
  }

  // Relatório de férias
  async getRelatorioFerias(filtros?: FiltrosRelatorioFerias): Promise<any[]> {
    try {
      const response = await this.api.get('/ferias', { params: filtros });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de férias:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar relatório de férias');
    }
  }
}

export default new RelatoriosService();
