# 👥 Aba Colaboradores - Módulo Regionais

## Visão Geral

A nova aba **Colaboradores** no módulo Regionais oferece uma visão completa de todos os colaboradores da empresa, com filtros avançados por gênero e estado, além de estatísticas detalhadas.

## Acesso

**Navegação:** Regionais → Colaboradores (Aba 4)

**Permissões:** ADMINISTRADOR, RH, GESTOR

## Funcionalidades Implementadas

### ✅ 1. Cards de Estatísticas por Gênero

#### Card Total
- Exibe o total de colaboradores filtrados
- Cor azul escuro
- Ícone de pessoas

#### Card Masculino (Clicável)
- Mostra quantidade de colaboradores masculinos
- Porcentagem do total
- Cor azul
- **Clique**: Filtra apenas colaboradores masculinos
- Ícone masculino (♂)

#### Card Feminino (Clicável)
- Mostra quantidade de colaboradoras femininas
- Porcentagem do total
- Cor rosa
- **Clique**: Filtra apenas colaboradoras femininas
- Ícone feminino (♀)

#### Card Estados Ativos
- Quantidade de estados com colaboradores (após filtros)
- Cor verde
- Ícone de globo

### ✅ 2. Filtros Avançados

#### Busca Textual
- Campo de busca que procura em:
  - Nome do colaborador
  - Email
  - Cargo
  - Cidade
- Busca em tempo real

#### Filtro por Gênero
- **Todos**: Exibe todos os colaboradores
- **Masculino**: Apenas homens
- **Feminino**: Apenas mulheres
- Ícones visuais nos itens do dropdown

#### Filtro por Estado
- **Todos os Estados**: Sem filtro
- **Estados individuais**: Lista todos os estados com colaboradores
- Formato: "SP - São Paulo"
- Lista ordenada alfabeticamente

### ✅ 3. Tabela de Colaboradores

#### Colunas Exibidas
1. **Colaborador**
   - Avatar (foto ou inicial)
   - Nome completo
   - Email (abaixo do nome)

2. **Gênero**
   - Chip colorido com ícone
   - Azul para masculino (♂)
   - Rosa para feminino (♀)

3. **Cargo**
   - Exibe o cargo do colaborador

4. **Departamento**
   - Departamento atual

5. **Estado/Cidade**
   - Sigla e nome do estado
   - Cidade (abaixo, em texto menor)

6. **Admissão**
   - Data de admissão formatada (DD/MM/AAAA)

7. **Ações**
   - Botão "Ver detalhes" (ícone de olho)
   - Abre dialog com informações completas

#### Características da Tabela
- **Hover**: Linha destacada ao passar o mouse
- **Limitação**: Exibe até 50 colaboradores por vez
- **Paginação**: Aviso quando há mais de 50 resultados
- **Vazia**: Mensagem quando nenhum colaborador é encontrado

### ✅ 4. Dialog de Detalhes do Colaborador

Ao clicar em "Ver detalhes", abre um modal com:

#### Cabeçalho
- Avatar grande (56x56px)
- Nome completo
- Email

#### Informações Exibidas
- **Gênero**: Chip colorido com ícone
- **Cargo**: Texto
- **Departamento**: Texto
- **Status**: Chip verde (ATIVO) ou cinza
- **Estado**: Sigla e nome completo
- **Cidade**: Nome da cidade
- **Data de Admissão**: Formatada
- **Telefone**: Se disponível
- **Unidade**: Se disponível

#### Ações
- Botão "Fechar" para sair do modal

## Dados e Estatísticas

### Total de Colaboradores Mock
- **São Paulo (SP)**: 150 colaboradores
- **Rio de Janeiro (RJ)**: 80 colaboradores
- **Minas Gerais (MG)**: 60 colaboradores
- **Paraná (PR)**: 45 colaboradores
- **Rio Grande do Sul (RS)**: 40 colaboradores
- **Santa Catarina (SC)**: 35 colaboradores
- **Bahia (BA)**: 30 colaboradores
- **Pernambuco (PE)**: 25 colaboradores
- **Ceará (CE)**: 20 colaboradores
- **Goiás (GO)**: 18 colaboradores
- **Distrito Federal (DF)**: 15 colaboradores

