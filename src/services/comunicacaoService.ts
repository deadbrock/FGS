// MODO MOCK - Para usar sem backend
export { default } from './comunicacaoService.mock';

/*
// ========================================
// CÓDIGO PARA BACKEND REAL (DESCOMENTE)
// ========================================

import api from './api';
import {
  Comunicado,
  EstatisticasComunicacao,
  RelatorioEfetividade,
} from '../types/comunicacao';

class ComunicacaoService {
  // COMUNICADOS
  async listarComunicados(): Promise<Comunicado[]> {
    const response = await api.get('/comunicacao');
    return response.data;
  }

  async buscarComunicado(id: string): Promise<Comunicado> {
    const response = await api.get(`/comunicacao/${id}`);
    return response.data;
  }

  async criarComunicado(comunicado: Partial<Comunicado>): Promise<Comunicado> {
    const response = await api.post('/comunicacao', comunicado);
    return response.data;
  }

  async atualizarComunicado(id: string, comunicado: Partial<Comunicado>): Promise<Comunicado> {
    const response = await api.put(`/comunicacao/${id}`, comunicado);
    return response.data;
  }

  async deletarComunicado(id: string): Promise<void> {
    await api.delete(`/comunicacao/${id}`);
  }

  async enviarComunicado(id: string): Promise<Comunicado> {
    const response = await api.post(`/comunicacao/${id}/enviar`);
    return response.data;
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasComunicacao> {
    const response = await api.get('/comunicacao/estatisticas');
    return response.data;
  }

  // RELATÓRIOS
  async gerarRelatorioEfetividade(
    dataInicio: string,
    dataFim: string
  ): Promise<RelatorioEfetividade> {
    const response = await api.get('/comunicacao/relatorios/efetividade', {
      params: { dataInicio, dataFim },
    });
    return response.data;
  }
}

export default new ComunicacaoService();
*/

