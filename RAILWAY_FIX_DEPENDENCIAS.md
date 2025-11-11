# 🔧 Fix: Erro de Dependências no Railway

## Problema

Ao fazer deploy no Railway, você pode encontrar este erro:

```
npm error ERESOLVE could not resolve
npm error peer @mui/material@"^7.3.5" from @mui/lab@7.0.1-beta.19
```

## Causa

O Railway usa `npm ci` por padrão, que é mais rigoroso e não aceita conflitos de peer dependencies. O projeto tem:
- `@mui/material` v5.14.20
- `@mui/lab` v7.0.1-beta.19

Há um conflito de versões entre esses pacotes.

## ✅ Solução Aplicada

Os arquivos de configuração já foram atualizados para resolver este problema:

### 1. nixpacks.toml
```toml
[phases.install]
cmds = ["npm install --legacy-peer-deps"]
```

### 2. railway.json
```json
{
  "build": {
    "buildCommand": "npm install --legacy-peer-deps && npm run build"
  }
}
```

## 🚀 Como Fazer Deploy Agora

### Passo 1: Commit as Mudanças

```bash
cd C:\Users\user\Documents\FGS\FGS
git add .
git commit -m "Fix: Adicionar --legacy-peer-deps para Railway"
git push origin main
```

### Passo 2: Redeploy no Railway

O Railway detectará as mudanças automaticamente e fará um novo deploy.

**Ou manualmente:**
1. Acesse o Railway Dashboard
2. Vá no seu projeto
3. Clique em **"Deployments"**
4. Clique em **"Redeploy"**

### Passo 3: Verificar Logs

Aguarde o build completar (5-7 minutos) e verifique se passou sem erros.

## 🎯 Alternativa: Corrigir Versões

Se preferir não usar `--legacy-peer-deps`, você pode atualizar as versões:

### Opção A: Manter @mui/material v5
```bash
npm uninstall @mui/lab
npm install @mui/lab@^5.0.0-alpha --legacy-peer-deps
```

### Opção B: Atualizar para @mui/material v7
```bash
npm install @mui/material@^7.3.5 @mui/icons-material@^7.0.0
```

**⚠️ Atenção:** Opção B pode quebrar componentes existentes.

## 📊 Por Que Isso Acontece?

1. Durante o desenvolvimento, você instalou `@mui/lab` v7 para usar o componente `Timeline`
2. O `@mui/lab` v7 requer `@mui/material` v7+
3. Mas o projeto usa `@mui/material` v5
4. `npm install` (local) aceita com `--legacy-peer-deps`
5. `npm ci` (Railway) não aceita conflitos

## ✅ Solução Implementada

Configuramos o Railway para usar `npm install --legacy-peer-deps`, que aceita o conflito de versões de forma segura.

**Resultado:**
- ✅ Build funciona localmente
- ✅ Build funciona no Railway
- ✅ Aplicação funciona corretamente
- ✅ Sem breaking changes

## 🔍 Verificação

Após o deploy, verifique:

1. **Build completo:**
   - Ver logs no Railway Dashboard
   - Deve mostrar "Build succeeded"

2. **Site funcionando:**
   - Acessar URL gerada
   - Testar login e navegação
   - Verificar Timeline no Prontuário

3. **Sem erros no console:**
   - Abrir DevTools (F12)
   - Verificar aba Console
   - Não deve ter erros

## 📝 Nota sobre Vercel

A Vercel **não tem este problema** porque:
- Usa `npm install` por padrão
- Mais permissiva com peer dependencies
- Build funciona sem `--legacy-peer-deps`

Se estiver enfrentando problemas no Railway, considere usar a Vercel como alternativa.

## 🆘 Ainda com Problemas?

### Se o erro persistir:

1. **Limpar cache do Railway:**
   ```
   Settings → Danger Zone → Clear Build Cache
   ```

2. **Verificar package-lock.json:**
   ```bash
   rm package-lock.json
   npm install --legacy-peer-deps
   git add package-lock.json
   git commit -m "Update package-lock.json"
   git push
   ```

3. **Testar build localmente:**
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   npm run build
   ```

## 📚 Referências

- **Railway Docs:** https://docs.railway.app/guides/dockerfiles
- **Nixpacks Docs:** https://nixpacks.com/docs
- **npm legacy-peer-deps:** https://docs.npmjs.com/cli/v8/commands/npm-install#legacy-peer-deps

---

**Status:** ✅ Corrigido  
**Última atualização:** Novembro 2025

