# 🚀 Configuração Railway (Backend + DB) + Vercel (Frontend)

## 📋 Arquitetura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │─────▶│   Railway   │─────▶│ PostgreSQL  │
│  (Frontend) │ API  │  (Backend)  │  DB  │  (Railway)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

Esta é uma **excelente** configuração porque:
- ✅ Vercel é otimizada para frontend (CDN global, build rápido)
- ✅ Railway é perfeita para backend + database
- ✅ Melhor performance e custos otimizados

---

## 🗄️ Passo 1: Railway - PostgreSQL + Backend

### 1.1. Configurar Backend no Railway

**Railway Dashboard → Backend → Variables:**

```bash
# Database (referencia automática do PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Servidor
NODE_ENV=production
PORT=${{PORT}}

# JWT (gere uma chave segura!)
JWT_SECRET=<sua-chave-super-secreta-aqui>

# CORS (URL do Vercel - importante!)
CORS_ORIGIN=https://seu-app.vercel.app

# Opcional
LOG_LEVEL=info
```

### 1.2. Gerar Domínio do Backend

1. Railway Dashboard → **Backend**
2. Settings → Networking → **"Generate Domain"**
3. Copie a URL gerada
4. Exemplo: `https://fgs-backend-production.up.railway.app`

**⚠️ IMPORTANTE:** Anote essa URL! Você vai usar no Vercel.

---

## 🌐 Passo 2: Vercel - Frontend

### 2.1. Configurar Variáveis no Vercel

**Vercel Dashboard → Seu Projeto → Settings → Environment Variables:**

```bash
# API URL (URL do backend no Railway)
VITE_API_URL=https://fgs-backend-production.up.railway.app

# Environment
VITE_ENV=production

# App Info (opcional)
VITE_APP_NAME=FGS - Formando Gente de Sucesso
VITE_APP_VERSION=1.0.0
```

### 2.2. Adicionar para Todos os Ambientes

No Vercel, marque as caixas:
- ☑️ **Production**
- ☑️ **Preview**
- ☑️ **Development**

### 2.3. Redeploy após Adicionar Variáveis

Após adicionar variáveis:
1. Vá em **Deployments**
2. Clique nos 3 pontos **"..."** do último deployment
3. Clique em **"Redeploy"**

---

## 🔗 Passo 3: Conectar Vercel ↔ Railway

### 3.1. Obter URL do Vercel

1. Vercel Dashboard → Seu Projeto
2. Veja a URL de produção
3. Exemplo: `https://fgs-sistema.vercel.app`

### 3.2. Atualizar CORS no Railway

**Railway Dashboard → Backend → Variables:**

Atualize a variável `CORS_ORIGIN`:

```bash
CORS_ORIGIN=https://fgs-sistema.vercel.app
```

**Se tiver domínio customizado, adicione também:**

```bash
CORS_ORIGIN=https://fgs-sistema.vercel.app,https://sistema.seudominio.com
```

### 3.3. Configurar CORS no Código do Backend

No seu backend, configure CORS corretamente:

