# 📋 Análise Comparativa: Funcionalidades do Prontuário

## ✅ Funcionalidades JÁ Implementadas

### 1. Dados Pessoais Completos
- ✅ Nome, CPF, RG, Data de Nascimento
- ✅ Endereço completo (CEP, Rua, Bairro, Cidade, Estado)
- ✅ Contatos (Telefone, E-mail)
- ✅ Estado Civil, Dependentes (quantidade_dependentes)
- ⚠️ **FALTA: WhatsApp** (existe apenas para integrações, não como campo de contato)
- ⚠️ **FALTA: Escolaridade** (existe no tipo TypeScript, mas precisa verificar se está no schema e formulário)

### 2. Dados Contratuais
- ✅ Data de Admissão e Demissão
- ✅ Cargo e Departamento
- ✅ Tipo de Contrato (CLT, PJ, Estágio, Temporário)
- ✅ Centro de Custo
- ✅ Local de Trabalho (Estado/Cidade)
- ✅ Jornada de Trabalho
- ✅ Benefícios vinculados (módulo separado)
- ⚠️ **FALTA: Histórico de Reajustes de Salário** (não existe tabela nem funcionalidade)

### 3. Documentos Digitais
- ✅ RG, CPF, CNH (suportado via tabela documentos)
- ✅ Comprovante de Residência (suportado via tabela documentos)
- ✅ Título de Eleitor (campo na tabela colaboradores)
- ✅ Carteira de Trabalho - CTPS (campos na tabela colaboradores)
- ✅ PIS/PASEP (campo na tabela colaboradores)
- ✅ Upload ilimitado de documentos (tabela documentos existe)
- ⚠️ **FALTA: Histórico de versões** (não existe controle de versões de documentos)
- ⚠️ **FALTA: Controle de validade completo** (existe data_validade, mas alertas podem ser melhorados)

### 4. Documentos Médicos
- ✅ ASO (Admissional, Periódico, Demissional, Mudança de Função) - via tabela documentos
- ✅ Atestados Médicos (módulo separado)
- ✅ Exames Ocupacionais (módulo separado)
- ⚠️ **FALTA: Carteira de Vacinação** (não existe tipo específico)
- ⚠️ **FALTA: Alertas de vencimento de exames** (existe estrutura básica, mas pode ser melhorado)

---

## 🚧 Funcionalidades FALTANTES a Implementar

### Prioridade ALTA

1. **WhatsApp como campo de contato**
   - Adicionar campo `whatsapp` na tabela `colaboradores`
   - Adicionar no formulário de Dados Pessoais
   - Adicionar no backend controller

2. **Escolaridade**
   - Verificar se campo existe no schema
   - Adicionar no formulário se não existir
   - Garantir que está sendo salvo/carregado

3. **Histórico de Reajustes de Salário**
   - Criar tabela `historico_reajustes_salario`
   - Criar endpoints no backend
   - Criar componente no frontend
   - Integrar na aba Dados Contratuais

### Prioridade MÉDIA

4. **Histórico de Versões de Documentos**
   - Criar tabela `documentos_versoes`
   - Implementar sistema de versionamento
   - Interface para visualizar versões

5. **Carteira de Vacinação**
   - Adicionar tipo de documento específico
   - Criar interface específica se necessário

6. **Alertas de Vencimento Melhorados**
   - Melhorar sistema de alertas existente
   - Adicionar notificações automáticas
   - Dashboard de alertas

---

## 📝 Plano de Implementação

### Fase 1: Campos Faltantes em Dados Pessoais
- [ ] Adicionar campo WhatsApp no schema
- [ ] Adicionar WhatsApp no backend controller
- [ ] Adicionar WhatsApp no formulário frontend
- [ ] Verificar e corrigir Escolaridade

### Fase 2: Histórico de Reajustes
- [ ] Criar migration para tabela historico_reajustes_salario
- [ ] Criar endpoints backend (CRUD)
- [ ] Criar componente frontend
- [ ] Integrar na aba Dados Contratuais

### Fase 3: Melhorias em Documentos
- [ ] Sistema de versionamento
- [ ] Melhorias em alertas
- [ ] Carteira de Vacinação

---

## 🔍 Verificações Necessárias

1. Verificar se `escolaridade` existe no schema atual
2. Verificar se alertas de vencimento estão funcionando corretamente
3. Verificar se todos os tipos de documentos estão sendo suportados

