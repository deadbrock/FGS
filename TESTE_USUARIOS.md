# 🧪 Guia de Teste - Módulo de Usuários

## 🚀 Iniciando o Sistema

### **Opção 1: Script Automático (Recomendado)**

Clique duas vezes em:
```
iniciar-sistema-completo.bat
```

### **Opção 2: Manual**

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev
```

---

## ✅ Checklist de Testes

### **1️⃣ Verificar Backend Rodando**

Abra: http://localhost:3333/health

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-11T...",
  "database": "connected"
}
```

✅ Se ver isso, o backend está OK!

---

### **2️⃣ Fazer Login**

1. Abra: http://localhost:3000
2. Email: `admin@fgs.com`
3. Senha: `admin123`
4. Clique em **Entrar**

**Resultado esperado:** Dashboard do sistema

---

### **3️⃣ Acessar Gestão de Usuários**

1. Menu lateral → **Usuários**

**Resultado esperado:**
- Lista de usuários existentes
- Botão "Novo Usuário" visível
- Campo de busca

---

### **4️⃣ TESTE: Criar Novo Usuário**

1. Clique em **Novo Usuário**
2. Preencha:
   - **Nome**: Teste Silva
   - **Email**: teste@fgs.com
   - **Senha**: teste123
   - **Perfil**: Colaborador
   - **Cargo**: Assistente
   - **Departamento**: TI
3. Clique em **Criar**

**Resultado esperado:**
- ✅ Alerta: "Usuário criado com sucesso!"
- ✅ Novo usuário aparece na lista
- ✅ Dialog fecha automaticamente

**Se der erro:**
- Verifique se o backend está rodando
- Abra F12 (Console) e veja os erros
- Verifique se o email já existe

---

### **5️⃣ TESTE: Buscar Usuário**

1. No campo de busca, digite: `teste`

**Resultado esperado:**
- ✅ Apenas usuários com "teste" no nome/email aparecem
- ✅ Lista filtra em tempo real

---

### **6️⃣ TESTE: Editar Usuário**

1. Clique no ícone de **Editar** (lápis) do usuário "Teste Silva"
2. Modifique:
   - **Nome**: Teste Silva Modificado
   - **Cargo**: Analista
   - Deixe a senha em branco
3. Clique em **Salvar**

**Resultado esperado:**
- ✅ Alerta: "Usuário atualizado com sucesso!"
- ✅ Nome e cargo atualizados na lista
- ✅ Senha não foi alterada (deixou em branco)

---

### **7️⃣ TESTE: Tentar Alterar Senha**

1. Edite o usuário novamente
2. Digite nova senha: `novasenha123`
3. Salve

**Resultado esperado:**
- ✅ Senha atualizada
- ✅ Próximo login deve usar a nova senha

---

### **8️⃣ TESTE: Validações**

#### **Email Duplicado**
1. Tente criar usuário com email `admin@fgs.com`

**Resultado esperado:**
- ❌ Erro: "Email já cadastrado"

#### **Campos Obrigatórios**
1. Tente criar usuário sem preencher nome

**Resultado esperado:**
- ❌ Erro: "Preencha os campos obrigatórios..."

#### **Senha Fraca**
1. Tente criar com senha `123`

**Resultado esperado:**
- ❌ Erro: "A senha deve ter no mínimo 6 caracteres"

---

### **9️⃣ TESTE: Proteção do Admin**

1. Tente deletar o usuário `admin@fgs.com`

**Resultado esperado:**
- ❌ Sem botão de deletar OU
- ❌ Alerta: "Não é possível deletar o usuário administrador principal"

---

### **🔟 TESTE: Deletar Usuário**

1. Clique no ícone de **Deletar** (lixeira) do usuário "Teste Silva Modificado"
2. Confirme a exclusão

**Resultado esperado:**
- ✅ Alerta: "Usuário deletado com sucesso!"
- ✅ Usuário removido da lista

---

## 📊 Testes da API (Opcional)

### **Listar Usuários**
```bash
curl http://localhost:3333/api/usuarios
```

### **Criar Usuário**
```bash
curl -X POST http://localhost:3333/api/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"API Test\",\"email\":\"api@test.com\",\"senha\":\"senha123\",\"role\":\"COLABORADOR\"}"
```

### **Atualizar Usuário** (substitua ID_DO_USUARIO)
```bash
curl -X PUT http://localhost:3333/api/usuarios/ID_DO_USUARIO \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"API Test Updated\"}"
```

### **Deletar Usuário** (substitua ID_DO_USUARIO)
```bash
curl -X DELETE http://localhost:3333/api/usuarios/ID_DO_USUARIO
```

---

## ✅ Resultado Final

Se todos os testes passarem:

- [x] Backend conectado ao PostgreSQL
- [x] API respondendo corretamente
- [x] Criar usuário funciona
- [x] Editar usuário funciona
- [x] Deletar usuário funciona
- [x] Busca funciona
- [x] Validações funcionam
- [x] Admin protegido
- [x] Senhas criptografadas
- [x] Interface responsiva

**🎉 MÓDULO DE USUÁRIOS 100% FUNCIONAL!**

---

## 🐛 Problemas Comuns

### **Backend não inicia**
```bash
# Instalar dependências
npm install --legacy-peer-deps

# Verificar .env
notepad .env

# Testar conexão com banco
node database/setup-database.js
```

### **Erro 404 na API**
- Verifique se o backend está rodando na porta 3333
- Verifique se criou o arquivo `.env.local` com `VITE_API_URL=http://localhost:3333`

### **Erro de CORS**
- Já está configurado no backend
- Se persistir, reinicie o backend

### **Usuários não aparecem**
- Verifique se há usuários no banco: `SELECT * FROM users;`
- Execute: `node database/setup-database.js` para criar usuários de teste

---

## 📞 Suporte

Se encontrar problemas:
1. Veja os logs do backend (terminal)
2. Abra F12 (Console do navegador)
3. Verifique a conexão com o banco
4. Consulte: `CONFIGURACAO_USUARIOS_REAL.md`

---

**Bom teste! 🚀**

