# Integração com Sistema "Trabalhe Conosco"

## 📋 Visão Geral

Este documento descreve a integração entre o sistema "Trabalhe Conosco" e o FGS para recebimento automático de candidatos e criação de admissões.

## 🔗 Endpoints Disponíveis

### 1. Receber Candidato
**POST** `/api/admissoes/candidatos`

Recebe dados de um candidato do sistema "Trabalhe Conosco" e cria automaticamente uma admissão no FGS.

#### Autenticação
- **Header**: `X-API-Key: sua-api-key-secreta`
- **OU**: `Authorization: Bearer sua-api-key-secreta`

#### Request Body
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  "endereco": {
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro"
  },
  "documentos": {
    "curriculo_url": "https://res.cloudinary.com/.../curriculo.pdf"
  },
  "vaga": {
    "id": 1,
    "titulo": "Desenvolvedor Full Stack",
    "departamento": "TI",
    "tipo_contrato": "CLT",
    "salario": 8000.00
  },
  "origem": "trabalhe_conosco",
  "candidato_id_origem": 42,
  "data_cadastro": "2025-01-15T10:30:00Z"
}
```

#### Campos Obrigatórios
- `nome`: Nome completo do candidato
- `cpf`: CPF do candidato (com ou sem formatação)
- `email`: E-mail do candidato
- `vaga`: Objeto com informações da vaga
  - `id`: ID da vaga (opcional)
  - `titulo`: Título da vaga (usado como cargo)

#### Campos Opcionais
- `telefone`: Telefone do candidato
- `data_nascimento`: Data de nascimento (formato: YYYY-MM-DD)
- `endereco`: Objeto com endereço
  - `estado`: Estado (UF)
  - `cidade`: Cidade
  - `bairro`: Bairro
- `documentos`: Objeto com documentos
  - `curriculo_url`: URL do currículo (será adicionado como documento)
- `origem`: Origem do candidato (padrão: "trabalhe_conosco")
- `candidato_id_origem`: ID do candidato no sistema de origem
- `data_cadastro`: Data de cadastro no sistema de origem

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Candidato recebido e admissão criada com sucesso",
  "data": {
    "admissao_id": "uuid-da-admissao",
    "nome_candidato": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "cargo": "Desenvolvedor Full Stack",
    "departamento": "TI",
    "etapa_atual": "APROVACAO",
    "status": "EM_ANDAMENTO",
    "documentos_criados": 10,
    "ja_existia": false
  }
}
```

#### Response (200 OK - Candidato já existe)
Se o candidato já possui uma admissão em andamento:
```json
{
  "success": true,
  "message": "Candidato já possui admissão em andamento",
  "data": {
    "admissao_id": "uuid-da-admissao-existente",
    "status": "EM_ANDAMENTO",
    "etapa_atual": "VALIDACAO_DOCUMENTOS",
    "ja_existia": true
  }
}
```

#### Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "Não autorizado",
  "message": "API key inválida ou ausente"
}
```

#### Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Campos obrigatórios: nome, cpf, email, vaga"
}
```

---

### 2. Verificar Status por CPF
**GET** `/api/admissoes/candidatos/cpf/:cpf`

Verifica o status de uma admissão pelo CPF do candidato.

#### Autenticação
- **Header**: `X-API-Key: sua-api-key-secreta`
- **OU**: `Authorization: Bearer sua-api-key-secreta`

#### Parâmetros
- `cpf`: CPF do candidato (com ou sem formatação)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-admissao",
    "nome_candidato": "João Silva",
    "cpf_candidato": "12345678900",
    "email_candidato": "joao@email.com",
    "cargo": "Desenvolvedor Full Stack",
    "departamento": "TI",
    "etapa_atual": "VALIDACAO_DOCUMENTOS",
    "status": "EM_ANDAMENTO",
    "data_solicitacao": "2025-01-15T10:30:00Z",
    "data_conclusao": null,
    "observacoes": "Candidato recebido do sistema \"trabalhe_conosco\"..."
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "error": "Nenhuma admissão encontrada para este CPF"
}
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente no FGS

No Railway (ou arquivo `.env` do FGS), adicione:

```env
# API Key para autenticação de integrações externas
FGS_API_KEY=sua-api-key-secreta-aqui

# URL do sistema FGS (para referência)
FGS_API_URL=https://seu-sistema-fgs.com/api/admissoes
```

**⚠️ IMPORTANTE**: Gere uma API key segura e única.

**📖 Consulte o arquivo `GERAR_API_KEY.md` para instruções detalhadas de como gerar e configurar a API key.**

**Resumo rápido:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Variáveis de Ambiente no "Trabalhe Conosco"

