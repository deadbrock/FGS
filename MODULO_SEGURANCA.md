# 🔐 Módulo de Segurança e Controle de Acesso - FGS

## 📋 Visão Geral

O módulo de **Segurança e Controle de Acesso** é responsável pelo gerenciamento completo de usuários, perfis, permissões e auditoria de acessos no sistema FGS. É um módulo administrativo exclusivo para o perfil **Administrador**.

---

## ✨ Funcionalidades Principais

### 1️⃣ Dashboard de Segurança
- **Estatísticas em Tempo Real**:
  - Total de usuários (ativos, inativos, bloqueados)
  - Acessos e tentativas de login do dia
  - Distribuição de usuários por perfil
  - Gráfico de acessos dos últimos 7 dias
  - Alertas de segurança

### 2️⃣ Gestão de Usuários
- **Cadastro Completo**:
  - Nome, email, telefone
  - Departamento e cargo
  - Perfil/Role (Administrador, RH, Gestor, Colaborador)
  - Status (Ativo, Inativo, Bloqueado, Pendente)
  - Foto de perfil
  
- **Controle de Acesso**:
  - Último acesso registrado
  - Tentativas de login falhadas
  - Status de senha (válida/expirada)
  - Data de expiração de senha
  - Permissões customizadas por usuário

- **Ações Disponíveis**:
  - Criar novo usuário
  - Editar usuário existente
  - Bloquear/Desbloquear usuário
  - Resetar senha
  - Visualizar histórico de acessos

### 3️⃣ Gestão de Perfis
- **Perfis Padrão**:
  - **Administrador**: Acesso total ao sistema
  - **RH**: Acesso a módulos de gestão de pessoas
  - **Gestor**: Acesso a relatórios e indicadores da equipe
  - **Colaborador**: Acesso limitado (dados pessoais)

- **Gerenciamento de Permissões**:
  - Definir permissões por módulo
  - Controlar ações (criar, editar, visualizar, excluir, exportar)
  - Criar permissões customizadas

### 4️⃣ Logs de Acesso
- **Registro Completo**:
  - Data e hora do acesso
  - Usuário e perfil
  - IP de origem
  - Navegador e dispositivo
  - Localização (opcional)
  - Status (sucesso/falha)
  - Motivo da falha (se aplicável)

- **Filtros Avançados**:
  - Por período
  - Por usuário
  - Por perfil
  - Por status (sucesso/falha)
  - Por IP

### 5️⃣ Logs de Alterações (Auditoria)
- **Rastreamento Completo**:
  - Quem fez a alteração
  - Quando foi feita
  - Qual módulo foi afetado
  - Qual ação foi executada
  - Qual entidade foi modificada
  - Campos alterados (valor anterior → valor novo)
  
- **Contexto da Alteração**:
  - IP de origem
  - Navegador utilizado

### 6️⃣ Configurações de Segurança
- **Políticas de Senha**:
  - Tamanho mínimo
  - Exigência de número
  - Exigência de letra maiúscula
  - Exigência de caractere especial
  - Prazo de expiração (dias)

- **Controle de Tentativas**:
  - Máximo de tentativas de login
  - Tempo de bloqueio (minutos)

- **Sessão**:
  - Tempo máximo de sessão
  - Autenticação de dois fatores (2FA)

- **Logs**:
  - Período de retenção de logs de acesso
  - Período de retenção de logs de alterações

---

## 🎯 Tipos de Dados

### Usuario
```typescript
interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: StatusUsuario;
  departamento?: string;
  cargo?: string;
  telefone?: string;
  foto?: string;
  ultimoAcesso?: string;
  tentativasLogin: number;
  senhaExpirada: boolean;
  dataExpiracao?: string;
  permissoesCustomizadas: PermissaoModulo[];
  criadoPor: string;
  criadoEm: string;
  atualizadoEm?: string;
}
```

### LogAcesso
```typescript
interface LogAcesso {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  email: string;
  role: UserRole;
  dataHora: string;
  ip: string;
  navegador: string;
  dispositivo: string;
  localizacao?: string;
  sucesso: boolean;
  motivoFalha?: string;
  acao: 'LOGIN' | 'LOGOUT' | 'TENTATIVA_FALHA';
}
```

### LogAlteracao
```typescript
interface LogAlteracao {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  role: UserRole;
  dataHora: string;
  modulo: string;
  acao: TipoAcao;
  entidade: string;
  entidadeId: string;
  camposAlterados: CampoAlterado[];
  ip: string;
  navegador: string;
}
```

---

