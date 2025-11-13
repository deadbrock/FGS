-- =============================================
-- LIMPEZA: Remover Treinamentos com Dados Vazios
-- =============================================
-- Remove treinamentos que foram criados mas têm campos obrigatórios vazios
-- =============================================

-- Verificar treinamentos com dados vazios
SELECT 
  id, 
  titulo, 
  tipo, 
  carga_horaria,
  CASE 
    WHEN titulo IS NULL OR titulo = '' THEN 'titulo vazio'
    WHEN tipo IS NULL OR tipo = '' THEN 'tipo vazio'
    WHEN carga_horaria IS NULL OR carga_horaria = 0 THEN 'carga_horaria vazia'
    ELSE 'OK'
  END as problema
FROM treinamentos 
WHERE titulo IS NULL OR titulo = '' 
   OR tipo IS NULL OR tipo = ''
   OR carga_horaria IS NULL OR carga_horaria = 0;

-- Deletar treinamentos com dados inválidos
DELETE FROM treinamentos 
WHERE titulo IS NULL OR titulo = '' 
   OR tipo IS NULL OR tipo = ''
   OR carga_horaria IS NULL OR carga_horaria = 0;

-- Verificar resultado
SELECT COUNT(*) as total_treinamentos FROM treinamentos;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Treinamentos com dados vazios removidos!';
  RAISE NOTICE '📝 Tabela limpa e pronta para cadastros reais.';
END $$;

