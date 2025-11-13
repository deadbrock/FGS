# 🔧 Como Criar o Arquivo .env

## 📋 Passo a Passo

### **1. Copiar o arquivo exemplo**

```powershell
# No PowerShell, execute:
cd C:\Users\user\Documents\FGS\FGS
copy env.example .env
```

---

### **2. Editar o arquivo .env**

```powershell
# Abrir com Notepad
notepad .env

# OU com VSCode/Cursor
code .env
```

---

### **3. Preencher a DATABASE_URL**

#### **Obter a URL do Railway:**

1. Acesse: https://railway.app/
2. Projeto **FGS**
3. Service **PostgreSQL**
4. Aba **"Variables"**
5. Copie o valor de **`DATABASE_URL`**

#### **Exemplo de DATABASE_URL:**
```
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
```

**IMPORTANTE:**
- ✅ Use a URL **PÚBLICA** (com `hopper.proxy.rlwy.net`)
- ❌ NÃO use a URL interna (com `postgres.railway.internal`)
- ✅ Cole a URL **sem espaços antes ou depois**

---

### **4. Salvar o arquivo**

No Notepad/VSCode:
- `Ctrl + S` para salvar
- Fechar o editor

---

### **5. Verificar se o .env foi criado**

```powershell
# Listar arquivos (incluindo ocultos)
Get-ChildItem -Force | Where-Object {$_.Name -eq ".env"}

# Se aparecer algo como:
# Mode  LastWriteTime  Length Name
# ----  -------------  ------ ----
# -a--- 13/11/2025     XXX    .env
# ✅ ARQUIVO CRIADO COM SUCESSO!
```

---

### **6. Executar o setup do banco**

```powershell
node database/setup-production-db.js
```

Se aparecer:
```
🚀 Configurando Banco de Dados de Produção...
📡 Testando conexão com o banco...
✅ Conectado com sucesso!
```

**✅ DEU CERTO!**

---

## 🚨 Problemas Comuns

### **Erro: "DATABASE_URL não encontrada"**

**Causa:** O arquivo `.env` não foi criado ou está vazio

**Solução:**
```powershell
# Verificar se o arquivo existe
Get-Content .env

# Se não mostrar nada ou der erro, crie novamente:
copy env.example .env
notepad .env
```

---

### **Erro: "password authentication failed"**

**Causa:** A senha na `DATABASE_URL` está errada ou desatualizada

**Solução:**
1. Vá no Railway Dashboard
2. PostgreSQL → Variables
3. Copie a `DATABASE_URL` **mais recente**
4. Cole no `.env`

---

### **Erro: "database railway does not exist" (com espaço extra)**

**Causa:** Há espaços extras na `DATABASE_URL`

**Solução:**
```powershell
# Abrir o .env
notepad .env

# Remover TODOS os espaços antes e depois da URL
# Salvar e tentar novamente
```

---

## ✅ Arquivo .env Correto

Seu `.env` deve ficar assim:

```
DATABASE_URL=postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway
PORT=3333
NODE_ENV=production
VITE_API_URL=https://fgs-production.up.railway.app
JWT_SECRET=supersecretjwtkey_mude_isso_por_favor_12345
FRONTEND_URL=https://fgs-huwl.vercel.app
CORS_ORIGIN=https://fgs-huwl.vercel.app
```

**Substituindo:**
- `iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj` → Sua senha real
- `hopper.proxy.rlwy.net:26190` → Seu host e porta reais

---

## 📝 Comandos Resumidos

```powershell
# 1. Ir para a pasta do projeto
cd C:\Users\user\Documents\FGS\FGS

# 2. Copiar exemplo
copy env.example .env

# 3. Editar
notepad .env

# 4. Colar a DATABASE_URL do Railway
# (copie do Railway Dashboard → PostgreSQL → Variables)

# 5. Salvar (Ctrl+S) e fechar

# 6. Executar setup
node database/setup-production-db.js

# 7. Executar seed
node database/run-seed.js
```

---

**Pronto! Agora execute esses comandos!** 🚀

