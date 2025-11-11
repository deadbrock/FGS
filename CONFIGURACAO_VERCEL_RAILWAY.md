# 🚀 Configuração - Vercel (Frontend) + Railway (Backend + Banco)

## 📐 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│              VERCEL (Frontend - React)                   │
│           https://seu-app.vercel.app                     │
│                                                          │
│  ├── Build: npm run build                               │
│  ├── Vite + React + TypeScript                          │
│  └── Variável: VITE_API_URL → URL do Railway           │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS Requests
                         │
┌────────────────────────▼────────────────────────────────┐
│           RAILWAY (Backend - Node.js Express)            │
│         https://seu-backend.railway.app                  │
│                                                          │
│  ├── Start: npm run dev:backend                         │
│  ├── Express + CORS                                     │
│  └── Conectado ao PostgreSQL do Railway                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ SQL Queries
                         │
┌────────────────────────▼────────────────────────────────┐
│         RAILWAY (PostgreSQL Database)                    │
│    hopper.proxy.rlwy.net:26190/railway                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 CONFIGURAÇÃO

### **1️⃣ Railway - Backend + Banco**

#### **A. Criar Serviços no Railway**

1. Acesse: https://railway.app
2. Crie um **novo projeto**
3. Adicione **PostgreSQL** (já criado: `hopper.proxy.rlwy.net:26190`)
4. Adicione **novo serviço** para o Backend

#### **B. Configurar Backend no Railway**

**Variáveis de Ambiente:**
```env
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=https://seu-app.vercel.app
PORT=3333
NODE_ENV=production
```

**Build & Deploy:**
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `node backend/server.js`
- **Root Directory**: `/`

#### **C. Obter URL do Backend**

Após o deploy, copie a URL:
```
https://seu-backend.railway.app
```

---

### **2️⃣ Vercel - Frontend**

#### **A. Variáveis de Ambiente no Vercel**

1. Acesse: https://vercel.com/seu-projeto
2. Settings → Environment Variables
3. Adicione:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://seu-backend.railway.app` |

**⚠️ IMPORTANTE:** Sem barra `/` no final!

#### **B. Build Settings (já configurado)**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 📝 DESENVOLVIMENTO LOCAL

### **Opção 1: Backend Local + Frontend Local**

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Configuração:**
- `.env` (backend):
```env
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=http://localhost:3000
PORT=3333
NODE_ENV=development
```

- `.env.local` (frontend):
```env
VITE_API_URL=http://localhost:3333
```

---

### **Opção 2: Backend Railway + Frontend Local**

Use o backend já deployado no Railway para desenvolvimento:

**`.env.local`** (frontend local):
```env
VITE_API_URL=https://seu-backend.railway.app
```

Rode apenas:
```bash
npm run dev
```

**Vantagem:** Não precisa rodar backend local!

---

## 🚀 DEPLOY

### **1. Deploy Backend no Railway**

```bash
# Fazer commit das mudanças
git add .
git commit -m "Backend configurado para Railway"

# Push para Railway (se conectado ao GitHub)
git push origin main
```

**Ou usar Railway CLI:**
```bash
railway up
```

### **2. Deploy Frontend no Vercel**

```bash
# Build local para testar
npm run build

# Deploy via CLI
vercel --prod

# Ou via GitHub (automático)
git push origin main
```

---

## ✅ CHECKLIST PÓS-DEPLOY

### **Backend (Railway)**

✅ Serviço está rodando (status verde)  
✅ URL pública gerada  
✅ Health check funcionando: `https://seu-backend.railway.app/health`  
✅ Variável `DATABASE_URL` configurada  
✅ Variável `FRONTEND_URL` aponta para Vercel  
✅ PostgreSQL conectado  

**Testar:**
```bash
curl https://seu-backend.railway.app/health
```

### **Frontend (Vercel)**

✅ Build passou (status verde)  
✅ URL pública gerada  
✅ Variável `VITE_API_URL` configurada  
✅ Site abre sem erros  
✅ Login funciona  
✅ Módulo Usuários carrega  

**Testar:**
1. Abra: https://seu-app.vercel.app
2. Login: `admin@fgs.com` / `admin123`
3. Menu → Usuários
4. Tente criar um usuário

---

## 🔐 CORS - Configuração Importante

