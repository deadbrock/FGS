import {
  ResumoDia,
  StatusDia,
  EstatisticasPonto,
  RankingPontualidade,
  RelatorioAtrasos,
  RelatorioFaltas,
} from '../types/ponto';

// Dados mock
const resumosDiasMock: ResumoDia[] = [
  {
    id: '1',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    departamento: 'RH',
    cargo: 'Analista',
    data: '2024-10-18',
    diaSemana: 'Sexta-feira',
    horarioPrevisto: {
      entrada: '08:00',
      saida: '17:00',
      intervaloInicio: '12:00',
      intervaloFim: '13:00',
    },
    horarioRealizado: {
      entrada: '08:05',
      saida: '17:10',
      intervaloInicio: '12:00',
      intervaloFim: '13:00',
    },
    horasTrabalhadas: 490, // 8h10min
    horasExtras: 10,
    atrasoMinutos: 0, // < 15 min, não conta
    saidaAntecipada: 0,
    status: StatusDia.PRESENTE,
    temJustificativa: false,
    registros: [],
  },
  {
    id: '2',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    departamento: 'RH',
    cargo: 'Analista',
    data: '2024-10-17',
    diaSemana: 'Quinta-feira',
    horarioPrevisto: {
      entrada: '08:00',
      saida: '17:00',
      intervaloInicio: '12:00',
      intervaloFim: '13:00',
    },
    horarioRealizado: {
      entrada: '08:20',
      saida: '17:00',
      intervaloInicio: '12:00',
      intervaloFim: '13:00',
    },
    horasTrabalhadas: 460, // 7h40min
    horasExtras: 0,
    atrasoMinutos: 20, // >= 15 min, conta!
    saidaAntecipada: 0,
    status: StatusDia.ATRASADO,
    temJustificativa: false,
    registros: [],
  },
];

class PontoServiceMock {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // RESUMOS DIÁRIOS
  async listarResumosDias(
    _dataInicio: string,
    _dataFim: string,
    colaboradorId?: string
  ): Promise<ResumoDia[]> {
    await this.delay(400);
    
    let dados = [...resumosDiasMock];
    
    if (colaboradorId) {
      dados = dados.filter(d => d.colaboradorId === colaboradorId);
    }
    
    return dados;
  }

  async buscarResumoDia(colaboradorId: string, data: string): Promise<ResumoDia | null> {
    await this.delay(200);
    return resumosDiasMock.find(
      d => d.colaboradorId === colaboradorId && d.data === data
    ) || null;
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasPonto> {
    await this.delay(500);
    
    return {
      hoje: {
        presentes: 238,
        ausentes: 5,
        atrasados: 2,
        totalColaboradores: 245,
        percentualPresenca: 97.1,
      },
      mes: {
        totalRegistros: 4900,
        mediaHorasTrabalhadas: 480,
        totalHorasExtras: 120,
        totalAtrasos: 15,
        totalFaltas: 8,
      },
      graficoPresenca: [
        { data: '2024-10-13', presentes: 240, ausentes: 3, atrasados: 2 },
        { data: '2024-10-14', presentes: 238, ausentes: 5, atrasados: 2 },
        { data: '2024-10-15', presentes: 242, ausentes: 2, atrasados: 1 },
        { data: '2024-10-16', presentes: 239, ausentes: 4, atrasados: 2 },
        { data: '2024-10-17', presentes: 241, ausentes: 3, atrasados: 1 },
        { data: '2024-10-18', presentes: 238, ausentes: 5, atrasados: 2 },
      ],
      graficoAtrasos: [
        { departamento: 'TI', quantidade: 5, minutosAcumulados: 120 },
        { departamento: 'RH', quantidade: 3, minutosAcumulados: 75 },
        { departamento: 'Vendas', quantidade: 4, minutosAcumulados: 95 },
        { departamento: 'Operações', quantidade: 3, minutosAcumulados: 60 },
      ],
    };
  }

  // RANKING
  async buscarRanking(dataInicio: string, dataFim: string): Promise<RankingPontualidade> {
    await this.delay(400);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      ranking: [
        {
          posicao: 1,
          colaboradorId: '1',
          colaboradorNome: 'Maria Santos',
          departamento: 'TI',
          cargo: 'Desenvolvedora',
          pontuacao: 100,
          diasTrabalhados: 20,
          diasPontuais: 20,
          atrasos: 0,
          faltas: 0,
          percentualPontualidade: 100,
        },
        {
          posicao: 2,
          colaboradorId: '2',
          colaboradorNome: 'João Silva',
          departamento: 'RH',
          cargo: 'Analista',
          pontuacao: 95,
          diasTrabalhados: 20,
          diasPontuais: 19,
          atrasos: 1,
          faltas: 0,
          percentualPontualidade: 95,
        },
        {
          posicao: 3,
          colaboradorId: '3',
          colaboradorNome: 'Ana Costa',
          departamento: 'Vendas',
          cargo: 'Gerente',
          pontuacao: 90,
          diasTrabalhados: 20,
          diasPontuais: 18,
          atrasos: 2,
          faltas: 0,
          percentualPontualidade: 90,
        },
      ],
    };
  }

  // RELATÓRIOS
  async gerarRelatorioAtrasos(dataInicio: string, dataFim: string): Promise<RelatorioAtrasos> {
    await this.delay(600);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      colaboradores: [
        {
          colaboradorId: '1',
          colaboradorNome: 'João Silva',
          departamento: 'RH',
          cargo: 'Analista',
          totalAtrasos: 2,
          minutosAcumulados: 45,
          diasComAtraso: ['2024-10-17', '2024-10-15'],
          percentualPontualidade: 90,
        },
      ],
      totalAtrasos: 15,
      mediaAtrasoMinutos: 22,
    };
  }

  async gerarRelatorioFaltas(dataInicio: string, dataFim: string): Promise<RelatorioFaltas> {
    await this.delay(600);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      colaboradores: [],
      totalFaltas: 8,
      totalJustificadas: 6,
      totalInjustificadas: 2,
    };
  }

  // EXPORTAÇÕES
  async exportarEspelhoPonto(_colaboradorId: string, mesReferencia: string): Promise<Blob> {
    await this.delay(1000);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Espelho de Ponto</title></head>
      <body><h1>Espelho de Ponto - ${mesReferencia}</h1></body>
      </html>
    `;
    
    return new Blob([html], { type: 'text/html' });
  }
}

export default new PontoServiceMock();

