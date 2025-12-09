-- =============================================
-- ATUALIZAR PERFIS DE USUÁRIO
-- Migration: Remover RH e SEGURANCA_TRABALHO, adicionar USUARIO
-- =============================================

-- 1. Remover constraint antiga
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Adicionar nova constraint com os perfis atualizados
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('ADMINISTRADOR', 'GESTOR', 'COLABORADOR', 'USUARIO'));

-- 3. Atualizar usuários existentes com perfis antigos
-- Converter RH para ADMINISTRADOR
UPDATE users SET role = 'ADMINISTRADOR' WHERE role = 'RH';

-- Converter SEGURANCA_TRABALHO para GESTOR
UPDATE users SET role = 'GESTOR' WHERE role = 'SEGURANCA_TRABALHO';

-- Log de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Perfis de usuário atualizados com sucesso!';
  RAISE NOTICE 'Perfis disponíveis: ADMINISTRADOR, GESTOR, COLABORADOR, USUARIO';
END $$;

