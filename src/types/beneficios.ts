// Tipos para o módulo de Benefícios

export enum TipoBeneficio {
  VALE_REFEICAO = 'VALE_REFEICAO',
  VALE_ALIMENTACAO = 'VALE_ALIMENTACAO',
  VALE_TRANSPORTE = 'VALE_TRANSPORTE',
  VALE_COMBUSTIVEL = 'VALE_COMBUSTIVEL',
  PLANO_SAUDE = 'PLANO_SAUDE',
  PLANO_ODONTOLOGICO = 'PLANO_ODONTOLOGICO',
  SEGURO_VIDA = 'SEGURO_VIDA',
  AUXILIO_EDUCACAO = 'AUXILIO_EDUCACAO',
  AUXILIO_CRECHE = 'AUXILIO_CRECHE',
  PARTICIPACAO_LUCROS = 'PARTICIPACAO_LUCROS',
  BONUS = 'BONUS',
  INCENTIVO_PERFORMANCE = 'INCENTIVO_PERFORMANCE',
  GYM_PASS = 'GYM_PASS',
  OUTROS = 'OUTROS',
}

export enum StatusBeneficio {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  SUSPENSO = 'SUSPENSO',
  CANCELADO = 'CANCELADO',
}

export enum FrequenciaBeneficio {
  MENSAL = 'MENSAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
  UNICO = 'UNICO',
}

export enum TipoValor {
  VALOR_FIXO = 'VALOR_FIXO',
  PERCENTUAL_SALARIO = 'PERCENTUAL_SALARIO',
  VARIAVEL = 'VARIAVEL',
}

// Cadastro de Benefício (template)
export interface Beneficio {
  id: string;
  tipo: TipoBeneficio;
  nome: string;
  descricao: string;
  fornecedor?: string; // Ex: Alelo, Sodexo, Unimed
  
  // Valores
  tipoValor: TipoValor;
  valorFixo?: number; // Se tipo for VALOR_FIXO
  percentualSalario?: number; // Se tipo for PERCENTUAL_SALARIO
  
  // Configurações
  frequencia: FrequenciaBeneficio;
  diaConcessao?: number; // Dia do mês (1-31)
  exigeComprovacao: boolean;
  
  // Elegibilidade
  cargoElegivel?: string[]; // Lista de cargos
  departamentoElegivel?: string[]; // Lista de departamentos
  nivelMinimo?: string; // Nível hierárquico mínimo
  
  // Custos
  custoEmpresa: number; // Valor pago pela empresa
  custoColaborador: number; // Desconto do colaborador
  
  // Status
  status: StatusBeneficio;
  dataInicio: string;
  dataFim?: string;
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  atualizadoEm?: string;
}

// Benefício associado a um colaborador
export interface BeneficioColaborador {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  beneficioId: string;
  beneficio: Beneficio;
  
  // Valores específicos deste colaborador
  valorConcedido: number; // Pode ser diferente do padrão
  custoEmpresaReal: number;
  custoColaboradorReal: number;
  
  // Status
  status: StatusBeneficio;
  dataInicio: string;
  dataFim?: string;
  motivoSuspensao?: string;
  
  // Comprovação
  documentosComprovacao: string[]; // URLs dos documentos
  proximaRenovacao?: string;
  
  // Aprovação
  aprovadoPor?: string;
  dataAprovacao?: string;
  observacoes?: string;
  
  // Metadados
  criadoEm: string;
  atualizadoEm?: string;
}

// Histórico de alterações
export interface HistoricoBeneficio {
  id: string;
  beneficioColaboradorId: string;
  colaboradorId: string;
  colaboradorNome: string;
  beneficioNome: string;
  
  // Tipo de alteração
  tipoAlteracao: 'CONCESSAO' | 'ALTERACAO_VALOR' | 'SUSPENSAO' | 'REATIVACAO' | 'CANCELAMENTO';
  
  // Valores anteriores
  valorAnterior?: number;
  statusAnterior?: StatusBeneficio;
  
