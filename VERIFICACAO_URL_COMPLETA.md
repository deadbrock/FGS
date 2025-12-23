# 🔍 Verificação Completa - URL da API

## Status Atual

❌ Erro 404 persistindo:
```
Erro ao buscar clínicas: Request failed with status code 404
Erro ao buscar solicitações: Request failed with status code 404
```

## Checklist de Verificação

### ✅ 1. Verificar Variável no Vercel

**Passos:**
1. Acesse https://vercel.com/dashboard
2. Projeto **FGS**
3. **Settings** → **Environment Variables**
4. Verifique se `VITE_API_URL` está como:
   ```
   https://fgs-production.up.railway.app/api
   ```
   
**Se ainda estiver sem `/api`:**
- Edite e adicione `/api` no final
- Salve
- Continue para o passo 2

### ✅ 2. Verificar se Redeploy foi Feito

**O redeploy é OBRIGATÓRIO!** A variável só funciona após novo build.

**Como fazer:**
1. Vercel → Seu Projeto → **Deployments**
2. Clique nos **três pontinhos (...)** do último deploy
3. Clique em **"Redeploy"**
4. ✅ Marque a opção **"Use existing Build Cache"** (opcional, mais rápido)
5. Clique em **"Redeploy"**
6. **Aguarde 1-2 minutos** até completar

### ✅ 3. Verificar Console do Navegador

Após o redeploy, **limpe o cache do navegador:**

**Chrome/Edge:**
- `Ctrl + Shift + Delete`
- Marque **"Cached images and files"**
- Clique em **"Clear data"**

Ou simplesmente:
- `Ctrl + F5` (hard refresh)

### ✅ 4. Verificar Network Tab

Abra o DevTools (F12) → Aba **Network**:

**URL que DEVERIA aparecer:**
```
https://fgs-production.up.railway.app/api/solicitacoes/?tipo_exame=ASO_ADMISSIONAL
```

**URL ERRADA (se ainda tiver):**
```
https://fgs-production.up.railway.app/solicitacoes/?tipo_exame=ASO_ADMISSIONAL
```

Se ainda aparecer a URL errada = **precisa fazer redeploy!**

---

## 🔧 Solução Alternativa (Se Vercel não Funcionar)

Se por algum motivo a variável do Vercel não está funcionando, podemos **forçar no código**:

### Opção A: Atualizar todos os services

Verificar e corrigir TODOS os arquivos de serviço que podem ter o mesmo problema:

```bash
# Ver todos os services
ls src/services/*.ts
```

Serviços que podem precisar de correção:
- ✅ `solicitacoesService.ts` 
- ⚠️ `epiService.ts` (verificar)
- ⚠️ `admissaoService.ts` (verificar)
- ⚠️ Outros...

### Opção B: Criar arquivo de configuração central

Criar `src/config/api.ts`:
```typescript
const RAILWAY_API = 'https://fgs-production.up.railway.app/api';
const LOCAL_API = 'http://localhost:3333/api';

export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.includes('/api') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api`)
  : (import.meta.env.DEV ? LOCAL_API : RAILWAY_API);
```

Isso garante que `/api` sempre será incluído.

---

## 🧪 Teste Rápido

**Para confirmar se o problema é cache ou redeploy:**

1. Abra uma **Janela Anônima** do navegador (Ctrl + Shift + N)
2. Acesse https://fgs-huwl.vercel.app
3. Faça login
4. Tente acessar Solicitações SST

**Se funcionar na anônima** = problema de cache  
**Se NÃO funcionar** = falta redeploy ou variável incorreta

---

## 📋 Ordem de Execução

1. ✅ Atualizar variável no Vercel (adicionar `/api`)
2. ✅ Fazer **Redeploy** no Vercel (OBRIGATÓRIO!)
3. ✅ Aguardar build completar (1-2 min)
4. ✅ Limpar cache do navegador (Ctrl + F5)
5. ✅ Testar novamente

---

## 🚨 Se AINDA não funcionar

Me confirme:
1. ✅ Você atualizou a variável `VITE_API_URL` no Vercel?
2. ✅ Você fez o Redeploy?
3. ✅ O build completou sem erros?
4. ✅ Você limpou o cache do navegador?

Se sim para tudo e ainda está 404, vamos fazer uma correção direta no código.


