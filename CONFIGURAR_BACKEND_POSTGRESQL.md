# 🗄️ Configurar Backend com PostgreSQL no Railway

## 🔍 Problema Identificado

Você está cadastrando informações no sistema, mas ao recarregar elas desaparecem porque:
- ❌ Backend está usando dados **mock** (memória)
- ❌ Dados não estão sendo salvos no **PostgreSQL**
- ✅ PostgreSQL está criado no Railway, mas não conectado

**Seu Projeto Railway:** https://railway.com/project/29037bdc-e5c3-4e7c-b49b-68038e694a1e

---

## 📋 Passo a Passo: Conectar Backend ao PostgreSQL

### Passo 1: Verificar PostgreSQL no Railway

1. Acesse seu projeto no Railway
2. Você deve ver 3 serviços:
   - 🗄️ **Postgres** (Database)
   - ⚙️ **Backend** (API)
   - 🎨 **Frontend** (ou deployado na Vercel)

3. Clique no serviço **Postgres**
4. Vá na aba **"Variables"**
5. Copie a variável `DATABASE_URL`

**Exemplo:**
```
postgresql://postgres:senha123@containers-us-west-123.railway.app:5432/railway
```

---

### Passo 2: Conectar Backend ao PostgreSQL

#### 2.1. Adicionar Variável de Ambiente

**Railway → Backend → Variables → Add Variable:**

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**Ou copie a URL completa:**
```bash
DATABASE_URL=postgresql://postgres:senha@host.railway.app:5432/railway
```

#### 2.2. Instalar Dependências no Backend

No seu projeto backend, instale as bibliotecas necessárias:

```bash
cd backend
npm install pg dotenv
```

**Para ORM (recomendado), escolha um:**

**Opção A: Prisma (Recomendado)**
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Opção B: TypeORM**
```bash
npm install typeorm reflect-metadata pg
```

**Opção C: Sequelize**
```bash
npm install sequelize pg pg-hstore
```

---

### Passo 3: Criar Estrutura do Banco de Dados

#### 3.1. Opção A - Usando Prisma (Recomendado)

