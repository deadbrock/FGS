-- =============================================
-- MIGRAÇÃO: Adicionar campo LOCAL_TRABALHO
-- Data: Novembro 2025
-- Descrição: Adiciona coluna para identificar o estado onde o colaborador trabalha
-- =============================================

-- 1. Adicionar coluna local_trabalho
ALTER TABLE colaboradores 
ADD COLUMN IF NOT EXISTS local_trabalho VARCHAR(2);

-- 2. Adicionar comentário explicativo
COMMENT ON COLUMN colaboradores.local_trabalho IS 'Estado (UF) onde o colaborador trabalha - utilizado para alocação regional';

-- 3. Adicionar constraint de validação para aceitar apenas UFs válidas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_local_trabalho_uf'
  ) THEN
    ALTER TABLE colaboradores
    ADD CONSTRAINT chk_local_trabalho_uf 
    CHECK (
      local_trabalho IS NULL OR local_trabalho IN (
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
        'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
        'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
        'SP', 'SE', 'TO'
      )
    );
  END IF;
END
$$;

-- 4. Criar índice para melhorar performance de consultas por estado
CREATE INDEX IF NOT EXISTS idx_colaboradores_local_trabalho 
ON colaboradores(local_trabalho);

-- 5. (OPCIONAL) Migrar dados existentes usando o estado de residência
-- DESCOMENTE SE QUISER USAR O ESTADO DE RESIDÊNCIA COMO PADRÃO
-- UPDATE colaboradores 
-- SET local_trabalho = estado 
-- WHERE local_trabalho IS NULL AND estado IS NOT NULL;

-- 6. (OPCIONAL) Definir um estado padrão para todos sem local_trabalho
-- DESCOMENTE E AJUSTE SE QUISER DEFINIR UM ESTADO PADRÃO
-- UPDATE colaboradores 
-- SET local_trabalho = 'SP' 
-- WHERE local_trabalho IS NULL;

-- 7. Verificar resultado
SELECT 
  'Total de colaboradores' as descricao,
  COUNT(*) as quantidade
FROM colaboradores
UNION ALL
SELECT 
  'Com local de trabalho definido',
  COUNT(*)
FROM colaboradores
WHERE local_trabalho IS NOT NULL
UNION ALL
SELECT 
  'Sem local de trabalho',
  COUNT(*)
FROM colaboradores
WHERE local_trabalho IS NULL;

-- 8. Ver distribuição por estado
SELECT 
  COALESCE(local_trabalho, 'NÃO DEFINIDO') as estado,
  COUNT(*) as total_colaboradores
FROM colaboradores
GROUP BY local_trabalho
ORDER BY total_colaboradores DESC;

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================

