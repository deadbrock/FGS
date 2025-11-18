import axios from 'axios';
import { EstatisticasSeguranca, LogAcesso, LogAlteracao, Usuario } from '../types/seguranca';
import { UserRole } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class SegurancaService {
  private api = axios.create({
    baseURL: `${API_URL}/api/seguranca`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  async getEstatisticas(): Promise<EstatisticasSeguranca> {
    try {
      const response = await this.api.get('/estatisticas');
      return response.data.data || this.getEstatisticasVazias();
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas de segurança:', error);
      return this.getEstatisticasVazias();
    }
  }

  private getEstatisticasVazias(): EstatisticasSeguranca {
    return {
      totalUsuarios: 0,
      usuariosAtivos: 0,
      usuariosInativos: 0,
      usuariosBloqueados: 0,
      acessosHoje: 0,
      tentativasFalhasHoje: 0,
      acessosUltimos7Dias: [],
      totalLogsAcesso: 0,
      totalLogsAlteracao: 0,
      usuariosPorPerfil: [],
      alertas: [],
    };
  }

  // ==========================================
  // USUÁRIOS
  // ==========================================

  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await this.api.get('/usuarios');
      const usuarios = response.data.data || [];
      
      // Mapear dados do backend para interface Usuario
      return usuarios.map((u: any) => ({
        id: u.id,
        nome: u.nome || '',
        email: u.email || '',
        role: u.role as UserRole,
        status: this.mapearStatusUsuario(u.status || 'ATIVO'),
        departamento: u.departamento || '',
        cargo: u.cargo || '',
        ultimoAcesso: u.ultimo_acesso || u.ultimoAcesso || null,
        tentativasLogin: u.tentativas_login || u.tentativasLogin || 0,
        senhaExpirada: u.senha_expirada || u.senhaExpirada || false,
        permissoesCustomizadas: u.permissoes_customizadas || u.permissoesCustomizadas || [],
        criadoPor: u.criado_por || u.criadoPor || 'Sistema',
        criadoEm: u.created_at || u.criadoEm || new Date().toISOString(),
      }));
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  private mapearStatusUsuario(status: string): 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'PENDENTE' {
    const statusMap: Record<string, 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'PENDENTE'> = {
      'ATIVO': 'ATIVO',
      'INATIVO': 'INATIVO',
      'BLOQUEADO': 'BLOQUEADO',
      'PENDENTE': 'PENDENTE',
    };
    return statusMap[status.toUpperCase()] || 'ATIVO';
  }

  // ==========================================
  // LOGS DE ACESSO
  // ==========================================

  async getLogsAcesso(filtros?: {
    dataInicio?: string;
    dataFim?: string;
    usuarioId?: string;
    sucesso?: boolean;
  }): Promise<LogAcesso[]> {
    try {
      const response = await this.api.get('/logs-acesso', { params: filtros });
      const logs = response.data.data || [];
      
      // Mapear dados do backend para interface LogAcesso
      return logs.map((log: any) => ({
        id: log.id,
        usuarioId: log.usuario_id || log.usuarioId || '',
        usuarioNome: log.usuario_nome || log.usuarioNome || 'N/A',
        email: log.email || '',
        role: (log.role || 'COLABORADOR') as UserRole,
        dataHora: log.data_hora || log.dataHora || new Date().toISOString(),
        ip: log.ip || 'N/A',
        navegador: log.navegador || log.user_agent || 'N/A',
        dispositivo: log.dispositivo || 'Desktop',
        sucesso: log.sucesso !== false,
        motivoFalha: log.motivo_falha || log.motivoFalha || undefined,
        acao: log.acao || 'LOGIN',
      }));
    } catch (error: any) {
      console.error('Erro ao buscar logs de acesso:', error);
      return [];
    }
  }

  // ==========================================
  // LOGS DE ALTERAÇÕES
  // ==========================================

  async getLogsAlteracao(filtros?: {
    dataInicio?: string;
    dataFim?: string;
    usuarioId?: string;
    modulo?: string;
    acao?: string;
  }): Promise<LogAlteracao[]> {
    try {
      const response = await this.api.get('/logs-alteracoes', { params: filtros });
      const logs = response.data.data || [];
      
      // Mapear dados do backend para interface LogAlteracao
      return logs.map((log: any) => ({
        id: log.id,
        usuarioId: log.usuario_id || log.usuarioId || '',
        usuarioNome: log.usuario_nome || log.usuarioNome || 'N/A',
        role: (log.role || 'COLABORADOR') as UserRole,
        dataHora: log.data_hora || log.dataHora || new Date().toISOString(),
        modulo: log.modulo || 'Sistema',
        acao: this.mapearTipoAcao(log.acao || 'EDITAR'),
        entidade: log.entidade || 'Registro',
        entidadeId: log.entidade_id || log.entidadeId || '',
        camposAlterados: this.mapearCamposAlterados(log.campos_alterados || log.camposAlterados || []),
        ip: log.ip || 'N/A',
        navegador: log.navegador || 'N/A',
      }));
    } catch (error: any) {
      console.error('Erro ao buscar logs de alterações:', error);
      return [];
    }
  }

  private mapearTipoAcao(acao: string): 'CRIAR' | 'EDITAR' | 'EXCLUIR' | 'VISUALIZAR' | 'EXPORTAR' {
    const acaoMap: Record<string, 'CRIAR' | 'EDITAR' | 'EXCLUIR' | 'VISUALIZAR' | 'EXPORTAR'> = {
      'CREATE': 'CRIAR',
      'CRIAR': 'CRIAR',
      'UPDATE': 'EDITAR',
      'EDITAR': 'EDITAR',
      'DELETE': 'EXCLUIR',
      'EXCLUIR': 'EXCLUIR',
      'VIEW': 'VISUALIZAR',
      'VISUALIZAR': 'VISUALIZAR',
      'EXPORT': 'EXPORTAR',
      'EXPORTAR': 'EXPORTAR',
    };
    return acaoMap[acao.toUpperCase()] || 'EDITAR';
  }

  private mapearCamposAlterados(campos: any): Array<{ campo: string; valorAnterior: any; valorNovo: any }> {
    if (!Array.isArray(campos)) {
      // Se for JSONB, pode vir como objeto
      if (typeof campos === 'object' && campos !== null) {
        return Object.entries(campos).map(([campo, valor]: [string, any]) => {
          // Se o valor for um objeto com valorAnterior e valorNovo
          if (valor && typeof valor === 'object' && 'valorAnterior' in valor) {
            return {
              campo,
              valorAnterior: valor.valorAnterior,
              valorNovo: valor.valorNovo,
            };
          }
          // Caso contrário, assume que é o valor novo
          return {
            campo,
            valorAnterior: '',
            valorNovo: valor,
          };
        });
      }
      return [];
    }
    
    return campos.map((campo: any) => {
      if (typeof campo === 'object' && campo !== null) {
        return {
          campo: campo.campo || campo.field || '',
          valorAnterior: campo.valorAnterior || campo.valor_anterior || campo.antes || '',
          valorNovo: campo.valorNovo || campo.valor_novo || campo.depois || '',
        };
      }
      return {
        campo: String(campo),
        valorAnterior: '',
        valorNovo: '',
      };
    });
  }
}

export default new SegurancaService();

