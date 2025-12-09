-- =============================================
-- ADICIONAR DOCUMENTOS ADMISSIONAIS COMPLETOS
-- Migration: Adicionar documentos faltantes
-- =============================================

-- Remover documentos antigos para recriar com a lista completa
DELETE FROM admissao_documentos_template;

-- Inserir TODOS os documentos obrigatórios conforme lista fornecida
INSERT INTO admissao_documentos_template (tipo_documento, nome_documento, descricao, obrigatorio, responsavel_padrao_role, prazo_dias, ordem) VALUES
  -- Documentos Pessoais
  ('FOTO_3X4', 'Foto 3x4', 'Foto para crachá e documentação', true, 'RH', 3, 1),
  ('CTPS_DIGITAL', 'CTPS Digital', 'Carteira de Trabalho Digital', true, 'DP', 3, 2),
  ('RG_FRENTE', 'Identidade (Frente)', 'RG ou CNH - Frente', true, 'DP', 3, 3),
  ('RG_VERSO', 'Identidade (Verso)', 'RG ou CNH - Verso', true, 'DP', 3, 4),
  ('COMPROVANTE_RESIDENCIA', 'Comprovante de Residência', 'Conta de luz, água ou telefone atualizado', true, 'DP', 5, 5),
  ('CERTIDAO_NASCIMENTO_CASAMENTO', 'Certidão Nascimento/Casamento', 'Certidão de Nascimento ou Casamento atualizada', true, 'DP', 7, 6),
  ('RESERVISTA', 'Reservista', 'Certificado de Reservista (homens)', false, 'DP', 7, 7),
  ('TITULO_ELEITOR', 'Título de Eleitor', 'Título de Eleitor com quitação eleitoral', true, 'DP', 5, 8),
  
  -- Documentos Criminais
  ('ANTECEDENTES_CRIMINAIS', 'Antecedentes Criminais', 'Certidão de Antecedentes Criminais', true, 'RH', 10, 9),
  
  -- Documentos de Dependentes
  ('CERTIDAO_DEPENDENTE', 'Certidão Dependente', 'Certidão de Nascimento dos dependentes', false, 'DP', 10, 10),
  ('CPF_DEPENDENTE', 'CPF Dependente', 'CPF dos dependentes', false, 'DP', 10, 11)
ON CONFLICT (tipo_documento) DO NOTHING;

-- Log de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Documentos admissionais atualizados com sucesso!';
  RAISE NOTICE 'Total: 11 documentos configurados';
END $$;

