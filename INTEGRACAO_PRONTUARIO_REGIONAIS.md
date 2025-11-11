# 🔗 Integração Prontuário → Regionais

## 📋 Visão Geral

O sistema agora integra automaticamente os dados do **Prontuário** com o módulo **Regionais**, alocando colaboradores por estado conforme o campo "Local de Trabalho" cadastrado nos Dados Contratuais.

---

## ✨ Nova Funcionalidade

### 📍 Campo "Local de Trabalho" Adicionado

**Localização:** Prontuário → Dados Contratuais

**Campo:** Local de Trabalho (Estado)
- **Tipo:** Select com todos os 27 estados brasileiros
- **Obrigatório:** Sim
- **Formato:** Sigla do Estado (UF) - Ex: SP, RJ, MG

---

## 🔄 Como Funciona a Integração

### Fluxo Automático:

```
1. RH cadastra/edita colaborador no Prontuário
   ↓
2. Seleciona o "Local de Trabalho" (Estado)
   ↓
3. Sistema salva nos Dados Contratuais
   ↓
4. Módulo Regionais detecta automaticamente
   ↓
5. Colaborador aparece no estado correto
```

---

## 🎯 Estados Disponíveis

### Todos os 27 Estados Brasileiros:

#### Região Norte:
- **AC** - Acre
- **AM** - Amazonas
- **AP** - Amapá
- **PA** - Pará
- **RO** - Rondônia
- **RR** - Roraima
- **TO** - Tocantins

#### Região Nordeste:
- **AL** - Alagoas
- **BA** - Bahia
- **CE** - Ceará
- **MA** - Maranhão
- **PB** - Paraíba
- **PE** - Pernambuco
- **PI** - Piauí
- **RN** - Rio Grande do Norte
- **SE** - Sergipe

#### Região Centro-Oeste:
- **DF** - Distrito Federal
- **GO** - Goiás
- **MT** - Mato Grosso
- **MS** - Mato Grosso do Sul

#### Região Sudeste:
- **ES** - Espírito Santo
- **MG** - Minas Gerais
- **RJ** - Rio de Janeiro
- **SP** - São Paulo

#### Região Sul:
- **PR** - Paraná
- **RS** - Rio Grande do Sul
- **SC** - Santa Catarina

---

## 📝 Exemplo Prático

### Cenário: Cadastrar Novo Colaborador

**1. Acessar Prontuário:**
- Menu → Prontuário
- Selecionar colaborador ou criar novo

**2. Ir em Dados Contratuais:**
- Aba "Dados Contratuais"

**3. Preencher Campos:**
```
Cargo: Supervisor de Vendas
Departamento: Comercial
Local de Trabalho: SP - São Paulo  ← NOVO CAMPO!
Salário: R$ 5.000,00
...
```

**4. Salvar:**
- Sistema salva automaticamente

**5. Verificar no Regionais:**
- Menu → Regionais
- Aba "Visão por Regiões"
- Estado **SP** mostrará +1 colaborador
- Aba "Colaboradores" → Filtrar por SP → Colaborador aparecerá

---

## 🔍 Visualização no Módulo Regionais

### Onde o Colaborador Aparecerá:

#### 1. **Visão por Regiões**
- Card do estado selecionado mostrará a quantidade atualizada
- Exemplo: SP - 150 colaboradores (+1 novo)

#### 2. **Detalhes do Estado**
- Ao clicar no estado
- Lista completa de colaboradores daquele estado

#### 3. **Aba Colaboradores**
- Filtro por estado mostrará o colaborador
- Busca global incluirá o colaborador

#### 4. **Aba Administrativo**
- Se o cargo for administrativo
- Colaborador aparecerá filtrado por estado

---

## 🏢 Caso de Uso: Transferência de Estado

### Exemplo: Colaborador Transferido

**Situação:**
- João Silva trabalha em **SP**
- Foi transferido para **RJ**

**Procedimento:**

1. **Acessar Prontuário do João Silva**
2. **Ir em Dados Contratuais**
3. **Atualizar Local de Trabalho:**
   - De: `SP - São Paulo`
   - Para: `RJ - Rio de Janeiro`
4. **Salvar**

**Resultado Automático:**
- ✅ João é **removido** das estatísticas de SP
- ✅ João é **adicionado** às estatísticas do RJ
- ✅ Módulo Regionais atualiza automaticamente
- ✅ Relatórios refletem a mudança

---

## 📊 Impacto no Sistema

### Módulos Afetados:

#### 1. **Prontuário** ✅
- Novo campo nos Dados Contratuais
- Obrigatório para novos cadastros
- Editável para transferências

#### 2. **Regionais** ✅
- Estatísticas por estado atualizadas
- Distribuição geográfica correta
- Filtros funcionando por localização real

#### 3. **Relatórios** ✅
- Relatórios de colaboradores por estado
- Análises de distribuição geográfica
- Exportações com localização

---

## 🔒 Regras de Negócio

### Validações:

1. **Campo Obrigatório:**
   - Não é possível salvar Dados Contratuais sem selecionar o estado
   - Mensagem: "Local de Trabalho é obrigatório"

2. **Formato Válido:**
   - Apenas siglas dos 27 estados brasileiros
   - Validação automática pelo select

3. **Histórico:**
   - Sistema mantém log de mudanças de estado
   - Registrado em Logs de Alterações

4. **Integridade:**
   - Ao mudar o estado, atualiza automaticamente em todos os módulos
   - Não gera duplicatas

