import axios from 'axios';
import {
  Admissao,
  CreateAdmissaoDTO,
  UpdateAdmissaoDTO,
  AvancarEtapaDTO,
  ValidarDocumentoDTO,
  EstatisticasAdmissao,
  FiltrosAdmissao,
  DocumentoTemplate,
  AdmissaoDocumento
} from '../types/admissao';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class AdmissaoService {
  private api = axios.create({
    baseURL: `${API_URL}/api/admissoes`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Configurar token de autenticação
  private setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Listar admissões
  async getAll(filtros?: FiltrosAdmissao): Promise<{ data: Admissao[]; pagination: any }> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/', { params: filtros });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar admissões:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar admissões');
    }
  }

  // Buscar admissão por ID
  async getById(id: string): Promise<Admissao> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar admissão:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar admissão');
    }
  }

  // Criar admissão
  async create(data: CreateAdmissaoDTO): Promise<Admissao> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post('/', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao criar admissão:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar admissão');
    }
  }

  // Atualizar admissão
  async update(id: string, data: UpdateAdmissaoDTO): Promise<Admissao> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar admissão:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar admissão');
    }
  }

  // Avançar etapa do workflow
  async avancarEtapa(id: string, data: AvancarEtapaDTO): Promise<Admissao> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post(`/${id}/avancar-etapa`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao avançar etapa:', error);
      throw new Error(error.response?.data?.error || 'Erro ao avançar etapa');
    }
  }

  // Estatísticas
  async getEstatisticas(periodoInicio?: string, periodoFim?: string): Promise<EstatisticasAdmissao> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/estatisticas', {
        params: {
          periodo_inicio: periodoInicio,
          periodo_fim: periodoFim
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }

  // Documentos Template
  async getDocumentosTemplate(): Promise<DocumentoTemplate[]> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.get('/documentos/template');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar documentos template:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar documentos template');
    }
  }

  // Upload de documento
  async uploadDocumento(admissaoId: string, documentoId: string, arquivo: File): Promise<AdmissaoDocumento> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('admissao_id', admissaoId);
      formData.append('documento_id', documentoId);

      const response = await this.api.post('/documentos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao fazer upload de documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload de documento');
    }
  }

  // Validar documento
  async validarDocumento(documentoId: string, data: ValidarDocumentoDTO): Promise<AdmissaoDocumento> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.put(`/documentos/${documentoId}/validar`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao validar documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao validar documento');
    }
  }

  // Enviar para eSocial
  async enviarESocial(admissaoId: string): Promise<any> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post(`/${admissaoId}/esocial`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao enviar para eSocial:', error);
      throw new Error(error.response?.data?.error || 'Erro ao enviar para eSocial');
    }
  }

  // Enviar para Thompson Reuters
  async enviarThompsonReuters(admissaoId: string): Promise<any> {
    try {
      const token = localStorage.getItem('@FGS:token');
      if (token) this.setAuthToken(token);

      const response = await this.api.post(`/${admissaoId}/thomson-reuters`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao enviar para Thompson Reuters:', error);
      throw new Error(error.response?.data?.error || 'Erro ao enviar para Thompson Reuters');
    }
  }
}

export default new AdmissaoService();

