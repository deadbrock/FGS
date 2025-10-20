// Tipos para o módulo de Relatórios e Indicadores

export enum TipoRelatorio {
  FUNCIONARIOS = 'FUNCIONARIOS',
  TURNOVER = 'TURNOVER',
  ATESTADOS = 'ATESTADOS',
  TREINAMENTOS = 'TREINAMENTOS',
  BENEFICIOS = 'BENEFICIOS',
  PONTO = 'PONTO',
  GERAL = 'GERAL',
}

export enum FormatoExportacao {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

// Indicadores Principais
export interface IndicadoresPrincipais {
  // Funcionários
  totalFuncionarios: number;
  funcionariosAtivos: number;
  funcionariosInativos: number;
  percentualAtivos: number;
  
  // Turnover
  turnoverMensal: number;
  turnoverAcumulado: number;
  admissoesMes: number;
  demissoesMes: number;
  
  // Atestados
  diasPerdidosAtestados: number;
  totalAtestadosMes: number;
  mediaDiasPorAtestado: number;
  
  // Treinamentos
  treinamentosVencidos: number;
  treinamentosAVencer: number; // Próximos 30 dias
  percentualTreinamentosOk: number;
  
  // Benefícios
  custoTotalBeneficios: number;
  custoMedioPorFuncionario: number;
  beneficiosMaisUtilizados: string[];
  
  // Ponto
  mediaHorasTrabalhadas: number;
  totalHorasExtras: number;
  taxaPontualidade: number;
}

// Relatório de Funcionários
export interface RelatorioFuncionarios {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Totais
  totalAtivos: number;
  totalInativos: number;
  totalGeral: number;
  
  // Por setor
  porSetor: FuncionariosPorSetor[];
  
  // Por função
  porFuncao: FuncionariosPorFuncao[];
  
  // Por unidade
  porUnidade: FuncionariosPorUnidade[];
  
  // Evolução mensal
  evolucaoMensal: EvolucaoFuncionarios[];
}

export interface FuncionariosPorSetor {
  setor: string;
  ativos: number;
  inativos: number;
  total: number;
  percentual: number;
}

export interface FuncionariosPorFuncao {
  funcao: string;
  quantidade: number;
  percentual: number;
}

export interface FuncionariosPorUnidade {
  unidade: string;
  ativos: number;
  inativos: number;
  total: number;
}

export interface EvolucaoFuncionarios {
  mes: string;
  ativos: number;
  admissoes: number;
  demissoes: number;
}

// Relatório de Turnover
export interface RelatorioTurnover {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas
  taxaTurnover: number;
  totalAdmissoes: number;
  totalDemissoes: number;
  headcountMedio: number;
  
  // Por motivo de desligamento
  porMotivo: TurnoverPorMotivo[];
  
  // Por setor
  porSetor: TurnoverPorSetor[];
  
  // Evolução mensal
  evolucaoMensal: EvolucaoTurnover[];
  
  // Tempo médio de casa
  tempoMedioCasa: number; // Em meses
}

export interface TurnoverPorMotivo {
  motivo: string;
  quantidade: number;
  percentual: number;
}

export interface TurnoverPorSetor {
  setor: string;
  admissoes: number;
  demissoes: number;
  taxaTurnover: number;
}

export interface EvolucaoTurnover {
  mes: string;
  admissoes: number;
  demissoes: number;
  turnover: number;
}

// Relatório de Atestados
export interface RelatorioAtestados {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas
  totalAtestados: number;
  totalDiasPerdidos: number;
  mediaDiasPorAtestado: number;
  custoEstimado: number;
  
  // Por tipo (CID simplificado)
  porTipo: AtestadosPorTipo[];
  
  // Por setor
  porSetor: AtestadosPorSetor[];
  
  // Colaboradores com mais atestados
  topColaboradores: ColaboradorAtestados[];
  