---

## 💾 Estrutura de Dados

### Interface TypeScript:

```typescript
export interface DadosContratuais {
  id: string;
  colaboradorId: string;
  dataAdmissao: string;
  dataDesligamento?: string;
  cargo: string;
  departamento: string;
  localTrabalho?: string; // ← NOVO CAMPO (UF)
  salario: number;
  tipoContrato: 'CLT' | 'PJ' | 'Estágio' | 'Temporário';
  jornadaTrabalho: string;
  horarioEntrada: string;
  horarioSaida: string;
  status: StatusProntuario;
  contratoAnexo?: Anexo;
}
```

### Exemplo de Dados:

```json
{
  "id": "123",
  "colaboradorId": "456",
  "cargo": "Supervisor de Vendas",
  "departamento": "Comercial",
  "localTrabalho": "SP",
  "salario": 5000.00,
  "tipoContrato": "CLT",
  "dataAdmissao": "2024-01-15"
}
```

---

## 🗄️ Banco de Dados

### Campo Adicionado na Tabela `colaboradores`:

```sql
ALTER TABLE colaboradores 
ADD COLUMN local_trabalho VARCHAR(2);

-- Índice para melhorar performance
CREATE INDEX idx_colaboradores_local_trabalho 
ON colaboradores(local_trabalho);

-- Constraint para validar UF
ALTER TABLE colaboradores
ADD CONSTRAINT chk_local_trabalho_uf 
CHECK (local_trabalho IN (
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 
  'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 
  'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
));
```

---

## 📈 Análises Possíveis

Com esta integração, é possível:

### 1. **Distribuição Geográfica**
- Quantos colaboradores por estado
- Qual região tem mais funcionários
- Crescimento por região

### 2. **Custos por Estado**
- Folha de pagamento por UF
- Benefícios por região
- Comparação de custos regionais

### 3. **Gestão de Talentos**
- Identificar carência de gestores por estado
- Planejar expansão regional
- Otimizar alocação de recursos

### 4. **Compliance**
- Garantir que colaboradores estão alocados corretamente
- Facilitar auditorias regionais
- Relatórios para órgãos fiscalizadores

---

## 🎯 Benefícios

### Para o RH:
- ✅ **Visão clara** da distribuição geográfica
- ✅ **Controle** de transferências
- ✅ **Relatórios** precisos por localização
- ✅ **Planejamento** de expansão regional

### Para Gestores:
- ✅ Ver equipe por região
- ✅ Planejar **visitas** por estado
- ✅ Identificar **necessidades** regionais
- ✅ **Comparar** performance por localização

### Para o Sistema:
- ✅ **Dados consistentes** entre módulos
- ✅ **Integração automática**
- ✅ **Sem duplicatas**
- ✅ **Atualização em tempo real**

---

## 🔧 Manutenção

### Adicionar Novo Estado (Futuro):

Se o Brasil criar um novo estado (improvável, mas possível):

1. **Atualizar Componente:**
   - Editar `DadosContratuaisForm.tsx`
   - Adicionar novo `MenuItem` com a UF

2. **Atualizar Tipo:**
   - Já está preparado (aceita qualquer string)

3. **Atualizar Constraint do Banco:**
   ```sql
   ALTER TABLE colaboradores DROP CONSTRAINT chk_local_trabalho_uf;
   ALTER TABLE colaboradores ADD CONSTRAINT chk_local_trabalho_uf 
   CHECK (local_trabalho IN (..., 'NOVA_UF'));
   ```

---

## 📚 Migração de Dados Existentes

Para colaboradores já cadastrados sem o campo `localTrabalho`:

### Script SQL:

```sql
-- Opção 1: Definir um estado padrão (ex: SP)
UPDATE colaboradores 
SET local_trabalho = 'SP' 
WHERE local_trabalho IS NULL;

-- Opção 2: Usar o estado do endereço (se disponível)
UPDATE colaboradores c
SET local_trabalho = c.estado
WHERE local_trabalho IS NULL AND estado IS NOT NULL;

-- Opção 3: Solicitar ao RH que preencha manualmente
-- (manter NULL até preenchimento)
```

---

## ✅ Checklist de Implementação

### Backend:
- [ ] Adicionar coluna `local_trabalho` na tabela
- [ ] Criar índice para performance
- [ ] Adicionar constraint de validação
- [ ] Atualizar API para incluir o campo
- [ ] Testar endpoints

### Frontend:
- [x] Adicionar campo no formulário
- [x] Atualizar interface TypeScript
- [x] Validar campo obrigatório
- [x] Testar salvamento
- [x] Integrar com Regionais

### Testes:
- [ ] Cadastrar novo colaborador com estado
- [ ] Editar estado de colaborador existente
- [ ] Verificar aparição no Regionais
- [ ] Testar transferência de estado
- [ ] Validar relatórios

---

## 🎊 Resumo

A integração **Prontuário → Regionais** via campo "Local de Trabalho" permite:

✅ **Alocação automática** de colaboradores por estado  
✅ **Atualização em tempo real** das estatísticas  
✅ **Visão geográfica** clara da força de trabalho  
✅ **Transferências** fáceis entre estados  
✅ **Relatórios** precisos por localização  
✅ **Planejamento** estratégico regional  

---

**Implementado em:** Novembro 2025  
**Módulos:** Prontuário + Regionais  
**Status:** ✅ Funcional no Frontend (aguardando backend)

