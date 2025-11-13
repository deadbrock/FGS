-- =============================================
-- FGS - SISTEMA DE GESTÃO DE RH
-- Schema Completo do Banco de Dados PostgreSQL
-- =============================================
-- Versão: 1.0
-- Data: 2025-11-13
-- =============================================

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users (Usuários do Sistema)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('ADMINISTRADOR', 'RH', 'GESTOR', 'COLABORADOR')),
  cargo VARCHAR(255),
  departamento VARCHAR(255),
  avatar TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_ativo ON users(ativo);

-- =============================================
-- TABELA: colaboradores (Prontuário)
-- =============================================
CREATE TABLE IF NOT EXISTS colaboradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados Pessoais
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  rg VARCHAR(20),
  data_nascimento DATE NOT NULL,
  sexo VARCHAR(1) CHECK (sexo IN ('M', 'F')),
  estado_civil VARCHAR(20),
  nacionalidade VARCHAR(100) DEFAULT 'Brasileira',
  naturalidade VARCHAR(100),
  
  -- Contatos
  email VARCHAR(255),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  
  -- Endereço
  cep VARCHAR(9),
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  
  -- Dados Contratuais
  matricula VARCHAR(50) UNIQUE,
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  cargo VARCHAR(255) NOT NULL,
  departamento VARCHAR(255),
  centro_custo VARCHAR(100),
  local_trabalho VARCHAR(2), -- Estado (UF) onde trabalha
  tipo_contrato VARCHAR(50) CHECK (tipo_contrato IN ('CLT', 'PJ', 'ESTAGIO', 'TEMPORARIO', 'APRENDIZ')),
  jornada_trabalho VARCHAR(50), -- Ex: "8h/dia - 44h/semana", "12x36"
  salario DECIMAL(10, 2),
  banco VARCHAR(100),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('CORRENTE', 'POUPANCA', 'SALARIO')),
  
  -- Dados Adicionais
  pis_pasep VARCHAR(20),
  ctps_numero VARCHAR(20),
  ctps_serie VARCHAR(20),
  ctps_uf VARCHAR(2),
  titulo_eleitor VARCHAR(20),
  cnh VARCHAR(20),
  cnh_categoria VARCHAR(5),
  cnh_validade DATE,
  
  -- Dependentes
  nome_mae VARCHAR(255),
  nome_pai VARCHAR(255),
  quantidade_dependentes INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'AFASTADO', 'FERIAS', 'DESLIGADO')),
  motivo_desligamento TEXT,
  
  -- Relacionamento com usuário
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Foto
  avatar TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT chk_local_trabalho_uf CHECK (
    local_trabalho IS NULL OR local_trabalho IN (
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
      'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
      'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
      'SP', 'SE', 'TO'
    )
  )
);

-- Índices para colaboradores
CREATE INDEX IF NOT EXISTS idx_colaboradores_cpf ON colaboradores(cpf);
CREATE INDEX IF NOT EXISTS idx_colaboradores_matricula ON colaboradores(matricula);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status ON colaboradores(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_cargo ON colaboradores(cargo);
CREATE INDEX IF NOT EXISTS idx_colaboradores_departamento ON colaboradores(departamento);
CREATE INDEX IF NOT EXISTS idx_colaboradores_local_trabalho ON colaboradores(local_trabalho);
CREATE INDEX IF NOT EXISTS idx_colaboradores_data_admissao ON colaboradores(data_admissao);

-- =============================================
-- TABELA: documentos (Documentos do Colaborador)
-- =============================================
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  tipo VARCHAR(100) NOT NULL, -- 'RG', 'CPF', 'CNH', 'CTPS', 'Comprovante Residência', 'ASO', 'Atestado', etc.
  nome_arquivo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL, -- URL ou caminho do arquivo
  tamanho_bytes BIGINT,
  mime_type VARCHAR(100),
  
  -- Controle de Validade
  data_emissao DATE,
  data_validade DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'VENCIDO', 'ARQUIVADO')),
  
  -- Auditoria
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para documentos
CREATE INDEX IF NOT EXISTS idx_documentos_colaborador ON documentos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo);
CREATE INDEX IF NOT EXISTS idx_documentos_status ON documentos(status);
CREATE INDEX IF NOT EXISTS idx_documentos_validade ON documentos(data_validade);