**Total**: ~518 colaboradores

### Distribuição por Gênero
- Aproximadamente **50% Masculino** e **50% Feminino**
- Variação por estado para dados realistas

## Exemplos de Uso

### Cenário 1: Ver Todos os Colaboradores
1. Acesse **Regionais** → **Colaboradores**
2. Visualize as estatísticas gerais nos cards
3. Role a tabela para ver os primeiros 50 colaboradores

### Cenário 2: Filtrar por Gênero
**Opção A (Rápida):**
1. Clique no card "Masculino" ou "Feminino"
2. A tabela filtra automaticamente

**Opção B (Manual):**
1. Use o dropdown "Gênero"
2. Selecione a opção desejada

### Cenário 3: Filtrar por Estado
1. Use o dropdown "Estado"
2. Selecione um estado (ex: "SP - São Paulo")
3. Veja apenas colaboradores daquele estado

### Cenário 4: Busca Específica
1. Digite no campo de busca (ex: "Colaborador SP 10")
2. Veja resultados em tempo real
3. Combine com filtros de gênero e estado

### Cenário 5: Ver Detalhes Completos
1. Na tabela, clique no ícone de olho (👁️) na linha desejada
2. Veja todas as informações no modal
3. Clique em "Fechar" para voltar

### Cenário 6: Análise por Gênero e Estado
1. Selecione um estado específico (ex: SP)
2. Veja os cards atualizarem com os números filtrados
3. Compare porcentagens masculino/feminino
4. Clique em um dos cards de gênero para filtrar ainda mais

## Design e UI/UX

