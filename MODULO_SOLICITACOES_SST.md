# Módulo de Solicitações SST - Documentação Completa

## 📋 Visão Geral

O módulo de Solicitações SST foi criado para gerenciar todos os tipos de exames ocupacionais exigidos pela NR-7, incluindo:

- **ASO Admissional**: Exames obrigatórios para novos colaboradores
- **Periódicos**: Exames de rotina dos colaboradores
- **Retorno ao Trabalho**: Exames após afastamento
- **Mudança de Risco**: Exames por mudança de função ou risco ocupacional
- **Demissional**: Exames de desligamento

## 🎯 Funcionalidades Implementadas

### Frontend

#### 1. Página Principal (`/solicitacoes`)
- Dashboard com estatísticas gerais
- Cards para navegação entre tipos de exames
- Visualização de métricas importantes:
  - Total de solicitações
  - Pendentes de agendamento
  - Realizados no mês
  - Taxa de aprovação

#### 2. Subpáginas por Tipo de Exame

**ASO Admissional** (`/solicitacoes/aso-admissional`)
- Listagem de solicitações
- Criação de nova solicitação
- Agendamento de exames
- Registro de resultados
- Integração com módulo de admissão

**Periódicos** (`/solicitacoes/periodicos`)
- Gestão de exames periódicos
- Vinculação com colaboradores existentes
- Controle de periodicidade

**Retorno ao Trabalho** (`/solicitacoes/retorno-trabalho`)
- Registro de motivo e data de afastamento
- Agendamento de exame de retorno
- Validação de aptidão

**Mudança de Risco** (`/solicitacoes/mudanca-risco`)
- Registro de cargo anterior e novo
- Avaliação de mudança de risco ocupacional

**Demissional** (`/solicitacoes/demissional`)
- Registro de data e motivo de desligamento
- Exame obrigatório para encerramento

#### 3. Cadastro de Clínicas (`/solicitacoes/clinicas`)
- CRUD completo de clínicas parceiras
- Dados cadastrais:
  - Nome, CNPJ, Razão Social
  - Contatos (telefone, email)
  - Endereço completo
  - Responsável pela clínica
  - Especialidades
  - Status (ativa/inativa)

### Backend

#### 1. Controllers

**`solicitacoesController.js`**
- `getAll()`: Listar solicitações com filtros
- `create()`: Criar nova solicitação
- `createAgendamento()`: Agendar exame
- `atualizarResultado()`: Registrar resultado do exame
- `getEstatisticas()`: Buscar estatísticas

**`clinicasController.js`**
- `getAll()`: Listar clínicas
- `create()`: Cadastrar clínica
- `update()`: Atualizar clínica
- `deleteClinica()`: Excluir clínica

#### 2. Rotas (`/api/solicitacoes`)

**Solicitações**
- `GET /` - Listar solicitações
- `POST /` - Criar solicitação
- `POST /agendamento` - Criar agendamento
- `PUT /:id/resultado` - Atualizar resultado
- `GET /estatisticas` - Buscar estatísticas

**Clínicas**
- `GET /clinicas` - Listar clínicas
- `POST /clinicas` - Criar clínica
- `PUT /clinicas/:id` - Atualizar clínica
- `DELETE /clinicas/:id` - Excluir clínica

#### 3. Banco de Dados

**Tabela: `sst_clinicas`**
```sql
- id (UUID)
- nome
- cnpj (único)
- razao_social
- telefone
- email
- endereco (JSONB)
- responsavel_nome
- responsavel_telefone
- responsavel_email
- especialidades (JSONB)
- observacoes
- ativo
- created_at
- updated_at
```

**Tabela: `sst_solicitacoes_exames`**
```sql
- id (UUID)
- tipo_exame (enum)
- colaborador_id
- colaborador_nome
- colaborador_cpf
- colaborador_email
- colaborador_telefone
- cargo
- cargo_anterior
- departamento
- setor
- admissao_id
- motivo_afastamento
- data_afastamento
- data_desligamento
- motivo_desligamento
- status (enum)
- data_solicitacao
- solicitado_por
- observacoes
- clinica_id
- data_agendamento
- hora_agendamento
- status_agendamento (enum)
- resultado (enum)
- restricoes
- data_realizacao
- medico_responsavel
- crm_medico
- aso_arquivo_url
- created_at
- updated_at
```

## 🔐 Permissões

O módulo está acessível para:
- **ADMINISTRADOR**: Acesso completo
- **GESTOR**: Acesso completo

