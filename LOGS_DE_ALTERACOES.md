# 📋 Logs de Alterações do Sistema

## Visão Geral

O módulo de **Logs de Alterações** registra todas as modificações realizadas no sistema FGS, proporcionando rastreabilidade completa e auditoria de todas as ações dos usuários.

## Acesso

**Navegação:** Segurança → Logs de Alterações (Aba 4)

**Permissões:** Apenas usuários com perfil **ADMINISTRADOR**

## Funcionalidades Implementadas

### ✅ 1. Visualização de Logs

#### Informações Exibidas
- **Data/Hora**: Momento exato da alteração
- **Usuário**: Nome e perfil do usuário que realizou a ação
- **Módulo**: Qual módulo foi afetado (Prontuário, Benefícios, etc.)
- **Ação**: Tipo de operação (CRIAR, EDITAR, EXCLUIR, EXPORTAR, VISUALIZAR)
- **Entidade**: O que foi alterado (Colaborador, Benefício, etc.)
- **ID**: Identificador único da entidade
- **Alterações**: Quantidade de campos modificados
- **Detalhes**: Botão para ver informações completas

### ✅ 2. Busca Inteligente

Campo de busca que procura em:
- Nome do usuário
- Módulo
- Entidade
- ID da entidade

**Exemplo**: Digite "Maria" para ver todas as alterações feitas pela usuária Maria

### ✅ 3. Filtros Avançados

#### Filtro por Módulo
- Todos
- Prontuário
- Benefícios
- Treinamentos
- Ponto
- Comunicação
- Segurança
- Usuários
- Configurações
- Relatórios

#### Filtro por Tipo de Ação
- Todas as Ações
- Criar
- Editar
- Excluir
- Exportar
- Visualizar

### ✅ 4. Detalhes Expansíveis

Cada linha da tabela pode ser expandida clicando no ícone **▼** para mostrar:
- **Campos Alterados**: Lista completa com valores antes e depois
- **Valor Anterior** → **Valor Novo**
- **IP de Origem**: Endereço IP de onde a ação foi realizada
- **Navegador**: Navegador utilizado

### ✅ 5. Dialog de Detalhes Completos

Clique no ícone **ℹ️** para abrir um modal com todas as informações:
- Dados da alteração (data, usuário, módulo, entidade)
- Contexto técnico (IP, navegador)
- Lista detalhada de todas as alterações
- Visual organizado com valores lado a lado

### ✅ 6. Exportação para CSV

Botão **Download** permite exportar todos os logs filtrados para um arquivo CSV contendo:
- Data/Hora
- Usuário
- Perfil
- Módulo
- Ação
- Entidade
- ID
- Alterações (campos modificados)

**Nome do arquivo**: `logs_alteracoes_YYYY-MM-DD.csv`

### ✅ 7. Atualização de Logs

Botão **Refresh** recarrega os logs do sistema.

## Tipos de Ações Registradas

### 🟢 CRIAR (Verde)
- Cadastro de novos registros
- Exemplos: Novo colaborador, novo benefício, novo treinamento

### 🔵 EDITAR (Azul)
- Modificação de registros existentes
- Exemplos: Alterar salário, atualizar dados pessoais, corrigir informações

### 🔴 EXCLUIR (Vermelho)
- Remoção de registros
- Exemplos: Excluir usuário, remover benefício

### 🟡 EXPORTAR (Amarelo)
- Exportação de dados
- Exemplos: Exportar relatórios, gerar PDFs

### ⚪ VISUALIZAR (Cinza)
- Acesso a informações sensíveis
- Exemplos: Visualizar prontuário completo

## Dados Rastreados

Para cada alteração, o sistema registra:

### 📊 Dados da Ação
- **ID Único**: Identificador do log
- **Data/Hora**: Timestamp completo
- **Módulo**: Qual parte do sistema
- **Entidade**: O que foi alterado
- **ID da Entidade**: Identificador do registro

