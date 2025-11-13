import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface Documento {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  tipo_documento: 'RG' | 'CPF' | 'CNH' | 'CTPS' | 'TITULO_ELEITOR' | 'ASO' | 'ATESTADO' | 'CERTIFICADO' | 'CONTRATO' | 'OUTRO';
  numero_documento?: string;
  data_emissao?: string;
  data_validade?: string;
  arquivo_nome: string;
  arquivo_url: string;
  arquivo_tamanho: number;
  arquivo_tipo: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstatisticasDocumentos {
  totalDocumentos: number;
  porTipo: Array<{
    tipo_documento: string;
    total: number;
  }>;
  vencidos: number;
  proximosVencimento: number;
  colaboradoresSemDocumentos: Array<{
    id: string;
    nome_completo: string;
  }>;
}

export interface FiltrosDocumentos {
  colaborador_id?: string;
  tipo_documento?: string;
  status_validade?: 'VALIDO' | 'VENCIDO' | 'PROXIMO_VENCIMENTO';
  limit?: number;
  offset?: number;
}

class DocumentosService {
  private api = axios.create({
    baseURL: `${API_URL}/api/documentos`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Listar documentos
  async getAll(filtros?: FiltrosDocumentos): Promise<{ data: Documento[]; pagination: any }> {
    try {
      const response = await this.api.get('/', { params: filtros });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar documentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar documentos');
    }
  }

  // Buscar por ID
  async getById(id: string): Promise<Documento> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar documento');
    }
  }

  // Upload de documento
  async upload(
    arquivo: File,
    dados: {
      colaborador_id: string;
      tipo_documento: string;
      numero_documento?: string;
      data_emissao?: string;
      data_validade?: string;
      observacoes?: string;
    }
  ): Promise<Documento> {
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('colaborador_id', dados.colaborador_id);
      formData.append('tipo_documento', dados.tipo_documento);
      
      if (dados.numero_documento) formData.append('numero_documento', dados.numero_documento);
      if (dados.data_emissao) formData.append('data_emissao', dados.data_emissao);
      if (dados.data_validade) formData.append('data_validade', dados.data_validade);
      if (dados.observacoes) formData.append('observacoes', dados.observacoes);

      const response = await this.api.post('/', formData, {
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

  // Download de documento
  async download(id: string): Promise<void> {
    try {
      const response = await this.api.get(`/${id}/download`, {
        responseType: 'blob',
      });

      // Criar URL do blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extrair nome do arquivo do header Content-Disposition ou usar nome padrão
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'documento';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Erro ao fazer download de documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer download de documento');
    }
  }

  // Atualizar metadados
  async update(id: string, dados: Partial<Documento>): Promise<Documento> {
    try {
      const response = await this.api.put(`/${id}`, dados);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar documento');
    }
  }

  // Deletar documento
  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar documento:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar documento');
    }
  }

  // Estatísticas
  async getEstatisticas(): Promise<EstatisticasDocumentos> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de documentos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas');
    }
  }
}

export default new DocumentosService();

