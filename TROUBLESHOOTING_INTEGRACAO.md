# 🔧 Troubleshooting - Integração Trabalhe Conosco → FGS

## ❌ Erro 404 "Rota não encontrada"

### Problema Identificado

O log mostra que a requisição está sendo enviada para a URL base sem o endpoint correto:

```
url: 'https://fgs-production.up.railway.app'
path: 'POST / HTTP/1.1'
```

**A URL correta deveria ser:**
```
https://fgs-production.up.railway.app/api/admissoes/candidatos
```

### ✅ Solução

O problema está na **configuração da URL no sistema "Trabalhe Conosco"**, não no código do FGS.

#### 1. Verificar Variável de Ambiente

No Railway do sistema "Trabalhe Conosco", verifique a variável `FGS_API_URL`:

**❌ ERRADO:**
```env
FGS_API_URL=https://fgs-production.up.railway.app
```

**✅ CORRETO:**
```env
FGS_API_URL=https://fgs-production.up.railway.app/api/admissoes/candidatos
```

#### 2. Verificar Código do Sistema "Trabalhe Conosco"

Certifique-se de que o código está usando a variável de ambiente corretamente:

**❌ ERRADO:**
```javascript
const response = await axios.post(process.env.FGS_API_URL, dados);
// Se FGS_API_URL = "https://fgs-production.up.railway.app"
// Resultado: POST https://fgs-production.up.railway.app
```

**✅ CORRETO:**
```javascript
const response = await axios.post(process.env.FGS_API_URL, dados);
// Se FGS_API_URL = "https://fgs-production.up.railway.app/api/admissoes/candidatos"
// Resultado: POST https://fgs-production.up.railway.app/api/admissoes/candidatos
```

### 🔍 Como Verificar se a Rota Está Funcionando

#### Teste 1: Usando cURL

```bash
curl -X POST https://fgs-production.up.railway.app/api/admissoes/candidatos \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-api-key-aqui" \
  -d '{
    "nome": "Teste",
    "cpf": "123.456.789-00",
    "email": "teste@email.com",
    "vaga": {
      "id": 1,
      "titulo": "Teste"
    }
  }'
```

**Resposta esperada:**
- ✅ **401 Unauthorized**: A rota existe, mas a API key está incorreta
- ✅ **400 Bad Request**: A rota existe, mas faltam campos obrigatórios
- ❌ **404 Not Found**: A URL está incorreta ou a rota não está registrada

#### Teste 2: Usando Postman/Insomnia

1. **Método**: POST
2. **URL**: `https://fgs-production.up.railway.app/api/admissoes/candidatos`
3. **Headers**:
   - `Content-Type: application/json`
   - `X-API-Key: sua-api-key-aqui`
4. **Body** (JSON):
```json
{
  "nome": "Teste",
  "cpf": "123.456.789-00",
  "email": "teste@email.com",
  "vaga": {
    "id": 1,
    "titulo": "Teste"
  }
}
```

### 📋 Checklist de Verificação

- [ ] A variável `FGS_API_URL` contém a URL completa: `https://.../api/admissoes/candidatos`
- [ ] A variável `FGS_API_KEY` está configurada e é a mesma no FGS
- [ ] O código do "Trabalhe Conosco" usa `process.env.FGS_API_URL` diretamente (sem adicionar paths)
- [ ] O método HTTP é `POST`
- [ ] O header `Content-Type` é `application/json`
- [ ] O header `X-API-Key` está sendo enviado
- [ ] O body contém os campos obrigatórios: `nome`, `cpf`, `email`, `vaga`

### 🐛 Outros Erros Comuns

#### Erro 401 "Não autorizado"

**Causa**: API key ausente ou incorreta

**Solução**:
1. Verifique se `FGS_API_KEY` está configurada no Railway do FGS
2. Verifique se `FGS_API_KEY` está configurada no Railway do "Trabalhe Conosco"
3. Certifique-se de que ambas são **idênticas**
4. Verifique se o header está sendo enviado: `X-API-Key: sua-key` ou `Authorization: Bearer sua-key`

#### Erro 400 "Campos obrigatórios"

**Causa**: Faltam campos obrigatórios no body

**Campos obrigatórios**:
- `nome` (string)
- `cpf` (string)
- `email` (string)
- `vaga` (object com `id` e `titulo`)

**Solução**: Verifique se todos os campos estão sendo enviados no body da requisição.

#### Erro 500 "Erro interno do servidor"

**Causa**: Erro no processamento (banco de dados, validação, etc.)

**Solução**:
1. Verifique os logs do Railway do FGS
2. Verifique se o banco de dados está acessível
3. Verifique se as tabelas `admissoes`, `admissao_documentos`, etc. existem

### 📊 Logs de Debug no FGS

O FGS agora inclui logs de debug para ajudar a identificar problemas:

```
📥 [ADMISSAO CANDIDATOS] Recebendo requisição POST /api/admissoes/candidatos
📥 [ADMISSAO CANDIDATOS] Headers: { ... }
📥 [ADMISSAO CANDIDATOS] Body recebido: { ... }
```

**Como ver os logs no Railway:**
1. Acesse o Railway Dashboard
2. Selecione o projeto FGS
3. Clique em "Deployments"
4. Clique no deployment mais recente
5. Clique em "View Logs"

### 🔄 Ordem das Rotas (Corrigida)

As rotas foram reorganizadas para evitar conflitos:

1. ✅ Rotas específicas (`/candidatos`) vêm **ANTES** de rotas dinâmicas (`/:id`)
2. ✅ Isso garante que `/candidatos` seja capturada corretamente

### 📞 Exemplo de Configuração Correta

**No Railway do "Trabalhe Conosco":**

```env
FGS_API_URL=https://fgs-production.up.railway.app/api/admissoes/candidatos
FGS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**No código do "Trabalhe Conosco":**

```javascript
const axios = require('axios');

async function enviarCandidatoParaFGS(candidato) {
  try {
    const response = await axios.post(
      process.env.FGS_API_URL, // URL completa já configurada
      {
        nome: candidato.nome,
        cpf: candidato.cpf,
        email: candidato.email,
        telefone: candidato.telefone,
        data_nascimento: candidato.dataNascimento,
        endereco: {
          estado: candidato.estado,
          cidade: candidato.cidade,
          bairro: candidato.bairro
        },
        documentos: {
          curriculo_url: candidato.curriculoUrl
        },
        vaga: {
          id: candidato.vagaId,
          titulo: candidato.vagaTitulo
        },
        origem: 'trabalhe_conosco',
        candidato_id_origem: candidato.id,
        data_cadastro: new Date().toISOString()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.FGS_API_KEY
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar candidato para FGS:', error.response?.data || error.message);
    throw error;
  }
}
```

### ✅ Verificação Final

Após corrigir a URL, teste novamente. Você deve receber uma das seguintes respostas:

**✅ Sucesso (201):**
```json
{
  "success": true,
  "message": "Candidato recebido e admissão criada com sucesso",
  "data": {
    "admissao_id": "...",
    "nome_candidato": "...",
    "cpf": "...",
    "email": "...",
    "cargo": "...",
    "departamento": "...",
    "etapa_atual": "APROVACAO",
    "status": "EM_ANDAMENTO",
    "documentos_criados": 5,
    "ja_existia": false
  }
}
```

**✅ Já existe (200):**
```json
{
  "success": true,
  "message": "Candidato já possui admissão em andamento",
  "data": {
    "admissao_id": "...",
    "status": "EM_ANDAMENTO",
    "etapa_atual": "...",
    "ja_existia": true
  }
}
```

