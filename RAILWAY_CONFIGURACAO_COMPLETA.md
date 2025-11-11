# 🚀 Configuração Completa Railway - Backend + Frontend + PostgreSQL

## 📋 Visão Geral

Você tem 3 serviços no Railway:
1. **PostgreSQL** (Database)
2. **Backend** (API Node.js/Express)
3. **Frontend** (React/Vite)

## 🗄️ Passo 1: Obter Variáveis do PostgreSQL

### No Railway Dashboard:

1. Clique no serviço **PostgreSQL**
2. Vá na aba **"Variables"**
3. Você verá estas variáveis (copie-as):

```
DATABASE_URL=postgresql://postgres:senha@container:5432/railway
PGHOST=containers-us-west-XXX.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua-senha-aqui
PGDATABASE=railway
```

**⚠️ IMPORTANTE:** Anote a `DATABASE_URL` completa!

---

## 🔧 Passo 2: Configurar Backend

### 2.1. Variáveis de Ambiente do Backend

No Railway, vá no serviço **Backend** → **Variables** e adicione:

```bash
# Database (copie do PostgreSQL)
DATABASE_URL=postgresql://postgres:senha@host:5432/railway

# Ou variáveis separadas:
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# Server
NODE_ENV=production
PORT=3333

# JWT (crie uma chave secreta forte)
JWT_SECRET=sua-chave-super-secreta-aqui-minimo-32-caracteres

# CORS (URL do frontend)
CORS_ORIGIN=https://seu-frontend.up.railway.app

# Opcional: Log
LOG_LEVEL=info
```

### 2.2. Gerar JWT_SECRET Seguro

Execute no seu terminal local:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou
openssl rand -hex 32
```

Copie o resultado e use como `JWT_SECRET`.

### 2.3. Referências entre Serviços

O Railway permite referenciar variáveis de outros serviços:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
# etc...
```

Isso cria uma conexão automática entre os serviços.

---

## 🎨 Passo 3: Configurar Frontend

### 3.1. Variáveis de Ambiente do Frontend

No Railway, vá no serviço **Frontend** → **Variables** e adicione:

```bash
# API URL (URL do backend)
VITE_API_URL=https://seu-backend.up.railway.app

# Environment
VITE_ENV=production

# App Info (opcional)
VITE_APP_NAME=FGS - Formando Gente de Sucesso
VITE_APP_VERSION=1.0.0
```

### 3.2. Como Obter a URL do Backend

1. Vá no serviço **Backend** no Railway
2. Em **Settings** → **Networking**
3. Clique em **"Generate Domain"** se ainda não tiver
4. Copie a URL (ex: `https://fgs-backend-production.up.railway.app`)
5. Use essa URL no `VITE_API_URL` do frontend

---

## 📝 Passo 4: Criar Arquivos .env (Desenvolvimento Local)

### Backend (.env)

Crie na raiz do backend:

```bash
# Database
DATABASE_URL=postgresql://postgres:senha@localhost:5432/fgs_dev

# Server
NODE_ENV=development
PORT=3333

# JWT
JWT_SECRET=dev-secret-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

Crie na raiz do frontend (FGS/):

```bash
# API URL (backend local)
VITE_API_URL=http://localhost:3333

# Environment
VITE_ENV=development

# App Info
VITE_APP_NAME=FGS - Formando Gente de Sucesso
VITE_APP_VERSION=1.0.0
```

---

## 🔗 Passo 5: Conectar Frontend ao Backend

### 5.1. Atualizar Services no Frontend

Se você ainda está usando services mock, precisa criar services reais:

**Exemplo: authService.ts**

```typescript
// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FGS:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
```

### 5.2. Criar Instância Axios Global

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@FGS:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('@FGS:token');
      localStorage.removeItem('@FGS:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🧪 Passo 6: Testar Conexões

### 6.1. Testar Backend Localmente

```bash
cd backend
npm install
npm run dev
```

Acesse: `http://localhost:3333/health` (ou sua rota de health check)

### 6.2. Testar Frontend Localmente

```bash
cd FGS
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### 6.3. Testar Conexão com PostgreSQL

No backend, crie uma rota de teste:

```javascript
// backend/src/routes.js
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      success: true, 
      time: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

