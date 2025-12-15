# 📋 Processo Completo de Admissão de Colaboradores

## 🎯 Visão Geral

O sistema de Admissão de Colaboradores automatiza todo o processo desde a solicitação de vaga até a integração com sistemas externos (eSocial e Thompson Reuters), garantindo rastreabilidade, controle de documentos e conformidade legal.

---

## 🔄 WORKFLOW COMPLETO - 9 ETAPAS

### **ETAPA 1: Solicitação de Vaga** 👤
**Responsável:** Gestor do Departamento  
**Status Inicial:** CONCLUÍDA automaticamente ao criar admissão

**O que acontece:**
- Gestor acessa o módulo "Admissão" e clica em "Nova Admissão"
- Preenche formulário com dados do candidato:
  - Nome, CPF, E-mail, Telefone
  - Cargo, Departamento, Tipo de Contrato
  - Salário Proposto, Data de Início Prevista
- Sistema cria automaticamente:
  - Registro da admissão
  - Documentos obrigatórios no checklist
  - Primeira etapa do workflow marcada como concluída
  - Próxima etapa (Aprovação) criada como pendente

**Resultado:** Admissão criada com status "EM_ANDAMENTO" e etapa atual "APROVACAO"

---

### **ETAPA 2: Aprovação** ✅
**Responsável:** RH / Diretoria  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**O que acontece:**
- RH/Diretoria recebe notificação (futuro: e-mail automático)
- Acessa a admissão e revisa os dados
- Pode aprovar ou reprovar:
  - **Aprovar:** Avança para próxima etapa
  - **Reprovar:** Admissão cancelada, status muda para "REPROVADA"

**Ações disponíveis:**
- Visualizar dados do candidato
- Editar informações se necessário
- Aprovar ou reprovar
- Adicionar observações

**Resultado:** Se aprovado, avança para "COLETA_DOCUMENTOS"

---

### **ETAPA 3: Coleta de Documentos** 📄
**Responsável:** Candidato (com suporte do RH)  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**O que acontece:**
- Sistema envia e-mail automático ao candidato (futuro) com:
  - Link para upload de documentos
  - Lista de documentos obrigatórios
  - Prazos de entrega
- Candidato acessa link e faz upload dos documentos:
  - RG, CPF, CTPS, Comprovante de Residência
  - Título de Eleitor
  - Certidões (se aplicável)
  - Foto 3x4
- Sistema atualiza status de cada documento:
  - **PENDENTE** → **RECEBIDO** (após upload)

**Checklist de Documentos:**
1. ✅ Foto 3x4 (Obrigatório, Prazo: 3 dias)
2. ✅ CTPS Digital (Obrigatório, Prazo: 3 dias)
3. ✅ RG Frente (Obrigatório, Prazo: 3 dias)
4. ✅ RG Verso (Obrigatório, Prazo: 3 dias)
5. ✅ Comprovante de Residência (Obrigatório, Prazo: 5 dias)
6. ⚪ Certidão Nascimento/Casamento (Opcional, Prazo: 7 dias)
7. ⚪ Reservista (Opcional, Prazo: 7 dias)
8. ✅ Título de Eleitor (Obrigatório, Prazo: 5 dias)
9. ⚪ Antecedentes Criminais (Opcional, Prazo: 7 dias)
10. ⚪ Certidão de Dependente (Opcional, Prazo: 7 dias)
11. ⚪ CPF de Dependente (Opcional, Prazo: 7 dias)

**Resultado:** Todos os documentos obrigatórios recebidos → Avança para "EXAME_ADMISSIONAL"

---

### **ETAPA 4: Exame Admissional** 🏥
**Responsável:** Segurança do Trabalho (SST)  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**⚠️ MUDANÇA IMPORTANTE:** Esta etapa agora ocorre **ANTES** da validação de documentos pelo DP.

**O que acontece:**
- SST agenda exame médico admissional
- Realiza o ASO (Atestado de Saúde Ocupacional)
- Faz upload do ASO no sistema
- Marca etapa como concluída

