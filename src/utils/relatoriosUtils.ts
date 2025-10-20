import { FormatoExportacao } from '../types/relatorios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Formata percentual
export const formatarPercentual = (valor: number): string => {
  return `${valor.toFixed(1)}%`;
};

// Formata moeda
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

// Formata número
export const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR').format(valor);
};

// Calcula taxa de turnover
export const calcularTurnover = (
  admissoes: number,
  demissoes: number,
  headcountMedio: number
): number => {
  if (headcountMedio === 0) return 0;
  return ((admissoes + demissoes) / 2 / headcountMedio) * 100;
};

// Calcula variação percentual
export const calcularVariacao = (valorAtual: number, valorAnterior: number): number => {
  if (valorAnterior === 0) return valorAtual > 0 ? 100 : 0;
  return ((valorAtual - valorAnterior) / valorAnterior) * 100;
};

// Retorna cor do alerta baseado no valor
export const getCorAlerta = (valor: number, limiteWarning: number, limiteError: number): string => {
  if (valor >= limiteError) return '#d32f2f';
  if (valor >= limiteWarning) return '#f57c00';
  return '#388e3c';
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

// Exporta para CSV
export const exportarCSV = (dados: unknown[], nomeArquivo: string): void => {
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

// Exporta para Excel (simula usando CSV com extensão .xls)
export const exportarExcel = (dados: unknown[], nomeArquivo: string): void => {
  if (dados.length === 0) return;
  
  const cabecalho = Object.keys(dados[0] as object).join('\t');
  const linhas = dados.map(item =>
    Object.values(item as object).join('\t')
  );
  
  const tsv = [cabecalho, ...linhas].join('\n');
  const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xls`;
  link.click();
};

// Exporta para PDF
export const exportarPDF = (
  titulo: string,
  dados: { cabecalho: string[]; linhas: (string | number)[][] },
  nomeArquivo: string
): void => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text(titulo, 14, 15);
  
  // Data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
  
  // Tabela
  (doc as any).autoTable({
    head: [dados.cabecalho],
    body: dados.linhas,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [162, 18, 42] },
  });
  
  doc.save(`${nomeArquivo}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Prepara dados para exportação
export const prepararDadosExportacao = (
  dados: unknown[],
  campos: { chave: string; label: string }[]
): { cabecalho: string[]; linhas: (string | number)[][] } => {
  const cabecalho = campos.map(c => c.label);
  const linhas = dados.map(item =>
    campos.map(c => (item as any)[c.chave] || '')
  );
  
  return { cabecalho, linhas };
};

// Detecta tendência (crescente, decrescente, estável)
export const detectarTendencia = (valores: number[]): 'CRESCENTE' | 'DECRESCENTE' | 'ESTAVEL' => {
  if (valores.length < 2) return 'ESTAVEL';
  
  const primeiro = valores[0];
  const ultimo = valores[valores.length - 1];
  const diferenca = ((ultimo - primeiro) / primeiro) * 100;
  
  if (diferenca > 5) return 'CRESCENTE';
  if (diferenca < -5) return 'DECRESCENTE';
  return 'ESTAVEL';
};

// Formata nome do mês
export const formatarMes = (mesAno: string): string => {
  const [ano, mes] = mesAno.split('-');
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return `${meses[parseInt(mes) - 1]}/${ano.substring(2)}`;
};

// Retorna ícone baseado na tendência
export const getIconeTendencia = (tendencia: 'CRESCENTE' | 'DECRESCENTE' | 'ESTAVEL'): string => {
  const icones = {
    CRESCENTE: '📈',
    DECRESCENTE: '📉',
    ESTAVEL: '➡️',
  };
  return icones[tendencia];
};

// Valida período
export const validarPeriodo = (dataInicio: string, dataFim: string): { valido: boolean; erro?: string } => {
  if (!dataInicio || !dataFim) {
    return { valido: false, erro: 'Data início e fim são obrigatórias' };
  }
  
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (inicio > fim) {
    return { valido: false, erro: 'Data início deve ser anterior à data fim' };
  }
  
  const diffDays = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 365) {
    return { valido: false, erro: 'Período máximo é de 1 ano' };
  }
  
  return { valido: true };
};

