# 🔍 Diagnóstico: Solicitações SST no Railway

## ✅ Status Atual (Verificado)

- ✅ **Tabelas existem no banco:** `sst_clinicas` e `sst_solicitacoes_exames`
- ❌ **Rotas retornando 404:** "rota não encontrada"
- 📱 **Frontend:** Configurado corretamente (`VITE_API_URL=https://fgs-production.up.railway.app`)

## 🎯 Problema Identificado

As tabelas existem, mas as **rotas não estão funcionando**. Possíveis causas:

### 1. Backend do Railway está desatualizado
O código no Railway pode não ter as rotas de SST implementadas.

### 2. Erro no registro das rotas
O backend pode estar falhando ao registrar as rotas de solicitações.

### 3. Erro de deploy
O último deploy pode ter falhado parcialmente.

---

## 🔧 Solução: Verificar e Atualizar Backend

### Passo 1: Verificar Logs do Railway

**Via Web:**
1. Acesse https://railway.app
2. Selecione seu projeto FGS
3. Clique no serviço do **Backend** (não o PostgreSQL)
4. Vá na aba **"Deployments"** ou **"Logs"**

**Procure por:**
```
✅ Rotas registradas:
   📋 Solicitações SST:
      - GET    /api/solicitacoes/
```

**Se NÃO aparecer**, significa que o backend está desatualizado!

---

### Passo 2: Fazer Deploy Atualizado

#### Verificar último commit

```bash
# Ver último commit
git log -1 --oneline

# Ver se tem as rotas SST
git log --all --oneline | grep -i "sst\|solicitacoes"
```

#### Fazer Deploy para o Railway

**Opção A: Via Git (Automático)**

Se o Railway está conectado ao GitHub:

```bash
# Verificar se tem mudanças
git status

# Se tiver, commitar
git add .
git commit -m "fix: garantir rotas SST no backend"
git push origin main
```

O Railway fará deploy automático!

**Opção B: Via Railway CLI**

```bash
# Instalar CLI (se não tiver)
npm install -g @railway/cli

# Login
railway login

# Fazer deploy
railway up
```

---

### Passo 3: Verificar Variáveis de Ambiente

No Railway, verifique se estas variáveis existem:

```
DATABASE_URL=postgresql://... (deve existir)
PORT=3333 (ou a porta configurada)
NODE_ENV=production
JWT_SECRET=... (deve existir)
FRONTEND_URL=https://fgs-huwl.vercel.app
CORS_ORIGIN=https://fgs-huwl.vercel.app
```

**Como verificar:**
1. Railway → Seu Projeto → Backend Service → **Variables**

---

### Passo 4: Forçar Rebuild

Se o deploy não funcionar:

1. Railway → Backend Service → **Settings**
2. Clique em **"Redeploy"** ou **"Restart"**
3. Aguarde o build completar

---

## 🧪 Testar Após Deploy

### 1. Health Check
```bash
curl https://fgs-production.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-23T...",
  "database": "connected"
}
```

### 2. Testar Rota de Solicitações

```bash
curl https://fgs-production.up.railway.app/api/solicitacoes/
```

**Se retornar 401 (Unauthorized):** ✅ A rota existe! (só precisa de autenticação)

**Se retornar 404:** ❌ Backend ainda não está atualizado

### 3. Verificar no Frontend

1. Acesse: https://fgs-huwl.vercel.app
2. Login com: `segurancafg@fgservices.com.br`
3. Navegue: **Solicitações → ASO Admissional**
4. ✅ Deve carregar sem erro!

---

## 📋 Checklist de Verificação

- [ ] Acessei os logs do Railway
- [ ] Vi a mensagem "Rotas registradas: Solicitações SST" nos logs
- [ ] O health check está respondendo
- [ ] Fiz deploy do backend atualizado
- [ ] Testei a rota `/api/solicitacoes/` (deve retornar 401, não 404)
- [ ] O frontend carrega a página ASO sem erros

---

## 🚨 Se Ainda Não Funcionar

### Verificar arquivo server.js no Railway

O arquivo `backend/server.js` DEVE ter estas linhas:

```javascript
// Importar rotas
import solicitacoesRoutes from './routes/solicitacoesRoutes.js';

// Registrar rotas
app.use('/api/solicitacoes', solicitacoesRoutes);
```

### Verificar se o arquivo existe no repositório

```bash
# Verificar se os arquivos existem
ls -la backend/routes/solicitacoesRoutes.js
ls -la backend/controllers/solicitacoesController.js
ls -la backend/controllers/clinicasController.js
```

Se algum arquivo não existir, o backend está incompleto!

---

## 📞 Comandos Úteis Railway

```bash
# Ver logs em tempo real
railway logs --tail

# Ver status do serviço
railway status

# Ver variáveis de ambiente
railway variables

# Conectar ao banco (para verificar tabelas)
railway connect postgres
```

---

## 🎯 Resumo

O problema é que o **backend no Railway não tem as rotas SST** registradas, mesmo que as tabelas existam no banco.

**Solução:**
1. ✅ Fazer deploy atualizado do backend
2. ✅ Verificar logs para confirmar rotas registradas
3. ✅ Testar no frontend

**Próximo passo:** Verificar os logs do Railway agora para confirmar se as rotas estão sendo registradas!


