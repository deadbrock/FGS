import api from './api';
import {
  ProntuarioColaborador,
  ExameMedico,
  AtestadoMedico,
  Ferias,
  Treinamento,
  Advertencia,
  PaginacaoParams,
  PaginacaoResultado,
  FiltrosProntuario,
} from '../types/prontuario';

class ProntuarioService {
  // Buscar prontuário completo de um colaborador
  async buscarProntuario(colaboradorId: string): Promise<ProntuarioColaborador> {
    const response = await api.get<ProntuarioColaborador>(`/prontuario/${colaboradorId}`);
    return response.data;
  }

  // Atualizar dados pessoais
  async atualizarDadosPessoais(colaboradorId: string, dados: any): Promise<void> {
    await api.put(`/prontuario/${colaboradorId}/dados-pessoais`, dados);
  }

  // Atualizar dados contratuais
  async atualizarDadosContratuais(colaboradorId: string, dados: any): Promise<void> {
    await api.put(`/prontuario/${colaboradorId}/dados-contratuais`, dados);
  }

  // Exames Médicos
  async listarExames(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<ExameMedico>> {
    const response = await api.get<PaginacaoResultado<ExameMedico>>(
      `/prontuario/${colaboradorId}/exames`,
      { params: { ...params, ...filtros } }
    );
    return response.data;
  }

  async criarExame(colaboradorId: string, exame: Partial<ExameMedico>): Promise<ExameMedico> {
    const response = await api.post<ExameMedico>(
      `/prontuario/${colaboradorId}/exames`,
      exame
    );
    return response.data;
  }

  // Atestados
  async listarAtestados(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<AtestadoMedico>> {
    const response = await api.get<PaginacaoResultado<AtestadoMedico>>(
      `/prontuario/${colaboradorId}/atestados`,
      { params: { ...params, ...filtros } }
    );
    return response.data;
  }

  // Férias
  async listarFerias(colaboradorId: string): Promise<Ferias[]> {
    const response = await api.get<Ferias[]>(`/prontuario/${colaboradorId}/ferias`);
    return response.data;
  }

  // Treinamentos
  async listarTreinamentos(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<Treinamento>> {
    const response = await api.get<PaginacaoResultado<Treinamento>>(
      `/prontuario/${colaboradorId}/treinamentos`,
      { params: { ...params, ...filtros } }
    );
    return response.data;
  }

  async criarTreinamento(
    colaboradorId: string,
    treinamento: Partial<Treinamento>
  ): Promise<Treinamento> {
    const response = await api.post<Treinamento>(
      `/prontuario/${colaboradorId}/treinamentos`,
      treinamento
    );
    return response.data;
  }

  // Advertências
  async listarAdvertencias(colaboradorId: string): Promise<Advertencia[]> {
    const response = await api.get<Advertencia[]>(
      `/prontuario/${colaboradorId}/advertencias`
    );
    return response.data;
  }

  // Upload de arquivos
  async uploadArquivo(colaboradorId: string, tipo: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);

    const response = await api.post<{ url: string }>(
      `/prontuario/${colaboradorId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  }
}

export default new ProntuarioService();

