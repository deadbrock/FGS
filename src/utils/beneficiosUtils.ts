import {
  TipoBeneficio,
  StatusBeneficio,
  FrequenciaBeneficio,
  Beneficio,
  BeneficioColaborador,
} from '../types/beneficios';

// Retorna nome amigável do tipo de benefício
export const getTipoNome = (tipo: TipoBeneficio): string => {
  const nomes: Record<TipoBeneficio, string> = {
    [TipoBeneficio.VALE_REFEICAO]: 'Vale Refeição',
    [TipoBeneficio.VALE_ALIMENTACAO]: 'Vale Alimentação',
    [TipoBeneficio.VALE_TRANSPORTE]: 'Vale Transporte',
    [TipoBeneficio.VALE_COMBUSTIVEL]: 'Vale Combustível',
    [TipoBeneficio.PLANO_SAUDE]: 'Plano de Saúde',
    [TipoBeneficio.PLANO_ODONTOLOGICO]: 'Plano Odontológico',
    [TipoBeneficio.SEGURO_VIDA]: 'Seguro de Vida',
    [TipoBeneficio.AUXILIO_EDUCACAO]: 'Auxílio Educação',
    [TipoBeneficio.AUXILIO_CRECHE]: 'Auxílio Creche',
    [TipoBeneficio.PARTICIPACAO_LUCROS]: 'Participação nos Lucros',
    [TipoBeneficio.BONUS]: 'Bônus',
    [TipoBeneficio.INCENTIVO_PERFORMANCE]: 'Incentivo por Performance',
    [TipoBeneficio.GYM_PASS]: 'Gym Pass',
    [TipoBeneficio.OUTROS]: 'Outros',
  };
  
  return nomes[tipo] || tipo;
};

// Retorna cor do tipo de benefício
export const getTipoCor = (tipo: TipoBeneficio): string => {
  const cores: Record<TipoBeneficio, string> = {
    [TipoBeneficio.VALE_REFEICAO]: '#2e7d32',
    [TipoBeneficio.VALE_ALIMENTACAO]: '#388e3c',
    [TipoBeneficio.VALE_TRANSPORTE]: '#1976d2',
    [TipoBeneficio.VALE_COMBUSTIVEL]: '#0288d1',
    [TipoBeneficio.PLANO_SAUDE]: '#d32f2f',
    [TipoBeneficio.PLANO_ODONTOLOGICO]: '#c62828',
    [TipoBeneficio.SEGURO_VIDA]: '#7b1fa2',
    [TipoBeneficio.AUXILIO_EDUCACAO]: '#f57c00',
    [TipoBeneficio.AUXILIO_CRECHE]: '#ff9800',
    [TipoBeneficio.PARTICIPACAO_LUCROS]: '#388e3c',
    [TipoBeneficio.BONUS]: '#43a047',
    [TipoBeneficio.INCENTIVO_PERFORMANCE]: '#66bb6a',
    [TipoBeneficio.GYM_PASS]: '#00796b',
    [TipoBeneficio.OUTROS]: '#757575',
  };
  
  return cores[tipo] || '#757575';
};

// Retorna ícone emoji do tipo
export const getTipoIcone = (tipo: TipoBeneficio): string => {
  const icones: Record<TipoBeneficio, string> = {
    [TipoBeneficio.VALE_REFEICAO]: '🍽️',
    [TipoBeneficio.VALE_ALIMENTACAO]: '🛒',
    [TipoBeneficio.VALE_TRANSPORTE]: '🚌',
    [TipoBeneficio.VALE_COMBUSTIVEL]: '⛽',
    [TipoBeneficio.PLANO_SAUDE]: '🏥',
    [TipoBeneficio.PLANO_ODONTOLOGICO]: '🦷',
    [TipoBeneficio.SEGURO_VIDA]: '🛡️',
    [TipoBeneficio.AUXILIO_EDUCACAO]: '📚',
    [TipoBeneficio.AUXILIO_CRECHE]: '👶',
    [TipoBeneficio.PARTICIPACAO_LUCROS]: '💰',
    [TipoBeneficio.BONUS]: '🎁',
    [TipoBeneficio.INCENTIVO_PERFORMANCE]: '🏆',
    [TipoBeneficio.GYM_PASS]: '💪',
    [TipoBeneficio.OUTROS]: '📋',
  };
  
  return icones[tipo] || '📋';
};

// Retorna nome do status
export const getStatusNome = (status: StatusBeneficio): string => {
  const nomes: Record<StatusBeneficio, string> = {
    [StatusBeneficio.ATIVO]: 'Ativo',
    [StatusBeneficio.INATIVO]: 'Inativo',
    [StatusBeneficio.SUSPENSO]: 'Suspenso',
    [StatusBeneficio.CANCELADO]: 'Cancelado',
  };
  
  return nomes[status] || status;
};

// Retorna cor do status
export const getStatusCor = (status: StatusBeneficio): string => {
  const cores: Record<StatusBeneficio, string> = {
    [StatusBeneficio.ATIVO]: '#388e3c',
    [StatusBeneficio.INATIVO]: '#757575',
    [StatusBeneficio.SUSPENSO]: '#f57c00',
    [StatusBeneficio.CANCELADO]: '#d32f2f',
  };
  
  return cores[status] || '#757575';
};

