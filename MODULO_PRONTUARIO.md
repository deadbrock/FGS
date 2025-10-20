# 📋 Módulo Prontuário do Colaborador

## 🎯 Visão Geral

Módulo completo para gerenciamento de prontuário de colaboradores no sistema FGS, incluindo dados pessoais, contratuais, exames médicos, atestados, férias, treinamentos, advertências e frequência.

---

## ✨ Funcionalidades Implementadas

### 📊 8 Seções Organizadas em Abas

1. **Dados Pessoais**
   - Nome, CPF, RG, Data de Nascimento
   - Sexo, Estado Civil
   - Nacionalidade, Naturalidade
   - Filiação (Mãe e Pai)
   - Contatos (Telefone, Celular, E-mail)
   - Endereço Completo (CEP, Logradouro, Número, Complemento, Bairro, Cidade, UF)

2. **Dados Contratuais**
   - Data de Admissão e Desligamento
   - Cargo e Departamento
   - Tipo de Contrato (CLT, PJ, Estágio, Temporário)
   - Salário
   - Jornada de Trabalho
   - Horários de Entrada/Saída
   - Upload de Contrato

3. **Exames Médicos**
   - Tipos: Admissional, Periódico, Demissional, Retorno, Mudança de Função
   - Data de Realização e Validade
   - Resultado (Apto, Inapto, Apto com Restrições)
   - Médico e CRM
   - Observações
   - Upload de Exame
   - **Status Automático** (Vencido se data < hoje)
   - **Tabela com filtros e paginação**

4. **Atestados Médicos**
   - Data de Emissão
   - Período de Afastamento
   - CID (opcional)
   - Médico e CRM
   - Upload de Atestado
   - Status automático

5. **Férias**
   - Período Aquisitivo
   - Dias de Direito, Gozados e Restantes
   - Data de Início e Fim
   - Tipo (Integral, Fracionada, Abono Pecuniário)
   - Cards visuais por período
   - Status colorido

6. **Treinamentos**
   - Título e Descrição
   - Data de Início e Fim
   - Carga Horária
   - Instrutor e Instituição
   - Nota (0-10)
   - Upload de Certificado
   - **Tabela com filtros e paginação**
   - Status de conclusão

7. **Advertências**
   - Tipos: Verbal, Escrita, Suspensão
   - Data e Motivo
   - Descrição detalhada
   - Responsável pela aplicação
   - Upload de documento
   - Status

8. **Frequência/Ponto**
   - Registro de entrada e saída
   - Horas extras e atrasos
   - Faltas e justificativas
   - Status diário

---

## 🎨 Componentes Criados

### 📝 Formulários

#### `DadosPessoaisForm.tsx`
- Formulário completo de dados pessoais
- Validação de campos obrigatórios
- Máscara automática para CPF, telefone
- Campo de endereço completo

#### `DadosContratuaisForm.tsx`
- Dados contratuais e trabalhistas
- Upload de contrato
- Campos monetários formatados
- Seleção de tipo de contrato

#### `ExameMedicoForm.tsx`
- Cadastro de exames médicos
- Seleção de tipo de exame
- Campos de validade
- Upload de documento

#### `TreinamentoForm.tsx`
- Cadastro de treinamentos
- Cálculo automático de carga horária
- Campo de nota
- Upload de certificado

### 📊 Tabelas e Filtros

#### `TabelaPaginada.tsx`
- Componente genérico de tabela
- Paginação integrada
- Ordenação por colunas
- Formato customizável por coluna
- Responsivo

#### `FiltrosTabela.tsx`
- Busca por texto
- Filtro por status (múltipla seleção)
- Filtro por data (início e fim)
- Botão limpar filtros
- Chips visuais de status

### 🎯 Componentes de UI

#### `StatusChip.tsx`
- Chip colorido por status
- 5 status: Aprovado, Pendente, Vencido, Em Análise, Cancelado
- Cores automáticas

#### `FileUpload.tsx`
- Upload de múltiplos arquivos
- Validação de tipo e tamanho
- Preview de imagens
- Lista de arquivos selecionados
- Limite de tamanho configurável

---

## 🔧 Serviços e API

### `prontuarioService.ts`
Integração completa com backend:

```typescript
- buscarProntuario(colaboradorId): Promise<ProntuarioColaborador>
- atualizarDadosPessoais(colaboradorId, dados): Promise<void>
- atualizarDadosContratuais(colaboradorId, dados): Promise<void>
- listarExames(colaboradorId, params, filtros): Promise<PaginacaoResultado>
- criarExame(colaboradorId, exame): Promise<ExameMedico>
- listarAtestados(colaboradorId, params, filtros): Promise<PaginacaoResultado>
- listarFerias(colaboradorId): Promise<Ferias[]>
- listarTreinamentos(colaboradorId, params, filtros): Promise<PaginacaoResultado>
- criarTreinamento(colaboradorId, treinamento): Promise<Treinamento>
- listarAdvertencias(colaboradorId): Promise<Advertencia[]>
- uploadArquivo(colaboradorId, tipo, file): Promise<string>
```

