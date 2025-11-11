-- =============================================
-- Schema do Banco de Dados FGS
-- PostgreSQL Railway
-- =============================================

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  avatar TEXT,
  cargo VARCHAR(100),
  departamento VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: colaboradores
-- =============================================
CREATE TABLE IF NOT EXISTS colaboradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  data_nascimento DATE,
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  cargo VARCHAR(100) NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  salario DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ATIVO',
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: beneficios
-- =============================================
CREATE TABLE IF NOT EXISTS beneficios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  fornecedor VARCHAR(255),
  categoria VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ATIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: colaborador_beneficio (relação N:N)
-- =============================================
CREATE TABLE IF NOT EXISTS colaborador_beneficio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  beneficio_id UUID NOT NULL REFERENCES beneficios(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  valor_personalizado DECIMAL(10, 2),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(colaborador_id, beneficio_id)
);

-- =============================================
-- TABELA: treinamentos
-- =============================================
CREATE TABLE IF NOT EXISTS treinamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL,
  instrutor VARCHAR(255),
  local VARCHAR(255),
  data_inicio TIMESTAMP NOT NULL,
  data_fim TIMESTAMP NOT NULL,
  carga_horaria INTEGER NOT NULL,
  vagas INTEGER,
  status VARCHAR(20) DEFAULT 'PLANEJADO',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: colaborador_treinamento (relação N:N)
-- =============================================
CREATE TABLE IF NOT EXISTS colaborador_treinamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id) ON DELETE CASCADE,
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'INSCRITO',
  nota DECIMAL(5, 2),
  presenca BOOLEAN DEFAULT FALSE,
  certificado_url TEXT,
  observacoes TEXT,
  UNIQUE(colaborador_id, treinamento_id)
);

-- =============================================
-- TABELA: registros_ponto
-- =============================================
CREATE TABLE IF NOT EXISTS registros_ponto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_entrada TIMESTAMP,
  hora_saida TIMESTAMP,
  hora_intervalo_inicio TIMESTAMP,
  hora_intervalo_fim TIMESTAMP,
  tipo VARCHAR(50) NOT NULL,
  justificativa TEXT,
  aprovado_por UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'NORMAL',
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: documentos
-- =============================================
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  arquivo_nome VARCHAR(255) NOT NULL,
  arquivo_tamanho INTEGER,
  data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_validade DATE,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: dependentes
-- =============================================
CREATE TABLE IF NOT EXISTS dependentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  data_nascimento DATE NOT NULL,
  parentesco VARCHAR(50) NOT NULL,
  telefone VARCHAR(20),
  plano_saude BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: avaliacoes_desempenho
-- =============================================
CREATE TABLE IF NOT EXISTS avaliacoes_desempenho (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  colaborador_id UUID NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  avaliador_id UUID REFERENCES users(id),
  data_avaliacao DATE NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  nota_geral DECIMAL(3, 2),
  criterios JSONB,
  pontos_fortes TEXT,
  pontos_melhoria TEXT,
  metas TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: logs_alteracoes
-- =============================================
CREATE TABLE IF NOT EXISTS logs_alteracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  usuario_nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  acao VARCHAR(50) NOT NULL,
  entidade VARCHAR(100) NOT NULL,
  entidade_id VARCHAR(100) NOT NULL,
  campos_alterados JSONB NOT NULL,
  ip VARCHAR(50) NOT NULL,
  navegador VARCHAR(255) NOT NULL,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA: logs_acesso
-- =============================================
CREATE TABLE IF NOT EXISTS logs_acesso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID,
  usuario_nome VARCHAR(255),
  email VARCHAR(255),
  acao VARCHAR(50) NOT NULL,
  ip VARCHAR(50) NOT NULL,
  navegador VARCHAR(255) NOT NULL,
  sucesso BOOLEAN DEFAULT TRUE,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Colaboradores
CREATE INDEX IF NOT EXISTS idx_colaboradores_cpf ON colaboradores(cpf);
CREATE INDEX IF NOT EXISTS idx_colaboradores_status ON colaboradores(status);
CREATE INDEX IF NOT EXISTS idx_colaboradores_departamento ON colaboradores(departamento);
CREATE INDEX IF NOT EXISTS idx_colaboradores_nome ON colaboradores(nome);

-- Benefícios
CREATE INDEX IF NOT EXISTS idx_beneficios_tipo ON beneficios(tipo);
CREATE INDEX IF NOT EXISTS idx_beneficios_status ON beneficios(status);

-- Treinamentos
CREATE INDEX IF NOT EXISTS idx_treinamentos_data_inicio ON treinamentos(data_inicio);
CREATE INDEX IF NOT EXISTS idx_treinamentos_status ON treinamentos(status);

-- Registros Ponto
CREATE INDEX IF NOT EXISTS idx_registros_ponto_colaborador ON registros_ponto(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_registros_ponto_data ON registros_ponto(data);

-- Documentos
CREATE INDEX IF NOT EXISTS idx_documentos_colaborador ON documentos(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo);

-- Logs
CREATE INDEX IF NOT EXISTS idx_logs_alteracoes_usuario ON logs_alteracoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_alteracoes_data ON logs_alteracoes(data_hora);
CREATE INDEX IF NOT EXISTS idx_logs_acesso_data ON logs_acesso(data_hora);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Usuário Administrador (senha: admin123)
-- Hash bcrypt de "admin123": $2b$10$XOPbrlUPQdwdJUpSrIF6X.LBL7654LBuN5SaXO0JRhOJ8YPjULd7i
INSERT INTO users (nome, email, senha, role, cargo, departamento)
VALUES 
  ('Administrador Sistema', 'admin@fgs.com', '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LBL7654LBuN5SaXO0JRhOJ8YPjULd7i', 'ADMINISTRADOR', 'Administrador', 'TI'),
  ('RH Gestor', 'rh@fgs.com', '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LBL7654LBuN5SaXO0JRhOJ8YPjULd7i', 'RH', 'Gerente de RH', 'Recursos Humanos'),
  ('Gestor Operacional', 'gestor@fgs.com', '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LBL7654LBuN5SaXO0JRhOJ8YPjULd7i', 'GESTOR', 'Gerente', 'Operações')
ON CONFLICT (email) DO NOTHING;

-- Benefícios Exemplo
INSERT INTO beneficios (nome, descricao, tipo, valor, fornecedor, categoria)
VALUES 
  ('Vale Transporte', 'Auxílio transporte mensal', 'TRANSPORTE', 220.00, 'ValeCard', 'Transporte'),
  ('Vale Refeição', 'Auxílio alimentação diário', 'ALIMENTACAO', 30.00, 'Alelo', 'Alimentação'),
  ('Plano de Saúde', 'Plano de saúde empresarial', 'SAUDE', 450.00, 'Unimed', 'Saúde'),
  ('Plano Odontológico', 'Plano odontológico', 'SAUDE', 80.00, 'OdontoPrev', 'Saúde'),
  ('Seguro de Vida', 'Seguro de vida em grupo', 'SEGURO', 35.00, 'MetLife', 'Seguros')
ON CONFLICT DO NOTHING;

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colaboradores_updated_at BEFORE UPDATE ON colaboradores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficios_updated_at BEFORE UPDATE ON beneficios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treinamentos_updated_at BEFORE UPDATE ON treinamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FIM DO SCHEMA
-- =============================================

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

