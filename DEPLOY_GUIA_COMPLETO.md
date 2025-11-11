# 🚀 Guia Completo de Deploy - FGS Sistema de RH

## Visão Geral

Este guia cobre o processo completo de deploy do sistema FGS para produção, incluindo preparação, configuração e deploy nas plataformas **Vercel** e **Railway**.

## Arquitetura Atual

```
FGS Sistema de RH (Frontend)
├── React 18 + TypeScript
├── Vite (Build Tool)
├── Material-UI (UI Framework)
├── React Router (Navegação)
└── Mock Services (Dados temporários)
```

**Nota:** Atualmente o sistema usa serviços mock. Para produção real, você precisará integrar com um backend.

## Escolhendo a Plataforma

### Vercel ⚡
**Melhor para:**
- Deploy mais rápido
- CDN global otimizado
- Projetos frontend/JAMstack
- Preview deployments automáticos

**Prós:**
- ✅ Build muito rápido (2-3 min)
- ✅ CDN global
- ✅ 100GB bandwidth grátis
- ✅ Interface simples

**Contras:**
- ❌ Sem suporte para backend tradicional
- ❌ Serverless apenas

### Railway 🚂
**Melhor para:**
- Projetos fullstack
- Quando precisar de banco de dados
- Maior controle sobre infra
- Deploy de containers Docker

**Prós:**
- ✅ Suporte completo a backend
- ✅ Database incluído
- ✅ Docker support
- ✅ SSH/Shell access

**Contras:**
- ❌ Build mais lento (5-7 min)
- ❌ Plano grátis limitado ($5 crédito)
- ❌ CDN básico

## Preparação Geral

### 1. Verificar Projeto Localmente

```bash
cd C:\Users\user\Documents\FGS\FGS

# Instalar dependências
npm install

# Build de produção
npm run build

# Testar build localmente
npm run preview
```

Acesse `http://localhost:3000` e teste todas as funcionalidades.

### 2. Configurar Git

Se ainda não tiver um repositório Git configurado:

```bash
# Inicializar Git
git init

# Adicionar remote (GitHub example)
git remote add origin https://github.com/seu-usuario/fgs-sistema.git

# Primeiro commit
git add .
git commit -m "Initial commit - Sistema FGS completo"

# Push para repositório
git push -u origin main
```

### 3. Arquivos de Configuração

Verifique que os seguintes arquivos existem:

#### ✅ vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### ✅ railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### ✅ nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run preview -- --host 0.0.0.0 --port ${PORT:-3000}"
```

#### ✅ .gitignore
Verifique se inclui:
```
node_modules
dist
*.local
.env
.env.local
```

### 4. Otimizações de Build

#### Reduzir Tamanho do Bundle

Adicione ao `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui': ['@mui/material', '@mui/icons-material'],
          'router': ['react-router-dom'],
        }
      }
    }
  }
})
```

#### Lazy Loading de Rotas

```typescript
// src/routes/index.tsx
const Prontuario = lazy(() => import('../pages/Prontuario'));
const Beneficios = lazy(() => import('../pages/Beneficios'));
// ...
```

## Deploy Passo a Passo

### Opção A: Deploy na Vercel

📖 **[Guia Completo de Deploy na Vercel](./DEPLOY_VERCEL.md)**

**Resumo rápido:**

1. **Login:** [vercel.com](https://vercel.com/)
2. **Import Repository:** Conecte seu repo GitHub
3. **Configure:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy:** Clique em Deploy
5. **Acesse:** `https://seu-projeto.vercel.app`

⏱️ **Tempo estimado:** 5-10 minutos

### Opção B: Deploy no Railway

📖 **[Guia Completo de Deploy no Railway](./DEPLOY_RAILWAY.md)**

**Resumo rápido:**

