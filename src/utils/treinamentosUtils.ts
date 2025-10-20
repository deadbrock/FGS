import { StatusTreinamento, TreinamentoColaborador } from '../types/treinamentos';

// Calcula a data de validade baseada na data de realização e dias de validade
export const calcularDataValidade = (dataRealizacao: string, validadeDias: number): string | undefined => {
  if (validadeDias === 0) return undefined; // Sem validade
  
  const data = new Date(dataRealizacao);
  data.setDate(data.getDate() + validadeDias);
  return data.toISOString().split('T')[0];
};

// Calcula o status do treinamento baseado na data de validade
export const calcularStatusTreinamento = (
  dataValidade: string | undefined,
  diasAlerta: number = 30
): StatusTreinamento => {
  if (!dataValidade) return StatusTreinamento.ATIVO;
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const validade = new Date(dataValidade);
  validade.setHours(0, 0, 0, 0);
  
  const diffTime = validade.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return StatusTreinamento.VENCIDO;
  } else if (diffDays <= diasAlerta) {
    return StatusTreinamento.A_VENCER;
  } else {
    return StatusTreinamento.ATIVO;
  }
};

// Retorna dias restantes até o vencimento
export const calcularDiasRestantes = (dataValidade: string | undefined): number | null => {
  if (!dataValidade) return null;
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const validade = new Date(dataValidade);
  validade.setHours(0, 0, 0, 0);
  
  const diffTime = validade.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Retorna cor do status
export const getStatusColor = (status: StatusTreinamento): string => {
  const cores: Record<StatusTreinamento, string> = {
    [StatusTreinamento.ATIVO]: '#388e3c',
    [StatusTreinamento.VENCIDO]: '#d32f2f',
    [StatusTreinamento.A_VENCER]: '#f57c00',
    [StatusTreinamento.CANCELADO]: '#757575',
    [StatusTreinamento.CONCLUIDO]: '#1976d2',
  };
  
  return cores[status] || '#757575';
};

// Retorna nome do status
export const getStatusNome = (status: StatusTreinamento): string => {
  const nomes: Record<StatusTreinamento, string> = {
    [StatusTreinamento.ATIVO]: 'Ativo',
    [StatusTreinamento.VENCIDO]: 'Vencido',
    [StatusTreinamento.A_VENCER]: 'A Vencer',
    [StatusTreinamento.CANCELADO]: 'Cancelado',
    [StatusTreinamento.CONCLUIDO]: 'Concluído',
  };
  
  return nomes[status] || status;
};

// Valida arquivo CSV
export const validarCSV = (file: File): { valido: boolean; erro?: string } => {
  // Verifica extensão
  if (!file.name.endsWith('.csv')) {
    return { valido: false, erro: 'Arquivo deve ser .csv' };
  }
  
  // Verifica tamanho (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valido: false, erro: 'Arquivo muito grande. Máximo: 5MB' };
  }
  
  return { valido: true };
};

// Parse de arquivo CSV
export const parseCSV = (conteudo: string): any[] => {
  const linhas = conteudo.split('\n').filter(linha => linha.trim());
  
  if (linhas.length < 2) {
    throw new Error('Arquivo CSV vazio ou sem dados');
  }
  
  const cabecalho = linhas[0].split(',').map(col => col.trim());
  const dados = [];
  
  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(',').map(val => val.trim());
    const objeto: any = {};
    
    cabecalho.forEach((col, index) => {
      objeto[col] = valores[index] || '';
    });
    
    dados.push(objeto);
  }
  
  return dados;
};

// Formata porcentagem
export const formatarPorcentagem = (valor: number): string => {
  return `${valor.toFixed(1)}%`;
};

// Gera cor aleatória para gráficos
export const gerarCor = (index: number): string => {
  const cores = [
    '#a2122a', '#354a80', '#388e3c', '#f57c00', '#1976d2',
    '#7b1fa2', '#c2185b', '#00796b', '#f57f17', '#5d4037',
  ];
  
  return cores[index % cores.length];
};

// Exporta para CSV
export const exportarParaCSV = (dados: any[], nomeArquivo: string): void => {
  if (dados.length === 0) return;
  
  // Cabeçalho
  const cabecalho = Object.keys(dados[0]).join(',');
  
  // Linhas
  const linhas = dados.map(item => 
    Object.values(item).map(val => `"${val}"`).join(',')
  );
  
  // Conteúdo completo
  const csv = [cabecalho, ...linhas].join('\n');
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Template CSV para download
export const gerarTemplateCSV = (): void => {
  const template = [
    'cpf,colaborador,tipoTreinamento,dataRealizacao,dataValidade,instrutor,instituicao,nota,observacoes',
    '123.456.789-00,João Silva,NR-10,2024-01-15,2025-01-15,Carlos Instrutor,FGS Academy,9.5,',
    '987.654.321-00,Maria Santos,Primeiros Socorros,2024-02-20,2026-02-20,Ana Educadora,Cruz Vermelha,10,',
  ];
  
  const csv = template.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'template_treinamentos.csv';
  link.click();
};

