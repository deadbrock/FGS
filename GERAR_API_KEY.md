# 🔑 Como Gerar e Configurar a API Key do FGS

## 📋 Visão Geral

A API Key do FGS é uma chave secreta usada para autenticar requisições de sistemas externos (como o "Trabalhe Conosco"). Ela é configurada como variável de ambiente no servidor.

## 🔧 Métodos para Gerar API Key

### Método 1: Usando OpenSSL (Recomendado)

**Linux/Mac:**
```bash
openssl rand -hex 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Ou use este comando mais simples:
```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Método 2: Usando Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Método 3: Gerador Online

Você pode usar geradores online como:
- https://www.random.org/strings/
- https://www.uuidgenerator.net/
- https://passwordsgenerator.net/

**Recomendação**: Gere uma string de pelo menos 32 caracteres (64 caracteres em hexadecimal).

### Método 4: Usando Python

```python
import secrets
print(secrets.token_hex(32))
```

## ⚙️ Configuração no Railway

### Passo 1: Gerar a API Key

Use um dos métodos acima para gerar uma chave. Exemplo:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Passo 2: Adicionar no Railway

1. Acesse o **Railway Dashboard**
2. Selecione o projeto **FGS Backend**
3. Vá em **Variables** (ou **Settings** → **Variables**)
4. Clique em **+ New Variable**
5. Adicione:
   - **Name**: `FGS_API_KEY`
   - **Value**: Cole a API key gerada
6. Clique em **Add**
7. O Railway irá reiniciar o serviço automaticamente

### Passo 3: Verificar se está funcionando

Após configurar, você pode testar fazendo uma requisição:

```bash
curl -X POST https://seu-sistema-fgs.com/api/admissoes/candidatos \
  -H "X-API-Key: sua-api-key-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "cpf": "12345678900",
    "email": "teste@email.com",
    "vaga": {
      "titulo": "Teste"
    }
  }'
```

Se retornar erro 401, a API key está incorreta ou não foi configurada.

## 🔒 Boas Práticas

1. **Nunca compartilhe a API key publicamente**
2. **Use uma chave diferente para cada ambiente** (desenvolvimento, produção)
3. **Regenere a chave periodicamente** (a cada 6-12 meses)
4. **Não commite a API key no código** (sempre use variáveis de ambiente)
5. **Use chaves longas e aleatórias** (mínimo 32 caracteres)

## 📝 Exemplo de API Key Válida

```
f8a3b2c1d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1
```

## 🛠️ Configuração Local (Desenvolvimento)

Se estiver testando localmente, adicione no arquivo `.env`:

```env
FGS_API_KEY=sua-api-key-aqui
```

**⚠️ IMPORTANTE**: Não commite o arquivo `.env` no Git!

## 🔍 Verificar se a API Key está Configurada

Você pode verificar se a variável está configurada verificando os logs do Railway. Se a API key não estiver configurada, você verá este aviso nos logs:

```
⚠️  FGS_API_KEY não configurada. Permitindo acesso sem autenticação.
```

**Nota**: Em desenvolvimento, o sistema permite acesso sem API key se ela não estiver configurada. Em produção, sempre configure a API key!

## 🚨 Troubleshooting

### Erro 401 (Não autorizado)
- Verifique se a variável `FGS_API_KEY` está configurada no Railway
- Verifique se o valor está correto (sem espaços extras)
- Verifique se o header `X-API-Key` está sendo enviado corretamente

### Acesso permitido sem API key
- Isso acontece quando `FGS_API_KEY` não está configurada
- Configure a variável no Railway para habilitar a autenticação

### Como regenerar a API key
1. Gere uma nova chave usando um dos métodos acima
2. Atualize a variável `FGS_API_KEY` no Railway
3. Atualize a variável `FGS_API_KEY` no sistema "Trabalhe Conosco"
4. O Railway reiniciará automaticamente

## 📞 Próximos Passos

Após configurar a API key:

1. ✅ Configure `FGS_API_KEY` no Railway do FGS
2. ✅ Configure `FGS_API_KEY` no Railway do "Trabalhe Conosco"
3. ✅ Configure `FGS_API_URL` no Railway do "Trabalhe Conosco"
4. ✅ Teste a integração enviando um candidato de teste