**Criar Schema Prisma:**

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Tabela de Usuários
model User {
  id        String   @id @default(uuid())
  nome      String
  email     String   @unique
  senha     String
  role      String
  avatar    String?
  cargo     String?
  departamento String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// Tabela de Colaboradores
model Colaborador {
  id              String   @id @default(uuid())
  nome            String
  cpf             String   @unique
  email           String?
  telefone        String?
  dataAdmissao    DateTime
  cargo           String
  departamento    String
  salario         Decimal  @db.Decimal(10, 2)
  status          String   @default("ATIVO")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  beneficios      Beneficio[]
  treinamentos    Treinamento[]
  registrosPonto  RegistroPonto[]

  @@map("colaboradores")
}

// Tabela de Benefícios
model Beneficio {
  id              String   @id @default(uuid())
  nome            String
  descricao       String?
  tipo            String
  valor           Decimal  @db.Decimal(10, 2)
  fornecedor      String?
  status          String   @default("ATIVO")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  colaboradores   Colaborador[]

  @@map("beneficios")
}

// Tabela de Treinamentos
model Treinamento {
  id              String   @id @default(uuid())
  titulo          String
  descricao       String?
  tipo            String
  instrutor       String?
  dataInicio      DateTime
  dataFim         DateTime
  cargaHoraria    Int
  status          String   @default("PLANEJADO")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  colaboradores   Colaborador[]

  @@map("treinamentos")
}

// Tabela de Registro de Ponto
model RegistroPonto {
  id              String   @id @default(uuid())
  colaboradorId   String
  colaborador     Colaborador @relation(fields: [colaboradorId], references: [id])
  data            DateTime
  horaEntrada     DateTime?
  horaSaida       DateTime?
  tipo            String
  observacao      String?
  createdAt       DateTime @default(now())

  @@map("registros_ponto")
}

// Tabela de Logs
model LogAlteracao {
  id              String   @id @default(uuid())
  usuarioId       String
  usuarioNome     String
  role            String
  modulo          String
  acao            String
  entidade        String
  entidadeId      String
  camposAlterados Json
  ip              String
  navegador       String
  dataHora        DateTime @default(now())

  @@map("logs_alteracoes")
}
```

**Executar Migrations:**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 3.2. Opção B - SQL Direto

Se preferir criar as tabelas manualmente, use este SQL:

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  avatar TEXT,
  cargo VARCHAR(100),
  departamento VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Colaboradores
CREATE TABLE colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  data_admissao DATE NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  salario DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Benefícios
CREATE TABLE beneficios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  fornecedor VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Treinamentos
CREATE TABLE treinamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL,
  instrutor VARCHAR(255),
  data_inicio TIMESTAMP NOT NULL,
  data_fim TIMESTAMP NOT NULL,
  carga_horaria INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'PLANEJADO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Registro de Ponto
CREATE TABLE registros_ponto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID REFERENCES colaboradores(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_entrada TIMESTAMP,
  hora_saida TIMESTAMP,
  tipo VARCHAR(50) NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Logs
CREATE TABLE logs_alteracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  usuario_nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  acao VARCHAR(50) NOT NULL,
  entidade VARCHAR(100) NOT NULL,
  entidade_id VARCHAR(100) NOT NULL,
  campos_alterados JSONB NOT NULL,
  ip VARCHAR(50) NOT NULL,
  navegador VARCHAR(255) NOT NULL,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_colaboradores_cpf ON colaboradores(cpf);
CREATE INDEX idx_colaboradores_status ON colaboradores(status);
CREATE INDEX idx_registros_ponto_colaborador ON registros_ponto(colaborador_id);
CREATE INDEX idx_registros_ponto_data ON registros_ponto(data);
CREATE INDEX idx_logs_usuario ON logs_alteracoes(usuario_id);
CREATE INDEX idx_logs_data ON logs_alteracoes(data_hora);
```

**Como executar:**
1. Railway → PostgreSQL → **"Data"** tab
2. Cole o SQL acima
3. Execute

---

### Passo 4: Configurar Conexão no Backend

#### 4.1. Criar Arquivo de Conexão (Prisma)

```javascript
// backend/src/database/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
```

#### 4.2. Criar Arquivo de Conexão (pg - Node PostgreSQL)

```javascript
// backend/src/database/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no PostgreSQL:', err);
});

module.exports = pool;
```

---

### Passo 5: Criar Controllers com Database

#### Exemplo: Benefícios Controller

```javascript
// backend/src/controllers/beneficiosController.js
const prisma = require('../database/prisma');

class BeneficiosController {
  // Listar todos os benefícios
  async index(req, res) {
    try {
      const beneficios = await prisma.beneficio.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return res.json(beneficios);
    } catch (error) {
      console.error('Erro ao listar benefícios:', error);
      return res.status(500).json({ error: 'Erro ao listar benefícios' });
    }
  }

  // Buscar benefício por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      
      const beneficio = await prisma.beneficio.findUnique({
        where: { id }
      });
      
      if (!beneficio) {
        return res.status(404).json({ error: 'Benefício não encontrado' });
      }
      
      return res.json(beneficio);
    } catch (error) {
      console.error('Erro ao buscar benefício:', error);
      return res.status(500).json({ error: 'Erro ao buscar benefício' });
    }
  }

  // Criar novo benefício
  async store(req, res) {
    try {
      const { nome, descricao, tipo, valor, fornecedor, status } = req.body;
      
      const beneficio = await prisma.beneficio.create({
        data: {
          nome,
          descricao,
          tipo,
          valor,
          fornecedor,
          status: status || 'ATIVO'
        }
      });
      
      return res.status(201).json(beneficio);
    } catch (error) {
      console.error('Erro ao criar benefício:', error);
      return res.status(500).json({ error: 'Erro ao criar benefício' });
    }
  }

  // Atualizar benefício
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, tipo, valor, fornecedor, status } = req.body;
      
      const beneficio = await prisma.beneficio.update({
        where: { id },
        data: {
          nome,
          descricao,
          tipo,
          valor,
          fornecedor,
          status
        }
      });
      
      return res.json(beneficio);
    } catch (error) {
      console.error('Erro ao atualizar benefício:', error);
      return res.status(500).json({ error: 'Erro ao atualizar benefício' });
    }
  }

  // Deletar benefício
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      await prisma.beneficio.delete({
        where: { id }
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar benefício:', error);
      return res.status(500).json({ error: 'Erro ao deletar benefício' });
    }
  }
}

module.exports = new BeneficiosController();
```

---

### Passo 6: Criar Rotas

```javascript
// backend/src/routes/beneficios.routes.js
const { Router } = require('express');
const beneficiosController = require('../controllers/beneficiosController');
const authMiddleware = require('../middlewares/auth');

const routes = Router();

// Todas as rotas precisam de autenticação
routes.use(authMiddleware);

routes.get('/beneficios', beneficiosController.index);
routes.get('/beneficios/:id', beneficiosController.show);
routes.post('/beneficios', beneficiosController.store);
routes.put('/beneficios/:id', beneficiosController.update);
routes.delete('/beneficios/:id', beneficiosController.delete);

module.exports = routes;
```

```javascript
// backend/src/routes/index.js
const { Router } = require('express');
const authRoutes = require('./auth.routes');
const beneficiosRoutes = require('./beneficios.routes');
const colaboradoresRoutes = require('./colaboradores.routes');
const treinamentosRoutes = require('./treinamentos.routes');

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/api', beneficiosRoutes);
routes.use('/api', colaboradoresRoutes);
routes.use('/api', treinamentosRoutes);

// Health check
routes.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

module.exports = routes;
```

---

### Passo 7: Atualizar server.js

```javascript
// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(routes);

// Erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Conectado' : 'Não configurado'}`);
});
```

---

### Passo 8: Deploy no Railway

```bash
cd backend
git add .
git commit -m "Conectar backend ao PostgreSQL"
git push origin main
```

Railway fará deploy automaticamente.

---

## ✅ Verificar se Funcionou

### 1. Ver Logs do Backend

Railway → Backend → Deployments → Último deployment → **View Logs**

Procure por:
```
✅ Conectado ao PostgreSQL
🚀 Servidor rodando na porta 3333
```

### 2. Testar Endpoint

```
https://seu-backend.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-11-11T...",
  "database": "connected"
}
```

### 3. Testar CRUD

No frontend, cadastre um benefício e recarregue a página.

**Se persistir:** ✅ Funcionou!  
**Se sumir:** ⚠️ Ainda está usando mock

---

## 🔍 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
1. Verificar `DATABASE_URL` no Railway
2. Formato correto: `postgresql://user:pass@host:5432/db`
3. Redeploy do backend

### Erro: "relation does not exist"

**Solução:**
1. Tabelas não foram criadas
2. Execute as migrations ou SQL manual
3. Railway → Postgres → Data tab

### Erro: "password authentication failed"

**Solução:**
1. Usar variável do Railway: `${{Postgres.DATABASE_URL}}`
2. Não copiar URL manualmente

---

## 📚 Próximos Passos

1. ✅ Criar todos os controllers (colaboradores, treinamentos, etc)
2. ✅ Implementar autenticação JWT
3. ✅ Adicionar validações
4. ✅ Implementar logs de alterações
5. ✅ Adicionar testes

---

**Precisa de ajuda para implementar algum controller específico?** 🚀

---

**Última atualização:** Novembro 2025  
**Projeto Railway:** [Link](https://railway.com/project/29037bdc-e5c3-4e7c-b49b-68038e694a1e)

