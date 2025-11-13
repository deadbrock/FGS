# 🔧 PLANO DE CORREÇÃO - SERVICES vs PÁGINAS

## ❌ PROBLEMA IDENTIFICADO:
Os services foram reescritos com métodos diferentes dos mocks, mas as páginas ainda chamam os métodos antigos.

---

## 📋 ANÁLISE COMPLETA DAS INCOMPATIBILIDADES:

### 1. **REGIONAIS** (`src/pages/Regionais.tsx`)

**Métodos antigos usados pela página:**
```typescript
regionaisService.getEstatisticasGerais()  // ✅ OK
regionaisService.getRankingEstados()      // ❌ NÃO EXISTE
regionaisService.getColaboradoresPorEstado(estado) // ❌ NÃO EXISTE
regionaisService.getAllColaboradores(filtros) // ❌ NÃO EXISTE (era mock)
```

**Métodos disponíveis no service real:**
```typescript
getEstatisticasGerais() // ✅
getColaboradores(filtros) // ✅ 
getAdministrativos(filtros) // ✅
```

**AÇÕES:**
- Remover chamada `getRankingEstados()` ou adaptar para usar `getEstatisticasGerais()`
- Trocar `getColaboradoresPorEstado()` por `getColaboradores({ estado })`
- Trocar `getAllColaboradores()` por `getColaboradores()`

---

### 2. **RELATÓRIOS** (`src/pages/Relatorios.tsx`)

**Métodos antigos usados pela página:**
```typescript
relatoriosService.buscarDashboard() // ❌
relatoriosService.gerarRelatorio() // ❌
```

**Métodos disponíveis no service real:**
```typescript
getDashboard() // ✅
getRelatorioColaboradores(filtros) // ✅
getRelatorioBeneficios(filtros) // ✅
getRelatorioTreinamentos(filtros) // ✅
getRelatorioAniversariantes(mes) // ✅
getRelatorioFerias(filtros) // ✅
```

**AÇÕES:**
- Trocar `buscarDashboard()` por `getDashboard()`
- Adaptar lógica para usar métodos específicos

---

### 3. **BENEFÍCIOS** (`src/pages/Beneficios.tsx`)

**Métodos antigos usados pela página:**
```typescript
beneficiosService.buscarEstatisticas() // ❌
beneficiosService.listarBeneficios() // ❌
beneficiosService.listarBeneficiosColaborador(id) // ❌
beneficiosService.associarBeneficio() // ❌
beneficiosService.buscarHistorico() // ❌
beneficiosService.gerarRelatorioCustos() // ❌
```

**Métodos disponíveis no service real:**
```typescript
// Tipos
getTipos() // ✅
createTipo(tipo) // ✅
updateTipo(id, tipo) // ✅
deleteTipo(id) // ✅

// Vínculos
getAll(colaboradorId?) // ✅
create(beneficio) // ✅
update(id, beneficio) // ✅
delete(id) // ✅

// Estatísticas
getEstatisticas() // ✅
```

**AÇÕES:**
- Trocar `buscarEstatisticas()` por `getEstatisticas()`
- Trocar `listarBeneficios()` por `getTipos()` (para listar tipos)
- Trocar `listarBeneficiosColaborador()` por `getAll(colaboradorId)`
- Trocar `associarBeneficio()` por `create()`
- Remover `buscarHistorico()` (não implementado no backend)
- Remover `gerarRelatorioCustos()` (usar API de relatórios)

---

### 4. **PONTO** (`src/pages/Ponto.tsx`)

**Métodos antigos usados pela página:**
```typescript
pontoService.buscarEstatisticas() // ❌
pontoService.listarResumosDias() // ❌
pontoService.buscarRanking() // ❌
pontoService.gerarRelatorioAtrasos() // ❌
```

**Métodos disponíveis no service real:**
```typescript
// Configurações
getConfiguracoes(ativo?) // ✅
createConfiguracao(config) // ✅

// Registros
getRegistros(filtros) // ✅
getRegistroById(id) // ✅
registrarPonto(registro) // ✅
aprovarPonto(id, aprovar) // ✅
deleteRegistro(id) // ✅

// Relatórios
getEspelhoPonto(colaborador_id, mes, ano) // ✅
getEstatisticas() // ✅
```

