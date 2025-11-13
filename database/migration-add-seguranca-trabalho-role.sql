-- =============================================
-- MIGRATION: Adicionar SEGURANCA_TRABALHO ao role
-- =============================================
-- Adiciona a role SEGURANCA_TRABALHO ao CHECK constraint
-- da tabela users
-- =============================================

-- Remover constraint antiga
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Adicionar nova constraint com SEGURANCA_TRABALHO
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('ADMINISTRADOR', 'RH', 'GESTOR', 'COLABORADOR', 'SEGURANCA_TRABALHO'));

-- Verificar resultado
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'users_role_check';

-- Testar (opcional - descomente para testar)
-- SELECT COUNT(*) FROM users WHERE role = 'SEGURANCA_TRABALHO';