No Railway do sistema "Trabalhe Conosco", adicione:

```env
FGS_API_URL=https://seu-sistema-fgs.com/api/admissoes/candidatos
FGS_API_KEY=sua-api-key-secreta-aqui
```

**📖 Consulte o arquivo `OBTER_API_URL.md` para instruções detalhadas de como encontrar a URL da API do FGS.**

**Resumo rápido:**
1. Acesse o Railway Dashboard
2. Selecione o projeto FGS Backend
3. Vá em Settings → Public Domain
4. Copie a URL (formato: `https://seu-projeto.up.railway.app`)
5. Adicione o endpoint: `/api/admissoes/candidatos`
6. URL completa: `https://seu-projeto.up.railway.app/api/admissoes/candidatos`

---

## 🔄 Fluxo de Integração

1. **Candidato se inscreve** no sistema "Trabalhe Conosco"
2. **Sistema "Trabalhe Conosco"** envia dados via POST para `/api/admissoes/candidatos`
3. **FGS recebe** os dados e:
   - Verifica se já existe admissão para o CPF
   - Se não existe, cria nova admissão automaticamente
   - Cria documentos obrigatórios baseados no template
   - Cria etapas iniciais do workflow (SOLICITACAO_VAGA → APROVACAO)
   - Se houver currículo, adiciona como documento recebido
4. **FGS retorna** informações da admissão criada
5. **Processo de admissão** continua normalmente no FGS

---

## 📝 Exemplo de Implementação no "Trabalhe Conosco"

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function enviarCandidatoParaFGS(candidato) {
  try {
    const response = await axios.post(
      process.env.FGS_API_URL,
      {
        nome: candidato.nome,
        cpf: candidato.cpf,
        email: candidato.email,
        telefone: candidato.telefone,
        data_nascimento: candidato.data_nascimento,
        endereco: {
          estado: candidato.estado,
          cidade: candidato.cidade,
          bairro: candidato.bairro
        },
        documentos: {
          curriculo_url: candidato.curriculo_url
        },
        vaga: {
          id: candidato.vaga_id,
          titulo: candidato.vaga_titulo,
          departamento: candidato.vaga_departamento,
          tipo_contrato: 'CLT',
          salario: candidato.vaga_salario
        },
        origem: 'trabalhe_conosco',
        candidato_id_origem: candidato.id,
        data_cadastro: new Date().toISOString()
      },
      {
        headers: {
          'X-API-Key': process.env.FGS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Candidato enviado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar candidato:', error.response?.data || error.message);
    throw error;
  }
}
```

### Python
```python
import requests
import os
from datetime import datetime

def enviar_candidato_para_fgs(candidato):
    url = os.getenv('FGS_API_URL')
    api_key = os.getenv('FGS_API_KEY')
    
    payload = {
        "nome": candidato['nome'],
        "cpf": candidato['cpf'],
        "email": candidato['email'],
        "telefone": candidato.get('telefone'),
        "data_nascimento": candidato.get('data_nascimento'),
        "endereco": {
            "estado": candidato.get('estado'),
            "cidade": candidato.get('cidade'),
            "bairro": candidato.get('bairro')
        },
        "documentos": {
            "curriculo_url": candidato.get('curriculo_url')
        },
        "vaga": {
            "id": candidato['vaga_id'],
            "titulo": candidato['vaga_titulo'],
            "departamento": candidato.get('vaga_departamento', 'Não informado'),
            "tipo_contrato": "CLT",
            "salario": candidato.get('vaga_salario')
        },
        "origem": "trabalhe_conosco",
        "candidato_id_origem": candidato['id'],
        "data_cadastro": datetime.now().isoformat()
    }
    
    headers = {
        'X-API-Key': api_key,
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    return response.json()
```

---

## 🔒 Segurança

1. **API Key**: Use uma API key forte e única
2. **HTTPS**: Sempre use HTTPS em produção
3. **Validação**: O FGS valida todos os dados recebidos
4. **Rate Limiting**: Considere implementar rate limiting no futuro

---

## 🐛 Troubleshooting

### Erro 401 (Não autorizado)
- Verifique se a API key está correta
- Verifique se o header `X-API-Key` está sendo enviado
- Verifique se a variável `FGS_API_KEY` está configurada no FGS

### Erro 400 (Bad Request)
- Verifique se todos os campos obrigatórios estão sendo enviados
- Verifique o formato do JSON

### Erro 500 (Internal Server Error)
- Verifique os logs do servidor FGS
- Verifique se as tabelas do banco de dados estão criadas
- Verifique se o template de documentos está configurado

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do FGS ou entre em contato com a equipe de desenvolvimento.