---

## 🚀 Passo 7: Deploy no Railway

### 7.1. Ordem de Deploy

1. **PostgreSQL** (já criado ✅)
2. **Backend** (com variáveis configuradas)
3. **Frontend** (com VITE_API_URL do backend)

### 7.2. Commit e Push

```bash
# Backend
cd backend
git add .
git commit -m "Configurar variáveis de ambiente para Railway"
git push origin main

# Frontend
cd ../FGS
git add .
git commit -m "Conectar com backend real no Railway"
git push origin main
```

### 7.3. Verificar Logs

No Railway Dashboard:
1. Clique em cada serviço
2. Vá em **"Deployments"**
3. Clique no último deployment
4. Veja os **logs** para verificar erros

---

## 🔍 Troubleshooting

### Backend não conecta ao PostgreSQL

**Erro:** `ECONNREFUSED` ou `timeout`

**Solução:**
1. Verifique se `DATABASE_URL` está correta
2. Use referências: `${{Postgres.DATABASE_URL}}`
3. Verifique se PostgreSQL está rodando

### Frontend não conecta ao Backend

**Erro:** `ERR_CONNECTION_REFUSED` ou CORS

**Solução:**
1. Verifique `VITE_API_URL` está correto
2. Verifique CORS no backend:

```javascript
// backend
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

### CORS Error

**Erro:** `Access-Control-Allow-Origin`

**Solução:**

No backend, configure CORS corretamente:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Dev
    'https://seu-frontend.up.railway.app', // Prod
    'https://seu-dominio.com' // Custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Variáveis não carregam

**Erro:** `undefined` ao acessar variáveis

**Solução Frontend:**
- Usar `import.meta.env.VITE_*`
- Reiniciar servidor após mudar .env
- Variáveis devem começar com `VITE_`

**Solução Backend:**
- Usar `process.env.*`
- Instalar `dotenv`: `npm install dotenv`
- Importar no topo: `require('dotenv').config()`

---

## 📊 Checklist de Configuração

### PostgreSQL
- [ ] Serviço criado no Railway
- [ ] Variáveis anotadas (DATABASE_URL)

### Backend
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` configurada (segura)
- [ ] `PORT=3333` configurada
- [ ] `CORS_ORIGIN` configurada (URL do frontend)
- [ ] `NODE_ENV=production` configurada
- [ ] Domínio gerado no Railway
- [ ] Build passou sem erros
- [ ] Logs sem erros
- [ ] Rota de health check funciona

### Frontend
- [ ] `VITE_API_URL` configurada (URL do backend)
- [ ] `VITE_ENV=production` configurada
- [ ] Build passou sem erros
- [ ] Login funciona
- [ ] API calls funcionam
- [ ] CORS não dá erro

---

## 📋 Template de Variáveis

### Backend (Railway)
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3333
JWT_SECRET=<gere-uma-chave-segura-aqui>
CORS_ORIGIN=https://seu-frontend.up.railway.app
LOG_LEVEL=info
```

### Frontend (Railway)
```bash
VITE_API_URL=https://seu-backend.up.railway.app
VITE_ENV=production
VITE_APP_NAME=FGS - Formando Gente de Sucesso
VITE_APP_VERSION=1.0.0
```

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **JWT_SECRET:** Mínimo 32 caracteres aleatórios
2. **Nunca commitar:** `.env` no Git
3. **CORS:** Listar apenas origens permitidas
4. **HTTPS:** Railway fornece automaticamente
5. **Validação:** Validar todas as inputs no backend
6. **Rate Limiting:** Implementar no backend

### ❌ Não Fazer

- ❌ Usar `CORS_ORIGIN=*` em produção
- ❌ Commitar `.env` com secrets
- ❌ Usar senha fraca no PostgreSQL
- ❌ Expor `JWT_SECRET` no frontend
- ❌ Fazer requests sem validação

---

## 📚 Referências

- **Railway Docs:** https://docs.railway.app/
- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode
- **PostgreSQL Connection:** https://node-postgres.com/

---

**Última atualização:** Novembro 2025  
**Status:** ✅ Configuração Completa

