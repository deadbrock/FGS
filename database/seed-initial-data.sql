-- =============================================
-- FGS - SEED DE DADOS INICIAIS
-- =============================================
-- Dados básicos para o sistema funcionar
-- =============================================

-- =============================================
-- 1. TIPOS DE BENEFÍCIOS PADRÃO
-- =============================================

INSERT INTO beneficios_tipos (nome, descricao, categoria, valor_padrao, coparticipacao, percentual_coparticipacao, ativo) VALUES
('Vale Transporte', 'Auxílio para deslocamento casa-trabalho', 'TRANSPORTE', 200.00, true, 6.00, true),
('Vale Refeição', 'Auxílio alimentação para refeições', 'ALIMENTACAO', 30.00, false, 0, true),
('Vale Alimentação', 'Auxílio para compra de alimentos', 'ALIMENTACAO', 300.00, false, 0, true),
('Plano de Saúde', 'Assistência médica e hospitalar', 'SAUDE', 250.00, true, 30.00, true),
('Plano Odontológico', 'Assistência odontológica', 'SAUDE', 50.00, true, 50.00, true),
('Seguro de Vida', 'Seguro de vida em grupo', 'OUTROS', 15.00, false, 0, true),
('Auxílio Creche', 'Auxílio para creche/babá', 'EDUCACAO', 400.00, false, 0, true),
('Bolsa de Estudos', 'Auxílio para cursos e graduação', 'EDUCACAO', 500.00, false, 0, true);

-- =============================================
-- 2. CONFIGURAÇÕES DE JORNADA PADRÃO
-- =============================================

INSERT INTO ponto_configuracoes (nome, descricao, tipo_jornada, horas_dia, horas_semana, entrada_1, saida_1, entrada_2, saida_2, intervalo_minutos, tolerancia_atraso_minutos, ativo) VALUES
('Jornada Padrão 44h', 'Segunda a Sexta: 8h às 12h e 13h às 18h', 'PADRAO', 8.00, 44.00, '08:00', '12:00', '13:00', '18:00', 60, 10, true),
('Jornada Comercial', 'Segunda a Sexta: 9h às 18h (1h almoço)', 'PADRAO', 8.00, 40.00, '09:00', '13:00', '14:00', '18:00', 60, 10, true),
('Escala 12x36', 'Trabalha 12 horas, descansa 36', 'ESCALA_12X36', 12.00, 36.00, '07:00', '19:00', null, null, 60, 15, true),
('Turno Manhã', 'Turno das 6h às 14h', 'TURNO', 8.00, 44.00, '06:00', '10:00', '10:15', '14:00', 15, 10, true),
('Turno Tarde', 'Turno das 14h às 22h', 'TURNO', 8.00, 44.00, '14:00', '18:00', '18:15', '22:00', 15, 10, true),
('Turno Noite', 'Turno das 22h às 6h', 'TURNO', 8.00, 44.00, '22:00', '02:00', '02:15', '06:00', 15, 10, true);

-- =============================================
-- 3. TREINAMENTOS NR OBRIGATÓRIOS
-- =============================================

INSERT INTO treinamentos (titulo, descricao, tipo, nr, carga_horaria, modalidade, validade_meses, ativo) VALUES
('NR-10 - Segurança em Instalações e Serviços em Eletricidade', 'Treinamento obrigatório para trabalhos com eletricidade', 'NR', 'NR-10', 40, 'PRESENCIAL', 24, true),
('NR-12 - Segurança no Trabalho em Máquinas e Equipamentos', 'Operação segura de máquinas e equipamentos', 'NR', 'NR-12', 8, 'PRESENCIAL', 24, true),
('NR-18 - Condições e Meio Ambiente de Trabalho na Indústria da Construção', 'Segurança na construção civil', 'NR', 'NR-18', 6, 'PRESENCIAL', 24, true),
('NR-35 - Trabalho em Altura', 'Trabalho acima de 2 metros do nível inferior', 'NR', 'NR-35', 8, 'PRESENCIAL', 24, true),
('NR-33 - Segurança e Saúde nos Trabalhos em Espaços Confinados', 'Trabalho em espaços confinados', 'NR', 'NR-33', 16, 'PRESENCIAL', 12, true),
('NR-06 - Equipamento de Proteção Individual - EPI', 'Uso correto de EPIs', 'NR', 'NR-06', 4, 'PRESENCIAL', 12, true),
('NR-05 - Comissão Interna de Prevenção de Acidentes - CIPA', 'Formação de membros da CIPA', 'NR', 'NR-05', 20, 'PRESENCIAL', 12, true),
('Integração de Novos Colaboradores', 'Treinamento inicial para todos os novos colaboradores', 'INTEGRACAO', null, 4, 'HIBRIDO', null, true);

-- =============================================
-- 4. EPIs COMUNS
-- =============================================

INSERT INTO epis (nome, descricao, tipo, ca, estoque_atual, estoque_minimo, vida_util_dias, ativo) VALUES
('Capacete de Segurança Branco', 'Capacete classe A/B', 'Capacete', '12345', 100, 20, 730, true),
('Capacete de Segurança Amarelo', 'Capacete classe A/B', 'Capacete', '12346', 150, 30, 730, true),
('Óculos de Proteção Incolor', 'Proteção contra impactos', 'Óculos', '23456', 200, 50, 365, true),
('Luva de Vaqueta', 'Proteção das mãos', 'Luva', '34567', 300, 100, 90, true),
('Luva de Raspa', 'Proteção para trabalhos pesados', 'Luva', '34568', 250, 80, 60, true),
('Botina de Segurança com Biqueira', 'Calçado de segurança', 'Calçado', '45678', 150, 40, 365, true),
('Protetor Auricular Tipo Plug', 'Proteção auditiva', 'Proteção Auditiva', '56789', 500, 150, 180, true),
('Cinto de Segurança Tipo Paraquedista', 'Para trabalho em altura', 'Cinto', '67890', 50, 15, 1095, true),
('Máscara PFF2', 'Proteção respiratória', 'Máscara', '78901', 1000, 300, 30, true),
('Colete Refletivo', 'Sinalização de segurança', 'Vestimenta', '89012', 200, 50, 365, true);

-- =============================================
-- MENSAGEM DE CONCLUSÃO
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Dados iniciais inseridos com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Resumo:';
  RAISE NOTICE '   • 8 tipos de benefícios';
  RAISE NOTICE '   • 6 configurações de jornada';
  RAISE NOTICE '   • 8 treinamentos (incluindo NRs)';
  RAISE NOTICE '   • 10 EPIs comuns';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Sistema pronto para cadastrar colaboradores!';
END $$;

