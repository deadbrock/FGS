# 📊 Dados Mock dos Colaboradores

## 🎯 Visão Geral

O sistema agora possui **50 colaboradores mock** com **dados completos e realistas** para teste e demonstração.

---

## 👥 Lista de Colaboradores

### **Nomes Realistas**

#### Masculinos (IDs ímpares: 1, 3, 5, 7...)
- João Silva Santos
- Carlos Eduardo Oliveira
- Pedro Henrique Costa
- Rafael Almeida Souza
- Lucas Martins Ferreira
- Bruno Pereira Lima
- Guilherme Santos Rocha
- Fernando Costa Silva
- Rodrigo Alves Santos
- Thiago Souza Oliveira
- Gabriel Lima Costa
- André Pereira Santos
- Marcelo Silva Ferreira
- Ricardo Costa Almeida
- Felipe Santos Lima

#### Femininos (IDs pares: 2, 4, 6, 8...)
- Maria Silva Santos
- Ana Paula Oliveira
- Juliana Costa Ferreira
- Fernanda Almeida Santos
- Carla Souza Lima
- Patricia Santos Costa
- Camila Oliveira Silva
- Renata Ferreira Alves
- Beatriz Costa Santos
- Amanda Lima Oliveira
- Daniela Santos Ferreira
- Larissa Costa Silva
- Mariana Almeida Santos
- Priscila Oliveira Costa
- Vanessa Santos Lima

---

## 💼 Cargos e Setores

### **12 Cargos Diferentes**
1. Analista de RH
2. Assistente Administrativo
3. Coordenador de Produção
4. Gerente de Operações
5. Diretor Comercial
6. Analista Financeiro
7. Assistente de TI
8. Coordenador de Vendas
9. Gerente de Projetos
10. Analista de Marketing
11. Supervisor de Logística
12. Técnico de Manutenção

### **9 Setores**
1. Recursos Humanos
2. Administrativo
3. Operacional
4. Comercial
5. Financeiro
6. TI
7. Marketing
8. Logística
9. Produção

---

## 📋 Estrutura do Prontuário

Cada colaborador possui um **prontuário completo** com:

### **1. Dados Pessoais** 👤
- Nome completo
- CPF (gerado automaticamente)
- RG (gerado automaticamente)
- Data de Nascimento (varia de 1980-2010)
- Sexo (M/F alternado por ID)
- Estado Civil (Solteiro, Casado, Divorciado)
- Nacionalidade: Brasileira
- Naturalidade (9 cidades diferentes)
- Nome da Mãe e do Pai
- Telefone e Celular
- Email (formato: nome.sobrenome.id@fgs.com)
- **Endereço completo**:
  - CEP
  - Logradouro
  - Número
  - Complemento (33% dos colaboradores)
  - Bairro
  - Cidade
  - Estado

### **2. Dados Contratuais** 📄
- Data de Admissão (2020-2024)
- Cargo
- Departamento
- Salário (R$ 3.000 - R$ 15.000)
- Tipo de Contrato (CLT ou PJ, alternado)
- Jornada de Trabalho (40h ou 44h semanais)
- Horário de Entrada/Saída
- Status: Aprovado
- Gestor Imediato (80% dos casos)

### **3. Exames Médicos** 🏥
Cada colaborador tem **2 a 4 exames**:

#### Tipos de Exames:
- Admissional
- Periódico
- Retorno ao Trabalho
- Mudança de Função
- Demissional

#### Status Dinâmico:
- ✅ **APROVADO**: Exame válido (> 2 meses até vencer)
- ⏳ **PENDENTE**: Próximo do vencimento (< 2 meses)
- ❌ **VENCIDO**: Exame vencido

#### Informações:
- Data de realização
- Data de validade (1 ano após realização)
- Resultado: "Apto"
- Médico responsável
- CRM
- Observações (quando vencido)

### **4. Treinamentos** 📚
Cada colaborador tem **2 a 5 treinamentos**:

#### Tipos de Treinamento:
- Segurança do Trabalho
- Gestão de Pessoas
- Excel Avançado
- Liderança e Coaching
- Comunicação Assertiva
- Qualidade Total
- Atendimento ao Cliente
- Vendas Consultivas
- Gestão de Projetos
- Inovação e Criatividade
- Trabalho em Equipe
- Inteligência Emocional

#### Instituições:
- FGS Academy
- Tech Institute
- Centro de Treinamento Profissional
- Escola de Negócios
- Instituto de Desenvolvimento
- Academia Corporativa

#### Informações:
- Título e descrição
- Data de início e fim
- Carga horária (20h a 60h)
- Instrutor
- Instituição
- Status (Aprovado/Pendente/Vencido)
- Nota (7 a 10)
- Validade (50% dos treinamentos têm validade de 1 ano)

### **5. Atestados Médicos** 🩺
**33% dos colaboradores** têm atestados:
- Data de emissão
- Data início/fim do afastamento
- Dias de afastamento (1-3 dias)
- Médico responsável e CRM
- CID: J00 (Resfriado comum)
- Descrição
- Status: Aprovado

### **6. Férias** 🏖️
Cada colaborador tem **pelo menos 1 período de férias**:
- Período aquisitivo (início e fim)
- Dias de direito: 30
- Dias gozados
- Dias restantes
- Data início/fim das férias
- Tipo: Integral
- Status: Aprovado/Pendente

### **7. Advertências** ⚠️
**20% dos colaboradores** têm advertências:
- Tipo: Verbal
- Data
- Motivo: "Atraso reiterado"
- Descrição detalhada
- Aplicado por: Gerente Direto
- Status: Aprovado

---

## 📊 Estatísticas dos Dados Mock

