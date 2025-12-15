# Módulo de Gestão de EPIs - Plano de Implementação

## 📋 Status Atual

### ✅ Concluído
- [x] Tipos TypeScript completos
- [x] Service com todas as APIs
- [x] Página principal com tabs
- [x] Cadastro de EPIs (CRUD completo)

### 🚧 Em Desenvolvimento

#### Frontend - Páginas Restantes

1. **EntregaEPIs.tsx** - Vincular EPI a Colaborador
   - Buscar colaborador por CPF/Nome
   - Selecionar EPI do estoque
   - Definir quantidade
   - Calcular data de validade automaticamente
   - Assinatura digital (opcional)
   - Foto do EPI entregue (opcional)

2. **HistoricoEPIs.tsx** - Histórico de Entregas
   - Listar todas as entregas
   - Filtros: colaborador, EPI, período, status
   - Visualizar detalhes de cada entrega
   - Exportar relatório

3. **ControleValidade.tsx** - Controle de Validade
   - EPIs vencidos (alerta vermelho)
   - EPIs a vencer em 30 dias (alerta amarelo)
   - EPIs a vencer em 60 dias (alerta azul)
   - Ações: notificar colaborador, agendar troca

4. **DevolucaoEPIs.tsx** - Devoluções
   - Listar EPIs em uso
   - Registrar devolução
   - Motivo: normal, extraviado, danificado
   - Atualizar estoque automaticamente

5. **Fichas.tsx** - Gestão de Fichas
   - Tabs: EPI, LPT, Jardineiro, Certificados
   - Upload de PDF
   - Controle de validade
   - Histórico por colaborador

#### Backend

1. **Controllers**
   - `epiController.js` - CRUD de EPIs
   - `entregaEPIController.js` - Entregas e devoluções
   - `fichaController.js` - Gestão de fichas
   - `movimentacaoController.js` - Controle de estoque

2. **Routes**
   - `epiRoutes.js` - Todas as rotas do módulo

3. **Migrations**
   - `create-epi-tables.sql`:
     ```sql
     CREATE TABLE epis (
       id UUID PRIMARY KEY,
       codigo VARCHAR(50) UNIQUE NOT NULL,
       nome VARCHAR(255) NOT NULL,
       descricao TEXT,
       categoria VARCHAR(100) NOT NULL,
       ca VARCHAR(50) NOT NULL,
       fabricante VARCHAR(255) NOT NULL,
       validade_ca DATE NOT NULL,
       durabilidade_meses INTEGER NOT NULL,
       quantidade_estoque INTEGER DEFAULT 0,
       estoque_minimo INTEGER DEFAULT 10,
       preco_unitario DECIMAL(10,2),
       fornecedor VARCHAR(255),
       observacoes TEXT,
       ativo BOOLEAN DEFAULT true,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE entregas_epi (
       id UUID PRIMARY KEY,
       epi_id UUID REFERENCES epis(id),
       colaborador_id UUID,
       quantidade INTEGER NOT NULL,
       data_entrega DATE NOT NULL,
       data_validade DATE NOT NULL,
       data_devolucao DATE,
       status VARCHAR(50) DEFAULT 'ENTREGUE',
       motivo_devolucao TEXT,
       observacoes TEXT,
       entregue_por UUID REFERENCES users(id),
       recebido_por UUID,
       assinatura_colaborador TEXT,
       foto_entrega TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE fichas (
       id UUID PRIMARY KEY,
       tipo VARCHAR(50) NOT NULL,
       colaborador_id UUID NOT NULL,
       numero_ficha VARCHAR(100) NOT NULL,
       data_emissao DATE NOT NULL,
       data_validade DATE,
       arquivo_url TEXT,
       observacoes TEXT,
       ativo BOOLEAN DEFAULT true,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE movimentacoes_estoque_epi (
       id UUID PRIMARY KEY,
       epi_id UUID REFERENCES epis(id),
       tipo_movimentacao VARCHAR(50) NOT NULL,
       quantidade INTEGER NOT NULL,
       quantidade_anterior INTEGER NOT NULL,
       quantidade_nova INTEGER NOT NULL,
       motivo TEXT NOT NULL,
       numero_nota VARCHAR(100),
       responsavel_id UUID REFERENCES users(id),
       data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       observacoes TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE INDEX idx_entregas_epi_colaborador ON entregas_epi(colaborador_id);
     CREATE INDEX idx_entregas_epi_status ON entregas_epi(status);
     CREATE INDEX idx_entregas_epi_validade ON entregas_epi(data_validade);
     CREATE INDEX idx_fichas_colaborador ON fichas(colaborador_id);
     CREATE INDEX idx_fichas_tipo ON fichas(tipo);
     ```

#### Integrações

1. **Menu e Rotas**
   - Adicionar "EPIs" no menu lateral
   - Configurar rotas no `routes/index.tsx`
   - Permissões: Segurança do Trabalho (Gestor e Usuário)

2. **Notificações**
   - Alertas automáticos de validade
   - Notificações de estoque baixo
   - Lembretes de devolução

## 🎯 Funcionalidades Principais

### Cadastro de EPIs
- ✅ CRUD completo
- ✅ Controle de estoque
- ✅ Alertas de estoque baixo
- ✅ Validação de CA

### Entrega de EPIs
- Buscar colaborador
- Selecionar EPI disponível
- Calcular validade automaticamente
- Registrar assinatura (opcional)
- Tirar foto (opcional)
- Atualizar estoque

### Histórico
- Ver todas as entregas
- Filtrar por colaborador/EPI/período
- Exportar relatórios
- Visualizar detalhes

### Controle de Validade
- Dashboard com alertas
- EPIs vencidos
- EPIs a vencer (30/60 dias)
- Ações rápidas

### Devolução
- Listar EPIs em uso
- Registrar devolução
- Motivos: normal, extraviado, danificado
- Atualizar estoque automaticamente

### Fichas
- Ficha de EPI (obrigatória)
- LPT (Laudo de Periculosidade)
- Ficha de Jardineiro
- Certificados diversos
- Upload de PDF
- Controle de validade

## 📊 Estatísticas

- Total de EPIs cadastrados
- Total em estoque
- EPIs em uso
- EPIs disponíveis
- EPIs vencidos
- Estoque baixo
- Entregas no mês
- Devoluções no mês
- Valor total do estoque
- Distribuição por categoria

## 🔔 Alertas Automáticos

1. **Estoque Baixo**
   - Quando quantidade <= estoque_minimo
   - Notificar responsável

2. **CA Vencido**
   - Quando validade_ca < hoje
   - Bloquear novas entregas

3. **EPI Vencido**
   - Quando data_validade < hoje
   - Notificar colaborador e SST

4. **A Vencer**
   - 30 dias antes: alerta amarelo
   - 15 dias antes: alerta laranja
   - 7 dias antes: alerta vermelho

## 🚀 Próximos Passos

1. Criar as páginas restantes do frontend
2. Criar controllers e routes do backend
3. Executar migrations no banco
4. Adicionar rotas e menu
5. Testar todas as funcionalidades
6. Implementar notificações automáticas

## 📝 Observações

- O módulo está sendo desenvolvido de forma modular
- Cada funcionalidade é independente
- Fácil de manter e expandir
- Seguindo padrões do projeto

---

**Data**: 15/12/2024  
**Status**: 🚧 Em Desenvolvimento (40% concluído)  
**Próxima Sessão**: Continuar criação das páginas frontend

