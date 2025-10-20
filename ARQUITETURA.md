# 🏗️ Arquitetura do Sistema FGS

## Visão Geral

O sistema FGS é uma aplicação React + TypeScript moderna, modular e escalável, desenvolvida com as melhores práticas de desenvolvimento frontend.

---

## 🎯 Pilares Arquiteturais

### 1. **Componentização**
- Componentes reutilizáveis e independentes
- Separação clara entre componentes de UI e lógica de negócio
- Props tipadas com TypeScript

### 2. **Gerenciamento de Estado**
- Context API para estado global (Autenticação)
- Estado local com hooks do React
- Preparado para Redux/Zustand se necessário

### 3. **Roteamento**
- React Router v6 para navegação
- Rotas protegidas por permissão
- Lazy loading preparado para otimização

### 4. **Estilização**
- Material-UI (MUI) como biblioteca base
- Tema customizado com cores da marca
- Sistema de design consistente

---

## 📐 Padrões de Projeto

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── PrivateRoute.tsx  # HOC para rotas protegidas
│   ├── Loading.tsx       # Componente de carregamento
│   ├── Logo.tsx          # Logo da aplicação
│   ├── RoleBadge.tsx     # Badge de perfil de usuário
│   ├── StatCard.tsx      # Card de estatísticas
│   └── index.ts          # Barrel export
│
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
│
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Hook para autenticação
│   └── useNavigationLog.ts  # Hook para logs
│
├── layouts/             # Layouts da aplicação
│   ├── LoginLayout.tsx  # Layout de login
│   └── DashboardLayout.tsx  # Layout principal com menu
│
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Página de login
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Usuarios.tsx     # Gestão de usuários
│   ├── Configuracoes.tsx  # Configurações
│   └── index.ts         # Barrel export
│
├── routes/              # Configuração de rotas
│   └── index.tsx        # Definição de todas as rotas
│
├── services/            # Serviços e APIs
│   ├── api.ts           # Configuração do Axios
│   ├── authService.ts   # Serviço de autenticação
│   ├── authService.mock.ts  # Mock para testes
│   └── logService.ts    # Serviço de logs
│
├── theme/               # Tema MUI
│   └── index.ts         # Configuração do tema
│
├── types/               # TypeScript types
│   └── index.ts         # Definição de tipos
│
├── utils/               # Utilitários
│   └── permissions.ts   # Sistema de permissões
│
├── App.tsx              # Componente raiz
└── main.tsx             # Entry point
```

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

```
1. Usuário acessa /login
2. Insere credenciais
3. authService.login() → POST /api/auth/login
4. Backend retorna { token, user }
5. Token armazenado no localStorage
6. AuthContext atualizado
7. Redirecionamento para /dashboard
8. Todas as requisições incluem: Authorization: Bearer <token>
```

### Estrutura do Token JWT

```typescript
{
  userId: string;
  role: UserRole;
  exp: number;  // Timestamp de expiração
}
```

### Proteção de Rotas

```tsx
<PrivateRoute allowedRoles={[UserRole.ADMINISTRADOR]}>
  <Configuracoes />
</PrivateRoute>
```

---

## 🛡️ Sistema de Permissões

### Hierarquia de Perfis

```
ADMINISTRADOR (Nível 4)
    ↓
RH (Nível 3)
    ↓
GESTOR (Nível 2)
    ↓
COLABORADOR (Nível 1)
```

### Matriz de Permissões

| Recurso | Admin | RH | Gestor | Colaborador |
|---------|-------|-----|--------|-------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Usuários | ✅ | ✅ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ✅ | ❌ |

---

## 🎨 Sistema de Design

### Cores Principais

```typescript
primary: '#a2122a'      // Vermelho FGS
secondary: '#354a80'    // Azul FGS
background: '#f5f5f5'   // Cinza claro
paper: '#ffffff'        // Branco
```

### Componentes de Design

#### StatCard
Card de estatísticas com ícone, valor e tendência.

#### RoleBadge
Badge colorido mostrando o perfil do usuário.

#### Logo
Logo da empresa com variações de tamanho.

---

## 🔄 Fluxo de Dados

### Requisições HTTP

```
Component → Service → Axios → API Backend
    ↓
  Response
    ↓
  Update State
    ↓
  Re-render