O backend já está configurado para aceitar requisições do Vercel:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Certifique-se de:**
1. `FRONTEND_URL` no Railway = URL do Vercel
2. Sem barra `/` no final

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **❌ Erro: "Erro ao carregar usuários"**

**Causa:** Frontend não consegue se conectar ao backend

**Solução:**
1. Verifique se `VITE_API_URL` está configurado no Vercel
2. Teste a URL do backend: `curl https://seu-backend.railway.app/health`
3. Verifique CORS no backend
4. Abra F12 → Network → Veja se há erro de CORS

---

### **❌ Erro: CORS blocked**

**Causa:** `FRONTEND_URL` no Railway está incorreto

**Solução:**
1. Railway → Variáveis → `FRONTEND_URL`
2. Deve ser: `https://seu-app.vercel.app` (URL exata do Vercel)
3. Sem barra no final!
4. Redeploy o backend após alterar

---

### **❌ Backend não inicia no Railway**

**Causa:** Dependências ou configuração incorreta

**Solução:**
1. Verifique logs no Railway
2. Start Command: `node backend/server.js`
3. Verifique se `DATABASE_URL` está definida
4. Teste localmente: `npm run dev:backend`

---

### **❌ Frontend não encontra a API**

**Causa:** `VITE_API_URL` não configurado ou incorreto

**Solução:**
1. Vercel → Settings → Environment Variables
2. Adicione: `VITE_API_URL` = `https://seu-backend.railway.app`
3. Redeploy: Vercel → Deployments → Redeploy

---

## 📊 MONITORAMENTO

### **Railway (Backend)**

- **Logs**: Railway → Serviço → Logs
- **Metrics**: CPU, Memory, Network
- **Status**: https://seu-backend.railway.app/health

### **Vercel (Frontend)**

- **Logs**: Vercel → Deployments → View Function Logs
- **Analytics**: Vercel → Analytics
- **Status**: https://seu-app.vercel.app

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### **Desenvolvimento:**
```bash
# Backend local
npm run dev:backend

# Frontend local  
npm run dev
```

### **Staging/Teste:**
```bash
# Deploy para preview
vercel

# Backend staging no Railway (branch de dev)
railway up --environment staging
```

### **Produção:**
```bash
# Frontend
git push origin main  # Auto-deploy Vercel

# Backend
git push origin main  # Auto-deploy Railway
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
FGS/
├── backend/                      ← Railway
│   ├── server.js
│   ├── controllers/
│   │   └── usuariosController.js
│   └── routes/
│       └── usuariosRoutes.js
│
├── src/                          ← Vercel
│   ├── services/
│   │   └── usuariosService.ts
│   └── pages/
│       └── Usuarios.tsx
│
├── .env                          ← Railway (local)
├── .env.local                    ← Vite (local)
├── vercel.json                   ← Configuração Vercel
└── railway.json                  ← Configuração Railway (se usar)
```

---

## 🎯 VARIÁVEIS DE AMBIENTE - RESUMO

### **Local (.env)**
```env
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000
PORT=3333
NODE_ENV=development
```

### **Local (.env.local)**
```env
VITE_API_URL=http://localhost:3333
```

### **Railway (Backend)**
```env
DATABASE_URL=postgresql://...
FRONTEND_URL=https://seu-app.vercel.app
PORT=3333
NODE_ENV=production
```

### **Vercel (Frontend)**
```env
VITE_API_URL=https://seu-backend.railway.app
```

---

## ✨ RESULTADO FINAL

```
┌─────────────────────────────────────┐
│   VERCEL (Frontend Deployado)      │
│   https://seu-app.vercel.app       │
│         ↓                           │
│   VITE_API_URL aponta para:        │
└─────────────────┬───────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────┐
│   RAILWAY (Backend Deployado)      │
│   https://seu-backend.railway.app  │
│         ↓                           │
│   DATABASE_URL aponta para:        │
└─────────────────┬───────────────────┘
                  │
                  │ PostgreSQL
                  ▼
┌─────────────────────────────────────┐
│   RAILWAY (PostgreSQL)              │
│   hopper.proxy.rlwy.net:26190      │
└─────────────────────────────────────┘
```

**🎉 Sistema 100% na nuvem e funcionando!**

---

## 📞 LINKS ÚTEIS

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Docs Vercel**: https://vercel.com/docs
- **Docs Railway**: https://docs.railway.app

---

**Desenvolvido para FGS - Deploy em produção! 🚀**

