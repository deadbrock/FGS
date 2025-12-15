-- =============================================
-- Tabelas do Módulo de Gestão de EPIs
-- =============================================

-- Tabela de EPIs (Equipamentos de Proteção Individual)
CREATE TABLE IF NOT EXISTS epis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100) NOT NULL,
  ca VARCHAR(50) NOT NULL, -- Certificado de Aprovação
  fabricante VARCHAR(255) NOT NULL,
  validade_ca DATE NOT NULL,
  durabilidade_meses INTEGER NOT NULL DEFAULT 12,
  quantidade_estoque INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 10,
  preco_unitario DECIMAL(10,2) DEFAULT 0,
  fornecedor VARCHAR(255),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Entregas de EPI
CREATE TABLE IF NOT EXISTS entregas_epi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epi_id UUID NOT NULL REFERENCES epis(id) ON DELETE RESTRICT,
  colaborador_id UUID NOT NULL, -- Referência ao colaborador (pode ser de outra tabela)
  quantidade INTEGER NOT NULL,
  data_entrega DATE NOT NULL,
  data_validade DATE NOT NULL,
  data_devolucao DATE,
  status VARCHAR(50) DEFAULT 'ENTREGUE' CHECK (status IN ('ENTREGUE', 'DEVOLVIDO', 'EXTRAVIADO', 'DANIFICADO')),
  motivo_devolucao VARCHAR(100),
  observacoes TEXT,
  entregue_por UUID REFERENCES users(id) ON DELETE SET NULL,
  recebido_por UUID REFERENCES users(id) ON DELETE SET NULL,
  assinatura_colaborador TEXT, -- Base64 da assinatura digital
  foto_entrega TEXT, -- URL da foto do EPI entregue
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fichas (EPI, LPT, Jardineiro, Certificados)
CREATE TABLE IF NOT EXISTS fichas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('EPI', 'LPT', 'JARDINEIRO', 'CERTIFICADO', 'OUTROS')),
  colaborador_id UUID NOT NULL, -- Referência ao colaborador
  numero_ficha VARCHAR(100) NOT NULL,
  data_emissao DATE NOT NULL,
  data_validade DATE,
  arquivo_url TEXT, -- URL do PDF da ficha
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tipo, colaborador_id, numero_ficha)
);

-- Tabela de Movimentações de Estoque de EPI
CREATE TABLE IF NOT EXISTS movimentacoes_estoque_epi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epi_id UUID NOT NULL REFERENCES epis(id) ON DELETE CASCADE,
  tipo_movimentacao VARCHAR(50) NOT NULL CHECK (tipo_movimentacao IN ('ENTRADA', 'SAIDA', 'AJUSTE', 'PERDA', 'DEVOLUCAO')),
  quantidade INTEGER NOT NULL,
  quantidade_anterior INTEGER NOT NULL,
  quantidade_nova INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  numero_nota VARCHAR(100), -- Número da nota fiscal (para entradas)
  responsavel_id UUID REFERENCES users(id) ON DELETE SET NULL,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Índices para melhor performance
-- =============================================

-- Índices para EPIs
CREATE INDEX IF NOT EXISTS idx_epis_codigo ON epis(codigo);
CREATE INDEX IF NOT EXISTS idx_epis_categoria ON epis(categoria);
CREATE INDEX IF NOT EXISTS idx_epis_ativo ON epis(ativo);
CREATE INDEX IF NOT EXISTS idx_epis_estoque_baixo ON epis(quantidade_estoque) WHERE quantidade_estoque <= estoque_minimo;

-- Índices para Entregas
CREATE INDEX IF NOT EXISTS idx_entregas_epi_colaborador ON entregas_epi(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_entregas_epi_epi_id ON entregas_epi(epi_id);
CREATE INDEX IF NOT EXISTS idx_entregas_epi_status ON entregas_epi(status);
CREATE INDEX IF NOT EXISTS idx_entregas_epi_validade ON entregas_epi(data_validade);
CREATE INDEX IF NOT EXISTS idx_entregas_epi_data_entrega ON entregas_epi(data_entrega);
CREATE INDEX IF NOT EXISTS idx_entregas_epi_vencidos ON entregas_epi(data_validade) WHERE status = 'ENTREGUE' AND data_validade < CURRENT_DATE;

-- Índices para Fichas
CREATE INDEX IF NOT EXISTS idx_fichas_colaborador ON fichas(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_fichas_tipo ON fichas(tipo);
CREATE INDEX IF NOT EXISTS idx_fichas_ativo ON fichas(ativo);
CREATE INDEX IF NOT EXISTS idx_fichas_validade ON fichas(data_validade);

-- Índices para Movimentações
CREATE INDEX IF NOT EXISTS idx_movimentacoes_epi_id ON movimentacoes_estoque_epi(epi_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON movimentacoes_estoque_epi(tipo_movimentacao);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_estoque_epi(data_movimentacao);

-- =============================================
-- Comentários nas tabelas
-- =============================================

COMMENT ON TABLE epis IS 'Cadastro de Equipamentos de Proteção Individual';
COMMENT ON TABLE entregas_epi IS 'Registro de entregas de EPIs aos colaboradores';
COMMENT ON TABLE fichas IS 'Fichas de EPI, LPT, Jardineiro e Certificados dos colaboradores';
COMMENT ON TABLE movimentacoes_estoque_epi IS 'Histórico de movimentações de estoque de EPIs';

-- =============================================
-- Dados iniciais (exemplos)
-- =============================================

-- Inserir alguns EPIs de exemplo (opcional)
INSERT INTO epis (id, codigo, nome, descricao, categoria, ca, fabricante, validade_ca, durabilidade_meses, quantidade_estoque, estoque_minimo, preco_unitario)
VALUES
  (gen_random_uuid(), 'EPI-001', 'Capacete de Segurança', 'Capacete de segurança classe A', 'PROTEÇÃO DE CABEÇA', '12345', 'Fabricante A', '2026-12-31', 24, 50, 10, 25.00),
  (gen_random_uuid(), 'EPI-002', 'Luva de Segurança', 'Luva de segurança em vaqueta', 'PROTEÇÃO DE MÃOS', '23456', 'Fabricante B', '2025-12-31', 6, 100, 20, 15.00),
  (gen_random_uuid(), 'EPI-003', 'Óculos de Proteção', 'Óculos de proteção incolor', 'PROTEÇÃO DE OLHOS', '34567', 'Fabricante C', '2027-12-31', 12, 75, 15, 20.00),
  (gen_random_uuid(), 'EPI-004', 'Protetor Auricular', 'Protetor auricular tipo concha', 'PROTEÇÃO AUDITIVA', '45678', 'Fabricante D', '2026-06-30', 18, 60, 12, 30.00),
  (gen_random_uuid(), 'EPI-005', 'Botina de Segurança', 'Botina de segurança com bico de aço', 'PROTEÇÃO DE PÉS', '56789', 'Fabricante E', '2025-12-31', 12, 40, 10, 80.00)
ON CONFLICT (codigo) DO NOTHING;

-- =============================================
-- Triggers para atualizar updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_epis_updated_at
  BEFORE UPDATE ON epis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entregas_epi_updated_at
  BEFORE UPDATE ON entregas_epi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fichas_updated_at
  BEFORE UPDATE ON fichas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