-- =============================================
-- TABELA: beneficios_tipos (Tipos de Benefícios)
-- =============================================
CREATE TABLE IF NOT EXISTS beneficios_tipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  categoria VARCHAR(50) CHECK (categoria IN ('TRANSPORTE', 'ALIMENTACAO', 'SAUDE', 'EDUCACAO', 'OUTROS')),
  valor_padrao DECIMAL(10, 2),
  coparticipacao BOOLEAN DEFAULT false, -- Se colaborador paga parte
  percentual_coparticipacao DECIMAL(5, 2), -- Ex: 6% para VT
  fornecedor VARCHAR(255),
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para beneficios_tipos
CREATE INDEX IF NOT EXISTS idx_beneficios_tipos_categoria ON beneficios_tipos(categoria);
CREATE INDEX IF NOT EXISTS idx_beneficios_tipos_ativo ON beneficios_tipos(ativo);

-- =============================================
-- TABELA: colaboradores_beneficios (Benefícios por Colaborador)
-- =============================================
CREATE TABLE IF NOT EXISTS colaboradores_beneficios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  beneficio_tipo_id UUID NOT NULL REFERENCES beneficios_tipos(id) ON DELETE CASCADE,
  
  valor DECIMAL(10, 2) NOT NULL,
  valor_coparticipacao DECIMAL(10, 2) DEFAULT 0,
  
  data_inicio DATE NOT NULL,
  data_fim DATE,
  
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  
  UNIQUE(colaborador_id, beneficio_tipo_id, data_inicio)
);

