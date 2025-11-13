# 🗄️ Database - FGS Sistema de RH

## 📋 Arquivos

### **schema-complete.sql**
Schema completo do banco de dados PostgreSQL com:
- ✅ 23 tabelas
- ✅ 80+ índices
- ✅ 16 triggers (update_at automático)
- ✅ Relacionamentos (foreign keys)
- ✅ Constraints e validações

### **seed-initial-data.sql**
Dados iniciais para o sistema funcionar:
- 8 tipos de benefícios (VT, VR, Plano de Saúde, etc.)
- 6 configurações de jornada (padrão, escala 12x36, turnos)
- 8 treinamentos obrigatórios (NRs)
- 10 EPIs comuns

---

## 🚀 Como Executar

### **1. Criar Schema Completo**

```bash
# Certifique-se que o .env está configurado com DATABASE_URL
node database/setup-production-db.js
```

**O que faz:**
- Conecta no PostgreSQL (Railway)
- Cria todas as 23 tabelas
- Cria índices e triggers
- Valida a criação

---

### **2. Inserir Dados Iniciais (Seed)**

```bash
node database/run-seed.js
```

**O que faz:**
- Insere tipos de benefícios
- Insere jornadas padrão
- Insere treinamentos NR
- Insere EPIs comuns

---

### **3. Executar Tudo de Uma Vez**

```bash
# Criar schema + seed
node database/setup-production-db.js && node database/run-seed.js
```

---

## 📊 Estrutura do Banco

### **1. Usuários e Autenticação**
- `users` - Usuários do sistema (admin, RH, gestor, colaborador)

### **2. Colaboradores**
- `colaboradores` - Dados pessoais e contratuais
- `dependentes` - Dependentes dos colaboradores
- `documentos` - Documentos digitalizados

### **3. Benefícios**
- `beneficios_tipos` - Tipos de benefícios (VT, VR, Saúde, etc.)
- `colaboradores_beneficios` - Benefícios vinculados aos colaboradores

### **4. Treinamentos**
- `treinamentos` - Cursos e treinamentos disponíveis
- `treinamentos_turmas` - Turmas de treinamentos
- `colaboradores_treinamentos` - Treinamentos realizados

### **5. Ponto Eletrônico**
- `ponto_configuracoes` - Configurações de jornada
- `ponto_registros` - Registros de ponto diário

### **6. Férias**
- `ferias` - Solicitações e períodos de férias

### **7. Atestados e Saúde**
- `atestados` - Atestados médicos
- `asos` - ASO (Atestado de Saúde Ocupacional)

### **8. Segurança do Trabalho**
- `epis` - Equipamentos de Proteção Individual
- `colaboradores_epis` - EPIs entregues aos colaboradores
- `acidentes_trabalho` - Registro de acidentes

### **9. eSocial**
- `esocial_eventos` - Log de envios ao eSocial

### **10. Sistema**
- `notificacoes` - Notificações para usuários
- `logs_auditoria` - Log de ações no sistema

---

## 🔍 Consultas Úteis

### **Ver todas as tabelas:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### **Contar registros por tabela:**
```sql
SELECT 
  schemaname,
  relname AS table_name,
  n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### **Ver índices de uma tabela:**
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'colaboradores';
```

### **Ver foreign keys:**
```sql
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

---

## ⚠️ ATENÇÃO

### **Não execute em produção se já tiver dados!**

Os scripts de schema usam `CREATE TABLE IF NOT EXISTS`, mas:
- ❌ Não fazem migration de dados existentes
- ❌ Podem causar conflitos com tabelas existentes

### **Para ambientes com dados:**
1. Faça backup do banco
2. Revise os scripts antes de executar
3. Execute migration scripts específicos (se disponíveis)

---

## 🔧 Troubleshooting

### **Erro: "DATABASE_URL não encontrada"**
```bash
# Crie o arquivo .env na raiz do projeto
DATABASE_URL=postgresql://usuario:senha@host:porta/database
```

### **Erro: "permission denied"**
- Verifique se o usuário do banco tem permissões para criar tabelas
- No Railway, o usuário `postgres` tem permissões completas

### **Erro: "relation already exists"**
- A tabela já existe no banco
- Use `DROP TABLE nome_tabela CASCADE;` para remover (CUIDADO!)
- Ou remova as linhas `CREATE TABLE` do SQL

---

## 📚 Referências

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Railway Docs: https://docs.railway.app/
- eSocial Layout: https://www.gov.br/esocial

---

## ✅ Checklist de Setup

- [ ] DATABASE_URL configurada no .env
- [ ] Schema criado (`node database/setup-production-db.js`)
- [ ] Seed executado (`node database/run-seed.js`)
- [ ] Usuário admin criado (executar `backend/server.js`)
- [ ] Backend conectado ao banco
- [ ] Frontend fazendo requisições com sucesso

---

**Pronto! Banco de dados configurado e pronto para uso!** 🎉

