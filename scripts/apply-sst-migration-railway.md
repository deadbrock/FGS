# 🚂 Aplicar Migration SST no Railway

## Método 1: Via Railway Web Interface (Mais Fácil)

### Passo 1: Acessar o Railway
1. Acesse https://railway.app
2. Faça login
3. Selecione seu projeto FGS
4. Clique no serviço **PostgreSQL**

### Passo 2: Abrir Query Console
1. Clique na aba **"Query"** ou **"Data"**
2. Você verá um console SQL

### Passo 3: Executar o SQL
Cole e execute este SQL:

```sql
-- =============================================
-- CRIAR TABELAS DO MÓDULO SST
-- =============================================

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
  status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'AGENDADO', 'REALIZADO', 'CANCELADO', 'REPROVADO')),
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  solicitado_por UUID NOT NULL,
  observacoes TEXT,
  clinica_id UUID,
  data_agendamento DATE,
  hora_agendamento TIME,
  status_agendamento VARCHAR(50) CHECK (status_agendamento IN ('AGUARDANDO_CONFIRMACAO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU')),
  resultado VARCHAR(50) CHECK (resultado IN ('APTO', 'INAPTO', 'APTO_COM_RESTRICOES')),
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

-- Criar Índices
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_tipo_exame ON sst_solicitacoes_exames(tipo_exame);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_status ON sst_solicitacoes_exames(status);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_colaborador_cpf ON sst_solicitacoes_exames(colaborador_cpf);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_data_solicitacao ON sst_solicitacoes_exames(data_solicitacao);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_clinica_id ON sst_solicitacoes_exames(clinica_id);
CREATE INDEX IF NOT EXISTS idx_sst_clinicas_ativo ON sst_clinicas(ativo);

-- Verificar criação
SELECT 
  'sst_clinicas' as tabela,
  COUNT(*) as registros
FROM sst_clinicas
UNION ALL
SELECT 
  'sst_solicitacoes_exames' as tabela,
  COUNT(*) as registros
FROM sst_solicitacoes_exames;
```

### Passo 4: Verificar
Se o SQL executou sem erros, as tabelas foram criadas! Você deve ver:
```
tabela                      | registros
----------------------------|-----------
sst_clinicas                | 0
sst_solicitacoes_exames     | 0
```

---

## Método 2: Via Railway CLI

### Passo 1: Instalar Railway CLI
```bash
# Windows (via npm)
npm install -g @railway/cli

# Ou baixar em: https://railway.app/cli
```

### Passo 2: Fazer Login
```bash
railway login
```

### Passo 3: Conectar ao Projeto
```bash
cd C:\Users\user\Documents\FGS\FGS
railway link
```

### Passo 4: Conectar ao PostgreSQL
```bash
railway connect postgres
```

### Passo 5: Executar Migration
Dentro do prompt do PostgreSQL:
```sql
\i database/migrations/create-sst-tables.sql
```

Ou executar diretamente:
```bash
railway run psql $DATABASE_URL -f database/migrations/create-sst-tables.sql
```

---

## Método 3: Via Script Node.js

### Passo 1: Criar arquivo de configuração
Crie um arquivo `.env.railway` com:
```
DATABASE_URL=sua_url_do_railway_aqui
```

### Passo 2: Executar script
```bash
# Carregar variáveis do Railway e executar
node -r dotenv/config scripts/check-sst-tables.js dotenv_config_path=.env.railway
```

---

## ✅ Verificação

Após aplicar a migration, teste:

### 1. Via curl:
```bash
curl https://fgs-production.up.railway.app/health
```

### 2. Verificar logs do Railway:
```bash
railway logs --tail
```

Procure por:
```
✅ Rotas registradas:
   📋 Solicitações SST:
      - GET    /api/solicitacoes/
```

### 3. Acessar o frontend:
1. Acesse https://fgs-huwl.vercel.app
2. Login: `segurancafg@fgservices.com.br`
3. Navegue para: **Solicitações → ASO Admissional**
4. ✅ Deve carregar sem erros!

---

## 🔧 Troubleshooting

### Erro: "relation does not exist"
- As tabelas não foram criadas
- Execute novamente o SQL do Método 1

### Erro: "rota não encontrada" persiste
1. Verifique logs do Railway: `railway logs`
2. Confirme que o backend fez deploy: verifique último commit no Railway
3. Reinicie o serviço no Railway

### Erro: "authentication failed"
- Verifique suas credenciais do Railway
- Obtenha nova DATABASE_URL em: Railway → PostgreSQL → Variables

---

**⚠️ IMPORTANTE:** 
- Use o **Método 1 (Web Interface)** se você não tem experiência com CLI
- Faça backup antes se tiver dados importantes
- As tabelas usam `CREATE TABLE IF NOT EXISTS`, então é seguro executar múltiplas vezes

**✅ Após aplicar, o módulo de Solicitações SST estará totalmente funcional!**