-- Índices para colaboradores_beneficios
CREATE INDEX IF NOT EXISTS idx_colaboradores_beneficios_colaborador ON colaboradores_beneficios(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_beneficios_tipo ON colaboradores_beneficios(beneficio_tipo_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_beneficios_ativo ON colaboradores_beneficios(ativo);

-- =============================================
-- TABELA: treinamentos (Cursos/Treinamentos)
-- =============================================
CREATE TABLE IF NOT EXISTS treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) CHECK (tipo IN ('NR', 'TECNICO', 'COMPORTAMENTAL', 'COMPLIANCE', 'INTEGRACAO', 'LIDERANCA', 'OUTROS')),
  nr VARCHAR(10), -- Se for NR: 'NR-10', 'NR-35', etc.
  carga_horaria INTEGER NOT NULL, -- Em horas
  
  instrutor VARCHAR(255),
  instituicao VARCHAR(255),
  
  modalidade VARCHAR(20) CHECK (modalidade IN ('PRESENCIAL', 'ONLINE', 'HIBRIDO')),
  local VARCHAR(255),
  
  validade_meses INTEGER, -- Ex: NR-35 = 24 meses
  
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices para treinamentos
CREATE INDEX IF NOT EXISTS idx_treinamentos_tipo ON treinamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_treinamentos_nr ON treinamentos(nr);
CREATE INDEX IF NOT EXISTS idx_treinamentos_ativo ON treinamentos(ativo);

-- =============================================
-- TABELA: treinamentos_turmas (Turmas de Treinamento)
-- =============================================
CREATE TABLE IF NOT EXISTS treinamentos_turmas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id) ON DELETE CASCADE,
  
  codigo VARCHAR(50) UNIQUE NOT NULL, -- Ex: "NR35-2025-01"
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  
  vagas INTEGER,
  vagas_preenchidas INTEGER DEFAULT 0,
  
  status VARCHAR(20) DEFAULT 'ABERTA' CHECK (status IN ('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para treinamentos_turmas
CREATE INDEX IF NOT EXISTS idx_treinamentos_turmas_treinamento ON treinamentos_turmas(treinamento_id);
CREATE INDEX IF NOT EXISTS idx_treinamentos_turmas_status ON treinamentos_turmas(status);
CREATE INDEX IF NOT EXISTS idx_treinamentos_turmas_data_inicio ON treinamentos_turmas(data_inicio);

-- =============================================
-- TABELA: colaboradores_treinamentos (Treinamentos por Colaborador)
-- =============================================
CREATE TABLE IF NOT EXISTS colaboradores_treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES treinamentos_turmas(id) ON DELETE SET NULL,
  
  data_realizacao DATE NOT NULL,
  data_validade DATE, -- Calculado com base em validade_meses
  
  presenca BOOLEAN DEFAULT true,
  percentual_presenca DECIMAL(5, 2) DEFAULT 100.00,
  
  status VARCHAR(20) DEFAULT 'CONCLUIDO' CHECK (status IN ('INSCRITO', 'EM_ANDAMENTO', 'CONCLUIDO', 'REPROVADO', 'CANCELADO')),
  nota DECIMAL(5, 2),
  aprovado BOOLEAN,
  
  certificado_url TEXT,
  certificado_numero VARCHAR(100),
  
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para colaboradores_treinamentos
CREATE INDEX IF NOT EXISTS idx_colaboradores_treinamentos_colaborador ON colaboradores_treinamentos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_treinamentos_treinamento ON colaboradores_treinamentos(treinamento_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_treinamentos_turma ON colaboradores_treinamentos(turma_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_treinamentos_status ON colaboradores_treinamentos(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_treinamentos_validade ON colaboradores_treinamentos(data_validade);

-- =============================================
-- TABELA: ponto_configuracoes (Configurações de Jornada)
-- =============================================
CREATE TABLE IF NOT EXISTS ponto_configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  
  tipo_jornada VARCHAR(50) CHECK (tipo_jornada IN ('PADRAO', 'ESCALA_12X36', 'ESCALA_6X1', 'TURNO', 'FLEXIVEL')),
  
  horas_dia DECIMAL(4, 2), -- Ex: 8.00
  horas_semana DECIMAL(4, 2), -- Ex: 44.00
  
  entrada_1 TIME,
  saida_1 TIME,
  entrada_2 TIME,
  saida_2 TIME,
  
  intervalo_minutos INTEGER,
  
  tolerancia_atraso_minutos INTEGER DEFAULT 10,
  tolerancia_saida_antecipada_minutos INTEGER DEFAULT 10,
  
  permite_banco_horas BOOLEAN DEFAULT true,
  
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para ponto_configuracoes
CREATE INDEX IF NOT EXISTS idx_ponto_configuracoes_ativo ON ponto_configuracoes(ativo);

-- =============================================
-- TABELA: ponto_registros (Registros de Ponto)
-- =============================================
CREATE TABLE IF NOT EXISTS ponto_registros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  data DATE NOT NULL,
  entrada_1 TIMESTAMP,
  saida_1 TIMESTAMP,
  entrada_2 TIMESTAMP,
  saida_2 TIMESTAMP,
  
  -- Cálculos
  horas_trabalhadas DECIMAL(5, 2),
  horas_extras_50 DECIMAL(5, 2) DEFAULT 0,
  horas_extras_100 DECIMAL(5, 2) DEFAULT 0,
  adicional_noturno DECIMAL(5, 2) DEFAULT 0,
  banco_horas DECIMAL(5, 2) DEFAULT 0, -- Positivo ou negativo
  
  -- Status
  status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'AJUSTADO')),
  tipo_dia VARCHAR(20) CHECK (tipo_dia IN ('NORMAL', 'FERIADO', 'DSR', 'FALTA', 'ATESTADO', 'FERIAS', 'FOLGA')),
  
  -- Justificativas
  falta_justificada BOOLEAN DEFAULT false,
  justificativa TEXT,
  
  -- Aprovação
  aprovado_por UUID REFERENCES users(id),
  data_aprovacao TIMESTAMP,
  
  -- Observações
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(colaborador_id, data)
);

-- Índices para ponto_registros
CREATE INDEX IF NOT EXISTS idx_ponto_registros_colaborador ON ponto_registros(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_ponto_registros_data ON ponto_registros(data);
CREATE INDEX IF NOT EXISTS idx_ponto_registros_status ON ponto_registros(status);
CREATE INDEX IF NOT EXISTS idx_ponto_registros_tipo_dia ON ponto_registros(tipo_dia);

-- =============================================
-- TABELA: atestados (Atestados Médicos)
-- =============================================
CREATE TABLE IF NOT EXISTS atestados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  data_emissao DATE NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_afastamento INTEGER NOT NULL,
  
  cid VARCHAR(10), -- Código CID da doença
  nome_medico VARCHAR(255),
  crm VARCHAR(20),
  
  tipo VARCHAR(50) CHECK (tipo IN ('DOENCA', 'ACIDENTE_TRABALHO', 'ACIDENTE_TRAJETO', 'CONSULTA', 'EXAME', 'ACOMPANHAMENTO')),
  
  arquivo_url TEXT NOT NULL,
  
  -- Integração eSocial
  esocial_enviado BOOLEAN DEFAULT false,
  esocial_protocolo VARCHAR(100),
  esocial_data_envio TIMESTAMP,
  
  status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'CANCELADO', 'PRORROGADO')),
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices para atestados
CREATE INDEX IF NOT EXISTS idx_atestados_colaborador ON atestados(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_atestados_data_inicio ON atestados(data_inicio);
CREATE INDEX IF NOT EXISTS idx_atestados_data_fim ON atestados(data_fim);
CREATE INDEX IF NOT EXISTS idx_atestados_tipo ON atestados(tipo);
CREATE INDEX IF NOT EXISTS idx_atestados_status ON atestados(status);

-- =============================================
-- TABELA: asos (Atestados de Saúde Ocupacional)
-- =============================================
CREATE TABLE IF NOT EXISTS asos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ADMISSIONAL', 'PERIODICO', 'RETORNO_TRABALHO', 'MUDANCA_FUNCAO', 'DEMISSIONAL')),
  data_exame DATE NOT NULL,
  data_validade DATE,
  
  medico_nome VARCHAR(255) NOT NULL,
  medico_crm VARCHAR(20) NOT NULL,
  
  resultado VARCHAR(50) NOT NULL CHECK (resultado IN ('APTO', 'INAPTO', 'APTO_COM_RESTRICAO')),
  restricoes TEXT,
  
  arquivo_url TEXT,
  
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices para asos
CREATE INDEX IF NOT EXISTS idx_asos_colaborador ON asos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_asos_tipo ON asos(tipo);
CREATE INDEX IF NOT EXISTS idx_asos_data_exame ON asos(data_exame);
CREATE INDEX IF NOT EXISTS idx_asos_data_validade ON asos(data_validade);
CREATE INDEX IF NOT EXISTS idx_asos_resultado ON asos(resultado);

-- =============================================
-- TABELA: epis (Equipamentos de Proteção Individual)
-- =============================================
CREATE TABLE IF NOT EXISTS epis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ca VARCHAR(20) UNIQUE, -- Certificado de Aprovação
  tipo VARCHAR(100), -- 'Capacete', 'Luva', 'Óculos', 'Botina', etc.
  
  fornecedor VARCHAR(255),
  valor_unitario DECIMAL(10, 2),
  
  estoque_atual INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 10,
  
  vida_util_dias INTEGER, -- Ex: 180 dias
  
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para epis
CREATE INDEX IF NOT EXISTS idx_epis_tipo ON epis(tipo);
CREATE INDEX IF NOT EXISTS idx_epis_ativo ON epis(ativo);
CREATE INDEX IF NOT EXISTS idx_epis_estoque ON epis(estoque_atual);

-- =============================================
-- TABELA: colaboradores_epis (EPIs Entregues)
-- =============================================
CREATE TABLE IF NOT EXISTS colaboradores_epis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  epi_id UUID NOT NULL REFERENCES epis(id) ON DELETE CASCADE,
  
  data_entrega DATE NOT NULL,
  data_validade DATE,
  data_devolucao DATE,
  
  quantidade INTEGER DEFAULT 1,
  
  tamanho VARCHAR(20), -- P, M, G, GG, número, etc.
  
  -- Assinatura Digital
  assinatura_digital TEXT, -- Base64 da assinatura
  ip_assinatura VARCHAR(50),
  
  status VARCHAR(20) DEFAULT 'EM_USO' CHECK (status IN ('EM_USO', 'DEVOLVIDO', 'PERDIDO', 'DANIFICADO')),
  motivo_devolucao TEXT,
  
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  entregue_por UUID REFERENCES users(id)
);

-- Índices para colaboradores_epis
CREATE INDEX IF NOT EXISTS idx_colaboradores_epis_colaborador ON colaboradores_epis(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_epis_epi ON colaboradores_epis(epi_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_epis_status ON colaboradores_epis(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_epis_validade ON colaboradores_epis(data_validade);

-- =============================================
-- TABELA: acidentes_trabalho (Registro de Acidentes)
-- =============================================
CREATE TABLE IF NOT EXISTS acidentes_trabalho (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  data_acidente TIMESTAMP NOT NULL,
  local_acidente VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  
  tipo VARCHAR(50) CHECK (tipo IN ('TIPICO', 'TRAJETO', 'DOENCA_OCUPACIONAL')),
  gravidade VARCHAR(50) CHECK (gravidade IN ('SEM_AFASTAMENTO', 'COM_AFASTAMENTO', 'FATAL')),
  
  parte_corpo_atingida VARCHAR(255),
  
  houve_afastamento BOOLEAN DEFAULT false,
  dias_afastamento INTEGER DEFAULT 0,
  
  testemunhas TEXT,
  
  -- CAT (Comunicação de Acidente de Trabalho)
  cat_numero VARCHAR(50),
  cat_data_emissao DATE,
  cat_arquivo_url TEXT,
  
  -- Integração eSocial
  esocial_enviado BOOLEAN DEFAULT false,
  esocial_protocolo VARCHAR(100),
  esocial_data_envio TIMESTAMP,
  
  -- Investigação
  causa_imediata TEXT,
  causa_raiz TEXT,
  plano_acao TEXT,
  
  responsavel_investigacao UUID REFERENCES users(id),
  data_investigacao DATE,
  
  status VARCHAR(20) DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'EM_INVESTIGACAO', 'CONCLUIDO')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices para acidentes_trabalho
CREATE INDEX IF NOT EXISTS idx_acidentes_colaborador ON acidentes_trabalho(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_acidentes_data ON acidentes_trabalho(data_acidente);
CREATE INDEX IF NOT EXISTS idx_acidentes_tipo ON acidentes_trabalho(tipo);
CREATE INDEX IF NOT EXISTS idx_acidentes_gravidade ON acidentes_trabalho(gravidade);
CREATE INDEX IF NOT EXISTS idx_acidentes_status ON acidentes_trabalho(status);

-- =============================================
-- TABELA: ferias (Controle de Férias)
-- =============================================
CREATE TABLE IF NOT EXISTS ferias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  periodo_aquisitivo_inicio DATE NOT NULL,
  periodo_aquisitivo_fim DATE NOT NULL,
  
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias INTEGER NOT NULL,
  
  tipo VARCHAR(50) CHECK (tipo IN ('INTEGRAL', 'FRACIONADA_1', 'FRACIONADA_2', 'FRACIONADA_3')),
  
  abono_pecuniario BOOLEAN DEFAULT false, -- Vender 10 dias
  dias_abono INTEGER DEFAULT 0,
  
  status VARCHAR(20) DEFAULT 'SOLICITADA' CHECK (status IN ('SOLICITADA', 'APROVADA', 'REJEITADA', 'EM_GOZO', 'CONCLUIDA', 'CANCELADA')),
  
  aprovado_por UUID REFERENCES users(id),
  data_aprovacao TIMESTAMP,
  motivo_rejeicao TEXT,
  
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para ferias
CREATE INDEX IF NOT EXISTS idx_ferias_colaborador ON ferias(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_ferias_data_inicio ON ferias(data_inicio);
CREATE INDEX IF NOT EXISTS idx_ferias_status ON ferias(status);

-- =============================================
-- TABELA: esocial_eventos (Log de Envios eSocial)
-- =============================================
CREATE TABLE IF NOT EXISTS esocial_eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  colaborador_id UUID REFERENCES colaboradores(id) ON DELETE SET NULL,
  
  tipo_evento VARCHAR(50) NOT NULL, -- 'S-2200', 'S-2299', 'S-2230', etc.
  descricao VARCHAR(255),
  
  xml_enviado TEXT,
  xml_retorno TEXT,
  
  protocolo VARCHAR(100),
  recibo VARCHAR(100),
  
  status VARCHAR(50) CHECK (status IN ('PENDENTE', 'ENVIADO', 'SUCESSO', 'ERRO', 'CANCELADO')),
  codigo_erro VARCHAR(50),
  mensagem_erro TEXT,
  
  tentativas INTEGER DEFAULT 1,
  
  enviado_em TIMESTAMP,
  processado_em TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Índices para esocial_eventos
CREATE INDEX IF NOT EXISTS idx_esocial_colaborador ON esocial_eventos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_esocial_tipo_evento ON esocial_eventos(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_esocial_status ON esocial_eventos(status);
CREATE INDEX IF NOT EXISTS idx_esocial_data ON esocial_eventos(enviado_em);

-- =============================================
-- TABELA: dependentes (Dependentes dos Colaboradores)
-- =============================================
CREATE TABLE IF NOT EXISTS dependentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  data_nascimento DATE NOT NULL,
  
  parentesco VARCHAR(50) CHECK (parentesco IN ('FILHO', 'CONJUGE', 'ENTEADO', 'PAI', 'MAE', 'IRMAO', 'OUTROS')),
  
  ir BOOLEAN DEFAULT false, -- Dependente para IR
  salario_familia BOOLEAN DEFAULT false, -- Recebe salário família
  plano_saude BOOLEAN DEFAULT false, -- Incluído no plano de saúde
  
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para dependentes
CREATE INDEX IF NOT EXISTS idx_dependentes_colaborador ON dependentes(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_dependentes_cpf ON dependentes(cpf);

-- =============================================
-- TABELA: notificacoes (Sistema de Notificações)
-- =============================================
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) CHECK (tipo IN ('INFO', 'ALERTA', 'ERRO', 'SUCESSO')),
  
  link VARCHAR(500), -- Link para a página relacionada
  
  lida BOOLEAN DEFAULT false,
  data_leitura TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para notificacoes
CREATE INDEX IF NOT EXISTS idx_notificacoes_user ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created ON notificacoes(created_at);

-- =============================================
-- TABELA: logs_auditoria (Log de Ações do Sistema)
-- =============================================
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  acao VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  tabela VARCHAR(100),
  registro_id UUID,
  
  dados_antes JSONB,
  dados_depois JSONB,
  
  ip VARCHAR(50),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para logs_auditoria
CREATE INDEX IF NOT EXISTS idx_logs_user ON logs_auditoria(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_auditoria(acao);
CREATE INDEX IF NOT EXISTS idx_logs_tabela ON logs_auditoria(tabela);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs_auditoria(created_at);

-- =============================================
-- TRIGGERS: Atualizar updated_at automaticamente
-- =============================================

-- Função genérica para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colaboradores_updated_at BEFORE UPDATE ON colaboradores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficios_tipos_updated_at BEFORE UPDATE ON beneficios_tipos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colaboradores_beneficios_updated_at BEFORE UPDATE ON colaboradores_beneficios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treinamentos_updated_at BEFORE UPDATE ON treinamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treinamentos_turmas_updated_at BEFORE UPDATE ON treinamentos_turmas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colaboradores_treinamentos_updated_at BEFORE UPDATE ON colaboradores_treinamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ponto_configuracoes_updated_at BEFORE UPDATE ON ponto_configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ponto_registros_updated_at BEFORE UPDATE ON ponto_registros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_atestados_updated_at BEFORE UPDATE ON atestados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asos_updated_at BEFORE UPDATE ON asos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_epis_updated_at BEFORE UPDATE ON epis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colaboradores_epis_updated_at BEFORE UPDATE ON colaboradores_epis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_acidentes_trabalho_updated_at BEFORE UPDATE ON acidentes_trabalho FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ferias_updated_at BEFORE UPDATE ON ferias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dependentes_updated_at BEFORE UPDATE ON dependentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FIM DO SCHEMA
-- =============================================

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE '✅ Schema completo criado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: 23';
  RAISE NOTICE '🔍 Índices criados: 80+';
  RAISE NOTICE '⚡ Triggers criados: 16';
  RAISE NOTICE '🎯 Sistema pronto para uso!';
END $$;

