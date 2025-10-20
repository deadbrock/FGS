# Módulo de Comunicação Interna - FGS

## Visão Geral

O módulo de **Comunicação Interna** permite o envio de comunicados e notificações para colaboradores através de múltiplos canais, com rastreamento de leitura e estatísticas de efetividade.

---

## Funcionalidades Principais

### 1️⃣ Envio Segmentado de Comunicados
- **5 tipos de envio**:
  - 📢 **Geral**: Para todos os colaboradores
  - 🏢 **Por Setor**: TI, RH, Vendas, etc.
  - 🏛️ **Por Unidade**: Filiais específicas
  - 👔 **Por Função**: Gerentes, analistas, etc.
  - 👤 **Individual**: Colaboradores específicos

### 2️⃣ Múltiplos Canais de Notificação
- 📱 **App**: Notificações push (ativo)
- 📧 **E-mail**: SMTP configurável (ativo)
- 💬 **WhatsApp**: Integração futura (preparado)
- 📨 **SMS**: Integração futura (preparado)

### 3️⃣ Categorias de Comunicados
- ℹ️ Informativo
- 🚨 Urgente
- 📅 Evento
- ⚠️ Aviso
- 🎁 Benefícios
- 📚 Treinamento
- 👥 RH
- 🛡️ Segurança
- 📋 Outros

### 4️⃣ Prioridades
- **Baixa** (cinza)
- **Normal** (azul)
- **Alta** (laranja)
- **Urgente** (vermelho)

### 5️⃣ Recursos Avançados
- ✅ **Confirmação de leitura**: Exige confirmação do colaborador
- ⏰ **Agendamento**: Envio programado (data e hora)
- 📎 **Anexos**: Documentos, imagens, PDFs
- 💾 **Rascunhos**: Salvar para enviar depois
- 📊 **Estatísticas**: Taxa de leitura e confirmação

### 6️⃣ Histórico Completo
- 📜 Todos os comunicados enviados
- 📈 Taxa de leitura por comunicado
- 👁️ Visualização de destinatários
- ✏️ Edição de rascunhos
- 🗑️ Exclusão de comunicados

---

## Estrutura de Arquivos

```
src/
├── types/
│   └── comunicacao.ts              # Tipos TypeScript (20+ interfaces)
├── utils/
│   └── comunicacaoUtils.ts         # Funções auxiliares
├── components/
│   └── comunicacao/
│       ├── ComunicadoForm.tsx      # Formulário de criação
│       └── HistoricoComunicados.tsx # Lista de comunicados
├── services/
│   ├── comunicacaoService.ts       # Serviço API (modo mock)
│   └── comunicacaoService.mock.ts  # Dados mock
└── pages/
    └── Comunicacao.tsx             # Página principal (3 abas)
```

---

## Tipos de Dados

### Comunicado
```typescript
interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: CategoriaComunicado;
  prioridade: PrioridadeComunicado;
  
  // Destinatários
  tipo: TipoComunicado;
  destinatarios: Destinatario;
  
  // Canais
  canais: CanalNotificacao[];
  
  // Agendamento
  dataEnvio: string;
  horaEnvio?: string;
  envioImediato: boolean;
  
  // Confirmação de leitura
  exigeLeitura: boolean;
  prazoDias?: number;
  
  // Status
  status: StatusComunicado; // RASCUNHO | AGENDADO | ENVIADO | CANCELADO
  
  // Estatísticas
  totalDestinatarios: number;
  totalEnviados: number;
  totalLidos: number;
  totalConfirmados: number;
}
```

### Destinatários
```typescript
interface Destinatario {
  todos?: boolean;              // Geral
  setores?: string[];           // Por setor
  unidades?: string[];          // Por unidade
  funcoes?: string[];           // Por função
  colaboradores?: string[];     // Individual
}
```

---

## Funções Utilitárias