### `prontuarioService.mock.ts`
Serviço mock para testes sem backend com dados de exemplo.

---

## 📝 Tipos TypeScript

### Principais Interfaces

```typescript
// Status
enum StatusProntuario {
  APROVADO, PENDENTE, VENCIDO, EM_ANALISE, CANCELADO
}

// Dados Pessoais
interface DadosPessoais {
  id, nome, cpf, rg, dataNascimento, sexo, estadoCivil,
  nacionalidade, naturalidade, nomeMae, nomePai,
  telefone, celular, email, endereco: Endereco
}

// Exame Médico
interface ExameMedico {
  id, colaboradorId, tipo, dataRealizacao, dataValidade,
  resultado, observacoes, status, anexo, medico, crm
}

// Treinamento
interface Treinamento {
  id, colaboradorId, titulo, descricao, dataInicio, dataFim,
  cargaHoraria, instrutor, instituicao, status, certificado, nota
}

// Paginação
interface PaginacaoParams {
  pagina, itensPorPagina, ordenarPor?, ordem?
}

interface PaginacaoResultado<T> {
  dados: T[], total, pagina, totalPaginas
}
```

---

## 🎯 Sistema de Status Automático

### Lógica de Status

```typescript
// Verifica vencimento baseado em data de validade
verificarVencimento(dataValidade: string): StatusProntuario {
  - Se data < hoje → VENCIDO
  - Se vence em ≤ 30 dias → PENDENTE
  - Caso contrário → APROVADO
}
```

### Cores de Status

