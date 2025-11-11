# 🔧 Configuração - Módulo de Usuários com Dados Reais

## ✅ Implementação Completa

O módulo de usuários agora está configurado para usar dados reais do banco de dados PostgreSQL!

---

## 📋 O que foi implementado?

### 🔙 Backend

1. **`backend/server.js`**
   - Servidor Express configurado
   - Conexão com PostgreSQL
   - CORS habilitado
   - Middlewares de log e erro
   - Health check endpoint

2. **`backend/controllers/usuariosController.js`**
   - ✅ `getUsuarios()` - Listar todos os usuários
   - ✅ `getUsuarioById()` - Buscar por ID
   - ✅ `createUsuario()` - Criar novo usuário
   - ✅ `updateUsuario()` - Atualizar usuário
   - ✅ `deleteUsuario()` - Deletar usuário
   - ✅ `checkEmailDisponivel()` - Verificar email
   - ✅ Senha com hash bcrypt
   - ✅ Validações completas

3. **`backend/routes/usuariosRoutes.js`**
   - Rotas REST completas
   - GET, POST, PUT, DELETE

### 🎨 Frontend

1. **`src/services/usuariosService.ts`**
   - Serviço com axios
   - Métodos para todas as operações CRUD
   - Tratamento de erros

2. **`src/pages/Usuarios.tsx`**
   - Interface completa de gestão
   - Criar, editar e deletar usuários
   - Busca e filtros
   - Dialogs modernos
   - Validações no frontend
   - Apenas administradores podem criar/editar

### 📦 Dependências Adicionadas

- ✅ `express` - Framework web
- ✅ `cors` - CORS middleware
- ✅ `bcrypt` - Hash de senhas
- ✅ `concurrently` - Rodar frontend e backend juntos

---

## 🚀 Como Executar

### **🌐 PRODUÇÃO (Vercel + Railway)**

O sistema está deployado em:
- **Frontend (Vercel)**: https://seu-app.vercel.app
- **Backend (Railway)**: https://seu-backend.railway.app

**Configuração necessária:**

**Vercel - Environment Variables:**
```env
VITE_API_URL=https://seu-backend.railway.app
```

**Railway - Environment Variables:**
```env
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=https://seu-app.vercel.app
PORT=3333
NODE_ENV=production
```

📖 **Guia completo:** `CONFIGURACAO_VERCEL_RAILWAY.md`

---

### **💻 DESENVOLVIMENTO LOCAL**

### **Passo 1: Instalar Dependências**

```bash
cd C:\Users\user\Documents\FGS\FGS
npm install --legacy-peer-deps
```

### **Passo 2: Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend Local
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=http://localhost:3000
PORT=3333
NODE_ENV=development
```

Crie um arquivo `.env.local` para o frontend (Vite):

```env
# Frontend Local
VITE_API_URL=http://localhost:3333
```

### **Passo 3: Executar o Sistema**

#### **Opção A: Rodar Tudo Junto (Recomendado)**

```bash
npm run dev:full
```

Isso inicia:
- Frontend (Vite) na porta 3000
- Backend (Express) na porta 3333

#### **Opção B: Backend Railway + Frontend Local**

Use o backend em produção para desenvolvimento:

**`.env.local`:**
```env
VITE_API_URL=https://seu-backend.railway.app
```

Rode apenas o frontend:
```bash
npm run dev
```

#### **Opção C: Rodar Separadamente**

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🧪 Testar a API

### **Health Check**
```bash
curl http://localhost:3333/health
```

### **Listar Usuários**
```bash
curl http://localhost:3333/api/usuarios
```

### **Criar Usuário (via API direta)**
```bash
curl -X POST http://localhost:3333/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Usuario",
    "email": "novo@fgs.com",
    "senha": "senha123",
    "role": "COLABORADOR",
    "cargo": "Assistente",
    "departamento": "TI"
  }'
```

---

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/usuarios` | Listar todos os usuários |
| GET | `/api/usuarios/:id` | Buscar usuário por ID |
| POST | `/api/usuarios` | Criar novo usuário |
| PUT | `/api/usuarios/:id` | Atualizar usuário |
| DELETE | `/api/usuarios/:id` | Deletar usuário |
| GET | `/api/usuarios/check-email?email=...` | Verificar se email está disponível |

---

## 🔐 Segurança