### Formatação
```typescript
getTipoNome(tipo: TipoComunicado): string
// Exemplo: SETOR -> "Por Setor"

getPrioridadeNome(prioridade): string
// Exemplo: URGENTE -> "Urgente"

getCanalIcone(canal): string
// Exemplo: EMAIL -> "📧"

getCategoriaNome(categoria): string
// Exemplo: TREINAMENTO -> "Treinamento"
```

### Cálculos
```typescript
calcularTaxaLeitura(lidos, total): number
// Retorna percentual de leitura

calcularTaxaConfirmacao(confirmados, total): number
// Retorna percentual de confirmação
```

### Validações
```typescript
validarEnvio(titulo, conteudo, canais): { valido: boolean; erros: string[] }
// Valida se comunicado pode ser enviado

contarPalavras(texto): number
// Conta palavras do conteúdo

estimarTempoLeitura(texto): string
// Retorna tempo estimado (ex: "5 min")
```

---

## Páginas e Navegação

### Página Principal: `/comunicacao`
Organizada em **3 abas**:

#### 📊 Aba 1: Dashboard
- **4 cards de estatísticas**:
  - Total de comunicados enviados
  - Enviados hoje
  - Taxa de leitura geral
  - Comunicados agendados
- **Gráficos**:
  - Efetividade por canal (App, E-mail, WhatsApp)
  - Distribuição por categoria
- **Alertas**: Comunicados não lidos

#### ✍️ Aba 2: Novo Comunicado
- **Botão "Novo Comunicado"**
- **Formulário completo**:
  - Tipo de envio (Geral/Setor/Unidade/Função/Individual)
  - Categoria
  - Prioridade
  - Título e conteúdo
  - Canais de envio (múltipla escolha)
  - Envio imediato ou agendado
  - Confirmação de leitura
- **Indicadores**:
  - Contador de palavras
  - Tempo de leitura estimado
- **Ações**:
  - Salvar como rascunho
  - Enviar agora
  - Agendar envio

#### 📜 Aba 3: Histórico
- **Lista de comunicados** enviados
- **Filtros**: Por tipo, categoria, status
- **Informações exibidas**:
  - Título e categoria
  - Status (rascunho/agendado/enviado/cancelado)
  - Prioridade
  - Preview do conteúdo
  - Destinatários
  - Canais utilizados
  - Taxa de leitura (barra de progresso)
  - Data de envio
- **Ações**:
  - Visualizar detalhes
  - Editar (somente rascunhos)
  - Excluir

---

## Canais de Notificação

### 1. App (Ativo)
- **Tipo**: Push notifications
- **Status**: ✅ Ativo
- **Integração**: Firebase Cloud Messaging (preparado)

### 2. E-mail (Ativo)
- **Tipo**: SMTP
- **Status**: ✅ Ativo
- **Configurável**:
  - Host e porta SMTP
  - Remetente
  - Credenciais

### 3. WhatsApp (Futuro)
- **Tipo**: API Business
- **Status**: 🚧 Em desenvolvimento
- **Preparado**:
  - Interface de configuração
  - Campo para API URL e Token
  - Número de origem

### 4. SMS (Futuro)
- **Tipo**: API terceiros
- **Status**: 🚧 Em desenvolvimento
- **Preparado**:
  - Interface de configuração
  - Campo para API URL e Token

---

## Fluxos de Processo

### Fluxo de Envio Imediato
1. RH cria comunicado
2. Seleciona destinatários e canais
3. Marca "Envio Imediato"
4. Clica em "Enviar Agora"
5. Sistema envia para todos os canais selecionados
6. Registra no histórico
7. Rastreia leituras

### Fluxo de Envio Agendado
1. RH cria comunicado
2. Desmarca "Envio Imediato"
3. Define data e hora
4. Clica em "Agendar Envio"
5. Status muda para "AGENDADO"
6. Sistema aguarda data/hora
7. Envia automaticamente
8. Atualiza status para "ENVIADO"

### Fluxo com Confirmação de Leitura
1. RH marca "Exigir Confirmação de Leitura"
2. Define prazo em dias
3. Envia comunicado
4. Colaborador recebe notificação
5. Colaborador abre e lê
6. Sistema marca como "lido"
7. Colaborador clica em "Confirmar"
8. Sistema marca como "confirmado"
9. RH acompanha % de confirmação

