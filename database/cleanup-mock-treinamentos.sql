-- =============================================
-- LIMPEZA: Remover Treinamentos Mock
-- =============================================
-- Remove os 8 treinamentos inseridos no seed inicial
-- Deixa o banco limpo para cadastros reais dos usuários
-- =============================================

-- Verificar treinamentos atuais
SELECT 
  id, 
  titulo, 
  tipo, 
  nr,
  carga_horaria
FROM treinamentos 
ORDER BY titulo;

-- Deletar treinamentos do seed (NRs e Integração)
DELETE FROM treinamentos 
WHERE titulo IN (
  'NR-10 - Segurança em Instalações e Serviços em Eletricidade',
  'NR-12 - Segurança no Trabalho em Máquinas e Equipamentos',
  'NR-18 - Condições e Meio Ambiente de Trabalho na Indústria da Construção',
  'NR-35 - Trabalho em Altura',
  'NR-33 - Segurança e Saúde nos Trabalhos em Espaços Confinados',
  'NR-06 - Equipamento de Proteção Individual - EPI',
  'NR-05 - Comissão Interna de Prevenção de Acidentes - CIPA',
  'Integração de Novos Colaboradores'
);

-- Verificar resultado (deve estar vazio)
SELECT COUNT(*) as total_treinamentos FROM treinamentos;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Treinamentos mock removidos com sucesso!';
  RAISE NOTICE '📝 O banco está limpo para cadastros reais.';
  RAISE NOTICE '👥 Agora os usuários podem cadastrar seus próprios treinamentos!';
END $$;