**Documentos gerados:**
- ASO Admissional
- Laudos médicos (se necessário)

**Resultado:** ASO aprovado → Avança para "VALIDACAO_DOCUMENTOS"

---

### **ETAPA 5: Validação de Documentos** 🔍
**Responsável:** Departamento Pessoal (DP)  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**⚠️ MUDANÇA IMPORTANTE:** Esta etapa agora ocorre **DEPOIS** do exame admissional (SST).

**O que acontece:**
- DP acessa a aba "Checklist" da admissão
- Visualiza todos os documentos enviados
- Valida cada documento:
  - **Aprovar:** Documento válido e correto
  - **Reprovar:** Documento com problemas (motivo obrigatório)
- Sistema atualiza status:
  - **RECEBIDO** → **APROVADO** ou **REPROVADO**
- **Se reprovar:** Sistema notifica automaticamente todos os usuários do RH com o motivo

**Validações realizadas:**
- Verificação de autenticidade
- Conferência de dados (CPF, RG, etc.)
- Verificação de validade (se aplicável)
- Qualidade do arquivo enviado

**Resultado:** Todos os documentos obrigatórios aprovados → Avança para "ENVIO_DOMINIO_WEB"

---

### **ETAPA 6: Envio para Domínio Web** 🌐
**Responsável:** Departamento Pessoal (DP)  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**⭐ NOVA ETAPA:** Após validação de documentos, DP envia dados para o sistema Domínio Web.

**O que acontece:**
- DP acessa a admissão e clica em "Enviar para Domínio Web"
- Sistema prepara dados do candidato:
  - Dados pessoais (nome, CPF, RG, data nascimento)
  - Dados contratuais (cargo, departamento, salário, tipo contrato)
  - Dados de contato (email, telefone, endereço)
  - Documentos validados
- Sistema envia para API do Domínio Web
- Recebe confirmação e ID no sistema Domínio Web
- Registra data/hora do envio

**Dados enviados:**
- Nome completo, CPF, RG
- Data de nascimento, gênero
- Email, telefone
- Endereço completo
- Cargo, departamento
- Tipo de contrato, salário
- Data de início prevista
- Documentos anexados

**Resultado:** Dados enviados com sucesso → Avança para "GERACAO_CONTRATO"

---

### **ETAPA 7: Geração de Contrato** 📝
**Responsável:** Sistema Domínio Web  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**O que acontece:**
- Sistema Domínio Web recebe os dados
- Gera contrato de trabalho automaticamente baseado em:
  - Dados do candidato
  - Tipo de contrato (CLT, PJ, Estágio, Temporário)
  - Salário proposto
  - Jornada de trabalho
  - Data de início
- Contrato fica disponível para assinatura
- Sistema FGS recebe notificação de contrato gerado

**Resultado:** Contrato gerado no Domínio Web → Avança para "ASSINATURA_DIGITAL"

---

### **ETAPA 8: Assinatura Digital** ✍️
**Responsável:** Colaborador (Novo Funcionário)  
**Status:** PENDENTE → EM_ANDAMENTO → CONCLUIDA

**O que acontece:**
- Domínio Web envia link de assinatura digital ao colaborador
- Colaborador acessa link e assina digitalmente
- Sistema registra assinatura e data/hora
- Contrato assinado fica arquivado no sistema
- DP marca no FGS que contrato foi assinado fisicamente (alternativa)

**Tecnologias:**
- Assinatura digital via Domínio Web
- Ou assinatura física registrada no FGS

**Resultado:** Contrato assinado → Avança para "ENVIO_ESOCIAL"

---

### **ETAPA 9: Envio eSocial** 📤
**Responsável:** Sistema Automático  
**Status:** PENDENTO → EM_ANDAMENTO → CONCLUIDA

**O que acontece:**
- Sistema prepara evento S-2200 (Admissão de Trabalhador)
- Envia automaticamente para API do eSocial:
  - Dados do trabalhador
  - Dados do vínculo empregatício
  - Dados do contrato
- Recebe confirmação e ID do evento
- Registra data/hora do envio