  // Evolução mensal
  evolucaoMensal: EvolucaoAtestados[];
}

export interface AtestadosPorTipo {
  tipo: string;
  quantidade: number;
  diasPerdidos: number;
  percentual: number;
}

export interface AtestadosPorSetor {
  setor: string;
  quantidade: number;
  diasPerdidos: number;
  colaboradoresAfetados: number;
}

export interface ColaboradorAtestados {
  colaboradorId: string;
  colaboradorNome: string;
  setor: string;
  totalAtestados: number;
  diasPerdidos: number;
}

export interface EvolucaoAtestados {
  mes: string;
  quantidade: number;
  diasPerdidos: number;
}

// Relatório de Treinamentos
export interface RelatorioTreinamentos {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas
  totalTreinamentos: number;
  treinamentosVencidos: number;
  treinamentosAVencer: number;
  treinamentosOk: number;
  percentualConformidade: number;
  
  // Por tipo
  porTipo: TreinamentosPorTipo[];
  
  // Por setor
  porSetor: TreinamentosPorSetor[];
  
  // Colaboradores pendentes
  colaboradoresPendentes: ColaboradorTreinamento[];
}

export interface TreinamentosPorTipo {
  tipo: string;
  total: number;
  vencidos: number;
  aVencer: number;
  ok: number;
  percentualConformidade: number;
}

export interface TreinamentosPorSetor {
  setor: string;
  total: number;
  vencidos: number;
  percentualConformidade: number;
}

export interface ColaboradorTreinamento {
  colaboradorId: string;
  colaboradorNome: string;
  setor: string;
  treinamentosVencidos: number;
  treinamentosAVencer: number;
}

// Relatório de Benefícios
export interface RelatorioBeneficiosCustos {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas
  custoTotalEmpresa: number;
  custoTotalColaborador: number;
  custoTotal: number;
  custoMedioPorColaborador: number;
  
  // Por tipo
  porTipo: CustoBeneficioPorTipo[];
  
  // Por setor
  porSetor: CustoBeneficioPorSetor[];
  
  // Evolução mensal
  evolucaoMensal: EvolucaoCustoBeneficios[];
  
  // Comparativo com período anterior
  variacaoPercentual: number;
}

export interface CustoBeneficioPorTipo {
  tipo: string;
  custoEmpresa: number;
  custoColaborador: number;
  custoTotal: number;
  beneficiarios: number;
  percentualTotal: number;
}

export interface CustoBeneficioPorSetor {
  setor: string;
  custoTotal: number;
  colaboradores: number;
  custoPorColaborador: number;
}

export interface EvolucaoCustoBeneficios {
  mes: string;
  custoTotal: number;
  custoEmpresa: number;
  custoColaborador: number;
}

// Relatório de Ponto
export interface RelatorioPonto {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas
  mediaHorasTrabalhadas: number;
  totalHorasExtras: number;
  totalAtrasos: number;
  totalFaltas: number;
  taxaPontualidade: number;
  
  // Por setor
  porSetor: PontoPorSetor[];
  
  // Ranking pontualidade
  ranking: RankingPontualidade[];
}

export interface PontoPorSetor {
  setor: string;
  mediaHoras: number;
  horasExtras: number;
  atrasos: number;
  faltas: number;
  taxaPontualidade: number;
}

export interface RankingPontualidade {
  colaboradorId: string;
  colaboradorNome: string;
  setor: string;
  diasPontuais: number;
  diasTrabalhados: number;
  percentual: number;
}

// Filtros Globais
export interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  setores?: string[];
  funcoes?: string[];
  unidades?: string[];
}

// Dashboard Geral
export interface DashboardGeral {
  indicadoresPrincipais: IndicadoresPrincipais;
  graficos: {
    funcionariosPorSetor: FuncionariosPorSetor[];
    turnoverMensal: EvolucaoTurnover[];
    atestadosMensal: EvolucaoAtestados[];
    custoBeneficiosMensal: EvolucaoCustoBeneficios[];
  };
  alertas: Alerta[];
}

export interface Alerta {
  id: string;
  tipo: 'ERRO' | 'AVISO' | 'INFO';
  titulo: string;
  mensagem: string;
  data: string;
}

