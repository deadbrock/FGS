-- =============================================
-- Recriar tabela users com UUID correto
-- =============================================

-- 1. Dropar tabela users
DROP TABLE IF EXISTS users CASCADE;

-- 2. Recriar tabela com schema correto
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 3. Criar índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 4. Verificar
SELECT * FROM users;

-- NOTA: O backend vai criar o usuário admin automaticamente ao iniciar

