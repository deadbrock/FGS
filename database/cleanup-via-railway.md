# Como Limpar Usuários Mock via Railway

## 🚀 Método 1: Via Railway CLI (Recomendado)

### 1. Conectar ao PostgreSQL do Railway:
```bash
railway connect Postgres
```

### 2. Listar usuários atuais:
```sql
SELECT id, nome, email, role, created_at FROM users ORDER BY created_at;
```

### 3. Deletar usuários mock:
```sql
DELETE FROM users WHERE email IN ('admin@fgs.com', 'rh@fgs.com', 'gestor@fgs.com');
```

### 4. Verificar usuários restantes:
```sql
SELECT id, nome, email, role FROM users;
```

---

## 🌐 Método 2: Via Railway Dashboard

### 1. Acesse:
- https://railway.app/
- Seu projeto FGS
- Service PostgreSQL
- Aba **"Data"**

### 2. Execute no Query Editor:
```sql
-- Listar usuários atuais
SELECT id, nome, email, role, created_at 
FROM users 
ORDER BY created_at;

-- Deletar usuários mock
DELETE FROM users 
WHERE email IN ('admin@fgs.com', 'rh@fgs.com', 'gestor@fgs.com');

-- Verificar resultado
SELECT id, nome, email, role 
FROM users;
```

---

## 💻 Método 3: Via Script Local (se .env estiver correto)

### 1. Verifique o arquivo `.env`:
```
DATABASE_URL=postgresql://postgres:SENHA@HOST:PORTA/railway
```

**IMPORTANTE:** 
- Sem espaços extras
- Senha entre a URL (depois de `postgres:` e antes de `@`)
- Use a URL PÚBLICA do Railway (não a interna)

### 2. Execute:
```bash
node database/cleanup-mock-users.js --confirm
```

---

## 🔍 Como obter a DATABASE_URL correta:

### Via Railway Dashboard:
1. Railway → Projeto FGS → PostgreSQL
2. Aba **"Variables"**
3. Copie o valor de `DATABASE_URL`
4. Cole no seu `.env` local

### Formato esperado:
```
DATABASE_URL=postgresql://postgres:SuaSenhaAqui@proxy.railway.com:12345/railway
```

---

## ✅ Resultado esperado:

Após deletar, você deve ver apenas os usuários que você criou via módulo Usuários, sem os mocks:
- ~~admin@fgs.com~~ (deletado)
- ~~rh@fgs.com~~ (deletado)
- ~~gestor@fgs.com~~ (deletado)
- ✅ seu-email@real.com (mantido)

