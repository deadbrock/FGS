# Módulo de Benefícios - FGS

## Visão Geral

O módulo de **Gestão de Benefícios** permite o controle completo de benefícios corporativos, custos, associações por colaborador e histórico de alterações.

---

## Funcionalidades Principais

### 1️⃣ Cadastro de Benefícios (Templates)
- **14 tipos pré-definidos**: Vale Refeição, Plano de Saúde, Seguro de Vida, etc.
- **Configuração de valores**: Fixo, percentual do salário ou variável
- **Frequência**: Mensal, trimestral, semestral, anual ou único
- **Elegibilidade**: Por cargo, departamento ou nível hierárquico
- **Custos**: Separação entre empresa e colaborador
- **Status**: Ativo, Inativo, Suspenso ou Cancelado

### 2️⃣ Associação por Colaborador
- **Vincular benefícios** a colaboradores específicos
- **Valores personalizados** (diferentes do padrão)
- **Documentos de comprovação** (quando necessário)
- **Controle de aprovação** (por gestor/RH)
- **Data de início e fim** de vigência
- **Renovação automática** com alertas

### 3️⃣ Histórico Completo de Alterações
- **Timeline visual** com todas as mudanças
- **Tipos registrados**:
  - ✅ Concessão
  - ✏️ Alteração de valor
  - ⏸️ Suspensão
  - ▶️ Reativação
  - ❌ Cancelamento
- **Rastreabilidade**: Quem fez, quando e por quê
- **Observações** e motivos detalhados

### 4️⃣ Relatórios de Custos
- **Consolidação por período**
- **Custo total**: Empresa + Colaborador
- **Análise por tipo de benefício**
- **Análise por departamento**
- **Top colaboradores** (maiores custos)
- **Percentuais e gráficos** visuais

### 5️⃣ Comparativos entre Períodos
- **Variação absoluta e percentual**
- **Comparação por tipo** de benefício
- **Comparação por departamento**
- **Tendências de crescimento**
- **Exportação para CSV**

---

## Estrutura de Arquivos

```
src/
├── types/
│   └── beneficios.ts                 # Tipos TypeScript (21 interfaces)
├── utils/
│   └── beneficiosUtils.ts            # Funções auxiliares
├── components/
│   └── beneficios/
│       ├── BeneficioForm.tsx         # Formulário de cadastro
│       ├── HistoricoAlteracoes.tsx   # Timeline de histórico
│       └── RelatorioCustos.tsx       # Relatório com tabelas
├── services/
│   ├── beneficiosService.ts          # Serviço API (modo mock)
│   └── beneficiosService.mock.ts     # Dados mock
└── pages/
    └── Beneficios.tsx                # Página principal (5 abas)
```

---

## Tipos de Benefícios Suportados

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| Vale Refeição | 🍽️ | Cartão refeição mensal |
| Vale Alimentação | 🛒 | Cartão alimentação |
| Vale Transporte | 🚌 | Auxílio transporte |
| Vale Combustível | ⛽ | Auxílio combustível |
| Plano de Saúde | 🏥 | Plano médico |
| Plano Odontológico | 🦷 | Plano dentário |
| Seguro de Vida | 🛡️ | Seguro em grupo |
| Auxílio Educação | 📚 | Bolsa de estudos |
| Auxílio Creche | 👶 | Ajuda de custo creche |
| Participação nos Lucros | 💰 | PLR anual |
| Bônus | 🎁 | Bonificações |
| Incentivo Performance | 🏆 | Premiações |
| Gym Pass | 💪 | Academia |
| Outros | 📋 | Personalizado |

---

## Tipos de Dados

### Benefício (Template)
```typescript
interface Beneficio {
  id: string;
  tipo: TipoBeneficio;
  nome: string;
  descricao: string;
  fornecedor?: string; // Ex: Alelo, Sodexo
  
  // Valores
  tipoValor: TipoValor; // VALOR_FIXO | PERCENTUAL_SALARIO | VARIAVEL
  valorFixo?: number;
  percentualSalario?: number;
  
  // Configurações
  frequencia: FrequenciaBeneficio;
  exigeComprovacao: boolean;
  
  // Elegibilidade
  cargoElegivel?: string[];
  departamentoElegivel?: string[];
  
  // Custos
  custoEmpresa: number;
  custoColaborador: number;
  
  // Status
  status: StatusBeneficio;
  dataInicio: string;
  dataFim?: string;
}
```

