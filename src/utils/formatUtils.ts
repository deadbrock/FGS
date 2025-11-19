/**
 * Utilitários de formatação
 */

/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
export const formatarMoeda = (valor: number | string | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  const numValor = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numValor)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValor);
};

/**
 * Formata um número com separadores de milhar
 */
export const formatarNumero = (valor: number | string | null | undefined): string => {
  if (valor === null || valor === undefined) return '0';
  
  const numValor = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numValor)) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(numValor);
};

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 */
export const formatarData = (data: string | Date | null | undefined): string => {
  if (!data) return '-';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) return '-';
  
  return new Intl.DateTimeFormat('pt-BR').format(dataObj);
};

/**
 * Formata uma data e hora para o formato brasileiro
 */
export const formatarDataHora = (data: string | Date | null | undefined): string => {
  if (!data) return '-';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) return '-';
  
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dataObj);
};

