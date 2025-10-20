# 🔌 Módulo de Integrações - FGS

## 📋 Visão Geral

O módulo de **Integrações** permite conectar o sistema FGS com outras plataformas e serviços externos, facilitando a automação e sincronização de dados. É um módulo administrativo exclusivo para o perfil **Administrador**.

---

## ✨ Funcionalidades Principais

### 1️⃣ Dashboard de Integrações
- **Estatísticas Globais**:
  - Total de integrações (ativas/inativas/com erro)
  - Sincronizações realizadas (hoje/semana/mês)
  - Taxa de sucesso e erros
  - Registros processados
  - Tempo médio de resposta

- **Gráficos e Indicadores**:
  - Distribuição por tipo de integração
  - Histórico de sincronizações (últimos 7 dias)
  - Status geral do sistema

### 2️⃣ Ponto Eletrônico ⏰
- **Configurações**:
  - Fornecedor (IDClass, REP, Secullum, Outro)
  - Modelo do equipamento
  - IP do dispositivo
  - Intervalo de sincronização (minutos)
  
- **Funcionalidades**:
  - Sincronização automática de registros
  - Armazenamento de fotos
  - Validação de reconhecimento facial
  - Teste de conexão

- **Dados Sincronizados**:
  - Registros de entrada/saída
  - Fotos dos colaboradores
  - Status de reconhecimento
  - Horários e atrasos

### 3️⃣ E-mail Corporativo 📧
- **Configurações SMTP**:
  - Provedor (SMTP Genérico, Gmail, Outlook, SendGrid, AWS SES)
  - Host e porta
  - Segurança (TLS, SSL, STARTTLS)
  - Remetente padrão e nome
  
- **Controles**:
  - Autenticação configurável
  - Limite de envio (hora/dia)
  - Teste de envio
  - Validação de credenciais

- **Uso no Sistema**:
  - Notificações automáticas
  - Comunicados internos
  - Alertas de vencimento
  - Relatórios agendados

### 4️⃣ WhatsApp Business API 💬
- **Configurações**:
  - Provedor (Meta/Facebook, Twilio, MessageBird)
  - Número de telefone
  - Phone Number ID e WABA ID
  - Webhook URL
  
- **Funcionalidades**:
  - Envio de mensagens individuais
  - Envio em massa (opcional)
  - Templates de mensagens aprovados
  - Integração com comunicados

- **Casos de Uso**:
  - Notificações de ponto
  - Alertas de treinamento
  - Comunicados urgentes
  - Confirmações de presença

### 5️⃣ Importação e Exportação 📊
- **Formatos Suportados**:
  - CSV (Comma-Separated Values)
  - XLSX (Excel Moderno)
  - XLS (Excel Legacy)
  - JSON (JavaScript Object Notation)

- **Importação**:
  - Upload de arquivos
  - Validação automática
  - Mapeamento de colunas
  - Relatório de erros
  - Processamento em lote
  
- **Exportação**:
  - Dados de colaboradores
  - Treinamentos
  - Benefícios
  - Registros de ponto
  - Relatórios customizados

- **Histórico**:
  - Registro de todas as importações
  - Status (Sucesso/Parcial/Falha)
  - Tempo de processamento
  - Linhas importadas vs. erros
  - Download de relatórios

### 6️⃣ API Externa 🔗
- **Configurações**:
  - Nome e versão da API
  - URL base e documentação
  - Endpoints disponíveis
  - Webhooks configurados
  - Rate limiting

- **Gerenciamento**:
  - Lista de endpoints
  - Métodos HTTP (GET, POST, PUT, DELETE)
  - Autenticação requerida
  - Contadores de uso
  - Logs de requisições

---

## 🎯 Tipos de Integração

### Por Categoria

| Tipo | Descrição | Status |
|------|-----------|--------|
| **Ponto Eletrônico** | Relógios de ponto facial/biométrico | ✅ Implementado |
| **E-mail** | Servidor SMTP para envios | ✅ Implementado |
| **WhatsApp** | Mensagens via WhatsApp Business API | ✅ Implementado |
| **API Externa** | Integração com ERPs e outros sistemas | ✅ Implementado |
| **Import/Export** | Arquivos CSV, Excel, JSON | ✅ Implementado |

---

## 🔐 Autenticação

### Métodos Suportados

1. **API Key**: Chave de autenticação simples
2. **OAuth 2.0**: Protocolo de autorização
3. **Basic Auth**: Usuário e senha
4. **Token Bearer**: Token JWT ou similar
5. **Certificado**: Autenticação por certificado digital

---

## 📊 Sincronização

### Modos de Sincronização

1. **Automática**: Executa em intervalos definidos
2. **Manual**: Acionada pelo usuário
3. **Agendada**: Programada para horários específicos
4. **Em Tempo Real**: Via webhooks

### Logs de Sincronização

Cada sincronização registra:
- Data/hora de início e fim
- Duração do processo
- Total de registros processados
- Sucessos e falhas
- Mensagens de erro
- Tipo de operação

---

## 🎨 Interface Visual

### Componentes Principais

1. **Cards de Estatísticas**:
   - Total de integrações
   - Sincronizações do dia
   - Taxa de sucesso
   - Integrações com erro