| Status | Cor | Uso |
|--------|-----|-----|
| APROVADO | Verde (#388e3c) | Item válido e aprovado |
| PENDENTE | Laranja (#f57c00) | Aguardando ação ou próximo de vencer |
| VENCIDO | Vermelho (#d32f2f) | Item expirado |
| EM_ANALISE | Azul (#1976d2) | Em processo de análise |
| CANCELADO | Cinza (#757575) | Cancelado ou inativo |

---

## 🚀 Como Usar

### 1. Acessar o Módulo

O módulo está disponível no menu lateral como **"Prontuário"**.

**Permissões:**
- ✅ Administrador
- ✅ RH
- ✅ Gestor
- ❌ Colaborador

### 2. Navegar pelas Abas

Clique nas abas para alternar entre as seções:
- Dados Pessoais
- Dados Contratuais
- Exames Médicos
- Atestados
- Férias
- Treinamentos
- Advertências
- Frequência

### 3. Adicionar Registros

Nas seções com tabelas (Exames, Treinamentos):
1. Clique no botão **"Novo Exame"** ou **"Novo Treinamento"**
2. Preencha o formulário
3. Faça upload dos anexos (opcional)
4. Clique em **"Salvar"**

### 4. Filtrar Dados

Use os filtros disponíveis:
- **Busca por texto** - Digite palavras-chave
- **Filtro por status** - Clique nos chips de status
- **Filtro por data** - Selecione data início/fim
- **Limpar** - Remove todos os filtros

### 5. Visualizar e Baixar Anexos

Nas tabelas, use os ícones:
- 👁️ **Visualizar** - Ver detalhes do registro
- 📥 **Download** - Baixar anexo (se disponível)

---

## 🔌 Integração com Backend

### Endpoints Necessários

```
GET /api/prontuario/:colaboradorId
  → Retorna prontuário completo

PUT /api/prontuario/:colaboradorId/dados-pessoais
  Body: DadosPessoais
  → Atualiza dados pessoais

PUT /api/prontuario/:colaboradorId/dados-contratuais
  Body: DadosContratuais
  → Atualiza dados contratuais

GET /api/prontuario/:colaboradorId/exames
  Query: pagina, itensPorPagina, status[], busca
  → Lista exames com paginação

POST /api/prontuario/:colaboradorId/exames
  Body: ExameMedico
  → Cria novo exame

GET /api/prontuario/:colaboradorId/treinamentos
  Query: pagina, itensPorPagina, status[], busca
  → Lista treinamentos com paginação

POST /api/prontuario/:colaboradorId/treinamentos
  Body: Treinamento
  → Cria novo treinamento

POST /api/prontuario/:colaboradorId/upload
  FormData: file, tipo
  → Upload de arquivo
  → Retorna: { url: string }
```

### Para usar com backend real:

1. Abra `src/pages/Prontuario.tsx`
2. Na linha 23, troque:
```typescript
import prontuarioService from '../services/prontuarioService.mock';
```
por:
```typescript
import prontuarioService from '../services/prontuarioService';
```

---

## 📂 Arquivos Criados

```
src/
├── types/
│   └── prontuario.ts (350+ linhas)
│
├── utils/
│   └── statusUtils.ts
│
├── components/
│   ├── StatusChip.tsx
│   ├── FileUpload.tsx
│   ├── TabelaPaginada.tsx
│   ├── FiltrosTabela.tsx
│   └── prontuario/
│       ├── DadosPessoaisForm.tsx
│       ├── DadosContratuaisForm.tsx
│       ├── ExameMedicoForm.tsx
│       └── TreinamentoForm.tsx
│
├── pages/
│   └── Prontuario.tsx (500+ linhas)
│
└── services/
    ├── prontuarioService.ts
    └── prontuarioService.mock.ts
```

**Total:** 13 arquivos novos + 5 arquivos modificados

---

## 🎨 Interface Visual

### Layout Principal
- **Abas horizontais** no topo do card
- **Conteúdo dinâmico** baseado na aba selecionada
- **Botões de ação** no cabeçalho de cada seção
- **Design consistente** com o resto do sistema FGS

### Tabelas
- **Cabeçalhos ordenáveis** (clique para ordenar)
- **Paginação** no rodapé
- **Chips coloridos** para status
- **Ícones de ação** para cada linha
- **Hover effect** nas linhas

### Formulários
- **Grid responsivo** (adapta para mobile)
- **Campos obrigatórios** marcados com *
- **Validação automática**
- **Upload visual** com lista de arquivos

### Diálogos (Modals)
- **Tamanho médio** (maxWidth="md")
- **Scroll automático** em conteúdo longo
- **Botões de ação** no rodapé
- **Fechamento** por ESC ou botão

---

## 🔐 Permissões

### Por Perfil

| Ação | Admin | RH | Gestor | Colaborador |
|------|-------|-----|--------|-------------|
| Visualizar Prontuário | ✅ | ✅ | ✅ | ❌ |
| Editar Dados Pessoais | ✅ | ✅ | ❌ | ❌ |
| Editar Dados Contratuais | ✅ | ✅ | ❌ | ❌ |
| Adicionar Exames | ✅ | ✅ | ❌ | ❌ |
| Adicionar Treinamentos | ✅ | ✅ | ✅ | ❌ |
| Visualizar Advertências | ✅ | ✅ | ✅ | ❌ |

*Nota: Permissões granulares podem ser implementadas conforme necessidade.*

---

## 📊 Dados Mock Disponíveis

O serviço mock inclui dados de exemplo para:
- ✅ 1 colaborador completo
- ✅ 2 exames médicos (1 aprovado, 1 pendente)
- ✅ 1 atestado médico
- ✅ 2 períodos de férias
- ✅ 2 treinamentos concluídos
- ✅ 0 advertências (colaborador exemplar!)

---

## 🚀 Próximas Melhorias Sugeridas

### Curto Prazo
- [ ] Implementar edição inline nas tabelas
- [ ] Adicionar exportação para PDF
- [ ] Implementar busca avançada
- [ ] Adicionar gráficos de acompanhamento

### Médio Prazo
- [ ] Timeline visual do histórico
- [ ] Notificações de vencimento
- [ ] Assinatura digital de documentos
- [ ] Integração com e-Social

### Longo Prazo
- [ ] OCR para leitura de documentos
- [ ] Comparação de versões
- [ ] Auditoria completa de mudanças
- [ ] App mobile para consulta

---

## 🐛 Troubleshooting

### Problema: Tabela não carrega dados
**Solução:** Verifique se está usando o serviço mock ou se o backend está respondendo.

### Problema: Upload não funciona
**Solução:** Verifique o tamanho máximo do arquivo (padrão: 5MB) e formatos aceitos.

### Problema: Filtros não funcionam
**Solução:** Limpe os filtros e tente novamente. Verifique o console para erros.

### Problema: Status não atualiza automaticamente
**Solução:** A função `verificarVencimento()` deve ser chamada ao carregar os dados.

---

## 📞 Suporte

Para dúvidas sobre o módulo de Prontuário:
1. Consulte esta documentação
2. Veja o código fonte dos componentes
3. Teste com dados mock primeiro
4. Verifique os logs do console do navegador

---

## ✅ Checklist de Testes

### Antes de usar em produção:

- [ ] Testar todas as abas
- [ ] Testar paginação nas tabelas
- [ ] Testar filtros e busca
- [ ] Testar upload de arquivos
- [ ] Testar responsividade (mobile/tablet)
- [ ] Testar permissões por perfil
- [ ] Validar integração com backend
- [ ] Verificar performance com muitos registros
- [ ] Testar status automáticos
- [ ] Verificar formatação de datas

---

**Módulo desenvolvido para FGS - Formando Gente de Sucesso** 🎓  
**Versão:** 1.0.0  
**Data:** 19 de outubro de 2025  
**Status:** ✅ Completo e Funcional

