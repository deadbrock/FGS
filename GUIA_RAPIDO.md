# 🚀 Guia Rápido - Sistema FGS

## Inicialização Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Modo Desenvolvimento
```bash
npm run dev
```

### 3. Acessar o Sistema
Abra o navegador em: `http://localhost:3000`

---

## 🔐 Login de Teste

### Para testar SEM backend (modo mock):

1. Abra o arquivo `src/services/authService.ts`
2. Na primeira linha, troque a importação:

**De:**
```typescript
import api from './api';
```

**Para:**
```typescript
export { default } from './authService.mock';
```

**OU substitua todo o conteúdo do arquivo por:**
```typescript
export { default } from './authService.mock';
```

3. Use as credenciais:

| Perfil | Email | Senha |
|--------|-------|-------|
| **Administrador** | admin@fgs.com | admin123 |
| **RH** | rh@fgs.com | rh123 |
| **Gestor** | gestor@fgs.com | gestor123 |
| **Colaborador** | colaborador@fgs.com | colab123 |

---

## 🎯 Funcionalidades por Perfil

### 👑 Administrador (admin@fgs.com)
✅ Dashboard  
✅ Usuários  
✅ Configurações  
✅ Todas as funcionalidades

### 👥 RH (rh@fgs.com)
✅ Dashboard  
✅ Usuários  
❌ Configurações

### 📊 Gestor (gestor@fgs.com)
✅ Dashboard  
❌ Usuários  
❌ Configurações

### 👤 Colaborador (colaborador@fgs.com)
✅ Dashboard  
❌ Usuários  
❌ Configurações

---

## 📂 Estrutura Rápida

```
src/
├── components/      → Componentes reutilizáveis
├── pages/          → Tela de Login, Dashboard, etc
├── layouts/        → Layout com menu lateral
├── contexts/       → Autenticação (AuthContext)
├── services/       → Chamadas de API
├── theme/          → Cores FGS (vermelho/azul)
└── types/          → TypeScript interfaces
```

---

## 🎨 Tema Visual

- **Vermelho FGS:** `#a2122a`
- **Azul FGS:** `#354a80`
- **Gradiente:** Linear de vermelho para azul

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

---

## 🔗 Integração com Backend

Para conectar com backend real:

1. Configure `.env`:
```env
VITE_API_URL=http://localhost:3333/api
```

2. Use o arquivo `src/services/authService.ts` original (sem mock)

3. O backend deve implementar:
   - POST `/api/auth/login`
   - GET `/api/auth/me`
   - Headers: `Authorization: Bearer <token>`

---

## 📱 Páginas Implementadas

- ✅ **Login** - Autenticação com JWT
- ✅ **Dashboard** - Estatísticas e atividades recentes
- ✅ **Usuários** - Gestão de usuários (Admin/RH)
- ✅ **Configurações** - Configurações do sistema (Admin)

---

## 🛡️ Sistema de Permissões

O sistema controla automaticamente o acesso baseado no perfil:

- Rotas protegidas com `<PrivateRoute>`
- Menu lateral exibe apenas opções permitidas
- Redirecionamento automático em caso de acesso negado

---

## 📊 Sistema de Logs

Todos os acessos são registrados automaticamente:

- Navegação entre páginas
- Ações realizadas
- Visualização em Configurações → Logs de Navegação

---

## ⚡ Dicas

1. **Menu Lateral:** Clique no ícone ☰ para recolher/expandir
2. **Perfil:** Clique no avatar no canto superior direito
3. **Teste Perfis:** Faça logout e teste com diferentes perfis
4. **Logs:** Veja os logs em tempo real na página de Configurações

---

## 🐛 Problemas Comuns

### Erro de autenticação
→ Verifique se está usando o mock (veja seção Login de Teste)

### Página em branco
→ Abra o console do navegador (F12) para ver erros

### Menu não aparece
→ Verifique se fez login corretamente

---

## 📞 Próximos Passos

1. ✅ Projeto criado e funcionando
2. 🔄 Integrar com backend Node.js
3. 🔄 Implementar mais páginas (Colaboradores, Relatórios, etc)
4. 🔄 Adicionar gráficos e dashboards avançados

---

**Sistema desenvolvido para FGS - Formando Gente de Sucesso** 🎓