2. **Tabela de Integrações**:
   - Nome e descrição
   - Tipo e status
   - Última sincronização
   - Registros processados
   - Ações rápidas

3. **Formulários de Configuração**:
   - Ponto eletrônico
   - E-mail corporativo
   - WhatsApp Business
   - API externa

4. **Ações Disponíveis**:
   - ⚙️ Configurar
   - ▶️ Ativar/Desativar
   - 🔄 Sincronizar agora
   - 🧪 Testar conexão

---

## 🔐 Controle de Acesso

### Permissões por Perfil

| Funcionalidade | Administrador | RH | Gestor | Colaborador |
|----------------|---------------|-----|--------|-------------|
| Dashboard Integrações | ✅ | ❌ | ❌ | ❌ |
| Configurar Integrações | ✅ | ❌ | ❌ | ❌ |
| Testar Conexões | ✅ | ❌ | ❌ | ❌ |
| Sincronizar Manualmente | ✅ | ❌ | ❌ | ❌ |
| Importar/Exportar Dados | ✅ | ⚠️ | ❌ | ❌ |
| Visualizar Logs | ✅ | ⚠️ | ❌ | ❌ |

⚠️ = Acesso limitado/parcial

---

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── integracoes.ts                    # Interfaces completas
├── pages/
│   └── Integracoes.tsx                   # Página principal (6 abas)
├── components/
│   └── integracoes/
│       ├── ConfiguracaoPonto.tsx         # Form ponto eletrônico
│       ├── ConfiguracaoEmail.tsx         # Form e-mail SMTP
│       ├── ConfiguracaoWhatsApp.tsx      # Form WhatsApp
│       └── ImportacaoExportacao.tsx      # Import/Export UI
├── utils/
│   └── permissions.ts                    # Atualizado com /integracoes
├── routes/
│   └── index.tsx                         # Rota /integracoes (Admin)
└── layouts/
    └── DashboardLayout.tsx               # Menu com ícone de Integrações
```

---

## 🎯 Como Usar

### Configurar Ponto Eletrônico
1. Acesse **Integrações** → **Ponto Eletrônico**
2. Selecione o fornecedor (IDClass, REP, etc.)
3. Informe o modelo e IP do dispositivo
4. Configure o intervalo de sincronização
5. Ative as opções desejadas (fotos, facial)
6. Clique em **Testar Conexão**
7. Se OK, clique em **Salvar Configurações**

### Configurar E-mail
1. Acesse **Integrações** → **E-mail**
2. Escolha o provedor
3. Informe host, porta e segurança
4. Configure remetente e limites
5. Clique em **Enviar E-mail de Teste**
6. Se receber, clique em **Salvar**

### Importar Dados
1. Acesse **Integrações** → **Import/Export**
2. Clique em **Importar Arquivo**
3. Selecione o arquivo (CSV/Excel)
4. Mapeie as colunas
5. Aguarde o processamento
6. Visualize o relatório de importação

---

## 🚀 Integrações Futuras

### Planejadas para Próximas Versões

1. **ERPs Corporativos**:
   - SAP
   - TOTVS
   - Oracle
   - Omie

2. **Plataformas de RH**:
   - Gupy
   - Kenoby
   - Vagas.com

3. **Serviços Cloud**:
   - Google Workspace
   - Microsoft 365
   - Dropbox
   - AWS S3

4. **Pagamentos**:
   - Sistemas de folha de pagamento
   - Vale-transporte
   - Vale-refeição

5. **BI e Analytics**:
   - Power BI
   - Tableau
   - Google Data Studio

---

## ⚙️ Configurações Avançadas

### Rate Limiting
- Requisições por minuto
- Requisições por hora
- Requisições por dia

### Retry Policy
- Número de tentativas
- Intervalo entre tentativas
- Backoff exponencial

### Notificações
- Email em caso de erro
- Alertas de sincronização
- Relatórios agendados

---

## 📊 Monitoramento

### Métricas Importantes

1. **Disponibilidade**: % de tempo ativa
2. **Latência**: Tempo médio de resposta
3. **Throughput**: Registros por hora
4. **Taxa de Erro**: % de falhas
5. **Uso de API**: Chamadas consumidas

---

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de Conexão:**
- Verificar firewall
- Validar IP/porta
- Testar conectividade

**Autenticação Falhou:**
- Validar credenciais
- Verificar token expirado
- Renovar API key

**Sincronização Lenta:**
- Reduzir intervalo
- Otimizar queries
- Aumentar timeout

---

## ✅ Status de Implementação

- ✅ Tipos TypeScript completos
- ✅ Página principal com 6 abas
- ✅ Dashboard de estatísticas
- ✅ Configuração de Ponto Eletrônico
- ✅ Configuração de E-mail
- ✅ Configuração de WhatsApp
- ✅ Importação/Exportação de dados
- ✅ Integração no menu e rotas
- ✅ Controle de permissões
- 🚧 Serviços backend (pendente)
- 🚧 Webhooks (pendente)
- 🚧 API aberta (pendente)

---

**Desenvolvido com ❤️ para o Sistema FGS - Formando Gente de Sucesso**

