# 🚀 Deploy na Vercel - FGS Sistema de RH

## Pré-requisitos

- Conta na [Vercel](https://vercel.com/)
- Código em um repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente (para testes)

## Método 1: Deploy via Vercel Dashboard (Recomendado)

### Passo 1: Preparar o Repositório

1. **Commit e push do código** para seu repositório Git:

```bash
cd C:\Users\user\Documents\FGS\FGS
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### Passo 2: Conectar com Vercel

1. Acesse [vercel.com](https://vercel.com/)
2. Faça login ou crie uma conta
3. Clique em **"Add New..."** → **"Project"**
4. Selecione seu repositório Git
5. Clique em **"Import"**

### Passo 3: Configurar o Projeto

A Vercel detectará automaticamente que é um projeto Vite React. Configure:

#### Framework Preset
- **Framework**: Vite
- **Root Directory**: `./` (deixe vazio se o projeto está na raiz)

#### Build Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Environment Variables (Opcional)
Adicione se necessário:
```
VITE_ENV=production
VITE_APP_NAME=FGS - Formando Gente de Sucesso
```

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. 🎉 Seu site estará no ar!

### Passo 5: Acessar o Site

A Vercel fornecerá uma URL como:
```
https://fgs-rh-system.vercel.app
```

## Método 2: Deploy via CLI

### Instalar Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
cd C:\Users\user\Documents\FGS\FGS
vercel
```

Siga as instruções:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Selecione sua conta
3. **Link to existing project?** → No
4. **Project name?** → fgs-rh-system
5. **Directory?** → ./
6. **Override settings?** → No

### Deploy para Produção

```bash
vercel --prod
```

## Configurações Adicionais

### Custom Domain (Domínio Próprio)

1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `fgs.seudominio.com`)
3. Configure os DNS conforme instruções

**Exemplo de configuração DNS:**
```
Type: CNAME
Name: fgs
Value: cname.vercel-dns.com
```

### Environment Variables

Para adicionar variáveis de ambiente:

1. **Settings** → **Environment Variables**
2. Adicione as variáveis necessárias:

```
VITE_API_URL=https://sua-api.com
VITE_ENV=production
```

3. **Redeploy** o projeto

### Configurar Redirects (Rotas SPA)

O arquivo `vercel.json` já está configurado para redirecionar todas as rotas para `index.html`, necessário para SPAs.

### HTTPS Automático

✅ A Vercel fornece HTTPS automaticamente
✅ Certificado SSL renovado automaticamente

## Build Local (Testar antes do Deploy)

Teste o build localmente antes de fazer deploy:

```bash
# Build
npm run build

# Preview do build
npm run preview
```

Acesse: `http://localhost:3000`

## Troubleshooting

### Erro: "Build failed"

**Solução 1:** Verifique o log de build na Vercel

**Solução 2:** Teste o build localmente:
```bash
npm run build
```

**Solução 3:** Limpe cache e reinstale:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro: "Routes not working" (404 em rotas)

**Causa:** Configuração de SPA incorreta

**Solução:** Verifique se o arquivo `vercel.json` existe e está correto

### Erro: "Module not found"

**Solução:** Verifique se todas as dependências estão em `package.json`:
```bash
npm install
```

### Build muito lento

**Solução:** A Vercel usa cache automaticamente. Primeiro build é mais lento.

## Recursos da Vercel

### ✅ Gratuito para projetos pessoais
- **Builds**: Ilimitados
- **Bandwidth**: 100GB/mês
- **Deploy**: Automático a cada push
- **Previews**: Para cada PR

### 🚀 Features Incluídas
- HTTPS automático
- CDN global
- Deploy automático (CI/CD)
- Preview deployments
- Analytics (básico)
- Edge Functions

## Continuous Deployment (CD)

### Deploy Automático

Após configurar, cada `git push` para a branch `main` fará deploy automático!

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

A Vercel detectará e fará deploy automaticamente.

### Preview Deployments

Para cada Pull Request, a Vercel cria um deploy de preview:
- URL única para testar
- Não afeta produção
- Perfeito para code review

## Monitoramento

### Ver Logs

1. Acesse o painel da Vercel
2. Selecione seu projeto
3. Vá em **Deployments**
4. Clique em um deployment
5. Veja os logs em **Building** e **Runtime Logs**

### Analytics

**Vercel Analytics** (opcional, pago):
- Pageviews
- Unique visitors
- Top pages
- Performance metrics

## Rollback

Se algo der errado:

1. Vá em **Deployments**
2. Encontre um deployment anterior que funcionava
3. Clique nos 3 pontos **"..."**
4. Clique em **"Promote to Production"**

## Comandos Úteis

```bash
# Ver informação do projeto
vercel ls

# Ver logs
vercel logs <deployment-url>

# Remove um deployment
vercel rm <deployment-name>

# Configurar variável de ambiente
vercel env add VITE_API_URL production

# Ver deployments
vercel list
```

## Performance

### Otimizações Automáticas

A Vercel otimiza automaticamente:
- Compressão Gzip/Brotli
- HTTP/2 e HTTP/3
- Cache headers otimizados
- Imagens otimizadas
- Code splitting

### Melhorar Performance

**1. Lazy Loading:**
```typescript
const Prontuario = lazy(() => import('./pages/Prontuario'));
```

**2. Code Splitting:**
Já configurado automaticamente pelo Vite

**3. Cache de Assets:**
Configurado em `vercel.json`

## Segurança

### Headers de Segurança

Adicione ao `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Custos

### Plano Gratuito (Hobby)
- ✅ Projetos pessoais
- ✅ Domínio .vercel.app
- ✅ HTTPS
- ✅ 100GB bandwidth
- ✅ Unlimited deployments

### Plano Pro ($20/mês)
- ✅ Projetos comerciais
- ✅ Mais bandwidth
- ✅ Analytics avançado
- ✅ Suporte prioritário
- ✅ Equipes

## Suporte

- **Documentação**: https://vercel.com/docs
- **Community**: https://github.com/vercel/vercel/discussions
- **Status**: https://vercel-status.com

## Checklist Final

Antes de fazer deploy, verifique:

- [ ] Código commitado no Git
- [ ] `npm run build` funciona localmente
- [ ] `npm run preview` mostra o site correto
- [ ] Arquivo `vercel.json` está presente
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] README atualizado com URL de produção

---

**Próximo passo:** [Deploy no Railway](./DEPLOY_RAILWAY.md)

**Última atualização:** Novembro 2025

