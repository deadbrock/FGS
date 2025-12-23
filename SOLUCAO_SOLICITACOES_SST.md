# 🔧 Solução: Solicitações SST não carregando

## 🎯 Problema Identificado

A página de **Solicitações ASO** está exibindo **"rota não encontrada"** quando a usuária CRISTIANE BARRETO tenta acessar.

### Logs do Console:
```
Erro ao buscar solicitações: ve
Erro ao buscar clínicas: ve
```

## 🔍 Diagnóstico

### Arquitetura Atual:
- 🚂 **Backend**: Railway (`https://fgs-production.up.railway.app`)
- 🗄️ **Banco de Dados**: PostgreSQL no Railway
- 🌐 **Frontend**: Vercel
- 🔗 **API URL configurada**: `VITE_API_URL=https://fgs-production.up.railway.app`

### Causa Raiz:
O backend no Railway provavelmente **não tem as tabelas SST criadas** no banco de dados, ou as rotas não estão sendo registradas corretamente.

## ✅ Solução - Passo a Passo

### 1️⃣ Verificar Backend no Railway

Acesse o Railway CLI ou a interface web:

```bash
# Verificar logs do backend
railway logs

# Ou acesse: https://railway.app → Seu Projeto → Logs
```

**Procure por:**
- ✅ `Rotas registradas: Solicitações SST`
- ✅ `GET /api/solicitacoes/`
- ❌ Erros de conexão com banco
- ❌ Erros ao registrar rotas

### 2️⃣ Criar Tabelas SST no Railway

As tabelas precisam ser criadas no banco de dados do Railway. Use um dos métodos:

#### Opção A: Via Railway CLI (Recomendado)

```bash
# Conectar ao banco do Railway
railway connect postgres

# Depois execute o SQL
\i database/migrations/create-sst-tables.sql
```

#### Opção B: Via Script Node.js

```bash
# No seu projeto local
DATABASE_URL=sua_url_railway_aqui node scripts/check-sst-tables.js
```

#### Opção C: Via Interface Web do Railway

1. Acesse Railway → PostgreSQL → Query
2. Cole e execute o conteúdo de `database/migrations/create-sst-tables.sql`

### 3️⃣ Verificar se as Rotas estão Registradas

O arquivo `backend/server.js` deve ter:

```javascript
import solicitacoesRoutes from './routes/solicitacoesRoutes.js';
// ...
app.use('/api/solicitacoes', solicitacoesRoutes);
```

✅ **Isso já está implementado no código!**

### 4️⃣ Fazer Deploy do Backend no Railway

Se você fez alterações locais, faça deploy:

```bash
# Commit suas mudanças
git add .
git commit -m "fix: adicionar rotas e tabelas SST"

# Push para o Railway (se configurado com Git)
git push

# Ou use o Railway CLI
railway up
```

### 5️⃣ Testar as Rotas

Após o deploy, teste as rotas diretamente:

```bash
# Testar health check
curl https://fgs-production.up.railway.app/health

# Testar rota de solicitações (precisa de autenticação)
curl https://fgs-production.up.railway.app/api/solicitacoes/
```

## 📋 Script SQL para Criar Tabelas

Execute este SQL no banco do Railway:

```sql
-- Tabela de Clínicas
CREATE TABLE IF NOT EXISTS sst_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  razao_social VARCHAR(255),
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  endereco JSONB NOT NULL,
  responsavel_nome VARCHAR(255),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  especialidades JSONB DEFAULT '[]'::jsonb,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Solicitações de Exames
CREATE TABLE IF NOT EXISTS sst_solicitacoes_exames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_exame VARCHAR(50) NOT NULL CHECK (tipo_exame IN ('ASO_ADMISSIONAL', 'PERIODICO', 'RETORNO_TRABALHO', 'MUDANCA_RISCO', 'DEMISSIONAL')),
  colaborador_id UUID,
  colaborador_nome VARCHAR(255) NOT NULL,
  colaborador_cpf VARCHAR(14) NOT NULL,
  colaborador_email VARCHAR(255),
  colaborador_telefone VARCHAR(20),
  cargo VARCHAR(255) NOT NULL,
  cargo_anterior VARCHAR(255),
  departamento VARCHAR(255) NOT NULL,
  setor VARCHAR(255) NOT NULL,
  admissao_id UUID,
  motivo_afastamento TEXT,
  data_afastamento DATE,
  data_desligamento DATE,
  motivo_desligamento TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  solicitado_por UUID NOT NULL,
  observacoes TEXT,
  clinica_id UUID,
  data_agendamento DATE,
  hora_agendamento TIME,
  status_agendamento VARCHAR(50),
  resultado VARCHAR(50),
  restricoes TEXT,
  data_realizacao DATE,
  medico_responsavel VARCHAR(255),
  crm_medico VARCHAR(20),
  aso_arquivo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitado_por) REFERENCES users(id),
  FOREIGN KEY (clinica_id) REFERENCES sst_clinicas(id),
  FOREIGN KEY (admissao_id) REFERENCES admissoes(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_tipo_exame ON sst_solicitacoes_exames(tipo_exame);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_status ON sst_solicitacoes_exames(status);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_colaborador_cpf ON sst_solicitacoes_exames(colaborador_cpf);
```

## 🧪 Verificação Final

Depois de aplicar a solução, verifique:

1. ✅ Acesse o Vercel: https://fgs-huwl.vercel.app
2. ✅ Faça login com: `segurancafg@fgservices.com.br`
3. ✅ Navegue para: **Solicitações → ASO Admissional**
4. ✅ Deve carregar a página sem erro de "rota não encontrada"

## 📞 Comandos Úteis

```bash
# Ver logs do Railway
railway logs --tail

# Conectar ao banco do Railway
railway connect postgres

# Verificar variáveis de ambiente
railway variables

# Fazer deploy
railway up
```

## 🎯 Resumo da Solução

1. **Criar tabelas SST** no banco PostgreSQL do Railway
2. **Verificar se o backend** está registrando as rotas corretamente
3. **Testar as rotas** no Railway
4. **Limpar cache do Vercel** se necessário

## 📝 Notas Importantes

- As tabelas já existem no código (`database/migrations/create-sst-tables.sql`)
- As rotas já estão implementadas (`backend/routes/solicitacoesRoutes.js`)
- O frontend já está configurado corretamente (`src/services/solicitacoesService.ts`)
- **Só falta criar as tabelas no banco de produção (Railway)**

---

**Última atualização:** 23/12/2025  
**Status:** ✅ Solução identificada - Aguardando aplicação no Railway

