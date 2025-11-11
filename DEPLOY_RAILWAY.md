# 🚂 Deploy no Railway - FGS Sistema de RH

## Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Código em um repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente (para testes)

## Método 1: Deploy via Railway Dashboard (Recomendado)

### Passo 1: Preparar o Repositório

1. **Commit e push do código** para seu repositório Git:

```bash
cd C:\Users\user\Documents\FGS\FGS
git add .
git commit -m "Preparar para deploy no Railway"
git push origin main
```

### Passo 2: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app/)
2. Faça login ou crie uma conta (pode usar GitHub)
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Autorize o Railway a acessar seus repositórios
6. Selecione o repositório **FGS**

### Passo 3: Configurar o Projeto

O Railway detectará automaticamente o Node.js. Configure:

#### Build Settings (Automático)

O Railway usará os arquivos:
- `railway.json` → Configurações do projeto
- `nixpacks.toml` → Build configuration
- `package.json` → Scripts de build

#### Variables (Environment Variables)

Adicione se necessário:

1. Clique em **"Variables"**
2. Adicione:

```
PORT=3000
NODE_ENV=production
VITE_ENV=production
```

### Passo 4: Deploy

1. O deploy inicia automaticamente após conectar o repositório
2. Aguarde o build (3-7 minutos no primeiro deploy)
3. 🎉 Seu site estará no ar!

### Passo 5: Acessar o Site

1. Na página do projeto, clique em **"Settings"**
2. Vá em **"Networking"** → **"Public Networking"**
3. Clique em **"Generate Domain"**
4. Sua URL será algo como:
```
https://fgs-rh-system.up.railway.app
```

## Método 2: Deploy via CLI

### Instalar Railway CLI

```bash
# Windows (usando npm)
npm install -g @railway/cli

# Ou usando cargo (Rust)
cargo install railway-cli
```

### Login

```bash
railway login
```

Isso abrirá o navegador para autenticação.

### Inicializar Projeto

```bash
cd C:\Users\user\Documents\FGS\FGS
railway init
```

Siga as instruções:
1. **Create a new project?** → Yes
2. **Project name?** → fgs-rh-system

### Deploy

```bash
railway up
```

### Ver Status

```bash
railway status
```

### Ver Logs

```bash
railway logs
```

## Configurações Avançadas

### Custom Domain (Domínio Próprio)

1. No painel do Railway, vá em **Settings** → **Networking**
2. Em **Custom Domains**, clique em **"Add Custom Domain"**
3. Digite seu domínio (ex: `fgs.seudominio.com`)
4. Configure os DNS conforme instruções

**Exemplo de configuração DNS:**
```
Type: CNAME
Name: fgs
Value: fgs-rh-system.up.railway.app
```

### Environment Variables

Para adicionar variáveis de ambiente:

1. **Variables** tab
2. Clique em **"New Variable"**
3. Adicione:

```
VITE_API_URL=https://sua-api.com
NODE_ENV=production
PORT=3000
```

4. **Redeploy** o projeto

### Configurar Build Command

Se precisar personalizar, edite `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### HTTPS Automático

✅ O Railway fornece HTTPS automaticamente
✅ Certificado SSL gerenciado automaticamente

## Build Local (Testar antes do Deploy)

Teste o build localmente antes de fazer deploy:

```bash
# Build
npm run build

# Preview do build (simula Railway)
npm run preview -- --host 0.0.0.0 --port 3000
```

Acesse: `http://localhost:3000`

## Troubleshooting

### Erro: "Build failed"

**Solução 1:** Ver logs completos

```bash
railway logs
```

**Solução 2:** Teste o build localmente:
```bash
npm run build
```

**Solução 3:** Limpe cache no Railway:
1. Vá em **Settings** → **Danger Zone**
2. Clique em **"Clear Build Cache"**
3. Faça redeploy

### Erro: "Application not responding"

**Causa:** Porta incorreta

**Solução:** Certifique-se que está usando a variável `PORT`:

No `nixpacks.toml`:
```toml
[start]
cmd = "npm run preview -- --host 0.0.0.0 --port ${PORT:-3000}"
```

### Erro: "Out of memory"

**Solução:** Aumente o plano ou otimize o build:

```json
// package.json
{
  "scripts": {
    "build": "vite build --mode production"
  }
}
```

### Deploy não inicia automaticamente

**Solução:**
1. **Settings** → **Triggers**
2. Verifique se **"Auto Deploy"** está ativado
3. Branch correta está configurada (main/master)

### Erro 404 em rotas

**Solução:** O Railway deve servir `index.html` para todas as rotas

Adicione ao seu `package.json`:
```json
{
  "scripts": {
    "preview": "vite preview --port ${PORT:-3000} --host 0.0.0.0"
  }
}
```

## Recursos do Railway

### ✅ Plano Gratuito (Trial)
- **$5 de crédito grátis/mês**
- **500 horas de execução**
- Builds ilimitados
- Deploy automático
- Domínio .railway.app

### 💰 Plano Hobby ($5/mês)
- **$5 de crédito incluído**
- Uso adicional cobrado conforme uso
- Domínios personalizados
- Mais recursos

### 🚀 Features Incluídas
- HTTPS automático
- Deploy automático (CI/CD)
- Environment variables
- Logs em tempo real
- Rollback fácil
- Preview environments