## 🎨 Interface Visual

### Componentes Principais

1. **Cards de Estatísticas**:
   - Total de usuários
   - Acessos hoje
   - Usuários bloqueados
   - Total de logs

2. **Gráficos**:
   - Distribuição de usuários por perfil (barras)
   - Acessos dos últimos 7 dias (sucesso vs falha)

3. **Tabelas Interativas**:
   - Lista de usuários com avatares
   - Logs de acesso com filtros
   - Logs de alterações com detalhes

4. **Chips de Status**:
   - Status do usuário (Ativo, Inativo, Bloqueado, Pendente)
   - Perfil/Role (cores diferenciadas)
   - Status de acesso (Sucesso/Falha)

---

## 🔐 Controle de Acesso

### Permissões por Perfil

| Funcionalidade | Administrador | RH | Gestor | Colaborador |
|----------------|---------------|-----|--------|-------------|
| Dashboard Segurança | ✅ | ❌ | ❌ | ❌ |
| Gestão de Usuários | ✅ | ❌ | ❌ | ❌ |
| Gestão de Perfis | ✅ | ❌ | ❌ | ❌ |
| Logs de Acesso | ✅ | ❌ | ❌ | ❌ |
| Logs de Alterações | ✅ | ❌ | ❌ | ❌ |
| Configurações de Segurança | ✅ | ❌ | ❌ | ❌ |

---

## 📊 Alertas Automáticos

### Tipos de Alertas

1. **Erro (🔴)**:
   - Múltiplas tentativas de login falhadas
   - Acesso de IP suspeito
   - Atividade anormal

2. **Aviso (🟡)**:
   - Senhas próximas ao vencimento
   - Usuários inativos há muito tempo
   - Permissões inconsistentes

3. **Info (🔵)**:
   - Novo usuário cadastrado
   - Alteração de perfil
   - Limpeza de logs agendada

---

## 🚀 Integração Futura

### Funcionalidades Planejadas

1. **Autenticação de Dois Fatores (2FA)**:
   - Via SMS
   - Via aplicativo autenticador
   - Via email

2. **Single Sign-On (SSO)**:
   - Integração com Google
   - Integração com Microsoft Azure AD
   - Integração com LDAP/Active Directory

3. **Análise de Comportamento**:
   - Detecção de anomalias
   - Machine Learning para segurança
   - Scores de risco por usuário

4. **Conformidade e Compliance**:
   - Relatórios LGPD
   - Exportação para auditoria
   - Certificações de segurança

---

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── seguranca.ts              # Interfaces e tipos
├── pages/
│   └── Seguranca.tsx             # Página principal
├── utils/
│   └── permissions.ts            # Atualizado com /seguranca
├── routes/
│   └── index.tsx                 # Rota /seguranca (Admin)
└── layouts/
    └── DashboardLayout.tsx       # Menu com ícone de Segurança
```

---

## 🎯 Como Usar

### Acessar o Módulo
1. Faça login como **Administrador**
2. No menu lateral, clique em **"Segurança"** 🔒
3. Navegue pelas abas:
   - **Dashboard**: Visão geral
   - **Usuários**: Gestão de usuários
   - **Logs de Acesso**: Auditoria de acessos
   - **Logs de Alterações**: Auditoria de modificações

### Gerenciar Usuários
1. Acesse a aba **"Usuários"**
2. Clique em **"Novo Usuário"**
3. Preencha os dados e defina o perfil
4. Salve as alterações

### Visualizar Logs
1. Acesse a aba **"Logs de Acesso"**
2. Use os filtros para refinar a busca
3. Exporte para PDF/Excel se necessário

---

## ✅ Status de Implementação

- ✅ Tipos TypeScript completos
- ✅ Página principal com tabs
- ✅ Dashboard de estatísticas
- ✅ Gestão de usuários (interface)
- ✅ Logs de acesso
- ✅ Integração no menu e rotas
- 🚧 Logs de alterações (em desenvolvimento)
- 🚧 Serviços de backend (pendente)
- 🚧 Configurações de segurança (pendente)

---

## 🔮 Próximos Passos

1. Implementar serviços backend para:
   - CRUD de usuários
   - Registro de logs
   - Configurações de segurança

2. Criar componentes de formulário:
   - Formulário de usuário
   - Formulário de permissões
   - Configurações avançadas

3. Implementar filtros avançados nos logs

4. Adicionar exportação de relatórios

5. Integração com sistema de notificações

---

**Desenvolvido com ❤️ para o Sistema FGS - Formando Gente de Sucesso**