### Benefício do Colaborador
```typescript
interface BeneficioColaborador {
  id: string;
  colaboradorId: string;
  beneficioId: string;
  
  // Valores específicos
  valorConcedido: number;
  custoEmpresaReal: number;
  custoColaboradorReal: number;
  
  // Status e documentação
  status: StatusBeneficio;
  documentosComprovacao: string[];
  proximaRenovacao?: string;
  
  // Aprovação
  aprovadoPor?: string;
  dataAprovacao?: string;
}
```

### Histórico de Alterações
```typescript
interface HistoricoBeneficio {
  id: string;
  colaboradorNome: string;
  beneficioNome: string;
  
  tipoAlteracao: 'CONCESSAO' | 'ALTERACAO_VALOR' | 'SUSPENSAO' | 'REATIVACAO' | 'CANCELAMENTO';
  
  valorAnterior?: number;
  valorNovo?: number;
  statusAnterior?: StatusBeneficio;
  statusNovo?: StatusBeneficio;
  
  motivo: string;
  alteradoPor: string;
  dataAlteracao: string;
}
```

---

## Funções Utilitárias

### Formatação
```typescript
formatarMoeda(valor: number): string
// Exemplo: 1500 -> "R$ 1.500,00"

getTipoNome(tipo: TipoBeneficio): string
// Exemplo: VALE_REFEICAO -> "Vale Refeição"

getTipoIcone(tipo: TipoBeneficio): string
// Exemplo: VALE_REFEICAO -> "🍽️"
```

### Cálculos
```typescript
calcularValorBeneficio(beneficio, salario): number
// Calcula valor baseado no tipo (fixo ou % salário)

calcularCustoAnual(beneficio): number
// Projeta custo anual baseado na frequência

calcularVariacaoPercentual(valorAnterior, valorAtual): number
// Calcula variação % entre períodos
```

### Validações
```typescript
validarElegibilidade(beneficio, cargo, departamento): boolean
// Verifica se colaborador é elegível

estaProximoVencimento(dataFim, diasAntecedencia): boolean
// Verifica se benefício está próximo de vencer
```

---

## Páginas e Navegação

### Página Principal: `/beneficios`
Organizada em **5 abas**:

#### 📊 Aba 1: Dashboard
- **Cards de resumo**:
  - Total de benefícios ativos
  - Colaboradores atendidos
  - Custo mensal empresa
  - Custo total mensal
- **Gráfico de distribuição** por tipo
- **Evolução de custos** mensal
- **Alertas**: Vencimentos e pendências

#### 🎁 Aba 2: Benefícios
- **Listagem de benefícios** cadastrados
- **Botão "Novo Benefício"**
- **Formulário completo**:
  - Tipo e nome
  - Descrição e fornecedor
  - Tipo de valor (fixo/% salário)
  - Frequência
  - Custos empresa e colaborador
  - Elegibilidade
- **Edição inline**

#### 👥 Aba 3: Colaboradores
- **Tabela de associações**
- **Filtros**: Por colaborador, tipo, status
- **Informações**:
  - Colaborador e departamento
  - Benefício concedido
  - Valor atual
  - Data de início
  - Status
- **Ações**: Editar, Suspender, Renovar

#### 📜 Aba 4: Histórico
- **Timeline visual** de alterações
- **Filtros**: Por colaborador ou benefício
- **Detalhes completos**:
  - Tipo de alteração (ícone colorido)
  - Valores anterior e novo
  - Motivo da mudança
  - Responsável
  - Data e hora

#### 📈 Aba 5: Relatórios
- **Filtro por período** (início e fim)
- **Botão "Gerar Relatório"**
- **Cards de totais**:
  - Custo empresa
  - Custo colaborador
  - Total de benefícios
  - Colaboradores atendidos
- **Tabela por tipo**:
  - Quantidade
  - Custos detalhados
  - Percentual do total
  - Barra de progresso visual
- **Tabela por departamento**:
  - Benefícios concedidos
  - Colaboradores atendidos
  - Custo total
  - Média por colaborador
- **Exportação para CSV**

---

## Permissões de Acesso

**Quem pode acessar:**
- ✅ Administrador (acesso total)
- ✅ RH (acesso total)
- ✅ Gestor (visualização e solicitações)