1. **Login:** [railway.app](https://railway.app/)
2. **New Project:** Deploy from GitHub
3. **Select Repository:** Selecione o FGS
4. **Auto Deploy:** Railway detecta e faz build
5. **Generate Domain:** Crie domínio público
6. **Acesse:** `https://seu-projeto.up.railway.app`

⏱️ **Tempo estimado:** 10-15 minutos

## Pós-Deploy

### 1. Testar em Produção

Teste todas as funcionalidades principais:

- [ ] Login com diferentes usuários
- [ ] Navegação entre módulos
- [ ] Prontuário - ver e editar
- [ ] Benefícios - CRUD completo
- [ ] Treinamentos - agendamento
- [ ] Regionais - visualização e filtros
- [ ] Segurança - logs de alterações
- [ ] Configurações - alterar foto e dados
- [ ] Tema escuro/claro
- [ ] Responsividade (mobile, tablet, desktop)

### 2. Configurar Domínio Personalizado (Opcional)

#### Vercel
1. Settings → Domains
2. Add Domain
3. Configure DNS (CNAME)

#### Railway
1. Settings → Networking
2. Custom Domains
3. Configure DNS (CNAME)

**Exemplo DNS:**
```
Type: CNAME
Name: fgs (ou app, sistema, etc)
Value: cname.vercel-dns.com (Vercel)
       seu-projeto.up.railway.app (Railway)
```

### 3. Configurar Analytics (Opcional)

#### Google Analytics

Adicione ao `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

### 4. Monitoramento de Erros

#### Sentry (Recomendado)

```bash
npm install @sentry/react @sentry/tracing
```

Configure em `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/project-id",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Integração com Backend (Futuro)

Quando implementar um backend, você precisará:

### 1. Configurar Variáveis de Ambiente

**Vercel / Railway:**
```
VITE_API_URL=https://sua-api.com
VITE_API_KEY=sua-chave-aqui
```

### 2. Atualizar Serviços

Substituir serviços mock por chamadas reais:

```typescript
// Antes (Mock)
import authService from '../services/authService.mock';

// Depois (Real)
import authService from '../services/authService';
```

### 3. Configurar CORS

No backend, permita o domínio do frontend:

```javascript
// Express example
app.use(cors({
  origin: 'https://seu-app.vercel.app'
}));
```

### 4. Opções de Backend

**Railway:**
- Deploy backend no mesmo projeto
- Usa Private Networking

**Vercel:**
- API Routes (Serverless)
- Backend separado (Heroku, Railway, AWS)

## Troubleshooting Geral

### Build Fails

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Routes 404

Causa: SPA routing não configurado

Solução: Verificar `vercel.json` (Vercel) ou servidor serve index.html

### Imagens Não Carregam

Causa: Caminho incorreto

Solução: Use caminhos relativos ou absolutos corretos:
```typescript
// Correto
<img src="/logo-fgs.png" />

// Ou
import logo from './assets/logo.png';
<img src={logo} />
```

### Performance Issues

1. Ative code splitting
2. Use lazy loading
3. Otimize imagens
4. Enable caching

### Memory Issues (Railway)

Aumente recursos:
- Settings → Resources
- Increase Memory Limit

## Security Checklist

- [ ] Remover console.logs de produção
- [ ] Não commitar .env com secrets
- [ ] Usar HTTPS (automático)
- [ ] Configurar CSP headers
- [ ] Validar inputs no frontend
- [ ] Rate limiting (quando backend)
- [ ] Implementar autenticação real

## Performance Checklist

- [ ] Code splitting configurado
- [ ] Lazy loading de rotas
- [ ] Imagens otimizadas
- [ ] Fonts otimizadas
- [ ] Cache headers configurados
- [ ] Gzip/Brotli compression
- [ ] CDN configurado

## Backup e Rollback

### Vercel
```bash
# Ver deployments
vercel ls

# Promover deployment antigo
vercel promote <deployment-url>
```

### Railway
```bash
# Ver deployments
railway list

# Rollback
railway rollback
```

## Custos Estimados

### Vercel (Plano Gratuito)
- **Custo:** $0/mês
- **Limitação:** 100GB bandwidth
- **Ideal para:** Até ~10k visitantes/mês

### Railway (Plano Hobby)
- **Custo:** ~$5-7/mês
- **Inclui:** $5 crédito
- **Ideal para:** Projetos pequenos/médios

### Escalabilidade

Para mais de 50k usuários/mês:
- **Vercel Pro:** $20/mês
- **Railway:** Pay-as-you-go (~$15-30/mês)
- **AWS/Azure:** Considerar para grandes scales

## Automação

### GitHub Actions (CI/CD)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm test # Se tiver testes
```

## Documentação Relacionada

- 📘 [Deploy na Vercel](./DEPLOY_VERCEL.md) - Guia detalhado Vercel
- 📙 [Deploy no Railway](./DEPLOY_RAILWAY.md) - Guia detalhado Railway
- 📗 [README Principal](./README.md) - Documentação do projeto

## Suporte e Comunidade

### Vercel
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### FGS Sistema
- Repositório: [GitHub]
- Documentação: Neste diretório

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para Deploy