// Retorna nome da frequência
export const getFrequenciaNome = (frequencia: FrequenciaBeneficio): string => {
  const nomes: Record<FrequenciaBeneficio, string> = {
    [FrequenciaBeneficio.MENSAL]: 'Mensal',
    [FrequenciaBeneficio.TRIMESTRAL]: 'Trimestral',
    [FrequenciaBeneficio.SEMESTRAL]: 'Semestral',
    [FrequenciaBeneficio.ANUAL]: 'Anual',
    [FrequenciaBeneficio.UNICO]: 'Único',
  };
  
  return nomes[frequencia] || frequencia;
};

// Formata valor monetário
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

// Calcula valor do benefício para um colaborador
export const calcularValorBeneficio = (
  beneficio: Beneficio,
  salarioColaborador?: number
): number => {
  if (beneficio.tipoValor === 'VALOR_FIXO' && beneficio.valorFixo) {
    return beneficio.valorFixo;
  }
  
  if (beneficio.tipoValor === 'PERCENTUAL_SALARIO' && beneficio.percentualSalario && salarioColaborador) {
    return (beneficio.percentualSalario / 100) * salarioColaborador;
  }
  
  return 0;
};

// Calcula custo anual de um benefício
export const calcularCustoAnual = (
  beneficio: BeneficioColaborador
): number => {
  const valorMensal = beneficio.custoEmpresaReal;
  
  switch (beneficio.beneficio.frequencia) {
    case FrequenciaBeneficio.MENSAL:
      return valorMensal * 12;
    case FrequenciaBeneficio.TRIMESTRAL:
      return valorMensal * 4;
    case FrequenciaBeneficio.SEMESTRAL:
      return valorMensal * 2;
    case FrequenciaBeneficio.ANUAL:
    case FrequenciaBeneficio.UNICO:
      return valorMensal;
    default:
      return valorMensal * 12;
  }
};

// Verifica se benefício está próximo do vencimento
export const estaProximoVencimento = (
  dataFim?: string,
  diasAntecedencia: number = 30
): boolean => {
  if (!dataFim) return false;
  
  const hoje = new Date();
  const vencimento = new Date(dataFim);
  const diffTime = vencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= diasAntecedencia;
};

// Verifica se benefício está vencido
export const estaVencido = (dataFim?: string): boolean => {
  if (!dataFim) return false;
  
  const hoje = new Date();
  const vencimento = new Date(dataFim);
  
  return vencimento < hoje;
};

// Calcula variação percentual entre dois períodos
export const calcularVariacaoPercentual = (
  valorAnterior: number,
  valorAtual: number
): number => {
  if (valorAnterior === 0) return valorAtual > 0 ? 100 : 0;
  
  return ((valorAtual - valorAnterior) / valorAnterior) * 100;
};

// Agrupa benefícios por tipo
export const agruparPorTipo = (
  beneficios: BeneficioColaborador[]
): Record<TipoBeneficio, BeneficioColaborador[]> => {
  const agrupado: Record<string, BeneficioColaborador[]> = {};
  
  beneficios.forEach(b => {
    const tipo = b.beneficio.tipo;
    if (!agrupado[tipo]) {
      agrupado[tipo] = [];
    }
    agrupado[tipo].push(b);
  });
  
  return agrupado as Record<TipoBeneficio, BeneficioColaborador[]>;
};

// Exporta relatório para CSV
export const exportarRelatorioCSV = (dados: unknown[], nomeArquivo: string): void => {
  if (dados.length === 0) return;
  
  const cabecalho = Object.keys(dados[0] as object).join(',');
  const linhas = dados.map(item =>
    Object.values(item as object).map(val => `"${val}"`).join(',')
  );
  
  const csv = [cabecalho, ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Gera cores para gráficos
export const gerarCoresGrafico = (quantidade: number): string[] => {
  const coresPadrao = [
    '#a2122a', '#354a80', '#388e3c', '#f57c00', '#1976d2',
    '#7b1fa2', '#c2185b', '#00796b', '#f57f17', '#5d4037',
  ];
  
  const cores: string[] = [];
  for (let i = 0; i < quantidade; i++) {
    cores.push(coresPadrao[i % coresPadrao.length]);
  }
  
  return cores;
};

// Valida se colaborador é elegível para benefício
export const validarElegibilidade = (
  beneficio: Beneficio,
  cargo?: string,
  departamento?: string
): boolean => {
  // Verifica cargo
  if (beneficio.cargoElegivel && beneficio.cargoElegivel.length > 0 && cargo) {
    if (!beneficio.cargoElegivel.includes(cargo)) {
      return false;
    }
  }
  
  // Verifica departamento
  if (beneficio.departamentoElegivel && beneficio.departamentoElegivel.length > 0 && departamento) {
    if (!beneficio.departamentoElegivel.includes(departamento)) {
      return false;
    }
  }
  
  return true;
};