```javascript
// backend/src/server.js ou app.js
const cors = require('cors');

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🔧 Passo 4: Configurar Frontend (Vercel)

### 4.1. Atualizar Services no Frontend

**src/services/api.ts:**

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos (Railway pode ser mais lento no cold start)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // True se usar cookies
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
      // Token expirado
      localStorage.removeItem('@FGS:token');
      localStorage.removeItem('@FGS:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2. Substituir Services Mock por Services Reais

**Exemplo: authService.ts**

```typescript
// src/services/authService.ts
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Salvar token
    if (data.token) {
      localStorage.setItem('@FGS:token', data.token);
      localStorage.setItem('@FGS:user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('@FGS:token');
    localStorage.removeItem('@FGS:user');
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export default authService;
```

---

## 🧪 Passo 5: Testar Conexão

### 5.1. Testar Backend (Railway)

Acesse no navegador:
```
https://seu-backend.up.railway.app/health
```

Deve retornar algo como:
```json
{
  "status": "ok",
  "timestamp": "2024-11-11T..."
}
```

### 5.2. Testar Database

Crie uma rota de teste no backend:

```javascript
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as time, version() as version');
    res.json({
      success: true,
      database: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

Acesse: `https://seu-backend.up.railway.app/api/test-db`

### 5.3. Testar Frontend → Backend

1. Acesse seu site na Vercel: `https://seu-app.vercel.app`
2. Abra DevTools (F12) → Console
3. Tente fazer login
4. Veja as requisições na aba Network

**Se funcionar:** ✅ Tudo conectado!

**Se der erro CORS:** ⚠️ Verifique configuração no passo 3.3

---

## 🔒 Passo 6: Segurança

### 6.1. Gerar JWT_SECRET Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use o resultado no Railway → Backend → `JWT_SECRET`

### 6.2. Headers de Segurança (Backend)

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: false, // Configure conforme necessário
  crossOriginEmbedderPolicy: false
}));
```

### 6.3. Rate Limiting (Backend)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de requisições
});

app.use('/api/', limiter);
```

---

## 📝 Desenvolvimento Local

### Backend (.env)

```bash
DATABASE_URL=postgresql://postgres:senha@localhost:5432/fgs_dev
NODE_ENV=development
PORT=3333
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:3333
VITE_ENV=development
```

---

## 🚀 Deploy Completo

### 1. Backend (Railway)

```bash
cd backend
git add .
git commit -m "Configure environment variables"
git push origin main
```

Railway detecta automaticamente e faz deploy.

### 2. Frontend (Vercel)

```bash
cd FGS
git add .
git commit -m "Connect to Railway backend"
git push origin main
```

Vercel detecta automaticamente e faz deploy.

---

## ✅ Checklist Final

### Railway (Backend)
- [ ] PostgreSQL criado
- [ ] Backend conectado ao PostgreSQL
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `JWT_SECRET` configurado (seguro!)
- [ ] `CORS_ORIGIN` com URL do Vercel
- [ ] `PORT=${{PORT}}`
- [ ] `NODE_ENV=production`
- [ ] Domínio gerado
- [ ] Health check funciona
- [ ] Logs sem erros

### Vercel (Frontend)
- [ ] `VITE_API_URL` com URL do Railway backend
- [ ] `VITE_ENV=production`
- [ ] Variáveis aplicadas em todos ambientes
- [ ] Build passou sem erros
- [ ] Site acessível
- [ ] Login funciona
- [ ] API calls funcionam
- [ ] CORS não dá erro

---

## 🔍 Troubleshooting

### Erro: CORS

**Sintomas:**
```
Access to fetch at 'https://backend.railway.app' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**Solução:**
1. Verifique `CORS_ORIGIN` no Railway tem a URL correta do Vercel
2. Verifique código CORS no backend (passo 3.3)
3. Redeploy do backend após mudanças

### Erro: 502 Bad Gateway (Railway)

**Sintomas:** Backend não responde

**Solução:**
1. Railway pode estar em "cold start" (primeira requisição demora)
2. Aumentar timeout no frontend para 30s
3. Verificar logs do Railway por erros
4. Verificar se `PORT=${{PORT}}` está configurado

### Erro: Environment Variable Undefined

**Frontend:**
- Variáveis devem começar com `VITE_`
- Usar `import.meta.env.VITE_API_URL`
- Redeploy após adicionar variáveis

**Backend:**
- Usar `process.env.VARIAVEL`
- Verificar se variável está no Railway
- Redeploy após adicionar variáveis

### Erro: 401 Unauthorized

**Sintomas:** Todas requisições retornam 401

**Solução:**
1. Verificar se token está sendo salvo no localStorage
2. Verificar se Authorization header está sendo enviado
3. Verificar JWT_SECRET no backend
4. Verificar se token não expirou

---

## 💡 Dicas de Performance

### Vercel (Frontend)
- ✅ Build otimizado automaticamente
- ✅ CDN global
- ✅ Cache agressivo de assets
- ✅ HTTP/2 e HTTP/3

### Railway (Backend)
- ⚠️ Cold start pode demorar 5-10s (primeiro request)
- ✅ Considere plano pago para keep-alive
- ✅ Use connection pooling no PostgreSQL
- ✅ Implemente cache (Redis)

### Otimizações
1. **Frontend:** Lazy loading de rotas
2. **Backend:** Cache de queries frequentes
3. **Database:** Índices nas tabelas
4. **API:** Paginação em listas grandes

---

## 💰 Custos Estimados

### Vercel
- **Hobby (Grátis):** 100GB bandwidth
- **Pro ($20/mês):** Ilimitado

### Railway
- **Trial:** $5 crédito grátis
- **Hobby ($5/mês):** $5 crédito incluído + pay-as-you-go

**Total Estimado:** $0-10/mês (para tráfego médio)

---

## 📊 Monitoramento

### Vercel
- **Analytics:** Dashboard integrado
- **Logs:** Em tempo real
- **Speed Insights:** Performance

### Railway
- **Logs:** Visualizar no dashboard
- **Metrics:** CPU, Memory, Network
- **Database:** Conexões, queries

---

## 🎯 Resumo Rápido

```bash
# Railway Backend
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<gere-chave-segura>
CORS_ORIGIN=https://seu-app.vercel.app
PORT=${{PORT}}
NODE_ENV=production

# Vercel Frontend
VITE_API_URL=https://seu-backend.up.railway.app
VITE_ENV=production
```

**Ordem:**
1. Configure Backend no Railway
2. Gere domínio do Backend
3. Configure Frontend na Vercel com URL do backend
4. Gere domínio do Frontend
5. Atualize CORS do Backend com URL do frontend
6. Teste tudo!

---

**Configuração ideal para produção!** ✅

**Dúvidas? Precisa de ajuda com alguma parte?** 🚀

---

**Última atualização:** Novembro 2025  
**Arquitetura:** Railway (Backend + DB) + Vercel (Frontend)

