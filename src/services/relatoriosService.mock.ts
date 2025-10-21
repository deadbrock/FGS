import {
  DashboardGeral,
  IndicadoresPrincipais,
  RelatorioFuncionarios,
} from '../types/relatorios';

class RelatoriosServiceMock {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async buscarDashboard(): Promise<DashboardGeral> {
    await this.delay(500);
    
    const indicadores: IndicadoresPrincipais = {
      totalFuncionarios: 245,
      funcionariosAtivos: 238,
      funcionariosInativos: 7,
      percentualAtivos: 97.1,
      
      turnoverMensal: 2.8,
      turnoverAcumulado: 8.5,
      admissoesMes: 3,
      demissoesMes: 4,
      
      diasPerdidosAtestados: 42,
      totalAtestadosMes: 18,
      mediaDiasPorAtestado: 2.3,
      
      treinamentosVencidos: 12,
      treinamentosAVencer: 28,
      percentualTreinamentosOk: 85.3,
      
      custoTotalBeneficios: 212000,
      custoMedioPorFuncionario: 865,
      beneficiosMaisUtilizados: ['Vale Refeição', 'Plano de Saúde', 'Vale Transporte'],
      
      mediaHorasTrabalhadas: 480,
      totalHorasExtras: 120,
      taxaPontualidade: 94.5,
    };
    
    return {
      indicadoresPrincipais: indicadores,
      graficos: {
        funcionariosPorSetor: [
          { setor: 'TI', ativos: 45, inativos: 2, total: 47, percentual: 19.2 },
          { setor: 'RH', ativos: 25, inativos: 1, total: 26, percentual: 10.6 },
          { setor: 'Vendas', ativos: 80, inativos: 3, total: 83, percentual: 33.9 },
          { setor: 'Operações', ativos: 68, inativos: 1, total: 69, percentual: 28.2 },
          { setor: 'Financeiro', ativos: 20, inativos: 0, total: 20, percentual: 8.2 },
        ],
        turnoverMensal: [
          { mes: '2024-07', admissoes: 5, demissoes: 3, turnover: 1.6 },
          { mes: '2024-08', admissoes: 4, demissoes: 5, turnover: 1.8 },
          { mes: '2024-09', admissoes: 6, demissoes: 4, turnover: 2.0 },
          { mes: '2024-10', admissoes: 3, demissoes: 4, turnover: 2.8 },
        ],
        atestadosMensal: [
          { mes: '2024-07', quantidade: 15, diasPerdidos: 35 },
          { mes: '2024-08', quantidade: 20, diasPerdidos: 48 },
          { mes: '2024-09', quantidade: 16, diasPerdidos: 38 },
          { mes: '2024-10', quantidade: 18, diasPerdidos: 42 },
        ],
        custoBeneficiosMensal: [
          { mes: '2024-07', custoTotal: 209000, custoEmpresa: 185000, custoColaborador: 24000 },
          { mes: '2024-08', custoTotal: 210200, custoEmpresa: 186000, custoColaborador: 24200 },
          { mes: '2024-09', custoTotal: 211400, custoEmpresa: 187000, custoColaborador: 24400 },
          { mes: '2024-10', custoTotal: 212000, custoEmpresa: 187500, custoColaborador: 24500 },
        ],
      },
      alertas: [
        {
          id: '1',
          tipo: 'AVISO',
          titulo: 'Treinamentos Vencidos',
          mensagem: '12 treinamentos estão vencidos e precisam de atenção',
          data: new Date().toISOString(),
        },
        {
          id: '2',
          tipo: 'INFO',
          titulo: 'Taxa de Pontualidade',
          mensagem: 'Taxa de pontualidade em 94.5%, acima da meta de 90%',
          data: new Date().toISOString(),
        },
      ],
    };
  }

  async gerarRelatorioFuncionarios(): Promise<RelatorioFuncionarios> {
    await this.delay(600);
    return {
      periodo: { inicio: '2024-01-01', fim: '2024-10-31' },
      totalAtivos: 238,
      totalInativos: 7,
      totalGeral: 245,
      porSetor: [
        { setor: 'TI', ativos: 45, inativos: 2, total: 47, percentual: 19.2 },
        { setor: 'Vendas', ativos: 80, inativos: 3, total: 83, percentual: 33.9 },
      ],
      porFuncao: [
        { funcao: 'Analista', quantidade: 85, percentual: 34.7 },
        { funcao: 'Assistente', quantidade: 60, percentual: 24.5 },
      ],
      porUnidade: [
        { unidade: 'Matriz', ativos: 150, inativos: 5, total: 155 },
        { unidade: 'Filial SP', ativos: 88, inativos: 2, total: 90 },
      ],
      evolucaoMensal: [
        { mes: '2024-07', ativos: 242, admissoes: 5, demissoes: 3 },
        { mes: '2024-08', ativos: 241, admissoes: 4, demissoes: 5 },
      ],
    };
  }
}

export default new RelatoriosServiceMock();

