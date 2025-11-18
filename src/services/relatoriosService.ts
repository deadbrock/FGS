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
      const data = response.data.data || {};
      // Garantir estrutura padrão
      return {
        totais: {
          colaboradoresAtivos: data.totais?.colaboradoresAtivos || 0,
          colaboradoresInativos: data.totais?.colaboradoresInativos || 0,
          beneficiosAtivos: data.totais?.beneficiosAtivos || 0,
          colaboradoresTreinados: data.totais?.colaboradoresTreinados || 0,
        },
        ultimos30Dias: {
          admissoes: data.ultimos30Dias?.admissoes || 0,
          demissoes: data.ultimos30Dias?.demissoes || 0,
        },
        distribuicao: {
          porEstado: Array.isArray(data.distribuicao?.porEstado) ? data.distribuicao.porEstado : [],
          porDepartamento: Array.isArray(data.distribuicao?.porDepartamento) ? data.distribuicao.porDepartamento : [],
          porGenero: Array.isArray(data.distribuicao?.porGenero) ? data.distribuicao.porGenero : [],
        },
      };
    } catch (error: any) {
      console.error('Erro ao buscar dashboard:', error);
      // Retornar estrutura vazia ao invés de lançar erro
      return {
        totais: {
          colaboradoresAtivos: 0,
          colaboradoresInativos: 0,
          beneficiosAtivos: 0,
          colaboradoresTreinados: 0,
        },
        ultimos30Dias: {
          admissoes: 0,
          demissoes: 0,
        },
        distribuicao: {
          porEstado: [],
          porDepartamento: [],
          porGenero: [],
        },
      };
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

  // ============================================
  // MÉTODOS DE COMPATIBILIDADE (LEGACY)
  // ============================================

  async buscarDashboard() {
    const dashboardData = await this.getDashboard();
    
    // Mapear DashboardData para DashboardGeral esperado pelo componente Relatorios
    const totalFuncionarios = dashboardData.totais.colaboradoresAtivos + dashboardData.totais.colaboradoresInativos;
    const percentualAtivos = totalFuncionarios > 0 
      ? (dashboardData.totais.colaboradoresAtivos / totalFuncionarios) * 100 
      : 0;
    
    // Calcular turnover mensal (demissões / média de funcionários * 100)
    const headcountMedio = totalFuncionarios; // Simplificado
    const turnoverMensal = headcountMedio > 0 
      ? (dashboardData.ultimos30Dias.demissoes / headcountMedio) * 100 
      : 0;
    
    return {
      indicadoresPrincipais: {
        totalFuncionarios,
        funcionariosAtivos: dashboardData.totais.colaboradoresAtivos,
        funcionariosInativos: dashboardData.totais.colaboradoresInativos,
        percentualAtivos,
        turnoverMensal: Math.round(turnoverMensal * 100) / 100, // Arredondar para 2 casas decimais
        turnoverAcumulado: 0, // TODO: implementar quando tiver histórico
        admissoesMes: dashboardData.ultimos30Dias.admissoes,
        demissoesMes: dashboardData.ultimos30Dias.demissoes,
        diasPerdidosAtestados: 0, // TODO: implementar quando tiver módulo de atestados
        totalAtestadosMes: 0, // TODO: implementar quando tiver módulo de atestados
        mediaDiasPorAtestado: 0, // TODO: implementar quando tiver módulo de atestados
        treinamentosVencidos: 0, // TODO: buscar de treinamentosService
        treinamentosAVencer: 0, // TODO: buscar de treinamentosService
        percentualTreinamentosOk: 0, // TODO: calcular
        custoTotalBeneficios: 0, // TODO: buscar de beneficiosService
        custoMedioPorFuncionario: 0, // TODO: calcular
        beneficiosMaisUtilizados: [], // TODO: buscar de beneficiosService
        mediaHorasTrabalhadas: 0, // TODO: buscar de pontoService
        totalHorasExtras: 0, // TODO: buscar de pontoService
        taxaPontualidade: 0, // TODO: buscar de pontoService
      },
      graficos: {
        funcionariosPorSetor: dashboardData.distribuicao.porDepartamento.map((item: any) => ({
          setor: item.departamento || item.setor || 'N/A',
          ativos: item.total || 0,
          inativos: 0,
          total: item.total || 0,
          percentual: totalFuncionarios > 0 ? ((item.total || 0) / totalFuncionarios) * 100 : 0,
        })),
        turnoverMensal: [], // TODO: implementar quando tiver histórico
        atestadosMensal: [], // TODO: implementar quando tiver módulo de atestados
        custoBeneficiosMensal: [], // TODO: implementar quando tiver histórico
      },
      alertas: [], // TODO: implementar sistema de alertas
    };
  }

  async gerarRelatorio(tipo: string, filtros?: any) {
    switch (tipo) {
      case 'colaboradores':
        return this.getRelatorioColaboradores(filtros);
      case 'beneficios':
        return this.getRelatorioBeneficios(filtros);
      case 'treinamentos':
        return this.getRelatorioTreinamentos(filtros);
      case 'ferias':
        return this.getRelatorioFerias(filtros);
      default:
        throw new Error(`Tipo de relatório inválido: ${tipo}`);
    }
  }
}

export default new RelatoriosService();
