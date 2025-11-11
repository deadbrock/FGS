# 🏢 Aba Administrativo - Módulo Regionais

## 📋 Visão Geral

A nova aba **"Administrativo"** no módulo Regionais exibe automaticamente todos os colaboradores com cargos de gestão e supervisão.

## ✨ Funcionalidades

### 🎯 Detecção Automática de Cargos

O sistema identifica automaticamente colaboradores com os seguintes cargos:

#### Cargos Detectados:
- ✅ **Supervisor / Supervisora**
- ✅ **Encarregado / Encarregada**
- ✅ **Coordenador / Coordenadora**
- ✅ **Gerente**
- ✅ **Diretor / Diretora**
- ✅ **Gestor / Gestora**
- ✅ **Líder**
- ✅ **Chefe**
- ✅ **Administrador / Administradora**

**Como Funciona:**
- Quando um colaborador é **promovido** para qualquer um desses cargos
- O sistema **automaticamente** detecta pela palavra-chave no cargo
- O colaborador **aparece instantaneamente** na aba Administrativo
- **Sem configuração manual** necessária

---

## 📊 Estatísticas

A aba exibe 4 cards com estatísticas:

1. **Total de Administrativos**: Todos os colaboradores com cargos de gestão
2. **Supervisores**: Total de supervisores (clicável para filtrar)
3. **Encarregados**: Total de encarregados (clicável para filtrar)
4. **Coordenadores**: Total de coordenadores/gerentes (clicável para filtrar)

---

## 🔍 Filtros Disponíveis

### 1. Busca por Texto
- Nome do colaborador
- Email
- Cargo
- Cidade

### 2. Tipo de Cargo
- Todos os Cargos
- Supervisores
- Encarregados
- Coordenadores
- Gerentes
- Diretores

### 3. Gênero
- Todos
- Masculino
- Feminino

### 4. Estado
- Todos os Estados
- Filtro por UF específica

---

## 📋 Tabela de Colaboradores

A tabela exibe:
- **Colaborador**: Avatar, nome e email
- **Cargo Administrativo**: Badge com ícone
- **Departamento**: Setor de atuação
- **Estado/Cidade**: Localização
- **Admissão**: Data de contratação
- **Ações**: Botão para ver detalhes

---

## 🔄 Atualização Automática

### Cenário: Promoção de Colaborador

**Exemplo:**
1. João Silva é **Auxiliar de Produção**
2. João é **promovido** para **Encarregado de Produção**
3. ✅ **Automaticamente** aparece na aba Administrativo

**Como é Detectado:**
```typescript
// O sistema verifica se o cargo contém palavras-chave
const isCargoAdministrativo = (cargo: string): boolean => {
  const cargosAdministrativos = [
    'supervisor', 'encarregado', 'coordenador', 
    'gerente', 'diretor', 'gestor', 'líder', 'chefe'
  ];
  
  const cargoLower = cargo.toLowerCase();
  return cargosAdministrativos.some(c => cargoLower.includes(c));
};
```

**Exemplos de Cargos Detectados:**
- ✅ "Supervisor de Vendas"
- ✅ "Encarregado de Manutenção"
- ✅ "Coordenador de Logística"
- ✅ "Gerente Regional"
- ✅ "Líder de Equipe"

**Exemplos de Cargos NÃO Detectados:**
- ❌ "Analista"
- ❌ "Assistente"
- ❌ "Auxiliar"
- ❌ "Técnico"

---

## 🎨 Interface

### Design Moderno
- **Banner informativo**: Destaque em roxo com ícone
- **Cards coloridos**: Gradientes diferenciados por tipo
- **Cards clicáveis**: Filtram automaticamente ao clicar
- **Tabela responsiva**: Funciona em mobile e desktop
- **Ícones intuitivos**: Facilita identificação visual

### Cores por Tipo
- **Total**: Azul (#6366f1)
- **Supervisores**: Roxo (#8b5cf6)
- **Encarregados**: Roxo escuro (#a855f7)
- **Coordenadores**: Rosa (#c026d3)

---

## 📱 Responsividade

A aba funciona perfeitamente em:
- 💻 **Desktop** (1920x1080)
- 📱 **Tablet** (768x1024)
- 📱 **Mobile** (375x667)

---

## 🚀 Benefícios

### Para o RH:
- ✅ **Visão centralizada** do quadro administrativo
- ✅ **Detecção automática** de promoções
- ✅ **Filtros avançados** para análises
- ✅ **Estatísticas em tempo real**

### Para Gestores:
- ✅ Ver **hierarquia** regional
- ✅ Identificar **líderes** por estado
- ✅ Análise de **distribuição** geográfica
- ✅ Contato rápido com **supervisores**

### Para Auditoria:
- ✅ Rastreamento de **promoções**
- ✅ **Histórico** automático
- ✅ Compliance com **estrutura organizacional**

---

## 📊 Exemplos de Uso

### Caso 1: Ver Todos os Supervisores
1. Acessar aba **"Administrativo"**
2. Clicar no card **"Supervisores"**
3. ✅ Sistema filtra automaticamente

### Caso 2: Encarregados de SP
1. Acessar aba **"Administrativo"**
2. Selecionar filtro **"Encarregados"**
3. Selecionar estado **"SP"**
4. ✅ Ver lista filtrada

### Caso 3: Buscar Coordenador Específico
1. Acessar aba **"Administrativo"**
2. Digitar nome na busca
3. ✅ Resultado instantâneo

---

## 🔧 Manutenção

### Adicionar Novos Cargos Administrativos

Para adicionar um novo cargo à detecção automática:

1. Editar `src/pages/Regionais.tsx`
2. Localizar a função `isCargoAdministrativo`
3. Adicionar o cargo no array:

```typescript
const cargosAdministrativos = [
  // ... cargos existentes
  'seu-novo-cargo',  // Adicionar aqui
];
```

**Exemplos:**
- 'superintendente'
- 'diretor-adjunto'
- 'vice-presidente'

### Personalizar Filtros

Para adicionar filtros de cargo:

1. Editar `src/pages/Regionais.tsx`
2. Localizar o Select "Tipo de Cargo"
3. Adicionar novo MenuItem:

```typescript
<MenuItem value="seu-cargo">Seu Cargo</MenuItem>
```

---

## 💡 Dicas

### Para Melhor Desempenho:
1. Use os **filtros** para refinar resultados
2. Clique nos **cards** para filtro rápido
3. Use a **busca** para localização específica

### Para Análises:
1. Compare **distribuição** por estado
2. Analise **proporção** de cada cargo
3. Monitore **crescimento** do quadro administrativo

---

## 🎯 Resumo

A aba **Administrativo** é uma ferramenta poderosa que:

✅ **Detecta automaticamente** cargos de gestão  
✅ **Filtra** por vários critérios  
✅ **Exibe estatísticas** em tempo real  
✅ **Atualiza automaticamente** com promoções  
✅ **Interface moderna** e responsiva  
✅ **Integrada** ao módulo Regionais  

---

**Implementado em:** Novembro 2025  
**Módulo:** Regionais  
**Status:** ✅ Funcional

