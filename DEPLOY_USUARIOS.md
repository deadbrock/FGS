# 🚀 Deploy do Módulo de Usuários - Vercel + Railway

## ✅ CHECKLIST PRÉ-DEPLOY

- [x] Backend criado (`backend/server.js`, `controllers`, `routes`)
- [x] Frontend atualizado (`src/pages/Usuarios.tsx`, `src/services/usuariosService.ts`)
- [x] Dependências instaladas (`express`, `cors`, `bcrypt`)
- [x] PostgreSQL configurado no Railway
- [x] Usuários de teste no banco

---

## 🔙 PASSO 1: Deploy do Backend no Railway

### **A. Acessar Railway**

1. Vá para: https://railway.app
2. Acesse seu projeto existente
3. Clique em **New Service**

### **B. Configurar Serviço Backend**

**Opção 1 - Via GitHub:**
1. Connect to GitHub
2. Selecione o repositório FGS
3. Railway detecta automaticamente

**Opção 2 - Via CLI:**
```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### **C. Configurar Variáveis de Ambiente**

No Railway, vá em **Variables** e adicione:

```env
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=https://seu-app.vercel.app
PORT=3333
NODE_ENV=production
```

⚠️ **IMPORTANTE:** 
- Use a `DATABASE_URL` do PostgreSQL já existente no Railway
- `FRONTEND_URL` deve ser a URL do Vercel (você colocará depois)

### **D. Configurar Build**

**Settings → Deploy:**
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `node backend/server.js`
- **Root Directory**: `/`

### **E. Deploy**

Clique em **Deploy** ou faça push no GitHub.

### **F. Obter URL do Backend**

Após o deploy, copie a URL gerada:
```
https://fgs-backend-production.up.railway.app
```

Ou algo similar.

### **G. Testar Backend**

```bash
curl https://sua-url.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

---

## 🎨 PASSO 2: Deploy do Frontend no Vercel

### **A. Acessar Vercel**

1. Vá para: https://vercel.com
2. Acesse seu projeto existente

### **B. Configurar Variável de Ambiente**

**Settings → Environment Variables:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://sua-url.railway.app` |

⚠️ **SEM barra `/` no final!**

### **C. Redeploy**

1. Vá em **Deployments**
2. Clique nos **...** do último deploy
3. **Redeploy**

Ou faça um novo commit:
```bash
git add .
git commit -m "Backend configurado"
git push origin main
```

### **D. Testar Frontend**

1. Acesse: https://seu-app.vercel.app
2. Login: `admin@fgs.com` / `admin123`
3. Menu → **Usuários**
4. Tente criar um usuário

---

## 🔄 PASSO 3: Atualizar CORS

### **A. Atualizar FRONTEND_URL no Railway**

Agora que você tem a URL do Vercel, atualize no Railway:

**Railway → Variables:**
```env
FRONTEND_URL=https://seu-app-real.vercel.app
```

### **B. Redeploy Backend**

Railway → **Redeploy**

---

## ✅ VALIDAÇÃO FINAL

### **Backend (Railway)**

✅ Status: Online (verde)  
✅ Health check: `https://sua-url.railway.app/health`  
✅ Logs sem erros  
✅ Conectado ao PostgreSQL  

**Testar API:**
```bash
# Health
curl https://sua-url.railway.app/health

# Listar usuários
curl https://sua-url.railway.app/api/usuarios
```

### **Frontend (Vercel)**

✅ Status: Ready (verde)  
✅ Site abre: `https://seu-app.vercel.app`  
✅ Login funciona  
✅ Módulo Usuários carrega  
✅ Criar usuário funciona  

**Testar no navegador:**
1. Abrir: https://seu-app.vercel.app
2. F12 → Network
3. Login → Ver se conecta no backend Railway
4. Usuários → Ver requisições para `/api/usuarios`

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **❌ "Erro ao carregar usuários"**

**Causa:** Frontend não encontra backend

**Solução:**
1. Vercel → Settings → Environment Variables
2. Verifique `VITE_API_URL` está correto
3. URL deve ser: `https://sua-url.railway.app` (sem `/`)
4. Redeploy no Vercel

---

### **❌ CORS Error**

**Causa:** Backend não reconhece frontend

**Solução:**
1. Railway → Variables
2. Verifique `FRONTEND_URL` = URL exata do Vercel
3. Deve ser: `https://seu-app.vercel.app` (sem `/`)
4. Redeploy no Railway

---

### **❌ Backend não inicia**

**Causa:** Erro de build ou variáveis

**Solução:**
1. Railway → Logs → Ver erro
2. Verifique `DATABASE_URL` está definida
3. Verifique Start Command: `node backend/server.js`
4. Teste localmente: `npm run dev:backend`

---

### **❌ 502 Bad Gateway**

**Causa:** Backend crashou

**Solução:**
1. Railway → Logs
2. Procure por erros
3. Verifique conexão com PostgreSQL
4. Redeploy

---

## 📊 ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────┐
│              VERCEL (Frontend)                       │
│        https://seu-app.vercel.app                   │
│                                                      │
│  Environment Variables:                             │
│  └── VITE_API_URL=https://backend.railway.app     │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTPS (CORS OK)
                       ▼
┌─────────────────────────────────────────────────────┐
│              RAILWAY (Backend)                       │
│        https://backend.railway.app                  │
│                                                      │
│  Environment Variables:                             │
│  ├── DATABASE_URL=postgresql://...                 │
│  ├── FRONTEND_URL=https://seu-app.vercel.app      │
│  ├── PORT=3333                                     │
│  └── NODE_ENV=production                           │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ PostgreSQL Connection
                       ▼
┌─────────────────────────────────────────────────────┐
│           RAILWAY (PostgreSQL)                       │
│     hopper.proxy.rlwy.net:26190/railway            │
│                                                      │
│  Tabela: users                                      │
│  ├── id, nome, email                               │
│  ├── senha (hash bcrypt)                           │
│  └── role, cargo, departamento                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 RESUMO DOS COMANDOS

### **Deploy Backend (Railway):**
```bash
# Via CLI
railway up

# Via Git
git push origin main
```

### **Deploy Frontend (Vercel):**
```bash
# Via CLI
vercel --prod

# Via Git
git push origin main
```

---

## 📝 VARIÁVEIS FINAIS

### **Railway (Backend)**
```env
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
FRONTEND_URL=https://seu-app-real.vercel.app
PORT=3333
NODE_ENV=production
```

### **Vercel (Frontend)**
```env
VITE_API_URL=https://seu-backend-real.railway.app
```

---

## ✨ PRONTO!

Agora você tem:

✅ Backend deployado no Railway  
✅ Frontend deployado no Vercel  
✅ Banco PostgreSQL no Railway  
✅ CRUD de usuários funcionando  
✅ Sistema 100% na nuvem  

**Teste agora:**
https://seu-app.vercel.app → Login → Usuários → Criar usuário!

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- `CONFIGURACAO_VERCEL_RAILWAY.md` - Guia completo
- `CONFIGURACAO_USUARIOS_REAL.md` - Configuração do módulo
- `TESTE_USUARIOS.md` - Como testar
- `USUARIOS_IMPLEMENTADO.md` - Resumo da implementação

---

**🚀 Deploy completo e funcional!**