---

## Permissões de Acesso

**Quem pode acessar:**
- ✅ Administrador (acesso total)
- ✅ RH (acesso total)
- ✅ Gestor (envio limitado ao seu setor)

**Colaboradores comuns**:
- Recebem notificações
- Visualizam comunicados
- Confirmam leitura

---

## Integração com Menu

O módulo foi adicionado ao menu lateral com:
- **Ícone**: 📢 Campaign
- **Título**: "Comunicação"
- **Posição**: Entre "Benefícios" e "Configurações"
- **Rota**: `/comunicacao`

---

## Exemplos de Uso

### 1. Criar Comunicado Geral
```typescript
const comunicado = {
  titulo: 'Novo Horário de Funcionamento',
  conteudo: 'A partir de segunda-feira...',
  tipo: TipoComunicado.GERAL,
  categoria: CategoriaComunicado.INFORMATIVO,
  prioridade: PrioridadeComunicado.NORMAL,
  canais: [CanalNotificacao.APP, CanalNotificacao.EMAIL],
  envioImediato: true,
  exigeLeitura: false,
};

await comunicacaoService.criarComunicado(comunicado);
```

### 2. Enviar para Setor Específico
```typescript
const comunicado = {
  titulo: 'Treinamento de Segurança',
  conteudo: 'Treinamento obrigatório...',
  tipo: TipoComunicado.SETOR,
  destinatarios: {
    setores: ['TI', 'Operações'],
  },
  categoria: CategoriaComunicado.TREINAMENTO,
  prioridade: PrioridadeComunicado.URGENTE,
  canais: [CanalNotificacao.APP, CanalNotificacao.EMAIL, CanalNotificacao.WHATSAPP],
  exigeLeitura: true,
  prazoDias: 7,
};
```

---

## Estatísticas Disponíveis

### Dashboard
- Total de comunicados
- Enviados hoje
- Taxa de leitura geral
- Taxa de confirmação geral
- Comunicados agendados

### Por Canal
- Total enviados
- Total entregues
- Total abertos
- Taxa de entrega (%)
- Taxa de abertura (%)

### Por Categoria
- Quantidade
- Percentual do total

---

## Cores e Estilos

### Cores de Prioridade
```typescript
BAIXA → #757575 (cinza)
NORMAL → #1976d2 (azul)
ALTA → #f57c00 (laranja)
URGENTE → #d32f2f (vermelho)
```

### Cores de Status
```typescript
RASCUNHO → #757575 (cinza)
AGENDADO → #1976d2 (azul)
ENVIADO → #388e3c (verde)
CANCELADO → #d32f2f (vermelho)
```

---

## Próximos Passos

### Integração com Backend
1. Descomente o código em `comunicacaoService.ts`
2. Configure os endpoints da API:
   - `GET/POST /comunicacao`
   - `POST /comunicacao/:id/enviar`
   - `GET /comunicacao/estatisticas`

### Integração WhatsApp
1. Configure API Business do WhatsApp
2. Obtenha credenciais (token, número)
3. Implemente webhook para status de entrega
4. Configure templates de mensagem

### Integração SMS
1. Escolha provedor (Twilio, Nexmo, etc.)
2. Configure credenciais
3. Implemente envio

### Melhorias Futuras
- 🔔 **Notificações em tempo real**: WebSocket
- 📊 **BI avançado**: Dashboards interativos
- 🤖 **Automação**: Envios recorrentes
- 📱 **App móvel**: Leitura offline
- 🌐 **Multilíngue**: Suporte a vários idiomas
- 🎨 **Editor rico**: Formatação HTML

---

## Suporte

Para dúvidas ou problemas:
1. Consulte os comentários no código
2. Verifique os tipos em `src/types/comunicacao.ts`
3. Teste com dados mock antes de integrar backend

---

**Módulo desenvolvido para o sistema FGS - Formando Gente de Sucesso** 🚀

