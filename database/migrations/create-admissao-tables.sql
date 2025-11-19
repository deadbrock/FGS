-- =============================================
-- SISTEMA DE ADMISSÃO DE COLABORADORES
-- Migration: Criar tabelas para admissão
-- =============================================

-- Tabela principal de admissões
CREATE TABLE IF NOT EXISTS admissoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados do Candidato/Colaborador
  candidato_id UUID REFERENCES colaboradores(id) ON DELETE SET NULL, -- Pode ser NULL até criar o colaborador
  nome_candidato VARCHAR(255) NOT NULL,
  cpf_candidato VARCHAR(14) NOT NULL,
  email_candidato VARCHAR(255) NOT NULL,
  telefone_candidato VARCHAR(20),
  
  -- Dados da Vaga
  vaga_id UUID, -- ID da vaga (pode ser referência futura)
  cargo VARCHAR(255) NOT NULL,
  departamento VARCHAR(255) NOT NULL,
  tipo_contrato VARCHAR(50) CHECK (tipo_contrato IN ('CLT', 'PJ', 'Estágio', 'Temporário')),
  salario_proposto DECIMAL(10, 2),
  data_inicio_prevista DATE,
  
  -- Workflow
  etapa_atual VARCHAR(50) DEFAULT 'SOLICITACAO_VAGA',
  status VARCHAR(50) DEFAULT 'EM_ANDAMENTO' CHECK (status IN ('EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'REPROVADA')),
  
  -- Responsáveis
  solicitado_por UUID REFERENCES users(id), -- Gestor que solicitou
  aprovado_por UUID REFERENCES users(id), -- RH/Diretoria que aprovou
  responsavel_atual UUID REFERENCES users(id), -- Responsável pela etapa atual
  
  -- Controle de Prazos
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_aprovacao TIMESTAMP,
  data_conclusao TIMESTAMP,
  prazo_final DATE, -- Prazo para conclusão da admissão
  
  -- Integrações
  esocial_enviado BOOLEAN DEFAULT false,
  esocial_evento_id VARCHAR(255), -- ID do evento S-2200 no eSocial
  esocial_data_envio TIMESTAMP,
  thomson_reuters_enviado BOOLEAN DEFAULT false,
  thomson_reuters_id VARCHAR(255), -- ID no sistema Thompson Reuters
  thomson_reuters_data_envio TIMESTAMP,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para admissoes
CREATE INDEX IF NOT EXISTS idx_admissoes_candidato ON admissoes(candidato_id);
CREATE INDEX IF NOT EXISTS idx_admissoes_status ON admissoes(status);
CREATE INDEX IF NOT EXISTS idx_admissoes_etapa ON admissoes(etapa_atual);
CREATE INDEX IF NOT EXISTS idx_admissoes_responsavel ON admissoes(responsavel_atual);
CREATE INDEX IF NOT EXISTS idx_admissoes_data_solicitacao ON admissoes(data_solicitacao);

-- Tabela de documentos obrigatórios da admissão
CREATE TABLE IF NOT EXISTS admissao_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admissao_id UUID NOT NULL REFERENCES admissoes(id) ON DELETE CASCADE,
  
  -- Documento
  tipo_documento VARCHAR(100) NOT NULL, -- 'RG', 'CPF', 'CTPS', 'Comprovante Residência', 'Título Eleitor', 'PIS', 'Certidão Nascimento', 'Certidão Casamento', 'ASO', etc.
  nome_documento VARCHAR(255) NOT NULL,
  obrigatorio BOOLEAN DEFAULT true,
  
  -- Status
  status VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'RECEBIDO', 'APROVADO', 'REPROVADO')),
  
  -- Arquivo
  arquivo_url TEXT,
  arquivo_nome VARCHAR(255),
  arquivo_tamanho BIGINT,
  arquivo_tipo VARCHAR(100),
  
  -- Responsável e Prazo
  responsavel_id UUID REFERENCES users(id), -- Responsável por validar este documento
  prazo_entrega DATE, -- Prazo para entrega deste documento
  data_recebimento TIMESTAMP,
  data_aprovacao TIMESTAMP,
  
  -- Validação
  validado_por UUID REFERENCES users(id),
  observacoes_validacao TEXT,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para admissao_documentos
CREATE INDEX IF NOT EXISTS idx_admissao_documentos_admissao ON admissao_documentos(admissao_id);
CREATE INDEX IF NOT EXISTS idx_admissao_documentos_status ON admissao_documentos(status);
CREATE INDEX IF NOT EXISTS idx_admissao_documentos_tipo ON admissao_documentos(tipo_documento);

-- Tabela de histórico do workflow (etapas)
CREATE TABLE IF NOT EXISTS admissao_workflow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admissao_id UUID NOT NULL REFERENCES admissoes(id) ON DELETE CASCADE,
  
  -- Etapa
  etapa VARCHAR(50) NOT NULL, -- 'SOLICITACAO_VAGA', 'APROVACAO', 'COLETA_DOCUMENTOS', 'VALIDACAO_DOCUMENTOS', 'EXAME_ADMISSIONAL', 'GERACAO_CONTRATO', 'ASSINATURA_DIGITAL', 'ENVIO_ESOCIAL', 'INTEGRACAO_THOMSON'
  status_etapa VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status_etapa IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  
  -- Responsável
  responsavel_id UUID REFERENCES users(id),
  responsavel_nome VARCHAR(255), -- Nome do responsável (para histórico)
  
  -- Datas
  data_inicio TIMESTAMP,
  data_conclusao TIMESTAMP,
  prazo_etapa DATE,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para admissao_workflow
