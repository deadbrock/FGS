import axios from 'axios';
import {
  EstatisticasIntegracoes,
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from '../types/integracoes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class IntegracoesService {
  private api = axios.create({
    baseURL: `${API_URL}/api/integracoes`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  async getEstatisticas(): Promise<EstatisticasIntegracoes> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de integrações:', error);
      throw new Error('Erro ao buscar estatísticas de integrações');
    }
  }

  // ==========================================
  // INTEGRAÇÕES
  // ==========================================

  async getAll(): Promise<Integracao[]> {
    try {
      const response = await this.api.get('/');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar integrações:', error);
      throw new Error('Erro ao buscar integrações');
    }
  }

  async getById(id: string): Promise<Integracao> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar integração:', error);
      throw new Error('Erro ao buscar integração');
    }
  }

  async create(integracao: Partial<Integracao>): Promise<Integracao> {
    try {
      const response = await this.api.post('/', integracao);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      throw new Error('Erro ao criar integração');
    }
  }

  async update(id: string, integracao: Partial<Integracao>): Promise<Integracao> {
    try {
      const response = await this.api.put(`/${id}`, integracao);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar integração:', error);
      throw new Error('Erro ao atualizar integração');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      console.error('Erro ao deletar integração:', error);
      throw new Error('Erro ao deletar integração');
    }
  }

  // ==========================================
  // AÇÕES
  // ==========================================

  async sincronizar(id: string): Promise<void> {
    try {
      await this.api.post(`/${id}/sincronizar`);
    } catch (error) {
      console.error('Erro ao sincronizar integração:', error);
      throw new Error('Erro ao sincronizar integração');
    }
  }

  async ativar(id: string): Promise<void> {
    try {
      await this.api.post(`/${id}/ativar`);
    } catch (error) {
      console.error('Erro ao ativar integração:', error);
      throw new Error('Erro ao ativar integração');
    }
  }

  async desativar(id: string): Promise<void> {
    try {
      await this.api.post(`/${id}/desativar`);
    } catch (error) {
      console.error('Erro ao desativar integração:', error);
      throw new Error('Erro ao desativar integração');
    }
  }

  async testar(id: string): Promise<any> {
    try {
      const response = await this.api.post(`/${id}/testar`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao testar integração:', error);
      throw new Error('Erro ao testar integração');
    }
  }

  // ==========================================
  // CONFIGURAÇÕES ESPECÍFICAS
  // ==========================================

  async salvarConfigPonto(config: any): Promise<void> {
    try {
      await this.api.post('/configuracoes/ponto', config);
    } catch (error) {
      console.error('Erro ao salvar configuração de ponto:', error);
      throw new Error('Erro ao salvar configuração de ponto');
    }
  }

  async salvarConfigEmail(config: any): Promise<void> {
    try {
      await this.api.post('/configuracoes/email', config);
    } catch (error) {
      console.error('Erro ao salvar configuração de email:', error);
      throw new Error('Erro ao salvar configuração de email');
    }
  }

  async salvarConfigWhatsApp(config: any): Promise<void> {
    try {
      await this.api.post('/configuracoes/whatsapp', config);
    } catch (error) {
      console.error('Erro ao salvar configuração de WhatsApp:', error);
      throw new Error('Erro ao salvar configuração de WhatsApp');
    }
  }

  // ==========================================
  // IMPORTAÇÃO/EXPORTAÇÃO
  // ==========================================

  async importarArquivo(file: File, modulo: string, opcoes?: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('modulo', modulo);
      if (opcoes) {
        formData.append('opcoes', JSON.stringify(opcoes));
      }

      const response = await this.api.post('/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      throw new Error('Erro ao importar arquivo');
    }
  }

  async exportarDados(modulo: string, formato: string, filtros?: any): Promise<Blob> {
    try {
      const response = await this.api.post(
        '/exportar',
        { modulo, formato, filtros },
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw new Error('Erro ao exportar dados');
    }
  }

  async getHistoricoImportacoes(): Promise<any[]> {
    try {
      const response = await this.api.get('/importacoes/historico');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de importações:', error);
      throw new Error('Erro ao buscar histórico de importações');
    }
  }

  async getDetalhesImportacao(id: string): Promise<any> {
    try {
      const response = await this.api.get(`/importacoes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da importação:', error);
      throw new Error('Erro ao buscar detalhes da importação');
    }
  }

  async downloadRelatorioImportacao(id: string): Promise<Blob> {
    try {
      const response = await this.api.get(`/importacoes/${id}/relatorio`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw new Error('Erro ao baixar relatório');
    }
  }

  async getTemplatesExportacao(): Promise<any[]> {
    try {
      const response = await this.api.get('/exportar/templates');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar templates de exportação:', error);
      throw new Error('Erro ao buscar templates de exportação');
    }
  }
}

export default new IntegracoesService();

