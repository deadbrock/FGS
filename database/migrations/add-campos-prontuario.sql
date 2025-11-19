-- =============================================
-- MIGRATION: Adicionar campos faltantes no Prontuário
-- Data: 2025-11-18
-- =============================================

-- Adicionar campo WhatsApp na tabela colaboradores
ALTER TABLE colaboradores 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- Adicionar campo Escolaridade na tabela colaboradores
ALTER TABLE colaboradores 
ADD COLUMN IF NOT EXISTS escolaridade VARCHAR(100);

-- Comentários para documentação
COMMENT ON COLUMN colaboradores.whatsapp IS 'Número de WhatsApp do colaborador';
COMMENT ON COLUMN colaboradores.escolaridade IS 'Nível de escolaridade (Fundamental, Médio, Superior, etc.)';

-- =============================================
-- Criar tabela para Histórico de Reajustes de Salário
-- =============================================

CREATE TABLE IF NOT EXISTS historico_reajustes_salario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  -- Dados do Reajuste
  salario_anterior DECIMAL(10, 2) NOT NULL,
  salario_novo DECIMAL(10, 2) NOT NULL,
  percentual_reajuste DECIMAL(5, 2), -- Calculado automaticamente
  data_reajuste DATE NOT NULL,
  data_efetivacao DATE NOT NULL,
  
  -- Motivo e Observações
  motivo VARCHAR(255), -- Ex: "Reajuste anual", "Promoção", "Ajuste de mercado"
  observacoes TEXT,
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  data_aprovacao TIMESTAMP,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reajustes_colaborador ON historico_reajustes_salario(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_reajustes_data ON historico_reajustes_salario(data_reajuste);

-- Comentários
COMMENT ON TABLE historico_reajustes_salario IS 'Histórico de reajustes salariais dos colaboradores';

-- =============================================
-- Criar tabela para Versões de Documentos
-- =============================================

CREATE TABLE IF NOT EXISTS documentos_versoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
  versao INTEGER NOT NULL,
  
  -- Dados da versão
  arquivo_url TEXT NOT NULL,
  arquivo_nome VARCHAR(255) NOT NULL,
  arquivo_tamanho BIGINT,
  arquivo_tipo VARCHAR(100),
  
  -- Metadados
  descricao_alteracao TEXT, -- O que mudou nesta versão
  data_emissao DATE,
  data_validade DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'ARQUIVADO')),
  
  -- Auditoria
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraint: versão única por documento
  UNIQUE(documento_id, versao)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_documentos_versoes_documento ON documentos_versoes(documento_id);
CREATE INDEX IF NOT EXISTS idx_documentos_versoes_versao ON documentos_versoes(versao);

-- Comentários
COMMENT ON TABLE documentos_versoes IS 'Histórico de versões de documentos do colaborador';

-- =============================================
-- Adicionar campo para tipo específico de documento médico
-- =============================================

-- Adicionar tipo 'CARTEIRA_VACINACAO' aos tipos de documentos existentes
-- (A tabela documentos já suporta qualquer tipo via VARCHAR, então não precisa de alteração)

-- =============================================
-- Verificar se tudo foi criado corretamente
-- =============================================

-- Verificar colunas adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'colaboradores' 
AND column_name IN ('whatsapp', 'escolaridade');

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('historico_reajustes_salario', 'documentos_versoes');

