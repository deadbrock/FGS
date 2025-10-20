// MODO MOCK - Para usar sem backend
// Para conectar com backend real, descomente o código comentado abaixo

export { default } from './pontoService.mock';

/*
// ========================================
// CÓDIGO PARA BACKEND REAL (DESCOMENTE)
// ========================================

import api from './api';
import {
  ResumoDia,
  EstatisticasPonto,
  RankingPontualidade,
  RelatorioAtrasos,
  RelatorioFaltas,
  ConfiguracaoHorario,
  SolicitacaoJustificativa,
  EspelhoPonto,
} from '../types/ponto';

class PontoService {
  // RESUMOS DIÁRIOS
  async listarResumosDias(
    dataInicio: string,
    dataFim: string,
    colaboradorId?: string
  ): Promise<ResumoDia[]> {
    const params = { dataInicio, dataFim, colaboradorId };
    const response = await api.get('/ponto/resumos', { params });
    return response.data;
  }

  async buscarResumoDia(colaboradorId: string, data: string): Promise<ResumoDia | null> {
    const response = await api.get(`/ponto/resumos/${colaboradorId}/${data}`);
    return response.data;
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasPonto> {
    const response = await api.get('/ponto/estatisticas');
    return response.data;
  }

  // RANKING
  async buscarRanking(dataInicio: string, dataFim: string): Promise<RankingPontualidade> {
    const response = await api.get('/ponto/ranking', { params: { dataInicio, dataFim } });
    return response.data;
  }

  // RELATÓRIOS
  async gerarRelatorioAtrasos(dataInicio: string, dataFim: string): Promise<RelatorioAtrasos> {
    const response = await api.get('/ponto/relatorios/atrasos', { params: { dataInicio, dataFim } });
    return response.data;
  }

  async gerarRelatorioFaltas(dataInicio: string, dataFim: string): Promise<RelatorioFaltas> {
    const response = await api.get('/ponto/relatorios/faltas', { params: { dataInicio, dataFim } });
    return response.data;
  }

  // CONFIGURAÇÕES
  async listarConfiguracoes(): Promise<ConfiguracaoHorario[]> {
    const response = await api.get('/ponto/configuracoes');
    return response.data;
  }

  async criarConfiguracao(config: Partial<ConfiguracaoHorario>): Promise<ConfiguracaoHorario> {
    const response = await api.post('/ponto/configuracoes', config);
    return response.data;
  }

  async atualizarConfiguracao(id: string, config: Partial<ConfiguracaoHorario>): Promise<ConfiguracaoHorario> {
    const response = await api.put(`/ponto/configuracoes/${id}`, config);
    return response.data;
  }

  // JUSTIFICATIVAS
  async listarJustificativas(status?: string): Promise<SolicitacaoJustificativa[]> {
    const response = await api.get('/ponto/justificativas', { params: { status } });
    return response.data;
  }

  async criarJustificativa(justificativa: Partial<SolicitacaoJustificativa>): Promise<SolicitacaoJustificativa> {
    const response = await api.post('/ponto/justificativas', justificativa);
    return response.data;
  }

  async avaliarJustificativa(
    id: string,
    aprovado: boolean,
    observacao: string
  ): Promise<SolicitacaoJustificativa> {
    const response = await api.put(`/ponto/justificativas/${id}/avaliar`, {
      aprovado,
      observacao,
    });
    return response.data;
  }

  // EXPORTAÇÕES
  async exportarEspelhoPonto(colaboradorId: string, mesReferencia: string): Promise<Blob> {
    const response = await api.get(`/ponto/espelho/${colaboradorId}/${mesReferencia}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new PontoService();
*/

