-- =============================================
-- REMOVER PIS/PASEP DA LISTA DE DOCUMENTOS
-- Migration: Remover documento PIS/PASEP
-- =============================================

-- Remover PIS/PASEP dos templates de documentos
DELETE FROM admissao_documentos_template 
WHERE tipo_documento = 'PIS';

-- Remover documentos PIS/PASEP já criados em admissões existentes
DELETE FROM admissao_documentos 
WHERE tipo_documento = 'PIS';

-- Log de conclusão
DO $$
BEGIN
  RAISE NOTICE 'PIS/PASEP removido com sucesso dos templates e documentos de admissão';
END $$;

