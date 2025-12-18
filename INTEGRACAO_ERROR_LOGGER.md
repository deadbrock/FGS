# 🚨 Integração com FGS Error Logger

Este documento explica como usar o sistema de monitoramento de erros no FGS.

## 📋 O que é?

O FGS Error Logger é uma **API independente** que captura e registra todos os erros do sistema FGS (frontend e backend) em um banco de dados separado, permitindo monitoramento e análise.

## 🎯 Benefícios

- ✅ Identificar erros em produção antes dos usuários reportarem
- ✅ Rastrear qual usuário teve o erro
- ✅ Ver a pilha completa do erro (stack trace)
- ✅ Estatísticas de erros mais frequentes
- ✅ Timeline de erros
- ✅ Dashboard visual para análise

## 🚀 Configuração

### 1. Frontend (.env)

Adicione ao arquivo `.env` do frontend:

```env
VITE_ERROR_LOGGER_URL=http://localhost:4000/api/errors/log
```

**Em produção:**
```env
VITE_ERROR_LOGGER_URL=https://fgs-error-logger.railway.app/api/errors/log
```

### 2. Backend (.env)

Adicione ao arquivo `.env` do backend:

```env
ERROR_LOGGER_URL=http://localhost:4000/api/errors/log
```

**Em produção:**
```env
ERROR_LOGGER_URL=https://fgs-error-logger.railway.app/api/errors/log
```

## 📝 Como Usar no Frontend

### 1. Error Boundary (Automático)

O `ErrorBoundary` já está configurado para capturar erros automaticamente.

**Uso no App.tsx:**

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();
  
  return (
    <ErrorBoundary user={user}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 2. Capturar Erros Manualmente

```typescript
import { logFrontendError, logWarning, logAPIError } from './utils/errorLogger';

// Em try-catch
try {
  await fetchData();
} catch (error) {
  logFrontendError(error, { acao: 'fetchData' }, user);
  throw error;
}

// Warnings
logWarning('Estoque baixo', { produto_id: '123', quantidade: 5 });

// Erros de API
axios.get('/api/usuarios')
  .catch(error => {
    logAPIError(error, '/api/usuarios', 'GET', user);
  });
```

### 3. Em Componentes

```tsx
import { logFrontendError } from '../utils/errorLogger';
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { user } = useAuth();

  const handleClick = async () => {
    try {
      await minhaFuncao();
    } catch (error) {
      logFrontendError(error, { componente: 'MeuComponente' }, user);
      // Mostrar mensagem de erro para o usuário
    }
  };
}
```

## 📝 Como Usar no Backend

### 1. Middleware Automático (Recomendado)

Adicione ao `server.js`:

```javascript
import { errorLoggerMiddleware } from './utils/errorLogger.js';

// ... outras rotas ...

// Middleware de erro (DEVE ser o último)
app.use(errorLoggerMiddleware);

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});
```

### 2. Capturar Erros Manualmente

```javascript
import { logBackendError, logWarning } from './utils/errorLogger.js';

// Em controllers
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT * FROM users');
    res.json(usuarios.rows);
  } catch (error) {
    logBackendError(error, req, 500);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Warnings
logWarning('Tentativa de acesso negado', {
  usuario_id: req.user?.id,
  recurso: '/api/admin',
});
```

### 3. Em Middlewares

```javascript
import { logWarning } from './utils/errorLogger.js';

export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      logWarning('Acesso negado por falta de permissão', {
        usuario_id: req.user.id,
        role: req.user.role,
        required_roles: allowedRoles,
        url: req.originalUrl,
      });
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};
```

## 📊 Dashboard de Erros

Acesse o dashboard em: **http://localhost:4000/api/dashboard**

Ou em produção: **https://fgs-error-logger.railway.app/api/dashboard**

### Funcionalidades do Dashboard:

- 📊 **Estatísticas Gerais**: Total de erros, warnings, pendentes
- 📋 **Últimos Erros**: Lista dos 20 erros mais recentes
- 🔍 **Filtros**: Por tipo, nível, data, usuário
- 📈 **Gráficos**: Timeline de erros
- 🎯 **Top Erros**: Erros mais frequentes
- 👥 **Top Usuários**: Usuários com mais erros

## 🔧 API Endpoints

### Estatísticas

```bash
GET http://localhost:4000/api/dashboard/stats
```

### Listar Erros

```bash
GET http://localhost:4000/api/errors?tipo=FRONTEND&nivel=ERROR&limit=50
```

### Top Erros

```bash
GET http://localhost:4000/api/dashboard/top-errors?limit=10
```

### Timeline

```bash
GET http://localhost:4000/api/dashboard/timeline?dias=7
```

### Resolver Erro

```bash
PUT http://localhost:4000/api/errors/:id/resolver
{
  "observacoes": "Corrigido na versão 2.0"
}
```

## 🎯 Boas Práticas

### ✅ FAÇA:

- Capture erros em operações críticas (banco de dados, APIs externas)
- Inclua contexto útil no campo `dados_adicionais`
- Use `logWarning` para situações que não são erros fatais
- Resolva erros no dashboard após corrigi-los

### ❌ NÃO FAÇA:

- Não log erros de validação de formulário (use apenas para erros técnicos)
- Não inclua senhas ou dados sensíveis nos logs
- Não use `logInfo` em produção (apenas desenvolvimento)
- Não faça log de todos os requests (apenas erros)

## 📈 Exemplo Completo

### Frontend - Página de Dashboard

```typescript
import { useEffect, useState } from 'react';
import { logFrontendError, logWarning } from '../utils/errorLogger';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        logFrontendError(
          error,
          { componente: 'Dashboard', acao: 'fetchStats' },
          user
        );
        // Mostrar mensagem de erro
      }
    };

    fetchData();
  }, [user]);

  return <div>{/* ... */}</div>;
};
```

### Backend - Controller

```javascript
import { pool } from '../config/database.js';
import { logBackendError, logWarning } from '../utils/errorLogger.js';

export const createUsuario = async (req, res) => {
  try {
    const { nome, email, role } = req.body;

    // Validação
    if (!nome || !email) {
      logWarning('Tentativa de criar usuário sem dados obrigatórios', {
        usuario_id: req.user?.id,
        dados_enviados: req.body,
      });
      return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    // Criar usuário
    const result = await pool.query(
      'INSERT INTO users (nome, email, role) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, role]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    logBackendError(error, req, 500);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};
```

## 🔒 Segurança

- Todos os logs são enviados via POST com JSON
- CORS configurado para aceitar apenas requisições do FGS
- Dados sensíveis NÃO devem ser incluídos nos logs
- O logger NÃO quebra a aplicação se falhar

## 🛠️ Troubleshooting

### Erro: "Failed to fetch"

- Verifique se o servidor de logs está rodando (`npm start` no fgs-error-logger)
- Verifique a URL configurada no `.env`
- Verifique se há problemas de CORS

### Logs não aparecem no dashboard

- Verifique se o banco de dados está configurado corretamente
- Execute a migration: `node database/run-migration.js`
- Verifique os logs do servidor de logs

### Performance

- O logger usa `fetch` sem `await` para não bloquear a aplicação
- Erros no logger são silenciosos (não quebram a app)
- Limite de 10MB por requisição

---

**Desenvolvido para o Sistema FGS** 🚀

