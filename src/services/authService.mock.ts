import { LoginCredentials, LoginResponse, User, UserRole } from '../types';

// Usuários simulados para teste sem backend
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Administrador Sistema',
    email: 'admin@fgs.com',
    role: UserRole.ADMINISTRADOR,
    departamento: 'TI',
    cargo: 'Administrador',
  },
  {
    id: '2',
    nome: 'Gerente RH',
    email: 'rh@fgs.com',
    role: UserRole.RH,
    departamento: 'Recursos Humanos',
    cargo: 'Gerente de RH',
  },
  {
    id: '3',
    nome: 'João Gestor',
    email: 'gestor@fgs.com',
    role: UserRole.GESTOR,
    departamento: 'Vendas',
    cargo: 'Gerente de Vendas',
  },
  {
    id: '4',
    nome: 'Maria Colaboradora',
    email: 'colaborador@fgs.com',
    role: UserRole.COLABORADOR,
    departamento: 'Operações',
    cargo: 'Assistente',
  },
];

// Senhas simuladas (email sem @dominio + "123")
const mockPasswords: Record<string, string> = {
  'admin@fgs.com': 'admin123',
  'rh@fgs.com': 'rh123',
  'gestor@fgs.com': 'gestor123',
  'colaborador@fgs.com': 'colab123',
};

// Serviço de autenticação MOCK (para testes sem backend)
class AuthServiceMock {
  // Login simulado
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find((u) => u.email === credentials.email);
    const expectedPassword = mockPasswords[credentials.email];

    if (!user || credentials.senha !== expectedPassword) {
      throw new Error('Email ou senha inválidos');
    }

    // Gera token mock (não é um JWT real)
    const mockToken = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

    // Armazena no localStorage
    localStorage.setItem('@FGS:token', mockToken);
    localStorage.setItem('@FGS:user', JSON.stringify(user));

    return {
      token: mockToken,
      user,
    };
  }

  // Logout
  logout(): void {
    localStorage.removeItem('@FGS:token');
    localStorage.removeItem('@FGS:user');
  }

  // Recupera usuário armazenado
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('@FGS:user');
    
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    
    return null;
  }

  // Recupera token armazenado
  getStoredToken(): string | null {
    return localStorage.getItem('@FGS:token');
  }

  // Simula verificação de usuário autenticado
  async me(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const user = this.getStoredUser();
    
    if (!user) {
      throw new Error('Não autenticado');
    }
    
    return user;
  }
}

export default new AuthServiceMock();