## Monitoramento

### Ver Logs em Tempo Real

**Via Dashboard:**
1. Selecione seu projeto
2. Vá na aba **"Logs"**
3. Ver logs em tempo real

**Via CLI:**
```bash
railway logs --follow
```

### Métricas

1. Vá em **"Metrics"**
2. Visualize:
   - CPU usage
   - Memory usage
   - Network I/O
   - Request count

### Health Checks

Railway faz health checks automaticamente:
- Pinga sua aplicação a cada 60 segundos
- Reinicia se não responder

## Rollback

Se algo der errado:

### Via Dashboard
1. Vá em **"Deployments"**
2. Encontre um deployment anterior
3. Clique nos 3 pontos **"..."**
4. Clique em **"Redeploy"**

### Via CLI
```bash
railway rollback
```

## Comandos Úteis da CLI

```bash
# Ver projeto atual
railway status

# Ver logs
railway logs

# Ver logs em tempo real
railway logs --follow

# Abrir dashboard no navegador
railway open

# Ver variáveis de ambiente
railway variables

# Adicionar variável
railway variables set VITE_API_URL=https://api.com

# Conectar a outro projeto
railway link

# Ver deployments
railway list

# Shell no container
railway shell

# Executar comando no container
railway run <comando>
```

## Continuous Deployment (CD)

### Deploy Automático

Após configurar, cada `git push` para a branch configurada fará deploy automático!

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

O Railway detectará e fará deploy automaticamente.

### Configurar Branch

1. **Settings** → **Triggers**
2. Configure a branch (main/master)
3. Ative **"Auto Deploy"**

### Preview Environments

Para cada PR, você pode configurar ambientes de preview:

1. **Settings** → **Environments**
2. Clique em **"New Environment"**
3. Configure para PR branches

## Performance

### Otimizações

**1. Cache de Build:**
O Railway faz cache automaticamente de `node_modules`

**2. Regional Deployment:**
- O Railway usa regiões globais
- Escolha a região mais próxima dos usuários

**3. Resource Limits:**
Configure conforme necessidade:
- **Settings** → **Resources**
- Ajuste CPU e Memory

### Hibernation (Plano Grátis)

⚠️ No plano grátis, projetos inativos podem "dormir" após 5 minutos:
- Primeiro request após hibernação é mais lento (~10s)
- Upgrading para plano pago remove hibernação

## Escaling (Horizontal)

Para escalar horizontalmente:

1. **Settings** → **Scaling**
2. Aumente o número de instâncias
3. Railway fará load balancing automático

```
Nota: Escaling horizontal requer plano pago
```

## Database (Opcional)

Se precisar de banco de dados:

1. No projeto, clique em **"New"** → **"Database"**
2. Escolha (PostgreSQL, MySQL, MongoDB, Redis)
3. Railway conectará automaticamente
4. Variáveis de ambiente são adicionadas automaticamente

## Segurança

### Private Networking

Para comunicação entre serviços:

1. **Settings** → **Networking**
2. Use **Private Network** URLs
3. Não expõe publicamente

### Secrets Management

Use variáveis de ambiente para secrets:

```bash
railway variables set API_KEY=seu-secret-aqui
```

## Custos

### Plano Trial (Grátis)
- $5 de crédito/mês
- ~500 horas de execução
- Ideal para testes e projetos pequenos

### Plano Hobby ($5/mês)
- $5 de crédito incluído
- Pay-as-you-go após crédito
- ~$0.000463/GB-s de RAM
- ~$0.000231/vCPU-s

### Estimativa para FGS
Uso típico: **~$3-7/mês**
- 512MB RAM
- 0.5 vCPU
- 24/7 uptime

## Webhooks

Configure webhooks para integração CI/CD:

1. **Settings** → **Webhooks**
2. Adicione URL do seu serviço
3. Eventos: deploy, build, etc.

## Suporte

- **Documentação**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **GitHub**: https://github.com/railwayapp
- **Status**: https://railway-status.com

## Comparação: Railway vs Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Preço Grátis** | $5 crédito/mês | 100GB bandwidth |
| **Backend** | ✅ Sim | ❌ Serverless apenas |
| **Database** | ✅ Incluído | ❌ Externo |
| **Docker** | ✅ Sim | ❌ Não |
| **Build Time** | Mais lento | Mais rápido |
| **CDN** | Basic | Global |

**Para FGS (frontend apenas):** Ambos funcionam bem!

## Checklist Final

Antes de fazer deploy, verifique:

- [ ] Código commitado no Git
- [ ] `npm run build` funciona localmente
- [ ] `npm run preview` mostra o site correto
- [ ] Arquivos `railway.json` e `nixpacks.toml` presentes
- [ ] Variáveis de ambiente configuradas
- [ ] Porta configurada para usar `$PORT`
- [ ] README atualizado com URL de produção

## Script de Deploy Rápido

Crie um arquivo `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy no Railway..."

# Build local
echo "📦 Building..."
npm run build

# Commit
echo "📝 Committing..."
git add .
git commit -m "Deploy: $(date)"

# Push
echo "🔄 Pushing to repository..."
git push origin main

echo "✅ Deploy iniciado! Verifique o Railway dashboard."
```

Execute:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

**Anterior:** [Deploy na Vercel](./DEPLOY_VERCEL.md)

**Última atualização:** Novembro 2025

