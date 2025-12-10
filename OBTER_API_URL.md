# 🌐 Como Obter a URL da API do FGS

## 📋 Visão Geral

A URL da API do FGS é o endereço base onde o backend está hospedado. Ela é necessária para que o sistema "Trabalhe Conosco" saiba para onde enviar os dados dos candidatos.

## 🔍 Onde Encontrar a URL da API

### Método 1: Railway Dashboard (Recomendado)

1. **Acesse o Railway Dashboard**
   - Vá para https://railway.app
   - Faça login na sua conta

2. **Selecione o Projeto FGS**
   - Clique no projeto do FGS Backend

3. **Acesse o Serviço**
   - Clique no serviço do backend (geralmente chamado de "backend" ou "api")

4. **Vá em Settings (Configurações)**
   - No menu lateral, clique em **Settings**

5. **Encontre a URL**                                                                                                                                      
   - Procure por **"Public Domain"** ou **"Custom Domain"**
   - A URL estará no formato: `https://seu-projeto.up.railway.app`
   - **OU** se você configurou um domínio customizado: `https://api.seudominio.com`

### Método 2: Railway Deployments

1. **Acesse o Railway Dashboard**
2. **Selecione o Projeto FGS**
3. **Clique em "Deployments"**
4. **Veja a URL no card do deployment**
   - Geralmente aparece como: `https://[nome-do-serviço].up.railway.app`

### Método 3: Verificar Variáveis de Ambiente

1. **No Railway Dashboard**
2. **Selecione o Projeto FGS**
3. **Vá em Variables**
4. **Procure por variáveis como:**
   - `RAILWAY_PUBLIC_DOMAIN`
   - `PORT` (geralmente 3333)
   - `DATABASE_URL` (não é a URL da API, mas pode ajudar a identificar o projeto)

## 📝 Formato da URL da API

A URL completa da API será:

```
https://seu-projeto.up.railway.app/api/admissoes/candidatos
```

**Exemplo:**
```
https://fgs-production.up.railway.app/api/admissoes/candidatos
```

### Estrutura da URL

- **Base URL**: `https://seu-projeto.up.railway.app`
- **Endpoint de Candidatos**: `/api/admissoes/candidatos`
- **URL Completa**: `https://seu-projeto.up.railway.app/api/admissoes/candidatos`

## ⚙️ Configuração no Railway

### Para o Sistema "Trabalhe Conosco"

No Railway do sistema "Trabalhe Conosco", adicione a variável de ambiente:

```env
FGS_API_URL=https://seu-projeto-fgs.up.railway.app/api/admissoes/candidatos
```

**Exemplo:**
```env
FGS_API_URL=https://fgs-production.up.railway.app/api/admissoes/candidatos
```

## 🔍 Como Verificar se a URL Está Correta

### Teste 1: Acessar no Navegador

Abra no navegador:
```
https://seu-projeto.up.railway.app/api/admissoes/estatisticas
```

Se retornar JSON (mesmo que erro 401 ou 500), a URL está correta.

### Teste 2: Usando cURL

```bash
curl https://seu-projeto.up.railway.app/api/admissoes/estatisticas
```

### Teste 3: Usando Postman ou Insomnia

1. Crie uma requisição GET
2. URL: `https://seu-projeto.up.railway.app/api/admissoes/estatisticas`
3. Envie a requisição
4. Se receber resposta (mesmo que erro), a URL está correta

## 🛠️ Configuração de Domínio Customizado (Opcional)

Se você quiser usar um domínio próprio (ex: `api.seudominio.com`):

1. **No Railway Dashboard**
2. **Selecione o Projeto FGS**
3. **Vá em Settings → Domains**
4. **Clique em "Custom Domain"**
5. **Adicione seu domínio**
6. **Configure o DNS** conforme instruções do Railway

Depois disso, use:
```
https://api.seudominio.com/api/admissoes/candidatos
```

## 📋 Checklist de Configuração

- [ ] Identifiquei a URL base do FGS no Railway
- [ ] Formatei a URL completa: `https://[url-base]/api/admissoes/candidatos`
- [ ] Testei a URL no navegador ou com cURL
- [ ] Configurei `FGS_API_URL` no sistema "Trabalhe Conosco"
- [ ] Configurei `FGS_API_KEY` no sistema "Trabalhe Conosco"
- [ ] Testei o envio de um candidato de teste

## 🚨 Troubleshooting

### Erro: "Connection refused" ou "Cannot connect"
- Verifique se o serviço está rodando no Railway
- Verifique se a porta está correta (geralmente 3333)
- Verifique se não há firewall bloqueando

### Erro: "404 Not Found"
- Verifique se a URL está completa: `/api/admissoes/candidatos`
- Verifique se as rotas estão configuradas corretamente
- Verifique os logs do Railway para erros

### Erro: "401 Unauthorized"
- Isso é normal! Significa que a URL está correta, mas a API key está faltando ou incorreta
- Configure a `FGS_API_KEY` no sistema "Trabalhe Conosco"

### Como encontrar a URL se não estiver visível
1. **Verifique os logs do Railway**
   - Os logs geralmente mostram em qual porta/URL o servidor está rodando
2. **Verifique o código do servidor**
   - Procure por `process.env.PORT` ou configurações de URL
3. **Entre em contato com o administrador do sistema**

## 📞 Exemplo Completo

**URL Base do FGS:**
```
https://fgs-production.up.railway.app
```

**URL Completa do Endpoint:**
```
https://fgs-production.up.railway.app/api/admissoes/candidatos
```

**Variáveis no "Trabalhe Conosco":**
```env
FGS_API_URL=https://fgs-production.up.railway.app/api/admissoes/candidatos
FGS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## 💡 Dica

Se você não conseguir encontrar a URL no Railway, você pode:
1. Verificar o histórico de commits/deployments
2. Verificar emails de notificação do Railway
3. Verificar variáveis de ambiente que podem conter a URL
4. Usar o Railway CLI para listar os serviços:
   ```bash
   railway status
   ```