**Dados enviados:**
- CPF, Nome, Data de Nascimento
- Endereço completo
- Cargo, Departamento, Salário
- Data de Admissão
- Tipo de Contrato

**Configuração necessária:**
```env
ESOCIAL_API_URL=https://webservices.producaorestrita.esocial.gov.br/...
ESOCIAL_TOKEN=seu_token_aqui
ESOCIAL_AMBIENTE=2  # 1=Produção, 2=Teste
ESOCIAL_CNPJ=12345678000190
```

**Resultado:** Evento S-2200 enviado com sucesso → Admissão CONCLUÍDA ✅

---

## 📊 CHECKLIST DE DOCUMENTOS

### Documentos Obrigatórios (10 tipos)

| # | Documento | Prazo | Responsável | Status |
|---|-----------|-------|-------------|--------|
| 1 | RG - Carteira de Identidade | 3 dias | DP | ✅ Obrigatório |
| 2 | CPF | 3 dias | DP | ✅ Obrigatório |
| 3 | CTPS - Carteira de Trabalho | 3 dias | DP | ✅ Obrigatório |
| 4 | Comprovante de Residência | 5 dias | DP | ✅ Obrigatório |
| 5 | Título de Eleitor | 5 dias | DP | ✅ Obrigatório |
| 6 | PIS/PASEP | 5 dias | DP | ✅ Obrigatório |
| 7 | Certidão de Nascimento | 7 dias | DP | ⚪ Opcional |
| 8 | Certidão de Casamento | 7 dias | DP | ⚪ Opcional |
| 9 | ASO - Atestado de Saúde Ocupacional | 7 dias | SST | ✅ Obrigatório |
| 10 | Foto 3x4 | 3 dias | RH | ✅ Obrigatório |

### Status dos Documentos

- **PENDENTE** 🔴 - Documento ainda não foi enviado
- **RECEBIDO** 🔵 - Documento enviado, aguardando validação
- **APROVADO** 🟢 - Documento validado e aprovado
- **REPROVADO** 🔴 - Documento rejeitado (requer correção)

### Fluxo de Validação

1. **Candidato envia documento** → Status: PENDENTE → RECEBIDO
2. **DP valida documento** → Status: RECEBIDO → APROVADO ou REPROVADO
3. **Se reprovado:** Candidato recebe notificação e pode reenviar

---

## 🔔 NOTIFICAÇÕES AUTOMÁTICAS (Futuro)

### E-mails Automáticos

1. **E-mail de Boas-Vindas** (ao criar admissão)
   - Link para upload de documentos
   - Lista de documentos necessários
   - Prazos de entrega

2. **Lembrete de Documentos Pendentes** (diário)
   - Lista de documentos ainda não enviados
   - Prazos próximos do vencimento
   - Link para upload

3. **Notificação de Conclusão** (ao finalizar admissão)
   - Para o gestor que solicitou
   - Para o RH
   - Informações de acesso ao sistema

4. **Alerta de Prazo Vencido**
   - Quando documento passa do prazo
   - Para candidato e responsável

---

## 📈 RELATÓRIOS E ESTATÍSTICAS

### Métricas Disponíveis

1. **Total de Admissões**
   - Total geral
   - Por período
   - Por departamento

2. **Tempo Médio de Admissão**
   - Em dias (do início ao fim)
   - Por etapa
   - Comparativo por período

3. **Documentos Pendentes**
   - Total de documentos aguardando
   - Por tipo de documento
   - Com prazo vencido

4. **Admissões por Status**
   - Em Andamento
   - Concluídas
   - Canceladas
   - Reprovadas

5. **Admissões por Etapa**
   - Distribuição atual das admissões
   - Gargalos identificados

6. **Admissões por Departamento**
   - Ranking de departamentos
   - Volume de contratações

---

## 🎯 COMO USAR O SISTEMA

### Para Gestores (Criar Nova Admissão)

1. Acesse **Admissão** no menu lateral
2. Clique em **"Nova Admissão"**
3. Preencha o formulário:
   - Dados do candidato (nome, CPF, e-mail, telefone)
   - Dados da vaga (cargo, departamento, tipo de contrato)
   - Salário proposto e data de início
