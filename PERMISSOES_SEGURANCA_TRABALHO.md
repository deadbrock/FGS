# 🔐 Permissões - Segurança do Trabalho

## 📋 Novo Role Implementado

Foi criado um novo perfil de usuário no sistema FGS:

### 👷 SEGURANÇA DO TRABALHO (`SEGURANCA_TRABALHO`)

**Descrição**: Perfil específico para profissionais do setor de Segurança do Trabalho, com acesso restrito apenas ao módulo de Treinamentos.

---

## 🎯 Permissões de Acesso

### ✅ **Módulos Permitidos**

| Módulo | Acesso | Descrição |
|--------|--------|-----------|
| 📊 Dashboard | ✅ Sim | Visualização do painel principal do sistema |
| 📚 Treinamentos | ✅ Sim | **Acesso completo** - Agendar, gerenciar e visualizar treinamentos |

### ❌ **Módulos Bloqueados**

| Módulo | Acesso | Motivo |
|--------|--------|--------|
| 👥 Usuários | ❌ Não | Gestão de usuários restrita a Admin e RH |
| 📁 Prontuário | ❌ Não | Dados sensíveis de colaboradores |
| ⏰ Ponto e Frequência | ❌ Não | Controle de ponto restrito |
| 🎁 Benefícios | ❌ Não | Gestão financeira restrita |
| 📢 Comunicação | ❌ Não | Comunicados internos restritos |
| 📊 Relatórios | ❌ Não | Relatórios gerenciais restritos |
| 🔒 Segurança | ❌ Não | Configurações exclusivas de Admin |
| 🔗 Integrações | ❌ Não | Integrações técnicas exclusivas de Admin |
| ⚙️ Configurações | ❌ Não | Configurações do sistema exclusivas de Admin |

---

## 👤 Usuário de Teste

Para testar o novo perfil, foi criado um usuário mock:

**Credenciais de Acesso:**
```
Email: seguranca@fgs.com
Senha: seguranca123
```

**Dados do Usuário:**
- **Nome**: Carlos Segurança
- **Departamento**: Segurança do Trabalho
- **Cargo**: Técnico de Segurança do Trabalho
- **Role**: SEGURANCA_TRABALHO

---

## 🎨 Identificação Visual

**Badge de Perfil:**
- **Cor**: Azul (#1976d2)
- **Label**: "Segurança do Trabalho"

O badge aparece em:
- Menu lateral (sidebar)
- Perfil do usuário
- Lista de usuários (quando implementada)

---

## 📚 Funcionalidades no Módulo Treinamentos

O usuário com perfil de Segurança do Trabalho tem acesso completo a:

### ✅ Funcionalidades Permitidas:

1. **📅 Agendar Treinamentos**
   - Criar novos agendamentos
   - Definir data, hora e local
   - Selecionar colaboradores participantes
   - Definir instrutor

2. **👥 Gerenciar Participantes**
   - Adicionar colaboradores aos treinamentos
   - Remover participantes
   - Controlar presença

3. **📊 Visualizar Dashboards**
   - Estatísticas de treinamentos
   - Gráficos de participação
   - Taxa de conclusão
   - Treinamentos vencidos e pendentes

4. **📋 Cadastrar Tipos de Treinamento**
   - Criar categorias
   - Definir validade
   - Configurar obrigatoriedade

5. **📤 Importação em Massa**
   - Importar treinamentos via CSV
   - Importar participantes

6. **🔔 Alertas de Vencimento**
   - Visualizar treinamentos próximos do vencimento
   - Receber notificações automáticas

---

## 🔧 Implementação Técnica

### Arquivos Modificados:

1. **`src/types/index.ts`**
   - Adicionado `SEGURANCA_TRABALHO` ao enum `UserRole`

2. **`src/utils/permissions.ts`**
   - Atualizado `routePermissions` com novo role
   - Adicionado nome amigável: "Segurança do Trabalho"
   - Adicionado cor do badge: #1976d2

3. **`src/layouts/DashboardLayout.tsx`**
   - Atualizado menu lateral com permissões do novo role
   - Apenas "Dashboard" e "Treinamentos" visíveis

4. **`src/routes/index.tsx`**
   - Adicionado role nas rotas protegidas
   - Rota `/treinamentos` agora inclui `SEGURANCA_TRABALHO`

5. **`src/services/authService.mock.ts`**
   - Adicionado usuário mock para testes
   - Email: `seguranca@fgs.com`
   - Senha: `seguranca123`

---

## 🚀 Como Testar

### Passo a Passo:

1. **Acesse o sistema**
   ```
   http://localhost:3002/login
   ```

2. **Faça login com as credenciais**
   ```
   Email: seguranca@fgs.com
   Senha: seguranca123
   ```

3. **Verifique o menu lateral**
   - Deve exibir apenas: Dashboard e Treinamentos
   - Outros módulos não devem aparecer

4. **Tente acessar um módulo restrito**
   - Digite manualmente na URL: `/prontuario` ou `/usuarios`
   - Sistema deve redirecionar para o Dashboard
   - Mensagem de "Acesso negado" deve aparecer

5. **Teste funcionalidades de Treinamentos**
   - Agendar novo treinamento
   - Adicionar participantes
   - Visualizar estatísticas

---

## 📊 Matriz de Permissões Completa

| Módulo | Admin | RH | Gestor | Colaborador | Seg. Trabalho |
|--------|-------|-----|--------|-------------|---------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuários | ✅ | ✅ | ❌ | ❌ | ❌ |
| Prontuário | ✅ | ✅ | ✅ | ❌ | ❌ |
| Treinamentos | ✅ | ✅ | ✅ | ❌ | ✅ |
| Ponto | ✅ | ✅ | ✅ | ❌ | ❌ |
| Benefícios | ✅ | ✅ | ✅ | ❌ | ❌ |
| Comunicação | ✅ | ✅ | ✅ | ❌ | ❌ |
| Relatórios | ✅ | ✅ | ✅ | ❌ | ❌ |
| Segurança | ✅ | ❌ | ❌ | ❌ | ❌ |
| Integrações | ✅ | ❌ | ❌ | ❌ | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔐 Segurança

### Validações Implementadas:

1. **Validação de Rota**
   - `PrivateRoute` verifica role antes de renderizar
   - Redirecionamento automático se não autorizado

2. **Validação de Menu**
   - Menu lateral só exibe itens permitidos
   - Filtro baseado em `allowedRoles`

3. **Validação de Permissão**
   - Função `hasPermission()` centraliza verificação
   - Reutilizável em qualquer parte do código

### Boas Práticas:

- ✅ Permissões definidas centralizadamente
- ✅ Validação no frontend e backend (quando implementado)
- ✅ Princípio do menor privilégio
- ✅ Separação clara de responsabilidades

---

## 📝 Próximos Passos (Futuro)

Para expandir as funcionalidades:

1. **Permissões Granulares**
   - Criar/Editar/Visualizar/Excluir separadamente
   - Permissões por recurso específico

2. **Grupos de Permissão**
   - Agrupar permissões relacionadas
   - Facilitar gestão em escala

3. **Auditoria**
   - Log de acessos
   - Histórico de alterações de permissão

4. **Dashboard Personalizado**
   - Cada role vê informações relevantes
   - Métricas específicas por perfil

---

**Desenvolvido por**: Sistema FGS  
**Data de Implementação**: 2025  
**Versão**: 2.0.0

