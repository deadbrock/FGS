# 📋 Instruções de Instalação e Execução

## Sistema FGS - Formando Gente de Sucesso

### 🔧 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### 📦 Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto (ou renomeie `.env.example`):

```env
VITE_API_URL=http://localhost:3333/api
```

### ▶️ Executando o Projeto

#### Modo de Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

#### Build para Produção

```bash
npm run build
```

#### Preview da Build

```bash
npm run preview
```

### 🔐 Credenciais de Teste

Como o backend ainda não está implementado, você pode usar estas credenciais simuladas na página de login:

- **Administrador:**
  - Email: `admin@fgs.com`
  - Senha: `admin123`

- **RH:**
  - Email: `rh@fgs.com`
  - Senha: `rh123`

- **Gestor:**
  - Email: `gestor@fgs.com`
  - Senha: `gestor123`

- **Colaborador:**
  - Email: `colaborador@fgs.com`
  - Senha: `colab123`

**⚠️ IMPORTANTE:** Por enquanto, o sistema tentará se comunicar com a API, mas como ela ainda não está implementada, você receberá erros de autenticação. Para testar a interface sem backend, você precisará modificar o `authService.ts` para aceitar login simulado.

### 🔄 Integração com Backend

Para conectar com o backend real:

1. Certifique-se de que o backend Node.js está rodando na porta 3333
2. Configure a variável `VITE_API_URL` no arquivo `.env`
3. O backend deve implementar os seguintes endpoints:

#### Endpoints Necessários:

```
POST /api/auth/login
  Body: { email: string, senha: string }
  Response: { token: string, user: User }

GET /api/auth/me
  Headers: { Authorization: Bearer <token> }
  Response: User

GET /api/dashboard/estatisticas
  Headers: { Authorization: Bearer <token> }
  Response: DashboardStats

GET /api/usuarios
  Headers: { Authorization: Bearer <token> }
  Response: User[]
```

### 📂 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── PrivateRoute.tsx
│   ├── Loading.tsx
│   ├── Logo.tsx
│   ├── RoleBadge.tsx
│   └── StatCard.tsx
├── contexts/         # Contextos React
│   └── AuthContext.tsx
├── hooks/            # Custom hooks
│   ├── useAuth.ts
│   └── useNavigationLog.ts
├── layouts/          # Layouts principais
│   ├── LoginLayout.tsx
│   └── DashboardLayout.tsx
├── pages/            # Páginas
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Usuarios.tsx
│   └── Configuracoes.tsx
├── routes/           # Configuração de rotas
│   └── index.tsx
├── services/         # Serviços de API
│   ├── api.ts
│   ├── authService.ts
│   └── logService.ts
├── theme/            # Configuração do tema MUI
│   └── index.ts
├── types/            # Tipos TypeScript
│   └── index.ts
├── utils/            # Utilitários
│   └── permissions.ts
├── App.tsx           # Componente principal
└── main.tsx          # Ponto de entrada
```

### 🎨 Personalização

#### Cores do Tema

As cores principais estão definidas em `src/theme/index.ts`:

- Vermelho FGS: `#a2122a`
- Azul FGS: `#354a80`

#### Perfis de Usuário

Os perfis e suas permissões estão definidos em:
- `src/types/index.ts` (enum UserRole)
- `src/utils/permissions.ts` (permissões de rotas)

### 🔒 Sistema de Permissões

O sistema possui 4 níveis de perfil:

1. **ADMINISTRADOR** - Acesso total
2. **RH** - Acesso a usuários e relatórios
3. **GESTOR** - Acesso a equipe e aprovações
4. **COLABORADOR** - Acesso a dados pessoais

As permissões são controladas por rota em `src/utils/permissions.ts`

### 📊 Sistema de Logs

O sistema registra automaticamente:
- Navegação entre páginas
- Ações realizadas pelos usuários
- Logs são armazenados no localStorage
- Podem ser visualizados em Configurações

### 🐛 Troubleshooting

#### Erro de CORS
Se encontrar erros de CORS, configure o backend para aceitar requisições de `http://localhost:3000`

#### Erro 401 (Unauthorized)
Verifique se o token JWT está sendo enviado corretamente e se o backend está validando corretamente

#### Build com erros
Execute `npm run lint` para verificar problemas de código

### 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido para FGS - Formando Gente de Sucesso** 🎓