### **Senhas**
- ✅ Hashing com bcrypt (10 rounds)
- ✅ Senhas nunca retornadas nas consultas
- ✅ Validação de força (mínimo 6 caracteres)

### **Validações Backend**
- ✅ Email único
- ✅ Campos obrigatórios
- ✅ Formato de email válido
- ✅ Não permitir deletar admin principal

### **Validações Frontend**
- ✅ Campos obrigatórios
- ✅ Validação de email
- ✅ Validação de senha (mínimo 6 caracteres)
- ✅ Confirmação antes de deletar
- ✅ Proteção do admin principal

---

## 👤 Usuários de Teste (já no banco)

Se você executou o `database/setup-database.js`, já existem 3 usuários:

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@fgs.com | admin123 | ADMINISTRADOR |
| rh@fgs.com | admin123 | RH |
| gestor@fgs.com | admin123 | GESTOR |

---

## 🎯 Como Usar no Sistema

### **1. Fazer Login**
- Acesse: http://localhost:3000
- Login: `admin@fgs.com`
- Senha: `admin123`

### **2. Acessar Gestão de Usuários**
- Menu lateral → **Usuários**
- Somente perfil **ADMINISTRADOR** tem acesso total

### **3. Criar Novo Usuário**
1. Clique em **Novo Usuário**
2. Preencha os dados:
   - Nome Completo *
   - Email *
   - Senha * (mínimo 6 caracteres)
   - Perfil de Acesso *
   - Cargo (opcional)
   - Departamento (opcional)
3. Clique em **Criar**

### **4. Editar Usuário**
1. Clique no ícone de **Editar** (lápis)
2. Modifique os campos desejados
3. Deixe a senha em branco para manter a atual
4. Clique em **Salvar**

### **5. Deletar Usuário**
1. Clique no ícone de **Deletar** (lixeira)
2. Confirme a exclusão
3. ⚠️ O admin principal (`admin@fgs.com`) não pode ser deletado

---

## ✅ Recursos Implementados

### Interface
- [x] Listagem de usuários com busca
- [x] Avatar com iniciais
- [x] Badge de perfil colorido
- [x] Tabela responsiva
- [x] Skeleton loading
- [x] Dialog de criar/editar moderno
- [x] Validações em tempo real
- [x] Feedback visual (alerts, loading)

### Funcionalidades
- [x] Criar usuário (apenas admin)
- [x] Editar usuário (apenas admin)
- [x] Deletar usuário (apenas admin)
- [x] Busca por nome, email, departamento
- [x] Proteção do admin principal
- [x] Senhas criptografadas
- [x] Validação de email único
- [x] Atualização automática da lista

---

## 🐛 Solução de Problemas

### **Erro: "Cannot find module 'express'"**
```bash
npm install --legacy-peer-deps
```

### **Erro: "Erro ao carregar usuários. Verifique se o backend está rodando."**
- Verifique se o backend está rodando na porta 3333
- Execute: `npm run dev:backend`
- Teste: `curl http://localhost:3333/health`

### **Erro: "database connection refused"**
- Verifique a `DATABASE_URL` no arquivo `.env`
- Teste a conexão: `node database/setup-database.js`

### **Backend não inicia**
1. Verifique se as dependências estão instaladas
2. Verifique o arquivo `.env`
3. Veja os logs no terminal

### **Usuários não aparecem**
1. Verifique se há usuários no banco: `SELECT * FROM users;`
2. Verifique se o backend está conectado ao banco
3. Abra o console do navegador (F12) para ver erros

---

## 📈 Próximos Passos

Com o módulo de usuários funcionando, os próximos módulos podem usar o mesmo padrão:

1. **Colaboradores** (Prontuário)
2. **Benefícios**
3. **Treinamentos**
4. **Ponto e Frequência**
5. **Comunicação**
6. **Relatórios**
7. **Segurança**
8. **Regionais**

---

## 🎉 Resultado

Agora o sistema FGS tem:
- ✅ Backend funcionando com PostgreSQL
- ✅ API REST completa
- ✅ CRUD de usuários 100% funcional
- ✅ Segurança com bcrypt
- ✅ Interface moderna e responsiva
- ✅ Apenas administradores gerenciam usuários
- ✅ Validações robustas

**Sistema pronto para criar, editar e gerenciar usuários reais!** 🚀

