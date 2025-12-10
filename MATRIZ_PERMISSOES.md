# 🔐 Matriz de Permissões - Sistema FGS

## 📋 Perfis de Acesso

O sistema FGS possui **4 perfis de acesso**, cada um com permissões específicas baseadas no **perfil** e no **departamento** do usuário.

### 1️⃣ ADMINISTRADOR
- **Acesso Total** ao sistema
- Pode gerenciar todos os usuários
- Pode criar usuários de qualquer perfil e departamento
- Acesso a todas as configurações e integrações

### 2️⃣ GESTOR
- Acesso varia conforme o **departamento**
- Pode gerenciar funcionalidades específicas do seu setor

### 3️⃣ COLABORADOR
- Acesso básico ao Dashboard
- Visualização de informações pessoais

### 4️⃣ USUARIO
- Acesso operacional limitado
- Permissões específicas por departamento

---

## 🏢 Departamentos

### 📌 Recursos Humanos
### 📌 Departamento Pessoal (DP)
### 📌 Segurança do Trabalho

---

## 🎯 Matriz de Permissões Detalhada

### 👤 USUÁRIO do Departamento Pessoal

| Módulo | Acesso |
|--------|--------|
| 📊 Dashboard | ✅ Sim |
| 👥 Usuários | ❌ Não |
| 📁 Prontuário | ❌ Não |
| ➕ Admissão | ✅ Sim |
| 🎓 Treinamentos | ❌ Não |
| ⏰ Ponto e Frequência | ✅ Sim |
| 🎁 Benefícios | ✅ Sim |
| 📢 Comunicação | ❌ Não |
| 📈 Relatórios | ❌ Não |
| 🌍 Regionais | ❌ Não |
| 🔒 Segurança | ❌ Não |
| 🔗 Integrações | ❌ Não |
| ⚙️ Configurações | ❌ Não |

**Resumo:** Acesso operacional aos módulos essenciais do DP (Admissão, Ponto, Benefícios).

---

### 👔 GESTOR do Departamento Pessoal

| Módulo | Acesso | Observações |
|--------|--------|-------------|
| 📊 Dashboard | ✅ Sim | Visualização completa |
| 👥 Usuários | ✅ Sim | **Limitado**: Só pode criar usuários do DP com perfil USUARIO |
| 📁 Prontuário | ✅ Sim | Acesso completo |
| ➕ Admissão | ✅ Sim | Gerenciamento completo |
| 🎓 Treinamentos | ❌ Não | - |
| ⏰ Ponto e Frequência | ✅ Sim | Gerenciamento completo |
| 🎁 Benefícios | ✅ Sim | Gerenciamento completo |
| 📢 Comunicação | ❌ Não | - |
| 📈 Relatórios | ✅ Sim | Relatórios do DP |
| 🌍 Regionais | ✅ Sim | Visualização e gestão |
| 🔒 Segurança | ❌ Não | - |
| 🔗 Integrações | ❌ Não | - |
| ⚙️ Configurações | ❌ Não | - |

**Resumo:** Acesso gerencial ao DP com permissão limitada para criar usuários apenas do seu departamento.

#### 🔐 Restrições do Gestor DP ao Criar Usuários:

1. **Perfil**: Só pode criar usuários com perfil **USUARIO**
2. **Departamento**: Só pode criar usuários para **Departamento Pessoal**
3. **Edição**: Só pode editar usuários do Departamento Pessoal
4. **Exclusão**: Não pode excluir usuários (apenas ADMINISTRADOR)

---

### 👔 GESTOR de Recursos Humanos

| Módulo | Acesso |
|--------|--------|
| 📊 Dashboard | ✅ Sim |
| 👥 Usuários | ❌ Não |
| 📁 Prontuário | ✅ Sim |
| ➕ Admissão | ✅ Sim |
| 🎓 Treinamentos | ✅ Sim |
| ⏰ Ponto e Frequência | ✅ Sim |
| 🎁 Benefícios | ✅ Sim |
| 📢 Comunicação | ✅ Sim |
| 📈 Relatórios | ✅ Sim |
| 🌍 Regionais | ✅ Sim |
| 🔒 Segurança | ❌ Não |
| 🔗 Integrações | ❌ Não |
| ⚙️ Configurações | ❌ Não |
| 👥 Colaboradores | ✅ Sim |

**Resumo:** Acesso amplo aos módulos operacionais e de gestão de pessoas.

---

### 👔 GESTOR de Segurança do Trabalho

