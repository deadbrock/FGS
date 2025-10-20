import { NavigationLog } from '../types';

// Serviço de logs de navegação
class LogService {
  private logs: NavigationLog[] = [];

  // Registra log de navegação
  logNavigation(userId: string, userName: string, route: string, action: string): void {
    const log: NavigationLog = {
      id: this.generateId(),
      userId,
      userName,
      route,
      timestamp: new Date(),
      action,
    };

    this.logs.push(log);
    this.saveToLocalStorage();

    // Log no console para desenvolvimento
    console.log(`[FGS LOG] ${userName} acessou ${route} - ${action}`);
  }

  // Obtém todos os logs
  getLogs(): NavigationLog[] {
    this.loadFromLocalStorage();
    return [...this.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Obtém logs de um usuário específico
  getUserLogs(userId: string): NavigationLog[] {
    this.loadFromLocalStorage();
    return this.logs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Limpa todos os logs
  clearLogs(): void {
    this.logs = [];
    this.saveToLocalStorage();
  }

  // Salva logs no localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('@FGS:logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Erro ao salvar logs:', error);
    }
  }

  // Carrega logs do localStorage
  private loadFromLocalStorage(): void {
    try {
      const logsStr = localStorage.getItem('@FGS:logs');
      if (logsStr) {
        const parsedLogs = JSON.parse(logsStr);
        // Converte strings de data de volta para objetos Date
        this.logs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      this.logs = [];
    }
  }

  // Gera ID único para o log
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new LogService();

