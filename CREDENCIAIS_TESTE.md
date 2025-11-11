# 🔐 Credenciais de Teste - FGS Sistema de RH

## Usuários de Teste

O sistema possui 5 usuários mock para demonstração:

### 1. Administrador Sistema
```
Email: admin@fgs.com
Senha: admin123
Permissões: Acesso total ao sistema
```

**Acesso a:**
- ✅ Todos os módulos
- ✅ Dashboard completo
- ✅ Prontuário (todos)
- ✅ Benefícios
- ✅ Treinamentos
- ✅ Ponto Eletrônico
- ✅ Regionais
- ✅ Relatórios
- ✅ Configurações
- ✅ Segurança

---

### 2. RH Gestor
```
Email: rh@fgs.com
Senha: rh123
Permissões: Gestão de RH completa
```

**Acesso a:**
- ✅ Dashboard
- ✅ Prontuário (todos)
- ✅ Benefícios
- ✅ Treinamentos
- ✅ Ponto Eletrônico
- ✅ Regionais
- ✅ Relatórios
- ❌ Segurança

---

### 3. Gestor de Equipe
```
Email: gestor@fgs.com
Senha: gestor123
Permissões: Gestão de equipe
```

**Acesso a:**
- ✅ Dashboard
- ✅ Prontuário (sua equipe)
- ✅ Benefícios (visualização)
- ✅ Treinamentos
- ✅ Ponto Eletrônico (sua equipe)
- ✅ Regionais
- ✅ Relatórios (limitado)
- ❌ Segurança

---

### 4. Colaborador
```
Email: colaborador@fgs.com
Senha: colaborador123
Permissões: Acesso limitado (self-service)
```

**Acesso a:**
- ✅ Dashboard (próprio)
- ✅ Prontuário (apenas visualização própria)
- ✅ Benefícios (próprios)
- ✅ Treinamentos (próprios)
- ✅ Ponto Eletrônico (próprio)
- ❌ Regionais
- ❌ Relatórios
- ❌ Segurança

---

### 5. Segurança do Trabalho
```
Email: seguranca@fgs.com
Senha: seguranca123
Permissões: Gestão de treinamentos
```

**Acesso a:**
- ✅ Dashboard (limitado)
- ✅ Treinamentos (completo)
- ❌ Outros módulos

---

## Módulos do Sistema

### 📊 Dashboard
- Estatísticas gerais
- Registros recentes
- Alertas automáticos
- Gráficos de progresso

### 📋 Prontuário
- Dados Pessoais
- Dados Contratuais
- Documentos
- Dependentes
- Formação Acadêmica
- Experiência Profissional
- Avaliações de Desempenho
- Observações
- Benefícios do Colaborador
- Histórico Completo

### 🎁 Benefícios
- Cadastro de benefícios
- Gestão de categorias
- Valores e fornecedores
- Status ativo/inativo

### 📚 Treinamentos
- Agendamento de treinamentos
- Gestão de participantes
- Tipos e categorias
- Histórico

### ⏰ Ponto Eletrônico
- Registro de ponto
- Relatórios de frequência
- Justificativas
- Horas extras

### 🗺️ Regionais
- Mapa de atuação
- Estatísticas por estado
- Colaboradores por região
- Análises geográficas

### 📈 Relatórios
- Diversos relatórios gerenciais
- Exportação em PDF/CSV
- Filtros personalizados

### ⚙️ Configurações
- Perfil do usuário
- Alterar foto
- Alterar senha
- Preferências do sistema
- Tema escuro/claro

### 🔒 Segurança
- Dashboard de segurança
- Logs de acesso
- Logs de alterações
- Gestão de usuários
- Monitoramento de ações

---

## Funcionalidades por Módulo

### Prontuário - Histórico Completo
O histórico exibe uma timeline com todos os eventos importantes:

- **Admissão:** Data de entrada
- **Promoções:** Mudanças de cargo
- **Treinamentos:** Cursos realizados
- **Avaliações:** Avaliações de desempenho
- **Férias:** Períodos de férias
- **Advertências:** Ocorrências disciplinares
- **Atestados:** Afastamentos médicos
- **Demissão:** Data de saída (se aplicável)

### Benefícios - Gestão
Cadastre e gerencie benefícios como:
- Vale Transporte
- Vale Refeição
- Vale Alimentação
- Plano de Saúde
- Plano Odontológico
- Seguro de Vida
- Gympass
- Auxílio Creche
- Participação nos Lucros

### Regionais - Visão Geográfica
- **Mapa Interativo:** Visualize colaboradores por estado
- **Estatísticas:** Números por região
- **Ranking:** Estados com mais colaboradores
- **Detalhes:** Lista completa por estado

### Segurança - Logs de Alterações
Rastreie todas as mudanças no sistema:
- Quem alterou
- Quando alterou
- O que foi alterado
- Valores anteriores e novos
- Módulo e ação
- IP e navegador

---

## Testes Recomendados

### 1. Autenticação
- [ ] Login com cada tipo de usuário
- [ ] Logout
- [ ] Verificar permissões de cada role

### 2. Navegação
- [ ] Menu lateral funciona
- [ ] Rotas protegidas (403 para usuários sem permissão)
- [ ] Breadcrumbs corretos

### 3. CRUD
- [ ] Criar novo benefício
- [ ] Editar benefício existente
- [ ] Excluir benefício
- [ ] Visualizar detalhes

### 4. Responsividade
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 5. Tema
- [ ] Alternar entre claro/escuro
- [ ] Preferência salva no localStorage

### 6. Performance
- [ ] Carregamento inicial rápido
- [ ] Navegação fluida entre páginas
- [ ] Lazy loading funcionando

---

## Dados Mock

O sistema usa dados mock temporários. Para produção real:

1. **Implementar Backend:**
   - API REST
   - Autenticação JWT
   - Banco de dados (PostgreSQL/MySQL)

2. **Substituir Serviços Mock:**
   - `authService.mock.ts` → `authService.ts`
   - `prontuarioService.mock.ts` → `prontuarioService.ts`
   - etc.

3. **Configurar Variáveis de Ambiente:**
   ```
   VITE_API_URL=https://sua-api.com
   VITE_API_KEY=sua-chave
   ```

---

## URLs Após Deploy

### Vercel
```
Production: https://fgs-rh-system.vercel.app
Preview: https://fgs-rh-system-git-<branch>.vercel.app
```

### Railway
```
Production: https://fgs-rh-system.up.railway.app
```

### Domínio Personalizado (Exemplo)
```
https://fgs.seudominio.com
ou
https://sistema.fgs.com.br
```

---

## Suporte

Para dúvidas sobre:
- **Deploy:** Ver `DEPLOY_README.md`
- **Vercel:** Ver `DEPLOY_VERCEL.md`
- **Railway:** Ver `DEPLOY_RAILWAY.md`
- **Geral:** Ver `DEPLOY_GUIA_COMPLETO.md`

---

**Última atualização:** Novembro 2025  
**Sistema:** FGS - Formando Gente de Sucesso  
**Versão:** 1.0.0