### 👤 Dados do Usuário
- **ID do Usuário**
- **Nome Completo**
- **Perfil/Role**: ADMINISTRADOR, RH, GESTOR, etc.

### 🔧 Campos Alterados
Para cada campo modificado:
- **Nome do Campo**
- **Valor Anterior**
- **Valor Novo**

### 🌐 Contexto Técnico
- **Endereço IP**: De onde a ação foi realizada
- **Navegador**: Qual navegador foi usado

## Exemplos de Uso

### Cenário 1: Auditoria de Aumento Salarial

**Objetivo**: Verificar quem alterou o salário de um colaborador

1. Acesse **Segurança** → **Logs de Alterações**
2. No campo de busca, digite o nome do colaborador ou "salário"
3. Filtre por módulo **Prontuário**
4. Filtre por ação **EDITAR**
5. Encontre o registro e expanda para ver os detalhes
6. Verifique: Data, quem alterou, valor anterior e valor novo

### Cenário 2: Rastreamento de Exclusões

**Objetivo**: Ver quem excluiu um registro importante

1. Filtre por ação **EXCLUIR**
2. Verifique a coluna "Usuário" para ver quem realizou
3. Clique em **ℹ️** para ver o motivo da exclusão (se registrado)

### Cenário 3: Relatório de Atividades de um Usuário

**Objetivo**: Ver todas as ações de um usuário específico

1. Digite o nome do usuário na busca
2. Veja todas as alterações realizadas por ele
3. Exporte para CSV para análise externa

### Cenário 4: Auditoria de Configurações do Sistema

**Objetivo**: Ver quem alterou configurações sensíveis

1. Filtre por módulo **Configurações** ou **Segurança**
2. Veja quais configurações foram alteradas e quando
3. Verifique o IP de origem para garantir que foi da rede interna

## Design e UI/UX

### 🎨 Cores por Tipo de Ação
- **Verde**: Criação (sucesso, novo registro)
- **Azul**: Edição (informação, modificação)
- **Vermelho**: Exclusão (alerta, remoção)
- **Amarelo**: Exportação (atenção, dados saindo)
- **Cinza**: Visualização (neutro, apenas leitura)

### 🎯 Chips Informativos
- **Perfil do Usuário**: Colorido conforme o role
- **Módulo**: Outlined (contorno)
- **ID da Entidade**: Monospace (fonte de código)
- **Quantidade de Alterações**: Primary (destaque)

### 📱 Responsividade
- Layout adaptável para desktop, tablet e mobile
- Filtros empilhados em telas pequenas
- Tabela com scroll horizontal se necessário

### ⚡ Performance
- 10 logs de exemplo implementados
- Filtragem em tempo real (client-side)
- Expansão/colapso suave com animação

## Estrutura de Dados

### Interface LogAlteracao

```typescript
interface LogAlteracao {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  role: UserRole;
  dataHora: string;
  modulo: string;
  acao: TipoAcao;
  entidade: string;
  entidadeId: string;
  camposAlterados: CampoAlterado[];
  ip: string;
  navegador: string;
}
```

### Interface CampoAlterado

```typescript
interface CampoAlterado {
  campo: string;
  valorAnterior: string | number | boolean;
  valorNovo: string | number | boolean;
}
```

### Enum TipoAcao

```typescript
enum TipoAcao {
  CRIAR = 'CRIAR',
  EDITAR = 'EDITAR',
  VISUALIZAR = 'VISUALIZAR',
  EXCLUIR = 'EXCLUIR',
  EXPORTAR = 'EXPORTAR',
}
```

## Logs de Exemplo Implementados

1. **Edição de Colaborador** (Salário e Cargo)
2. **Criação de Benefício** (Vale Alimentação)
3. **Alteração de Usuário** (Perfil e Status)
4. **Criação de Treinamento** (Segurança no Trabalho)
5. **Edição de Ponto** (Ajuste de horário)
6. **Exclusão de Usuário** (Desligamento)
7. **Criação de Advertência** (Evento no Prontuário)
8. **Criação de Comunicado** (Reunião Geral)
9. **Edição de Configuração** (Backup Automático)
10. **Exportação de Relatório** (Folha de Pagamento)

