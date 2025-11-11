# 🗄️ Como Adicionar a Coluna local_trabalho no Banco de Dados

## 📋 Duas Situações Diferentes

### **Situação 1:** Banco de Dados NOVO (sem tabelas criadas)
✅ Use o arquivo `schema.sql` completo

### **Situação 2:** Banco de Dados JÁ EXISTE (com tabelas criadas)
✅ Use o arquivo `migration-add-local-trabalho.sql`

---

## 🆕 Situação 1: Banco Novo (Primeira Vez)

Se você ainda **não criou as tabelas** no PostgreSQL:

### Via Script Node.js:

```bash
cd C:\Users\user\Documents\FGS\FGS
database\run-setup.bat
```

Isso executará o `schema.sql` completo que já inclui a coluna `local_trabalho`.

---

## 🔄 Situação 2: Banco Já Existe (Adicionar Coluna)

Se você **já tem tabelas criadas** e quer apenas adicionar a nova coluna:

### **Opção A: Via Railway CLI (Recomendado)**

```bash
# 1. Instalar Railway CLI (se ainda não tem)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Conectar ao projeto
railway link

# 4. Executar migração
railway run psql -d $DATABASE_URL -f database/migration-add-local-trabalho.sql
```

### **Opção B: Via Script PowerShell**

```powershell
# Definir a DATABASE_URL
$env:DATABASE_URL="sua-url-aqui"

# Executar com psql (precisa ter PostgreSQL instalado)
psql $env:DATABASE_URL -f database/migration-add-local-trabalho.sql
```

### **Opção C: Via Node.js (Sem precisar instalar psql)**

Vou criar um script para você:

```bash
node database/run-migration.js
```

---

## 📝 Opção C Detalhada: Script Node.js

### Método Mais Fácil (Windows):

```cmd
database\run-migration.bat
```

Esse script já tem a `DATABASE_URL` configurada e vai executar tudo automaticamente!

---

## ✅ O Que a Migração Faz

1. **Adiciona a coluna** `local_trabalho VARCHAR(2)`
2. **Cria validação** para aceitar apenas UFs válidas (AC, AL, AP, AM...)
3. **Cria índice** para melhorar performance
4. **Mostra estatísticas** de quantos colaboradores tem/não tem estado

---

## 📊 Verificando Após Executar

Após executar a migração, você verá:

```
✅ Conectado com sucesso!
📄 Lendo arquivo de migração...
🔨 Executando migração...
   - Adicionando coluna local_trabalho
   - Criando constraint de validação
   - Criando índice

✅ Migração executada com sucesso!

📊 Verificando resultado:
   ✅ Coluna local_trabalho criada
   Tipo: character varying
   Nullable: YES
   ✅ Índice criado

📈 Estatísticas:
   Total de colaboradores: 0
   Com local definido: 0
   Sem local definido: 0

🎉 Migração concluída com sucesso!
```

---

## 🔄 Banco Novo vs Banco Existente

### Banco NOVO (sem tabelas):
```bash
database\run-setup.bat
```
✅ Cria tudo do zero (já inclui local_trabalho)

### Banco EXISTENTE (já tem tabelas):
```bash
database\run-migration.bat
```
✅ Apenas adiciona a coluna local_trabalho

---

## ⚠️ Avisos Importantes

### Se aparecer erro "coluna já existe":
- ✅ É normal! Significa que a migração já foi executada antes
- Não precisa fazer nada

### Se aparecer erro de conexão:
- Verifique se a `DATABASE_URL` está correta no arquivo `.env` ou `run-migration.bat`
- Certifique-se de que o Railway está acessível

---

## 🎯 Resumo Rápido

**Para adicionar a coluna agora:**

```cmd
cd C:\Users\user\Documents\FGS\FGS
database\run-migration.bat
```

Pronto! A coluna `local_trabalho` estará disponível na tabela `colaboradores`.

---

## 📚 Arquivos Criados

- ✅ `database/migration-add-local-trabalho.sql` - SQL da migração
- ✅ `database/run-migration.js` - Script Node.js para executar
- ✅ `database/run-migration.bat` - Atalho Windows (mais fácil!)
- ✅ `database/schema.sql` - Atualizado com a nova coluna