CREATE INDEX IF NOT EXISTS idx_admissao_workflow_admissao ON admissao_workflow(admissao_id);
CREATE INDEX IF NOT EXISTS idx_admissao_workflow_etapa ON admissao_workflow(etapa);
CREATE INDEX IF NOT EXISTS idx_admissao_workflow_status ON admissao_workflow(status_etapa);

-- Tabela de notificações automáticas
CREATE TABLE IF NOT EXISTS admissao_notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admissao_id UUID NOT NULL REFERENCES admissoes(id) ON DELETE CASCADE,
  
  -- Destinatário
  destinatario_tipo VARCHAR(50) NOT NULL CHECK (destinatario_tipo IN ('CANDIDATO', 'GESTOR', 'RH', 'DP', 'SST')),
  destinatario_email VARCHAR(255) NOT NULL,
  destinatario_nome VARCHAR(255),
  
  -- Notificação
  tipo_notificacao VARCHAR(100) NOT NULL, -- 'EMAIL_BOAS_VINDAS', 'LEMBRETE_DOCUMENTO', 'NOTIFICACAO_CONCLUSAO', 'LEMBRETE_PRAZO', etc.
  assunto VARCHAR(255) NOT NULL,
  corpo_email TEXT,
  
  -- Status
  status_envio VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status_envio IN ('PENDENTE', 'ENVIADO', 'FALHA', 'CANCELADO')),
  data_envio TIMESTAMP,
  tentativas_envio INTEGER DEFAULT 0,
  erro_envio TEXT,
  
  -- Links e Anexos
  link_upload TEXT, -- Link para upload de documentos
  anexos JSONB, -- Array de URLs de anexos
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para admissao_notificacoes
CREATE INDEX IF NOT EXISTS idx_admissao_notificacoes_admissao ON admissao_notificacoes(admissao_id);
CREATE INDEX IF NOT EXISTS idx_admissao_notificacoes_status ON admissao_notificacoes(status_envio);
CREATE INDEX IF NOT EXISTS idx_admissao_notificacoes_tipo ON admissao_notificacoes(tipo_notificacao);

-- Tabela de configuração de documentos obrigatórios (template)
CREATE TABLE IF NOT EXISTS admissao_documentos_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Documento
  tipo_documento VARCHAR(100) NOT NULL UNIQUE,
  nome_documento VARCHAR(255) NOT NULL,
  descricao TEXT,
  obrigatorio BOOLEAN DEFAULT true,
  
  -- Responsável padrão
  responsavel_padrao_id UUID REFERENCES users(id),
  responsavel_padrao_role VARCHAR(50), -- 'RH', 'DP', 'SST', etc.
  
  -- Prazo padrão
  prazo_dias INTEGER DEFAULT 7, -- Prazo em dias a partir da solicitação
  
  -- Ordem de exibição
  ordem INTEGER DEFAULT 0,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir documentos padrão obrigatórios
INSERT INTO admissao_documentos_template (tipo_documento, nome_documento, descricao, obrigatorio, responsavel_padrao_role, prazo_dias, ordem) VALUES
  ('RG', 'Carteira de Identidade (RG)', 'Documento de identidade com foto', true, 'DP', 3, 1),
  ('CPF', 'CPF', 'Cadastro de Pessoa Física', true, 'DP', 3, 2),
  ('CTPS', 'Carteira de Trabalho', 'Carteira de Trabalho e Previdência Social', true, 'DP', 3, 3),
  ('COMPROVANTE_RESIDENCIA', 'Comprovante de Residência', 'Conta de luz, água ou telefone', true, 'DP', 5, 4),
  ('TITULO_ELEITOR', 'Título de Eleitor', 'Título de Eleitor atualizado', true, 'DP', 5, 5),
  ('PIS', 'PIS/PASEP', 'Programa de Integração Social', true, 'DP', 5, 6),
  ('CERTIDAO_NASCIMENTO', 'Certidão de Nascimento', 'Certidão de Nascimento atualizada', false, 'DP', 7, 7),
  ('CERTIDAO_CASAMENTO', 'Certidão de Casamento', 'Certidão de Casamento (se casado)', false, 'DP', 7, 8),
  ('ASO', 'ASO - Atestado de Saúde Ocupacional', 'Exame admissional', true, 'SST', 7, 9),
  ('FOTO_3X4', 'Foto 3x4', 'Foto para crachá', true, 'RH', 3, 10)
ON CONFLICT (tipo_documento) DO NOTHING;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_admissao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admissoes_updated_at BEFORE UPDATE ON admissoes FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();
CREATE TRIGGER update_admissao_documentos_updated_at BEFORE UPDATE ON admissao_documentos FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();
CREATE TRIGGER update_admissao_notificacoes_updated_at BEFORE UPDATE ON admissao_notificacoes FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();
CREATE TRIGGER update_admissao_documentos_template_updated_at BEFORE UPDATE ON admissao_documentos_template FOR EACH ROW EXECUTE FUNCTION update_admissao_updated_at();