| Módulo | Acesso |
|--------|--------|
| 📊 Dashboard | ✅ Sim |
| 👥 Usuários | ❌ Não |
| 📁 Prontuário | ❌ Não |
| ➕ Admissão | ✅ Sim |
| 🎓 Treinamentos | ✅ Sim |
| ⏰ Ponto e Frequência | ❌ Não |
| 🎁 Benefícios | ❌ Não |
| 📢 Comunicação | ❌ Não |
| 📈 Relatórios | ❌ Não |
| 🌍 Regionais | ❌ Não |
| 🔒 Segurança | ❌ Não |
| 🔗 Integrações | ❌ Não |
| ⚙️ Configurações | ❌ Não |

**Resumo:** Acesso focado em Admissão (exames) e Treinamentos.

---

### 👤 COLABORADOR

| Módulo | Acesso |
|--------|--------|
| 📊 Dashboard | ✅ Sim |
| Demais Módulos | ❌ Não |

**Resumo:** Acesso básico apenas ao Dashboard para visualização de informações pessoais.

---

## 🔧 Implementação Técnica

### Frontend

#### 1. **Verificação de Acesso por Rota**
```typescript
// src/utils/permissions.ts
export const hasRouteAccess = (user: User | null, route: string): boolean => {
  if (!user) return false;
  
  const { role, departamento } = user;
  
  // ADMINISTRADOR tem acesso total
  if (role === UserRole.ADMINISTRADOR) return true;
  
  // Mapeamento específico por perfil + departamento + rota
  const accessKey = `${role}_${departamento || ''}_${route}`;
  return accessMap[accessKey] || false;
};
```

#### 2. **Filtro de Menu Lateral**
```typescript
// src/layouts/DashboardLayout.tsx
const filteredMenuItems = menuItems.filter((item) => {
  if (!user) return false;
  return hasRouteAccess(user, item.path);
});
```

#### 3. **Proteção de Rotas**
```typescript
// src/components/PrivateRoute.tsx
const hasAccess = hasRouteAccess(user, currentPath);
if (!hasAccess) {
  return <Navigate to="/dashboard" replace />;
}
```

#### 4. **Restrições no Formulário de Usuários**
```typescript
// src/pages/Usuarios.tsx
const isGestorDP = currentUser?.role === UserRole.GESTOR && 
                    currentUser?.departamento === Departamento.DEPARTAMENTO_PESSOAL;

// Pré-definir valores para Gestor DP
if (isGestorDP) {
  setFormData({
    role: UserRole.USUARIO,
    departamento: Departamento.DEPARTAMENTO_PESSOAL,
  });
}
```

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR                            │
│  ✅ Acesso Total | Gerencia Tudo | Cria Qualquer Usuário  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  GESTOR (DP)   │  │  GESTOR (RH)   │  │ GESTOR (ST) │
│                │  │                │  │             │
│ 8 Módulos      │  │ 10 Módulos     │  │ 3 Módulos   │
│ Cria Usuários  │  │ Sem Usuários   │  │ Sem Usuários│
│ (DP/USUARIO)   │  │                │  │             │
└───────┬────────┘  └────────────────┘  └─────────────┘
        │
┌───────▼────────┐
│  USUARIO (DP)  │
│                │
│ 4 Módulos      │
│ Operacional    │
└────────────────┘

┌────────────────┐
│  COLABORADOR   │
│                │
│ 1 Módulo       │
│ (Dashboard)    │
└────────────────┘
```

---

## 🚀 Como Testar

### 1. Criar Usuário Gestor DP
```
Perfil: GESTOR
Departamento: Departamento Pessoal
```

### 2. Criar Usuário do DP
```
Perfil: USUARIO
Departamento: Departamento Pessoal
```

### 3. Verificar Acessos
- Login com Gestor DP → Deve ver 8 módulos no menu
- Login com Usuario DP → Deve ver 4 módulos no menu
- Gestor DP tentar criar usuário → Só pode criar USUARIO do DP

---

## 📝 Notas Importantes

1. ✅ **Segurança**: Todas as verificações são feitas tanto no frontend quanto no backend
2. ✅ **Flexibilidade**: Fácil adicionar novos perfis ou departamentos
3. ✅ **Manutenibilidade**: Lógica centralizada em `permissions.ts`
4. ✅ **UX**: Usuários só veem o que podem acessar (menu dinâmico)

---

**Última Atualização:** 10/12/2025
**Versão:** 2.0