**Colaboradores comuns** podem:
- Ver seus próprios benefícios
- Solicitar novos benefícios
- Acessar comprovantes

---

## Integração com Menu

O módulo foi adicionado ao menu lateral com:
- **Ícone**: 🎁 CardGiftcard
- **Título**: "Benefícios"
- **Posição**: Entre "Ponto e Frequência" e "Configurações"
- **Rota**: `/beneficios`

---

## Exemplos de Uso

### 1. Criar Novo Benefício
```typescript
const novoBeneficio = {
  tipo: TipoBeneficio.VALE_REFEICAO,
  nome: 'Vale Refeição Padrão',
  descricao: 'Vale refeição mensal',
  fornecedor: 'Alelo',
  tipoValor: TipoValor.VALOR_FIXO,
  valorFixo: 30, // R$ 30/dia
  frequencia: FrequenciaBeneficio.MENSAL,
  custoEmpresa: 900,
  custoColaborador: 0,
  status: StatusBeneficio.ATIVO,
};

await beneficiosService.criarBeneficio(novoBeneficio);
```

### 2. Associar Benefício a Colaborador
```typescript
const associacao = {
  colaboradorId: '123',
  beneficioId: '456',
  valorConcedido: 900,
  custoEmpresaReal: 900,
  custoColaboradorReal: 0,
  status: StatusBeneficio.ATIVO,
  dataInicio: '2024-01-01',
};

await beneficiosService.associarBeneficio(associacao);
```

### 3. Gerar Relatório de Custos
```typescript
const relatorio = await beneficiosService.gerarRelatorioCustos(
  '2024-01-01',
  '2024-12-31'
);

console.log(`Custo Total: ${formatarMoeda(relatorio.custoTotal)}`);
console.log(`Benefícios: ${relatorio.totalBeneficios}`);
console.log(`Colaboradores: ${relatorio.totalColaboradores}`);
```

---

## Cores e Estilos

### Cores de Status
```typescript
ATIVO → #388e3c (verde)
INATIVO → #757575 (cinza)
SUSPENSO → #f57c00 (laranja)
CANCELADO → #d32f2f (vermelho)
```

### Cores de Tipos (Exemplos)
```typescript
VALE_REFEICAO → #2e7d32 (verde escuro)
PLANO_SAUDE → #d32f2f (vermelho)
VALE_TRANSPORTE → #1976d2 (azul)
AUXILIO_EDUCACAO → #f57c00 (laranja)
```

---

## Fluxos de Processo

### Fluxo de Concessão
1. RH cadastra benefício (template)
2. Define elegibilidade e custos
3. Associa a colaborador específico
4. Colaborador recebe notificação
5. Se exige comprovação → envia documentos
6. RH aprova
7. Registrado no histórico

### Fluxo de Alteração
1. Colaborador solicita ou RH identifica necessidade
2. RH altera valor/status
3. Sistema registra valores anterior/novo
4. Salva motivo e responsável
5. Histórico atualizado automaticamente

### Fluxo de Renovação
1. Sistema detecta benefício próximo ao vencimento
2. Gera alerta automático
3. RH revisa e renova
4. Nova data de vigência definida
5. Histórico registrado

---

## Próximos Passos

### Integração com Backend
1. Descomente o código em `beneficiosService.ts`
2. Configure os endpoints da API:
   - `GET/POST /beneficios`
   - `GET/POST /beneficios-colaborador`
   - `GET /beneficios/historico`
   - `GET /beneficios/estatisticas`
   - `GET /beneficios/relatorios/custos`

### Melhorias Futuras
- 🔔 **Notificações**: Alertas de vencimento automáticos
- 📱 **Portal do Colaborador**: Autoatendimento
- 🤖 **Automação**: Renovações automáticas
- 📊 **BI**: Dashboards avançados com comparativos
- 💳 **Integração**: APIs de fornecedores (Alelo, Sodexo)
- 📄 **Documentos**: Upload e gestão de comprovantes
- 🔐 **Workflow**: Aprovação multinível

---

## Suporte

Para dúvidas ou problemas:
1. Consulte os comentários no código
2. Verifique os tipos em `src/types/beneficios.ts`
3. Teste com dados mock antes de integrar backend

---

**Módulo desenvolvido para o sistema FGS - Formando Gente de Sucesso** 🚀