### 🎨 Cores por Gênero
- **Masculino**: Azul (#3b82f6, #2563eb)
- **Feminino**: Rosa (#ec4899, #be185d)
- **Total**: Azul escuro (#1d4ed8)
- **Estados**: Verde (#10b981)

### 🎯 Cards Interativos
- Cards de gênero têm **efeito hover**:
  - Elevação (translateY)
  - Sombra maior
  - Cursor pointer
- Animação suave (transition 0.3s)

### 📊 Chips Informativos
- **Gênero**: Outlined com ícone
- **Status**: Filled (verde/cinza)
- Tamanho small para melhor layout

### 📱 Responsividade
- Cards empilham em telas pequenas (Grid xs=12, sm=6, md=3)
- Filtros adaptam layout (Grid md=5/3/4)
- Tabela com scroll horizontal se necessário
- Dialog responsivo (maxWidth="sm")

### ⚡ Performance
- Limitação de 50 registros exibidos
- Filtragem client-side (rápida)
- Aviso quando há mais resultados
- Loading skeleton durante carregamento inicial

## Estrutura de Dados

### Interface ColaboradorRegional (Atualizada)

```typescript
interface ColaboradorRegional {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  estado: EstadoBrasil;
  cidade: string;
  dataAdmissao: string;
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO';
  genero: 'MASCULINO' | 'FEMININO'; // ✨ NOVO
  avatar?: string;
  telefone?: string;
  gestor?: string;
  unidade?: string;
  cpf?: string; // ✨ NOVO
  dataNascimento?: string; // ✨ NOVO
  salario?: number; // ✨ NOVO
}
```

### Interface EstatisticasRegionais (Atualizada)

```typescript
interface EstatisticasRegionais {
  totalColaboradores: number;
  colaboradoresMasculinos: number; // ✨ NOVO
  colaboradoresFemininos: number; // ✨ NOVO
  estadosAtivos: number;
  unidadesAtivas: number;
  regiaoMaiorConcentracao: RegiaoBrasil;
  estadoMaiorConcentracao: EstadoBrasil;
  crescimentoAnual: number;
  distribuicaoPorRegiao: Record<RegiaoBrasil, number>;
  distribuicaoPorEstado: Record<EstadoBrasil, number>;
  distribuicaoPorGenero: { // ✨ NOVO
    masculino: number;
    feminino: number;
  };
}
```

## Métodos do Serviço

### getAllColaboradores()

```typescript
async getAllColaboradores(
  filtros?: FiltrosRegionais & { genero?: 'MASCULINO' | 'FEMININO' }
): Promise<ColaboradorRegional[]>
```

**Filtros Suportados:**
- `genero`: 'MASCULINO' | 'FEMININO'
- `estado`: EstadoBrasil[]
- `departamento`: string
- `cargo`: string
- `status`: string[]
- `busca`: string

**Retorno:** Array de colaboradores filtrados

## Integração com Backend (Futuro)

### 1. Endpoint de Listagem

```typescript
GET /api/regionais/colaboradores
Query Params:
  - genero?: 'MASCULINO' | 'FEMININO'
  - estado?: EstadoBrasil[]
  - busca?: string
  - page: number
  - limit: number

Response:
{
  colaboradores: ColaboradorRegional[],
  total: number,
  masculino: number,
  feminino: number,
  page: number,
  totalPages: number
}
```

### 2. Endpoint de Estatísticas

```typescript
GET /api/regionais/estatisticas/genero
Query Params:
  - estado?: EstadoBrasil

Response:
{
  total: number,
  masculino: {
    count: number,
    percentual: number
  },
  feminino: {
    count: number,
    percentual: number
  },
  porEstado: Record<EstadoBrasil, {
    masculino: number,
    feminino: number
  }>
}
```

### 3. Endpoint de Detalhes

```typescript
GET /api/regionais/colaboradores/:id

Response: ColaboradorRegional
```

## Melhorias Futuras

### 📋 Planejado

1. **Paginação Completa**
   - Navegação entre páginas
   - Seleção de itens por página (10, 25, 50, 100)
   - Indicador de página atual

2. **Exportação**
   - Botão para exportar para CSV/Excel
   - Incluir filtros aplicados
   - Opção de exportar todos ou apenas visualizados

3. **Filtros Adicionais**
   - Filtro por departamento
   - Filtro por cargo
   - Filtro por status
   - Filtro por data de admissão (intervalo)

4. **Gráficos**
   - Gráfico de pizza (distribuição por gênero)
   - Gráfico de barras (colaboradores por estado)
   - Timeline de admissões

5. **Ordenação**
   - Ordenar por nome
   - Ordenar por data de admissão
   - Ordenar por estado
   - Indicadores visuais de ordenação

6. **Visualização em Cards**
   - Opção de alternar entre tabela e cards
   - Cards com mais destaque para fotos
   - Melhor para visualização em mobile

7. **Ações em Massa**
   - Seleção múltipla de colaboradores
   - Exportar selecionados
   - Aplicar ações em lote

8. **Busca Avançada**
   - Múltiplos critérios simultaneamente
   - Salvar buscas favoritas
   - Histórico de buscas

## Boas Práticas

### ✅ O que fazer:
- Usar filtros para encontrar colaboradores específicos
- Combinar filtros para análises mais precisas
- Verificar cards de estatísticas antes de filtrar
- Usar busca textual para nomes específicos

### ❌ O que evitar:
- Não tentar exibir todos os colaboradores sem filtros (limitado a 50)
- Não ignorar a mensagem de "50 de X colaboradores"
- Evitar buscas muito genéricas que retornam muitos resultados

## LGPD e Privacidade

### 🔒 Considerações

1. **Dados Sensíveis**
   - Gênero é informação sensível (LGPD Art. 5º, II)
   - Apenas usuários autorizados têm acesso
   - Logs de acesso são registrados

2. **Anonimização**
   - Em relatórios públicos, agregar dados
   - Não expor gênero individualmente em dashboards públicos
   - Manter mínimo de registros para evitar identificação

3. **Finalidade**
   - Uso apenas para gestão de pessoas
   - Análises demográficas internas
   - Cumprimento de legislação trabalhista

## Suporte

Para mais informações técnicas:
- `src/pages/Regionais.tsx` - Implementação da aba
- `src/services/regionaisService.mock.ts` - Serviço de dados
- `src/types/regionais.ts` - Definições de tipos

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Funcional (Mock Data)