```

### Interceptors do Axios

**Request Interceptor:**
```typescript
// Adiciona token JWT automaticamente
config.headers.Authorization = `Bearer ${token}`;
```

**Response Interceptor:**
```typescript
// Captura erro 401 e redireciona para login
if (error.response?.status === 401) {
  window.location.href = '/login';
}
```

---

## 📊 Sistema de Logs

### Eventos Registrados

- ✅ Navegação entre páginas
- ✅ Login/Logout
- ✅ Ações do usuário (criar, editar, excluir)
- ✅ Erros de API

### Estrutura do Log

```typescript
{
  id: string;
  userId: string;
  userName: string;
  route: string;
  timestamp: Date;
  action: string;
}
```

### Armazenamento

- Logs armazenados no **localStorage**
- Limite de 1000 logs
- Visualização em tempo real na página de Configurações

---

## 🚀 Performance

### Otimizações Implementadas

1. **Code Splitting** (preparado)
   - Lazy loading de rotas
   - Dynamic imports

2. **Memoization**
   - useCallback para funções
   - useMemo para cálculos pesados

3. **Bundle Size**
   - Tree shaking automático (Vite)
   - Importações específicas do MUI

### Métricas Alvo

- **FCP** (First Contentful Paint): < 1.5s
- **TTI** (Time to Interactive): < 3s
- **Bundle Size**: < 500KB gzipped

---

## 🧪 Testes (Preparado)

### Estrutura de Testes

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── services/
│   ├── authService.ts
│   └── authService.test.ts
```

### Tipos de Teste

1. **Unit Tests** - Funções e utilidades
2. **Component Tests** - Componentes isolados
3. **Integration Tests** - Fluxos completos
4. **E2E Tests** - Testes de ponta a ponta

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3333/api
```

### TypeScript Config

- **Strict Mode**: Habilitado
- **Path Aliases**: `@/*` → `src/*`
- **Target**: ES2020

---

## 📱 Responsividade

### Breakpoints (MUI)

- **xs**: < 600px (mobile)
- **sm**: ≥ 600px (tablet)
- **md**: ≥ 900px (desktop small)
- **lg**: ≥ 1200px (desktop)
- **xl**: ≥ 1536px (desktop large)

### Grid System

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard />
  </Grid>
</Grid>
```

---

## 🔮 Extensibilidade

### Como Adicionar uma Nova Página

1. Criar arquivo em `src/pages/NovaPagina.tsx`
2. Adicionar rota em `src/routes/index.tsx`
3. Adicionar item no menu em `src/layouts/DashboardLayout.tsx`
4. Definir permissões em `src/utils/permissions.ts`

### Como Adicionar um Novo Perfil

1. Adicionar no enum em `src/types/index.ts`
2. Atualizar `getRoleName()` em `src/utils/permissions.ts`
3. Atualizar `getRoleColor()` em `src/utils/permissions.ts`
4. Definir permissões em `routePermissions`

---

## 📚 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2.0 | Framework UI |
| TypeScript | 5.3.3 | Type Safety |
| Material-UI | 5.14.20 | Componentes UI |
| React Router | 6.20.0 | Roteamento |
| Axios | 1.6.2 | HTTP Client |
| Vite | 5.0.7 | Build Tool |

---

## 🎓 Boas Práticas Implementadas

✅ TypeScript strict mode  
✅ ESLint configurado  
✅ Componentização adequada  
✅ Separação de responsabilidades  
✅ DRY (Don't Repeat Yourself)  
✅ SOLID principles  
✅ Clean Code  
✅ Semantic HTML  
✅ Acessibilidade (a11y)  
✅ Comentários em português  

---

**Documentação técnica - FGS Sistema de RH** 🎓