## 📊 Fluxo de Trabalho

### 1. Cadastro de Clínica
1. Acessar "Cadastro de Clínicas"
2. Preencher dados da clínica
3. Salvar

### 2. Criação de Solicitação
1. Selecionar tipo de exame
2. Preencher dados do colaborador
3. Adicionar informações específicas (cargo, departamento, etc.)
4. Criar solicitação (status: PENDENTE)

### 3. Agendamento
1. Abrir solicitação pendente
2. Selecionar clínica
3. Definir data e hora
4. Confirmar agendamento (status: AGENDADO)

### 4. Registro de Resultado
1. Após realização do exame
2. Registrar resultado (APTO, INAPTO, APTO_COM_RESTRICOES)
3. Informar médico responsável e CRM
4. Upload do ASO (opcional)
5. Salvar (status: REALIZADO)

## 🎨 Componentes Visuais

### Cores por Tipo de Exame
- **ASO Admissional**: #354a80 (Azul escuro)
- **Periódicos**: #0288d1 (Azul)
- **Retorno ao Trabalho**: #2e7d32 (Verde)
- **Mudança de Risco**: #ed6c02 (Laranja)
- **Demissional**: #d32f2f (Vermelho)

### Status
- **PENDENTE**: Amarelo/Warning
- **AGENDADO**: Azul/Info
- **REALIZADO**: Verde/Success
- **CANCELADO**: Cinza/Default
- **REPROVADO**: Vermelho/Error

### Resultados
- **APTO**: Verde/Success
- **INAPTO**: Vermelho/Error
- **APTO_COM_RESTRICOES**: Amarelo/Warning

## 🔄 Integração com Outros Módulos

### Admissão
- ASO Admissional vinculado à etapa "Exame Admissional (SST)"
- Campo `admissao_id` na solicitação
- Fluxo automático quando admissão chega na etapa SST

### Prontuário (Futuro)
- Histórico de exames do colaborador
- Visualização de ASOs anteriores
- Alertas de vencimento de exames periódicos

## 📝 Próximas Melhorias

1. **Notificações Automáticas**
   - Lembrete de agendamento
   - Confirmação de exame
   - Alerta de vencimento (periódicos)

2. **Relatórios**
   - Exames realizados por período
   - Exames pendentes
   - Taxa de aprovação por clínica
   - Custos por clínica

3. **Integração com Calendário**
   - Visualização de agendamentos
   - Conflitos de horário
   - Disponibilidade de clínicas

4. **Upload de Documentos**
   - Upload direto do ASO
   - Armazenamento em cloud (Cloudinary)
   - Visualização inline

5. **Workflow Automático**
   - Criação automática de solicitações periódicas
   - Cálculo de periodicidade por cargo/risco
   - Integração com eSocial (S-2220)

## 🚀 Como Usar

### Para Desenvolvedores

1. **Frontend**
   ```bash
   # As páginas já estão criadas e roteadas
   # Acesse via menu "Solicitações SST"
   ```

2. **Backend**
   ```bash
   # As rotas estão em /api/solicitacoes
   # Controllers em backend/controllers/
   # Migrations já executadas
   ```

3. **Banco de Dados**
   ```bash
   # Executar migration (se necessário)
   cd database
   node run-migration-sst.js
   ```

### Para Usuários

1. Acesse o sistema FGS
2. No menu lateral, clique em "Solicitações SST"
3. Primeiro, cadastre as clínicas parceiras
4. Depois, crie solicitações conforme necessário
5. Agende os exames nas clínicas
6. Registre os resultados após realização

## ✅ Checklist de Implementação

- [x] Tipos TypeScript
- [x] Service (API)
- [x] Página principal
- [x] Subpágina ASO Admissional
- [x] Subpágina Periódicos
- [x] Subpágina Retorno ao Trabalho
- [x] Subpágina Mudança de Risco
- [x] Subpágina Demissional
- [x] Cadastro de Clínicas
- [x] Rotas frontend
- [x] Menu no layout
- [x] Controllers backend
- [x] Rotas backend
- [x] Migrations
- [x] Tabelas criadas

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verificar logs do backend
2. Verificar console do navegador
3. Consultar documentação da NR-7
4. Contatar equipe de desenvolvimento

---

**Desenvolvido em**: 15/12/2024  
**Versão**: 1.0.0  
**Status**: ✅ Completo e Funcional

