-- =============================================
-- ADICIONAR CAMPOS NOVOS NA TABELA ADMISSOES
-- =============================================

-- Adicionar campo para contrato assinado fisicamente
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admissoes' AND column_name='contrato_assinado_fisicamente') THEN
        ALTER TABLE admissoes ADD COLUMN contrato_assinado_fisicamente BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna contrato_assinado_fisicamente adicionada à tabela admissoes.';
    ELSE
        RAISE NOTICE 'Coluna contrato_assinado_fisicamente já existe na tabela admissoes.';
    END IF;
END $$;

-- Adicionar campo para data de assinatura física
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admissoes' AND column_name='data_assinatura_fisica') THEN
        ALTER TABLE admissoes ADD COLUMN data_assinatura_fisica DATE;
        RAISE NOTICE 'Coluna data_assinatura_fisica adicionada à tabela admissoes.';
    ELSE
        RAISE NOTICE 'Coluna data_assinatura_fisica já existe na tabela admissoes.';
    END IF;
END $$;

-- =============================================
-- TABELA: EXAMES_ADMISSIONAIS
-- =============================================
CREATE TABLE IF NOT EXISTS exames_admissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admissao_id UUID NOT NULL REFERENCES admissoes(id) ON DELETE CASCADE,
  
  -- Tipo de Exame
  tipo_exame VARCHAR(100) NOT NULL, -- 'ASO_ADMISSIONAL', 'EXAME_CLINICO', 'EXAME_COMPLEMENTAR', etc.
  nome_exame VARCHAR(255) NOT NULL,
  
  -- Agendamento
  clinica_id UUID, -- ID da clínica (pode ser referência futura)
  nome_clinica VARCHAR(255),
  data_agendamento DATE,
  hora_agendamento TIME,
  endereco_clinica TEXT,
  telefone_clinica VARCHAR(20),
  
  -- Realização
  data_realizacao DATE,
  hora_realizacao TIME,
  medico_responsavel VARCHAR(255),
  crm_medico VARCHAR(20),
  
  -- Resultado
  resultado VARCHAR(50) CHECK (resultado IN ('APTO', 'INAPTO', 'APTO_COM_RESTRICOES', 'PENDENTE')),
  observacoes TEXT,
  
  -- Arquivo
  arquivo_url TEXT,
  arquivo_nome VARCHAR(255),
  arquivo_tamanho BIGINT,
  arquivo_tipo VARCHAR(100),
  
  -- Status
  status VARCHAR(50) DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'REALIZADO', 'CANCELADO', 'REAGENDADO')),
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  responsavel_nome VARCHAR(255),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para exames_admissionais
CREATE INDEX IF NOT EXISTS idx_exames_admissionais_admissao ON exames_admissionais(admissao_id);
CREATE INDEX IF NOT EXISTS idx_exames_admissionais_data_agendamento ON exames_admissionais(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_exames_admissionais_status ON exames_admissionais(status);

-- =============================================
-- TABELA: CLINICAS (Para agendamento de exames)
-- =============================================
CREATE TABLE IF NOT EXISTS clinicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  telefone VARCHAR(20),
  email VARCHAR(255),
  contato_responsavel VARCHAR(255),
  tipos_exames TEXT[], -- Array de tipos de exames que a clínica realiza
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clinicas
CREATE INDEX IF NOT EXISTS idx_clinicas_ativo ON clinicas(ativo);
CREATE INDEX IF NOT EXISTS idx_clinicas_cidade ON clinicas(cidade, estado);

-- Inserir algumas clínicas de exemplo
INSERT INTO clinicas (id, nome, cidade, estado, telefone, tipos_exames, ativo) VALUES
  (uuid_generate_v4(), 'Clínica Médica Central', 'São Paulo', 'SP', '(11) 1234-5678', ARRAY['ASO_ADMISSIONAL', 'EXAME_CLINICO'], true),
  (uuid_generate_v4(), 'Laboratório Saúde Ocupacional', 'Rio de Janeiro', 'RJ', '(21) 2345-6789', ARRAY['EXAME_COMPLEMENTAR', 'EXAME_LABORATORIAL'], true),
  (uuid_generate_v4(), 'Centro Médico Preventivo', 'Belo Horizonte', 'MG', '(31) 3456-7890', ARRAY['ASO_ADMISSIONAL', 'EXAME_CLINICO', 'EXAME_COMPLEMENTAR'], true)
ON CONFLICT DO NOTHING;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_exames_admissionais_updated_at BEFORE UPDATE ON exames_admissionais FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();
CREATE TRIGGER update_clinicas_updated_at BEFORE UPDATE ON clinicas FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();