## Integração com Backend (Futuro)

Quando implementar um backend real:

### 1. Endpoint de Consulta

```typescript
GET /api/seguranca/logs/alteracoes
Query Params:
  - dataInicio: string (ISO)
  - dataFim: string (ISO)
  - usuarioId?: string
  - modulo?: string
  - acao?: TipoAcao
  - busca?: string
  - page: number
  - limit: number

Response:
{
  logs: LogAlteracao[],
  total: number,
  page: number,
  totalPages: number
}
```

### 2. Criação de Log

```typescript
POST /api/seguranca/logs/alteracoes

Body:
{
  acao: TipoAcao,
  modulo: string,
  entidade: string,
  entidadeId: string,
  camposAlterados: CampoAlterado[]
}

// IP e navegador capturados automaticamente no backend
```

### 3. Middleware de Auditoria

Criar um middleware que intercepta todas as ações e registra automaticamente:

```typescript
// Exemplo em Node.js/Express
const auditMiddleware = (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Registrar log após sucesso
    if (res.statusCode < 400) {
      logService.registrar({
        usuarioId: req.user.id,
        acao: determinarAcao(req.method),
        modulo: extrairModulo(req.path),
        // ...
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};
```

## Segurança e Privacidade

### 🔒 Considerações Importantes

1. **Acesso Restrito**
   - Apenas ADMINISTRADORES podem visualizar logs
   - Logs não podem ser editados ou excluídos (imutáveis)

2. **Dados Sensíveis**
   - Senhas NUNCA são registradas
   - Dados financeiros são parcialmente ocultados (opcional)
   - CPF/RG podem ser mascarados nos logs

3. **Retenção de Dados**
   - Definir política de retenção (ex: 2 anos)
   - Arquivamento automático de logs antigos
   - Backup regular dos logs de auditoria

4. **LGPD / Conformidade**
   - Registrar apenas dados necessários
   - Permitir anonimização de logs (se requerido)
   - Documentar propósito de cada coleta

## Boas Práticas

### ✅ O que fazer:
- Revisar logs regularmente (mensal/trimestral)
- Investigar ações suspeitas imediatamente
- Exportar logs importantes para backup
- Treinar equipe sobre importância da auditoria
- Documentar investigações baseadas em logs

### ❌ O que evitar:
- Nunca compartilhar logs com pessoas não autorizadas
- Não modificar ou excluir logs manualmente
- Não ignorar alertas de ações suspeitas
- Não deixar logs acessíveis publicamente

## Próximas Melhorias

### 📋 Planejado

1. **Paginação**
   - Limitar registros por página
   - Navegação entre páginas
   - Opção de "Carregar mais"

2. **Filtros Avançados**
   - Filtro por data (intervalo)
   - Filtro por IP
   - Filtro múltiplo de usuários
   - Salvar filtros favoritos

3. **Gráficos e Estatísticas**
   - Alterações por dia/semana/mês
   - Top usuários mais ativos
   - Módulos mais alterados
   - Horários de pico de atividade

4. **Alertas Automáticos**
   - Notificar sobre ações críticas
   - Email para exclusões importantes
   - Webhook para integrações

5. **Comparação de Versões**
   - Ver histórico completo de um registro
   - Timeline de alterações
   - Restaurar versão anterior (rollback)

6. **Relatórios Automáticos**
   - Relatório mensal de auditoria
   - PDF com resumo de atividades
   - Dashboard executivo

## Suporte

Para mais informações técnicas:
- `src/pages/Seguranca.tsx` - Implementação principal
- `src/types/seguranca.ts` - Definições de tipos
- `src/utils/statusUtils.ts` - Funções auxiliares

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Funcional (Mock Data)