4. Clique em **"Salvar"**
5. Sistema cria automaticamente:
   - Admissão com status "EM_ANDAMENTO"
   - Checklist com 10 documentos
   - Primeira etapa concluída

### Para RH (Aprovar e Gerenciar)

1. Acesse **Admissão** → Aba **"Admissões"**
2. Filtre por status "EM_ANDAMENTO"
3. Selecione uma admissão e clique em **"Ver Detalhes"**
4. Na aba **"Workflow"**:
   - Visualize todas as etapas
   - Clique em **"Avançar Etapa"** quando aprovar
5. Na aba **"Checklist"**:
   - Valide documentos (Aprovar/Reprovar)
   - Visualize arquivos enviados

### Para DP (Validar Documentos)

1. Acesse **Admissão** → Aba **"Checklist"**
2. Selecione uma admissão
3. Visualize todos os documentos
4. Para cada documento com status "RECEBIDO":
   - Clique no ícone de **"Aprovar"** ✅ ou **"Reprovar"** ❌
   - Adicione observações se necessário
5. Sistema atualiza status automaticamente

### Para Candidatos (Enviar Documentos) - Futuro

1. Recebe e-mail com link de acesso
2. Acessa link e visualiza checklist
3. Para cada documento pendente:
   - Clica em **"Enviar Documento"**
   - Seleciona arquivo (PDF, DOC, JPG, PNG)
   - Faz upload
4. Acompanha status de cada documento

---

## 🔧 INTEGRAÇÕES

### eSocial (S-2200)

**Quando:** Etapa 8 - Envio eSocial  
**O que faz:** Envia evento S-2200 (Admissão de Trabalhador)  
**Dados enviados:**
- Identificação do trabalhador
- Dados do vínculo empregatício
- Remuneração
- Local de trabalho

**Configuração:**
- URL da API do eSocial
- Token de autenticação
- CNPJ da empresa
- Ambiente (Produção/Teste)

### Thompson Reuters

**Quando:** Etapa 9 - Integração Thompson Reuters  
**O que faz:** Envia dados do novo colaborador para sistema externo  
**Dados enviados:**
- Dados pessoais completos
- Dados contratuais
- Endereço
- Contatos

**Configuração:**
- URL da API do Thompson Reuters
- API Key de autenticação

---

## ✅ BENEFÍCIOS DO SISTEMA

1. **Rastreabilidade Completa**
   - Histórico de todas as etapas
   - Log de alterações
   - Datas e responsáveis registrados

2. **Controle de Documentos**
   - Checklist automático
   - Status individual de cada documento
   - Alertas de prazo

3. **Automação**
   - Criação automática de documentos obrigatórios
   - Envio automático para eSocial
   - Integração com sistemas externos

4. **Conformidade Legal**
   - Envio obrigatório para eSocial
   - Documentos obrigatórios controlados
   - Prazos respeitados

5. **Eficiência**
   - Redução de tempo de admissão
   - Menos erros manuais
   - Processo padronizado

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Prazos:** Cada documento tem prazo configurável (padrão: 3-7 dias)
2. **Obrigatoriedade:** Documentos marcados como obrigatórios devem ser aprovados para avançar
3. **Validação:** Apenas DP pode aprovar/reprovar documentos
4. **Integrações:** Requerem configuração de credenciais no `.env`
5. **Notificações:** Sistema de e-mails automáticos será implementado na próxima fase

---

## 🚀 PRÓXIMAS MELHORIAS

- [ ] Sistema de notificações por e-mail completo
- [ ] Portal do candidato para upload de documentos
- [ ] Geração automática de contrato com templates
- [ ] Assinatura digital integrada
- [ ] Dashboard de métricas avançadas
- [ ] Relatórios exportáveis (PDF, Excel)
- [ ] Histórico de versões de documentos
- [ ] Alertas proativos de vencimento

---

## 📞 SUPORTE

Para dúvidas sobre o processo de admissão, entre em contato com o RH ou consulte a documentação técnica.