**AÇÕES:**
- Trocar `buscarEstatisticas()` por `getEstatisticas()`
- Trocar `listarResumosDias()` por `getRegistros({ data_inicio, data_fim })`
- Remover `buscarRanking()` (não implementado)
- Remover `gerarRelatorioAtrasos()` (não implementado)

---

### 5. **TREINAMENTOS** (`src/pages/Treinamentos.tsx`)

**Métodos antigos usados pela página:**
```typescript
treinamentosService.listarTipos() // ❌
treinamentosService.listarAlertas() // ❌
treinamentosService.listarTreinamentos() // ❌
treinamentosService.buscarEstatisticas() // ❌
```

**Métodos disponíveis no service real:**
```typescript
// Treinamentos
getAll() // ✅
getById(id) // ✅
create(treinamento) // ✅
update(id, treinamento) // ✅
delete(id) // ✅

// Turmas
getTurmas(treinamentoId?) // ✅
createTurma(turma) // ✅
updateTurma(id, turma) // ✅
deleteTurma(id) // ✅

// Vínculos
getColaboradorTreinamentos(colaboradorId?, treinamentoId?, turmaId?) // ✅
vincularColaborador(vinculo) // ✅
updateVinculo(id, vinculo) // ✅
deleteVinculo(id) // ✅

// Estatísticas
getEstatisticas() // ✅
```

**AÇÕES:**
- Trocar `listarTipos()` por `getAll()` (tipos de treinamento = cursos)
- Trocar `listarAlertas()` por `getEstatisticas()` (tem vencidos/vencendo)
- Trocar `listarTreinamentos()` por `getAll()` ou `getColaboradorTreinamentos()`
- Trocar `buscarEstatisticas()` por `getEstatisticas()`

---

### 6. **PRONTUÁRIO** (`src/pages/Prontuario.tsx`)

**Problema:** Página usa `prontuarioService` que aponta para `/prontuario/:id`

**Solução:** O backend não tem rota `/prontuario`, usar `/api/colaboradores/:id`

**AÇÕES:**
- Atualizar `prontuarioService.ts` para usar API de colaboradores
- OU criar adapter no service
- OU migrar para `colaboradoresService`

---

### 7. **COMPONENTES DE PRONTUÁRIO**

#### `BeneficiosColaboradorTab.tsx`:
- Usa métodos antigos de `beneficiosService`
- Trocar por métodos reais

#### `HistoricoColaborador.tsx`:
- Usa `prontuarioService.buscarHistorico()`
- Não existe no backend - precisa implementar ou remover

#### `AdicionarEventoModal.tsx`:
- Usa métodos de prontuário que não existem
- Precisa adaptar

---

## 🎯 PLANO DE AÇÃO (ORDEM DE EXECUÇÃO):

### FASE 1: SERVICES (Adicionar métodos de compatibilidade)
1. ✅ Adicionar métodos alias nos services para compatibilidade
2. ✅ Manter métodos antigos apontando para os novos

### FASE 2: PÁGINAS PRINCIPAIS
1. ⏳ **Usuários** - Verificar conexão com backend
2. ⏳ **Regionais** - Ajustar métodos
3. ⏳ **Relatórios** - Ajustar métodos  
4. ⏳ **Benefícios** - Ajustar métodos
5. ⏳ **Ponto** - Ajustar métodos
6. ⏳ **Treinamentos** - Ajustar métodos

### FASE 3: PRONTUÁRIO
1. ⏳ Atualizar `prontuarioService` para usar `/api/colaboradores`
2. ⏳ Ajustar componentes de prontuário
3. ⏳ Testar fluxo completo

### FASE 4: TESTES
1. ⏳ Testar cada módulo
2. ⏳ Corrigir bugs encontrados
3. ⏳ Validar em produção

---

## 📝 LIÇÕES APRENDIDAS:

1. ❌ **Erro:** Reescrever services sem analisar uso nas páginas
2. ✅ **Correção:** Sempre mapear dependências antes de refatorar
3. ✅ **Melhor prática:** Manter compatibilidade ou criar adapters
4. ✅ **Próxima vez:** Fazer migração gradual com feature flags

---

**Data:** 13/11/2024 - 14h00
**Status:** 🔴 EM CORREÇÃO

