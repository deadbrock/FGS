# 🔗 Como Obter a URL do Backend no Railway

## 📍 MÉTODO 1: Via Dashboard (Mais Fácil)

### **Passo a Passo:**

1. **Acesse o Railway**
   - Vá para: https://railway.app
   - Faça login

2. **Acesse seu Projeto**
   - Você verá todos os seus projetos
   - Clique no projeto FGS (ou o nome que você deu)

3. **Identifique o Serviço Backend**
   - Você verá 2 serviços:
     - 🐘 **PostgreSQL** (banco de dados)
     - 🟢 **Seu Backend** (Node.js)
   - Clique no serviço **Backend** (Node.js)

4. **Ver a URL**
   - Na aba **Settings** ou **Deployments**
   - Procure por:
     - **"Domains"** ou
     - **"Public URL"** ou
     - **"Railway Provided Domain"**
   
   Você verá algo como:
   ```
   https://fgs-backend-production.up.railway.app
   ```
   ou
   ```
   https://fgs-backend-production-xxxx.up.railway.app
   ```

5. **Copiar a URL**
   - Clique no ícone de **copiar** ao lado da URL
   - Ou selecione e copie manualmente

---

## 📍 MÉTODO 2: Via Deployments

1. Acesse seu projeto no Railway
2. Clique no serviço **Backend**
3. Vá na aba **Deployments**
4. Clique no deployment mais recente (o primeiro da lista)
5. A URL estará no topo da página:
   ```
   Deployed to: https://sua-url.railway.app
   ```

---

## 📍 MÉTODO 3: Via Settings

1. Acesse seu projeto no Railway
2. Clique no serviço **Backend**
3. Vá na aba **Settings**
4. Role até a seção **Networking** ou **Domains**
5. Você verá:
   - **Railway Provided Domain**: `https://sua-url.railway.app`
   - Ou um botão **Generate Domain** se ainda não tiver

---

## 📍 MÉTODO 4: Via CLI (Avançado)

Se você tem o Railway CLI instalado:

```bash
# Navegar até o projeto
cd C:\Users\user\Documents\FGS\FGS

# Listar serviços
railway status

# Ver informações do serviço
railway service
```

A URL aparecerá na saída do comando.

---

## 🎯 COMO É A URL?

A URL do Railway geralmente tem este formato:

```
https://[nome-do-servico]-production.up.railway.app
```

ou

```
https://[nome-do-servico]-production-[id].up.railway.app
```

**Exemplos:**
- `https://fgs-backend-production.up.railway.app`
- `https://web-production-1234.up.railway.app`
- `https://backend-production-abcd.up.railway.app`

---

## ⚠️ ATENÇÃO: Backend Ainda Não Foi Deployado?

Se você ainda **não fez o deploy do backend no Railway**, a URL não existe ainda!

### **Precisa criar um novo serviço para o Backend:**

1. **Acesse Railway**: https://railway.app
2. **Abra seu projeto** (onde já tem o PostgreSQL)
3. **Clique em "New Service"** ou **"+ New"**
4. Escolha uma opção:
   - **"Deploy from GitHub"** (recomendado)
   - **"Empty Service"**
   - **"Deploy from Template"**

### **Opção A: Deploy from GitHub (Recomendado)**

1. Clique em **"Deploy from GitHub"**
2. Autorize o Railway a acessar seu GitHub
3. Selecione o repositório **FGS**
4. Railway detectará automaticamente que é um projeto Node.js
5. Clique em **Deploy**

**Railway vai automaticamente:**
- Instalar dependências: `npm install`
- Iniciar o servidor: `node backend/server.js` ou similar

**Depois do deploy:**
- Railway gera uma URL automaticamente
- Aparece na aba **Settings → Domains**

### **Opção B: Via CLI**

```bash
# 1. Instalar Railway CLI (se não tiver)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navegar até seu projeto
cd C:\Users\user\Documents\FGS\FGS

# 4. Linkar ao projeto Railway
railway link

# 5. Deploy
railway up
```

Após o deploy, a URL será mostrada no terminal!

---

## 🔍 VERIFICAR SE O BACKEND ESTÁ FUNCIONANDO

Depois de obter a URL, teste se está funcionando:

### **1. Health Check**

Abra no navegador ou use curl:

```bash
# Substitua pela sua URL real
curl https://sua-url.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T...",
  "database": "connected"
}
```

### **2. API de Usuários**

```bash
curl https://sua-url.railway.app/api/usuarios
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [...],
  "total": 3
}
```

---

## 📝 ONDE USAR A URL?

Depois de obter a URL do Railway, você precisa configurar em:

### **1. No Vercel (Frontend)**

**Vercel → Settings → Environment Variables:**

```env
VITE_API_URL=https://sua-url-real.railway.app
```

⚠️ **SEM barra `/` no final!**

Depois: **Redeploy** no Vercel!

### **2. No Railway (Backend - atualizar CORS)**

**Railway → Variáveis de Ambiente:**

```env
FRONTEND_URL=https://seu-app.vercel.app
```

(Use a URL do seu app no Vercel)

### **3. Desenvolvimento Local**

**Arquivo `.env.local`:**

```env
VITE_API_URL=https://sua-url-real.railway.app
```

Assim você desenvolve localmente usando o backend em produção!

---

## 🐛 PROBLEMAS COMUNS

### **❌ "Não vejo nenhuma URL"**

**Causa:** Backend ainda não foi deployado ou falhou

**Solução:**
1. Verifique se o deploy terminou
2. Railway → Deployments → Veja se está "Success" (verde)
3. Se está "Failed" (vermelho), veja os logs

### **❌ "URL retorna 404"**

**Causa:** Backend não está rodando ou rota incorreta

**Solução:**
1. Teste: `https://sua-url.railway.app/health`
2. Verifique Start Command no Railway
3. Veja os logs: Railway → View Logs

### **❌ "Service Unavailable"**

**Causa:** Backend crashou ou não iniciou

**Solução:**
1. Railway → View Logs
2. Procure por erros
3. Verifique variáveis de ambiente (DATABASE_URL, etc)

---

## 📸 IMAGEM DE REFERÊNCIA

A URL aparece aqui no Railway:

```
┌─────────────────────────────────────────────┐
│  Railway Dashboard                          │
│                                             │
│  [PostgreSQL]  [Backend Node.js] ← Clique  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Settings                              │ │
│  │                                       │ │
│  │ Domains                               │ │
│  │ ┌───────────────────────────────────┐ │ │
│  │ │ Railway Provided Domain          │ │ │
│  │ │                                  │ │ │
│  │ │ https://backend-production.up... │ │ │
│  │ │                          [Copy]  │ │ │
│  │ └───────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST

- [ ] Acessei https://railway.app
- [ ] Encontrei meu projeto
- [ ] Cliquei no serviço **Backend**
- [ ] Vi a URL em **Settings → Domains**
- [ ] Copiei a URL completa
- [ ] Testei: `https://minha-url.railway.app/health`
- [ ] Configurei no Vercel: `VITE_API_URL`
- [ ] Fiz Redeploy no Vercel
- [ ] Testei o sistema funcionando

---

## 🎯 RESUMO RÁPIDO

1. **Railway.app** → Login
2. **Seu Projeto** → Clique
3. **Backend Service** → Clique
4. **Settings** → Domains
5. **Copiar URL** → `https://sua-url.railway.app`
6. **Usar no Vercel** → `VITE_API_URL`
7. **Redeploy** → Pronto!

---

**Conseguiu a URL? Próximo passo: configurar no Vercel! 🚀**

