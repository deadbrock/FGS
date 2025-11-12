# 🔧 Como Corrigir o Erro de UUID

## Problema
O erro `invalid input syntax for type uuid: "1"` ocorre porque a tabela `users` foi criada com IDs numéricos em vez de UUIDs.

## Solução

### Opção 1: Via Railway CLI (Recomendado)

1. **Instale o Railway CLI** (se ainda não tiver):
```bash
npm install -g @railway/cli
```

2. **Faça login no Railway:**
```bash
railway login
```

3. **Conecte ao projeto:**
```bash
cd C:\Users\user\Documents\FGS\FGS
railway link
```

4. **Execute o script de correção:**
```bash
railway run node database/recreate-users.js
```

5. **Reinicie o backend no Railway:**
   - Vá no Railway Dashboard
   - Clique no serviço do backend
   - Clique em "Restart"

6. **Faça login novamente no sistema:**
   - Email: `admin@fgs.com`
   - Senha: `admin123`

---

### Opção 2: Via Railway Dashboard (Manual)

1. **Acesse o Railway Dashboard**
2. Clique no seu projeto **FGS**
3. Clique no **banco de dados PostgreSQL**
4. Vá na aba **Query**
5. Cole e execute o SQL de `database/recreate-users.sql`
6. **Reinicie o backend**
7. Faça login com `admin@fgs.com` / `admin123`

---

### Opção 3: Localmente (Testando)

```bash
# No diretório do projeto
cd C:\Users\user\Documents\FGS\FGS

# Execute o script
node database/recreate-users.js
```

---

## ⚠️ IMPORTANTE

- **Todos os usuários serão deletados**
- Você precisará **fazer login novamente**
- O sistema criará automaticamente o usuário admin

## 📝 Após a correção

Teste atualizar o perfil:
1. Acesse **Configurações** → **Perfil**
2. Altere o nome
3. Clique em **Salvar**
4. Recarregue a página (F5)
5. ✅ As alterações devem persistir!