### **Distribuição por Status:**
- 60% Ativos (30 colaboradores)
- 20% Em Férias (10 colaboradores)
- 20% Afastados (10 colaboradores)

### **Distribuição por Gênero:**
- 50% Masculino (IDs ímpares)
- 50% Feminino (IDs pares)

### **Distribuição por Tipo de Contrato:**
- 50% CLT (IDs pares)
- 50% PJ (IDs ímpares)

### **Cidades de Origem:**
- São Paulo - SP
- Rio de Janeiro - RJ
- Belo Horizonte - MG
- Curitiba - PR
- Porto Alegre - RS
- Salvador - BA
- Brasília - DF
- Fortaleza - CE
- Recife - PE

---

## 🔍 Como os Dados São Gerados

### **Algoritmo Baseado em ID:**
```typescript
// Cada característica é determinada pelo ID do colaborador
const id = colaboradorId;

// Sexo alternado
const sexo = id % 2 === 0 ? 'M' : 'F';

// Cargo baseado no módulo
const cargo = cargos[id % cargos.length];

// Status distribuído
const status = ['ATIVO', 'ATIVO', 'ATIVO', 'FERIAS', 'AFASTADO'][id % 5];

// Data de nascimento varia
const anoNascimento = 1980 + (id % 30); // 1980-2010

// Salário baseado no ID
const salario = 3000 + (id * 500) + ((id % 5) * 1000); // R$ 3.000 - R$ 15.000
```

### **Cache Inteligente:**
- Os prontuários são gerados **sob demanda**
- Armazenados em **cache** para consultas rápidas
- Dados consistentes entre múltiplas visualizações

---

## 🎮 Como Testar

### **1. Lista de Colaboradores**
```
1. Acesse: Prontuário no menu
2. Veja 50 colaboradores com nomes reais
3. Use filtros para buscar:
   - Por nome: "João", "Maria", "Silva"
   - Por cargo: "Analista de RH", "Gerente"
   - Por setor: "TI", "Comercial"
   - Por status: Ativo, Férias, Afastado
```

### **2. Prontuário Individual**
```
1. Clique em "Ver Prontuário" de qualquer colaborador
2. Explore as 7 abas:
   ✅ Dados Pessoais - formulário completo
   ✅ Dados Contratuais - informações trabalhistas
   ✅ Exames Médicos - 2-4 exames com status
   ✅ Atestados - alguns colaboradores têm
   ✅ Férias - histórico de férias
   ✅ Treinamentos - 2-5 treinamentos com validade
   ✅ Advertências - alguns colaboradores têm
```

### **3. Teste de Filtros**
```
Nos exames e treinamentos:
- Filtre por status: Aprovado/Pendente/Vencido
- Busque por nome/tipo
- Veja a paginação funcionando
```

---

## 🔄 Funcionalidades Implementadas

### **CRUD Completo:**
- ✅ **Create**: Adicionar novos exames e treinamentos
- ✅ **Read**: Visualizar todos os dados com paginação
- ✅ **Update**: Editar exames e treinamentos (simulado)
- ✅ **Delete**: Excluir exames e treinamentos (simulado)

### **Paginação:**
- ✅ Exames (10 por página)
- ✅ Treinamentos (10 por página)
- ✅ Navegação entre páginas

### **Filtros:**
- ✅ Por status (Aprovado/Pendente/Vencido)
- ✅ Busca por texto
- ✅ Combinação de filtros

---

## 🎯 Exemplos de Colaboradores

### **Colaborador ID 1 - João Silva Santos**
- 👤 Masculino
- 💼 Analista de RH
- 🏢 Recursos Humanos
- 📅 Admitido em 2021
- ✅ Status: Ativo
- 🏥 3 exames (alguns vencidos)
- 📚 3 treinamentos
- 🏖️ 1 período de férias

### **Colaborador ID 2 - Maria Silva Santos**
- 👤 Feminino
- 💼 Assistente Administrativo
- 🏢 Administrativo
- 📅 Admitida em 2022
- 🏖️ Status: Férias
- 🏥 2 exames (válidos)
- 📚 4 treinamentos
- 🩺 1 atestado médico

### **Colaborador ID 5 - Lucas Martins Ferreira**
- 👤 Masculino
- 💼 Diretor Comercial
- 🏢 Comercial
- 📅 Admitido em 2020
- ⚠️ Status: Afastado
- 🏥 4 exames
- 📚 5 treinamentos
- ⚠️ 1 advertência

---

## 🚀 Próximas Melhorias

### **Backend Real:**
Substituir por:
```typescript
// Ao invés de mock
import prontuarioService from './prontuarioService.mock';

// Usar serviço real
import prontuarioService from './prontuarioService';
```

### **Fotos dos Colaboradores:**
- Upload de fotos
- Integração com AWS S3 ou similar
- Visualização no avatar

### **Mais Dados:**
- Histórico de cargos
- Histórico salarial
- Dependentes
- Documentos anexados

---

## 📝 Notas Importantes

1. **Dados Fictícios**: Todos os dados são gerados automaticamente para demonstração
2. **CPF Mock**: CPFs não são válidos, apenas para visualização
3. **Emails Mock**: Emails não são reais
4. **Consistência**: Mesmo colaborador sempre terá os mesmos dados
5. **Performance**: Cache otimizado para acesso rápido

---

## ✅ Status: Completo e Funcional

🎉 **Sistema totalmente funcional com dados realistas para demonstração!**

- ✅ 50 colaboradores com nomes reais
- ✅ Prontuários completos com 7 seções
- ✅ Exames médicos com status dinâmico
- ✅ Treinamentos com validade
- ✅ Atestados e férias
- ✅ Filtros e paginação funcionando
- ✅ CRUD completo simulado

**Pronto para apresentação e testes!** 🚀

