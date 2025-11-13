# 🐛 CORREÇÕES DE BUGS - FASE 1

**Data:** 13/11/2024  
**Status:** 🔴 8 bugs identificados

---

## 📋 RELATÓRIO DE BUGS

### 1. ✅ Dashboard - Dados Mock
**Problema:** Dashboard exibe apenas dados estáticos (mock)  
**Impacto:** 🟡 Médio - Dashboard não reflete dados reais  
**Causa:** `Dashboard.tsx` usa constantes hardcoded  
**Solução:** Conectar ao endpoint `/api/relatorios/dashboard`

### 2. 🔴 Usuários - Erro ao Cadastrar Segurança do Trabalho
**Problema:** POST 400/500 ao criar usuário deste departamento  
**Impacto:** 🔴 Alto - Bloqueia cadastro de usuários  
**Causa:** Possível validação no backend ou campo inválido  
**Solução:** Investigar logs do Railway e validações do controller

### 3. 🟡 Prontuário - Edição de Colaboradores Mock
**Problema:** Não é possível editar colaboradores existentes  
**Impacto:** 🟡 Médio - Edição bloqueada  
**Causa:** Colaboradores são mock, não existem no DB  
**Solução:** Criar seed de colaboradores reais no DB

### 4. 🔴 Treinamentos - TypeError t.filter is not a function
**Problema:** Erro ao renderizar lista de treinamentos  
**Impacto:** 🔴 Alto - Módulo não funciona  
**Causa:** Frontend espera array, backend retorna objeto  
**Solução:** Corrigir service ou controller

### 5. 🔴 Treinamentos - Erro 500 GET /colaboradores
**Problema:** GET /api/treinamentos/colaboradores?colaboradorId[pagina]=0  
**Impacto:** 🔴 Alto - Não carrega treinamentos de colaboradores  
**Causa:** Query params incorretos (paginação como array)  
**Solução:** Corrigir chamada no frontend

### 6. 🔴 Ponto - TypeError Cannot read 'presentes'
**Problema:** Erro ao acessar propriedade 'presentes' de undefined  
**Impacto:** 🔴 Alto - Módulo Ponto não funciona  
**Causa:** Dados de estatísticas não retornam estrutura esperada  
**Solução:** Validar estrutura de retorno do backend

### 7. 🔴 Benefícios - TypeError Cannot read 'map'
**Problema:** Erro ao tentar fazer map em undefined  
**Impacto:** 🔴 Alto - Lista de benefícios não renderiza  
**Causa:** Backend não retorna array ou retorna undefined  
**Solução:** Validar retorno do backend e adicionar fallback no frontend

### 8. 🔴 Relatórios - Erro 500 GET /dashboard
**Problema:** GET /api/relatorios/dashboard retorna 500  
**Impacto:** 🔴 Alto - Dashboard de relatórios não funciona  
**Causa:** Possível query SQL inválida ou tabela inexistente  
**Solução:** Verificar logs do Railway e estrutura do banco

---

## 🎯 PRIORIZAÇÃO

### CRÍTICO (Impede uso do sistema) - 5 bugs
1. ✅ Usuários - Erro ao cadastrar (bug-002)
2. ✅ Treinamentos - t.filter error (bug-004)
3. ✅ Treinamentos - erro 500 colaboradores (bug-005)
4. ✅ Ponto - erro presentes (bug-006)
5. ✅ Relatórios - erro 500 dashboard (bug-008)

### ALTO (Afeta funcionalidade importante) - 1 bug
6. ✅ Benefícios - erro map (bug-007)

### MÉDIO (Funcionalidade degradada) - 2 bugs
7. ✅ Dashboard - dados mock (bug-001)
8. ✅ Prontuário - edição bloqueada (bug-003)

---

## 🔧 PLANO DE AÇÃO

### FASE 1: BUGS CRÍTICOS (1-2h)
- [ ] Verificar logs do Railway para todos os erros 500
- [ ] Corrigir query de relatórios/dashboard
- [ ] Corrigir validação de usuários (Segurança do Trabalho)
- [ ] Corrigir chamada de API treinamentos/colaboradores
- [ ] Adicionar validações e fallbacks nos serviços

### FASE 2: BUGS ALTOS (30min)
- [ ] Corrigir estrutura de retorno de benefícios
- [ ] Adicionar verificação de array no frontend

### FASE 3: BUGS MÉDIOS (1h)
- [ ] Conectar Dashboard a dados reais
- [ ] Criar seed de colaboradores para testes

---

## 📝 LOGS DE CORREÇÃO

### Bug #001 - Dashboard Mock
**Status:** 🔴 Pendente  
**Ação:**
1. Criar service `dashboardService.ts`
2. Conectar `Dashboard.tsx` ao endpoint real
3. Adicionar loading e error states

### Bug #002 - Usuários Segurança do Trabalho
**Status:** 🔴 Pendente  
**Ação:**
1. Verificar logs do Railway (POST /api/usuarios)
2. Identificar campo que causa erro 400/500
3. Corrigir validação no backend

### Bug #003 - Edição de Colaboradores
**Status:** 🔴 Pendente  
**Ação:**
1. Criar script `seed-colaboradores.sql`
2. Inserir 5-10 colaboradores de teste
3. Executar seed no Railway

### Bug #004 - Treinamentos t.filter
**Status:** 🔴 Pendente  
**Ação:**
1. Verificar retorno de `getTreinamentos()`
2. Garantir que sempre retorna array
3. Adicionar fallback `|| []` no frontend

### Bug #005 - Treinamentos Colaboradores 500
**Status:** 🔴 Pendente  
**Ação:**
1. Corrigir params de `getColaboradorTreinamentos()`
2. Remover paginação inválida
3. Testar endpoint manualmente

### Bug #006 - Ponto 'presentes' undefined
**Status:** 🔴 Pendente  
**Ação:**
1. Verificar estrutura de `getEstatisticas()` do ponto
2. Adicionar validação no frontend
3. Usar optional chaining `?.`

### Bug #007 - Benefícios map undefined
**Status:** 🔴 Pendente  
**Ação:**
1. Verificar retorno de `getBeneficios()`
2. Garantir que sempre retorna array
3. Adicionar fallback no frontend

### Bug #008 - Relatórios Dashboard 500
**Status:** 🔴 Pendente  
**Ação:**
1. Verificar logs do Railway
2. Testar query SQL no psql
3. Corrigir controller se necessário

---

**Última Atualização:** 13/11/2024 - 15:00

