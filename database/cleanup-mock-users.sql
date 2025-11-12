-- =============================================
-- Limpar usuários mock - Manter apenas usuários reais
-- =============================================

-- Mostrar usuários atuais antes da limpeza
SELECT 
  id, 
  nome, 
  email, 
  role, 
  created_at 
FROM users 
ORDER BY created_at;

-- ATENÇÃO: Isso vai deletar todos os usuários EXCETO os que você criou manualmente
-- Mantenha apenas usuários com email real (não mock)

-- Deletar usuários mock (ajuste conforme necessário)
-- Descomente a linha abaixo SOMENTE se tiver certeza

-- DELETE FROM users 
-- WHERE email IN ('admin@fgs.com', 'rh@fgs.com', 'gestor@fgs.com')
-- AND created_at < NOW() - INTERVAL '1 hour'; -- Apenas usuários criados há mais de 1 hora

-- OU: Deletar todos os usuários EXCETO os que você criou recentemente
-- DELETE FROM users WHERE created_at < NOW() - INTERVAL '1 day';

-- OU: Manter apenas usuários específicos por email
-- DELETE FROM users WHERE email NOT IN ('seu-email@real.com', 'outro-email@real.com');

-- Verificar usuários restantes
SELECT 
  id, 
  nome, 
  email, 
  role, 
  created_at 
FROM users 
ORDER BY created_at;

