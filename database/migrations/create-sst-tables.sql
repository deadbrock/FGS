-- =============================================
-- TABELAS DO MÓDULO DE SOLICITAÇÕES SST
-- =============================================

-- Tabela de Clínicas
CREATE TABLE IF NOT EXISTS sst_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  razao_social VARCHAR(255),
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  endereco JSONB NOT NULL,
  responsavel_nome VARCHAR(255),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  especialidades JSONB DEFAULT '[]'::jsonb,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Solicitações de Exames
CREATE TABLE IF NOT EXISTS sst_solicitacoes_exames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_exame VARCHAR(50) NOT NULL CHECK (tipo_exame IN ('ASO_ADMISSIONAL', 'PERIODICO', 'RETORNO_TRABALHO', 'MUDANCA_RISCO', 'DEMISSIONAL')),
  colaborador_id UUID,
  colaborador_nome VARCHAR(255) NOT NULL,
  colaborador_cpf VARCHAR(14) NOT NULL,
  colaborador_email VARCHAR(255),
  colaborador_telefone VARCHAR(20),
  cargo VARCHAR(255) NOT NULL,
  cargo_anterior VARCHAR(255),
  departamento VARCHAR(255) NOT NULL,
  setor VARCHAR(255) NOT NULL,
  admissao_id UUID,
  motivo_afastamento TEXT,
  data_afastamento DATE,
  data_desligamento DATE,
  motivo_desligamento TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'AGENDADO', 'REALIZADO', 'CANCELADO', 'REPROVADO')),
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  solicitado_por UUID NOT NULL,
  observacoes TEXT,
  clinica_id UUID,
  data_agendamento DATE,
  hora_agendamento TIME,
  status_agendamento VARCHAR(50) CHECK (status_agendamento IN ('AGUARDANDO_CONFIRMACAO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'NAO_COMPARECEU')),
  resultado VARCHAR(50) CHECK (resultado IN ('APTO', 'INAPTO', 'APTO_COM_RESTRICOES')),
  restricoes TEXT,
  data_realizacao DATE,
  medico_responsavel VARCHAR(255),
  crm_medico VARCHAR(20),
  aso_arquivo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitado_por) REFERENCES users(id),
  FOREIGN KEY (clinica_id) REFERENCES sst_clinicas(id),
  FOREIGN KEY (admissao_id) REFERENCES admissoes(id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_tipo_exame ON sst_solicitacoes_exames(tipo_exame);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_status ON sst_solicitacoes_exames(status);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_colaborador_cpf ON sst_solicitacoes_exames(colaborador_cpf);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_data_solicitacao ON sst_solicitacoes_exames(data_solicitacao);
CREATE INDEX IF NOT EXISTS idx_sst_solicitacoes_clinica_id ON sst_solicitacoes_exames(clinica_id);
CREATE INDEX IF NOT EXISTS idx_sst_clinicas_ativo ON sst_clinicas(ativo);

-- Comentários nas tabelas
COMMENT ON TABLE sst_clinicas IS 'Clínicas parceiras para realização de exames ocupacionais';
COMMENT ON TABLE sst_solicitacoes_exames IS 'Solicitações de exames ocupacionais (ASO, Periódicos, Retorno, Mudança de Risco, Demissional)';

-- Dados de exemplo (opcional - remover em produção)
-- INSERT INTO sst_clinicas (nome, cnpj, telefone, email, endereco, ativo)
-- VALUES 
--   ('Clínica Saúde Ocupacional', '12.345.678/0001-90', '(81) 3333-4444', 'contato@clinicasaude.com', 
--    '{"logradouro": "Rua das Flores", "numero": "123", "bairro": "Centro", "cidade": "Recife", "estado": "PE", "cep": "50000-000"}', true);

