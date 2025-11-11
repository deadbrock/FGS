# 🚀 Deploy Rápido - FGS Sistema de RH

## Início Rápido

### Pré-requisitos
```bash
✅ Node.js 18+ instalado
✅ Git configurado
✅ Código em repositório GitHub/GitLab
```

### Verificação Pré-Deploy
```bash
npm run deploy:check
```

Este comando verifica:
- ✅ Arquivos de configuração
- ✅ Dependências instaladas
- ✅ Build funciona
- ✅ Git configurado
- ✅ TypeScript sem erros

---

## Opção 1: Deploy na Vercel (Recomendado) ⚡

### Via Dashboard (Mais Fácil)

1. **Acesse:** [vercel.com](https://vercel.com/)
2. **Login** com GitHub
3. **Import Repository** → Selecione o FGS
4. **Deploy** (automático)
5. **Pronto!** URL: `https://seu-app.vercel.app`

⏱️ **Tempo:** 5 minutos

### Via CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
npm run deploy:vercel
```

📖 **[Guia Completo Vercel](./DEPLOY_VERCEL.md)**

---

## Opção 2: Deploy no Railway 🚂

### Via Dashboard

1. **Acesse:** [railway.app](https://railway.app/)
2. **Login** com GitHub
3. **New Project** → Deploy from GitHub
4. **Selecione** o repositório FGS
5. **Settings** → Networking → **Generate Domain**
6. **Pronto!** URL: `https://seu-app.up.railway.app`

⏱️ **Tempo:** 10 minutos

### Via CLI

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Init e Deploy
railway init
npm run deploy:railway
```

📖 **[Guia Completo Railway](./DEPLOY_RAILWAY.md)**

---

## Comparação Rápida

| Feature | Vercel | Railway |
|---------|--------|---------|
| **Build Time** | 2-3 min ⚡ | 5-7 min |
| **Plano Grátis** | 100GB bandwidth | $5 crédito |
| **CDN** | Global | Basic |
| **Backend** | Serverless | Full support |
| **Database** | Externo | Incluído |
| **Melhor para** | Frontend SPA | Fullstack |

**Recomendação para FGS:** 
- **Vercel** (frontend apenas) ✅
- **Railway** (quando adicionar backend)

---

## Após o Deploy

### 1. Testar o Site
```bash
✅ Login funciona
✅ Navegação entre módulos
✅ CRUD de dados
✅ Responsividade
✅ Tema escuro/claro
```

### 2. Configurar Domínio (Opcional)
- Vercel: Settings → Domains
- Railway: Settings → Networking → Custom Domains

### 3. Monitorar
- **Logs:** Disponíveis no dashboard
- **Performance:** Analytics da plataforma
- **Erros:** Considere Sentry

---

## Troubleshooting

### Build Falhou
```bash
# Teste localmente
npm run build

# Limpar e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Rotas Retornam 404
✅ Verificar `vercel.json` existe  
✅ Rewrite configurado para SPA

### Site Não Carrega
✅ Verificar logs da plataforma  
✅ Testar URL em navegador anônimo  
✅ Limpar cache do navegador

---

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Local (localhost)
npm run dev:network      # Rede local

# Build e Preview
npm run build            # Build produção
npm run preview          # Testar build local

# Deploy
npm run deploy:check     # Verificar antes de deploy
npm run deploy:vercel    # Deploy Vercel (CLI)
npm run deploy:railway   # Deploy Railway (CLI)

# Qualidade
npm run lint             # Verificar código
npm run build:check      # TypeScript + Build
```

---

## Documentação Completa

📚 **Guias Detalhados:**
- [Deploy Vercel](./DEPLOY_VERCEL.md) - Guia completo Vercel
- [Deploy Railway](./DEPLOY_RAILWAY.md) - Guia completo Railway
- [Guia Completo](./DEPLOY_GUIA_COMPLETO.md) - Tudo sobre deploy

📁 **Arquivos de Configuração:**
- `vercel.json` - Config Vercel
- `railway.json` - Config Railway
- `nixpacks.toml` - Build Railway
- `vite.config.ts` - Config Vite

---

## Próximos Passos

Após deploy bem-sucedido:

1. ✅ **Adicionar Domínio Customizado**
2. ✅ **Configurar Analytics** (Google Analytics, Vercel Analytics)
3. ✅ **Monitoramento de Erros** (Sentry)
4. ✅ **Implementar Backend Real** (substituir mocks)
5. ✅ **Adicionar Database** (Railway PostgreSQL)
6. ✅ **Configurar CI/CD** (GitHub Actions)

---

## Suporte

🐛 **Issues:** Reportar no GitHub  
📖 **Docs:** Ver arquivos DEPLOY_*.md  
💬 **Plataformas:**
- Vercel: [vercel.com/discord](https://vercel.com/discord)
- Railway: [discord.gg/railway](https://discord.gg/railway)

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para Deploy

---

## Checklist Pré-Deploy

Antes de fazer deploy, confirme:

- [ ] `npm run build` funciona sem erros
- [ ] `npm run preview` mostra site correto
- [ ] Código commitado no Git
- [ ] Remote Git configurado (GitHub/GitLab)
- [ ] Arquivos de config presentes (vercel.json, railway.json)
- [ ] Logo FGS adicionada (se aplicável)
- [ ] .env não commitado
- [ ] README atualizado

**Tudo pronto?** Execute:
```bash
npm run deploy:check
```

Se passar, você está pronto para deploy! 🚀

