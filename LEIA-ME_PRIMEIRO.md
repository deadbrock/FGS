# 🎯 LEIA-ME PRIMEIRO - Sistema FGS

## ⚡ Início Ultrarrápido (3 minutos)

### Passo 1: Instalar
```bash
npm install
```

### Passo 2: Configurar para Teste SEM Backend

Abra o arquivo `src/services/authService.ts` e **substitua todo o conteúdo** por:

```typescript
export { default } from './authService.mock';
```

### Passo 3: Executar
```bash
npm run dev
```

### Passo 4: Acessar
Abra o navegador em: **http://localhost:3000**

### Passo 5: Fazer Login
Use qualquer uma destas credenciais:

| Perfil | Email | Senha |
|--------|-------|-------|
| **Admin** | admin@fgs.com | admin123 |
| **RH** | rh@fgs.com | rh123 |
| **Gestor** | gestor@fgs.com | gestor123 |
| **Colaborador** | colaborador@fgs.com | colab123 |

---

## 🎉 Pronto! O sistema está funcionando!

Agora você pode:
- ✅ Navegar pelas páginas
- ✅ Testar diferentes perfis de usuário
- ✅ Ver o menu lateral recolhível
- ✅ Visualizar logs de navegação
- ✅ Testar permissões de acesso

---

## 📚 Documentação Completa

Após testar o sistema, leia:

1. **GUIA_RAPIDO.md** - Funcionalidades e dicas
2. **INSTRUCOES.md** - Instalação detalhada e integração
3. **ARQUITETURA.md** - Estrutura técnica do projeto
4. **PROJETO_COMPLETO.md** - Resumo completo do projeto

---

## 🔌 Para Integrar com Backend Real

1. **NÃO modifique** o arquivo `authService.ts` (use o original)
2. Configure o arquivo `.env`:
   ```env
   VITE_API_URL=http://localhost:3333/api
   ```
3. Certifique-se de que o backend implementa os endpoints:
   - POST `/api/auth/login`
   - GET `/api/auth/me`

---

## ❓ Problemas?

### Erro "Cannot find module"
👉 Execute: `npm install`

### Erro "Port already in use"
👉 Mude a porta: `npm run dev -- --port 3001`

### Login não funciona
👉 Certifique-se de ter configurado o modo mock (Passo 2)

---

## 🎨 O que você vai ver:

### 1. Tela de Login
- Design moderno com gradiente vermelho/azul
- Logo FGS animado
- Campos de email e senha

### 2. Dashboard
- 4 cards de estatísticas
- Tabela de atividades recentes
- Menu lateral recolhível

### 3. Usuários (Admin/RH)
- Lista de usuários com busca
- Badges coloridos de perfil
- Avatares personalizados

### 4. Configurações (Admin)
- Configurações do sistema
- Logs de navegação em tempo real
- Opções de notificação

---

## 🎯 Testando Permissões

Faça login com diferentes perfis para ver:

**Admin (admin@fgs.com)**
- Vê todos os menus
- Acessa Usuários e Configurações

**RH (rh@fgs.com)**
- Vê Dashboard e Usuários
- NÃO vê Configurações

**Gestor/Colaborador**
- Vê apenas Dashboard
- Recebe "Acesso Negado" em outras páginas

---

## ✨ Características Principais

✅ **React 18** + **TypeScript 5**  
✅ **Material-UI** (componentes modernos)  
✅ **JWT** Authentication  
✅ **4 perfis** de usuário  
✅ **Menu lateral** recolhível  
✅ **Tema customizado** (cores FGS)  
✅ **Sistema de logs** automático  
✅ **Rotas protegidas** por permissão  
✅ **Design responsivo**  

---

## 📊 Estrutura do Projeto

```
FGS/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Login, Dashboard, Usuários, Config
│   ├── layouts/       # Layout com menu lateral
│   ├── services/      # API e autenticação
│   ├── contexts/      # AuthContext
│   └── theme/         # Cores FGS
├── LEIA-ME_PRIMEIRO.md  ← Você está aqui!
├── GUIA_RAPIDO.md
├── INSTRUCOES.md
└── README.md
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

---

## 🎓 Desenvolvido para

**FGS - Formando Gente de Sucesso**

Sistema de RH completo com autenticação, controle de permissões e interface moderna.

---

## 💡 Dica Final

Explore o sistema! Faça login com diferentes perfis, navegue pelas páginas, teste o menu recolhível, e veja os logs em Configurações.

**Divirta-se! 🎉**