  // Valores novos
  valorNovo?: number;
  statusNovo?: StatusBeneficio;
  
  // Detalhes
  motivo: string;
  observacoes?: string;
  
  // Autor
  alteradoPor: string;
  dataAlteracao: string;
}

// Relatório de Custos
export interface RelatorioCustos {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Totais Gerais
  custoTotalEmpresa: number;
  custoTotalColaborador: number;
  custoTotal: number;
  totalBeneficios: number;
  totalColaboradores: number;
  
  // Por Tipo de Benefício
  porTipo: CustoPorTipo[];
  
  // Por Departamento
  porDepartamento: CustoPorDepartamento[];
  
  // Por Colaborador (top 10 mais caros)
  topColaboradores: CustoColaborador[];
}

export interface CustoPorTipo {
  tipo: TipoBeneficio;
  nome: string;
  quantidade: number;
  custoEmpresa: number;
  custoColaborador: number;
  custoTotal: number;
  percentualTotal: number;
}

export interface CustoPorDepartamento {
  departamento: string;
  quantidade: number;
  custoEmpresa: number;
  custoColaborador: number;
  custoTotal: number;
  colaboradoresAtendidos: number;
}

export interface CustoColaborador {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  quantidadeBeneficios: number;
  custoEmpresa: number;
  custoColaborador: number;
  custoTotal: number;
}

// Comparativo entre períodos
export interface ComparativoPeriodos {
  periodo1: {
    inicio: string;
    fim: string;
    custoTotal: number;
  };
  periodo2: {
    inicio: string;
    fim: string;
    custoTotal: number;
  };
  
  // Variações
  variacaoAbsoluta: number;
  variacaoPercentual: number;
  
  // Detalhamento
  porTipo: ComparativoTipo[];
  porDepartamento: ComparativoDepartamento[];
}

export interface ComparativoTipo {
  tipo: TipoBeneficio;
  nome: string;
  periodo1: number;
  periodo2: number;
  variacao: number;
  variacaoPercentual: number;
}

export interface ComparativoDepartamento {
  departamento: string;
  periodo1: number;
  periodo2: number;
  variacao: number;
  variacaoPercentual: number;
}

// Estatísticas do Dashboard
export interface EstatisticasBeneficios {
  totalAtivos: number;
  totalInativos: number;
  totalColaboradoresAtendidos: number;
  custoMensalEmpresa: number;
  custoMensalColaborador: number;
  custoMensalTotal: number;
  
  // Distribuição
  distribuicaoPorTipo: DistribuicaoBeneficio[];
  evolucaoCustos: EvolucaoCusto[];
  
  // Alertas
  beneficiosProximosVencimento: BeneficioColaborador[];
  beneficiosSemComprovacao: BeneficioColaborador[];
}

export interface DistribuicaoBeneficio {
  tipo: TipoBeneficio;
  nome: string;
  quantidade: number;
  percentual: number;
}

export interface EvolucaoCusto {
  mes: string;
  custoEmpresa: number;
  custoColaborador: number;
  custoTotal: number;
}

// Solicitação de Benefício (pelo colaborador)
export interface SolicitacaoBeneficio {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  beneficioId: string;
  beneficioNome: string;
  
  // Justificativa
  justificativa: string;
  documentosAnexos: string[];
  
  // Status da solicitação
  status: 'PENDENTE' | 'EM_ANALISE' | 'APROVADA' | 'RECUSADA';
  
  // Avaliação
  avaliadoPor?: string;
  dataAvaliacao?: string;
  observacaoAvaliacao?: string;
  
  // Metadados
  criadaEm: string;
}

// Filtros
export interface FiltrosBeneficios {
  tipo?: TipoBeneficio[];
  status?: StatusBeneficio[];
  departamento?: string;
  dataInicio?: string;
  dataFim?: string;
  colaboradorId?: string;
}

// Resumo para Dashboard
export interface ResumoBeneficioColaborador {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  beneficios: BeneficioColaborador[];
  custoTotalEmpresa: number;
  custoTotalColaborador: number;
  custoTotal: number;
}

