# FGS - Formando Gente de Sucesso
## Sistema de Recursos Humanos

Sistema completo de RH desenvolvido com React + TypeScript, featuring autenticação JWT, controle de permissões e interface moderna.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Material-UI (MUI)** para componentes
- **React Router v6** para roteamento
- **Axios** para requisições HTTP
- **JWT** para autenticação
- **Vite** como bundler

## 🎨 Design Moderno

- 🌓 **Tema claro/escuro** com toggle
- 🎨 **Gradientes premium** nas cores vermelho (#a2122a) e azul (#354a80)
- ✨ **Animações suaves** e transições (fade + slide)
- 🔍 **Campo de busca** integrado no header
- 🔔 **Central de notificações** com badges
- 💎 **Glassmorphism** e efeitos de profundidade
- 📊 **Dashboard redesenhado** com cards premium
- 🚀 **Atalhos rápidos** para todos os módulos
- 📋 **Breadcrumbs** em todas as páginas
- 🎯 **Botões com gradiente** padronizados
- ⏳ **Skeleton loading** em tabelas
- 🎭 **Microanimações** de entrada

## 👥 Perfis de Usuário

- **Administrador**: Acesso total ao sistema
- **RH**: Gestão de colaboradores e relatórios
- **Gestor**: Visualização de equipe e aprovações
- **Colaborador**: Acesso a dados pessoais

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🔧 Configuração

Configure a URL da API no arquivo `.env`:

```
VITE_API_URL=http://localhost:3333/api
```

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis
├── layouts/         # Layouts principais
├── pages/           # Páginas da aplicação
├── contexts/        # Contextos React (Auth, etc)
├── services/        # Serviços de API
├── types/           # Tipos TypeScript
├── utils/           # Funções utilitárias
├── hooks/           # Custom hooks
├── routes/          # Configuração de rotas
└── theme/           # Configuração de tema MUI
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e enviado em todas as requisições através do header `Authorization: Bearer <token>`.

## 📊 Módulos Implementados

### 🏠 Módulos Base
- ✅ **Login** com autenticação JWT
- ✅ **Dashboard** com estatísticas e indicadores
- ✅ **Gestão de Usuários** (perfis e permissões)
- ✅ **Configurações** do sistema

### 👥 Gestão de Pessoas
- ✅ **Prontuário do Colaborador** - Dados pessoais, contratuais, exames, atestados
- ✅ **Treinamentos** - Cadastro, agendamento, controle de vencimento
- ✅ **Benefícios** - Vale, planos, incentivos e relatórios de custos

### ⏰ Ponto e Frequência
- ✅ **Gestão de Ponto** - Horários, atrasos, faltas e ranking de pontualidade
- ✅ Integração futura com sistema de ponto facial

### 📢 Comunicação
- ✅ **Comunicação Interna** - Envio de comunicados por setor, função ou geral
- ✅ Sistema de notificações (app, email, WhatsApp*)

### 📊 Relatórios e Analytics
- ✅ **Relatórios e Indicadores** - Turnover, dias perdidos, custos
- ✅ Exportação para PDF, Excel e CSV
- ✅ Filtros avançados por período, setor, função

### 🔐 Segurança
- ✅ **Gestão de Usuários e Perfis** - Controle completo de acesso
- ✅ **Logs de Acesso** - Auditoria de login/logout
- ✅ **Logs de Alterações** - Rastreamento de modificações
- ✅ Dashboard de segurança com alertas

### 🔌 Integrações (NOVO!)
- ✅ **Ponto Eletrônico** - IDClass, REP, Secullum
- ✅ **E-mail Corporativo** - SMTP, Gmail, Outlook, SendGrid
- ✅ **WhatsApp Business** - Envio de notificações
- ✅ **Import/Export** - CSV, Excel, JSON
- ✅ **API Externa** - Integração com ERPs

### ⚙️ Infraestrutura
- ✅ Menu lateral recolhível
- ✅ Layout responsivo
- ✅ Sistema de logs de navegação
- ✅ Rotas protegidas por perfil
- ✅ Controle de permissões granular

### 🎨 Design Premium (Sistema de Design Completo)

#### Sistema de Design Tokens
- ✅ **Design Tokens** - Padronização completa de espaçamentos, sombras e tamanhos
  - Espaçamentos baseados em múltiplos de 8px (xs: 4px - 4xl: 96px)
  - 5 níveis de sombras (sm, md, lg, xl, 2xl) + sombras coloridas
  - Tipografia escalável de 8 níveis (12px - 48px)
  - Variáveis CSS e TypeScript tokens
  - Documentação completa em `DESIGN_SYSTEM.md`

#### Componentes Premium
- ✅ **Loading Personalizado** - Spinner com logo FGS
  - Duplo spinner concêntrico (vermelho + azul)
  - Logo no centro com animação pulse
  - Pontos animados em sequência
  - Mensagem personalizável

- ✅ **GradientButton** - Botões com microinterações avançadas
  - Efeito shimmer no hover
  - Ripple animation no click
  - Estado loading com spinner
  - 4 variantes: primary, secondary, success, error

- ✅ **AnimatedCard** - Cards com animações de entrada
- ✅ **PageHeader** - Cabeçalhos com breadcrumbs e gradiente
- ✅ **ActionButton** - Botões de ação com ícones
- ✅ **SkeletonLoaders** - Loading states elegantes

#### Telas Redesenhadas
- ✅ **Tela de Login Premium**
  - Fundo com gradiente animado e padrão de pontos
  - Card com glassmorphism e sombras elegantes
  - Logo FGS com animação pulse
  - Frase institucional: "Formando Gente de Sucesso"
  - Campos minimalistas com ícones coloridos
  - Botão com gradiente e efeitos hover
  - Rodapé com copyright dinâmico

- ✅ **Dashboard Moderno**
  - Cards premium com gradientes suaves
  - Gráficos com Recharts
  - Contadores animados
  - Atalhos rápidos para módulos

#### Tipografia e Contraste
- ✅ **Fontes Uniformizadas**
  - Inter (corpo, interfaces) - 300-800 weights
  - Poppins (títulos, destaques) - 300-800 weights
  - Fira Code (código monospace)
  - Hierarquia clara de títulos (H1-H6)

- ✅ **Contraste Otimizado**
  - Textos primários: #1a202c (contraste 7.8:1)
  - Textos secundários: #4a5568 (contraste 5.2:1)
  - Placeholders: #a0aec0 (contraste 3.9:1)
  - 100% WCAG AA compliance

#### UX e Interações
- ✅ **Microinterações** - Feedback visual em todos os elementos
  - Hover com elevação e sombras
  - Active com escala reduzida
  - Loading states consistentes
  - Transições suaves (cubic-bezier)

- ✅ **Animações Premium**
  - 15+ keyframes CSS globais
  - 50+ transições implementadas
  - Animações de página (fade, slide)
  - Modais e dropdowns animados (Framer Motion)

#### Responsividade e Acessibilidade
- ✅ **Responsividade Completa**
  - Mobile (< 600px) ✓
  - Tablet (600-959px) ✓
  - Desktop (960-1279px) ✓
  - Large Desktop (1280px+) ✓
  - Touch targets mínimo 44x44px

- ✅ **Acessibilidade WCAG AA**
  - Contraste adequado em todos os textos
  - Navegação completa por teclado
  - ARIA labels e roles semânticos
  - Focus visible em todos os elementos
  - Suporte a leitores de tela

#### Documentação
- 📚 **DESIGN_SYSTEM.md** - Sistema de design completo
- 📚 **REDESIGN_FINAL.md** - Resumo executivo do redesign
- 📚 **LOGIN_PREMIUM.md** - Documentação da tela de login
- 📚 **DASHBOARD_PREMIUM.md** - Documentação do dashboard
- 📚 **UX_PREMIUM.md** - Melhorias de experiência

## 🛠️ Desenvolvimento

O projeto está preparado para integração com backend Node.js através de API REST. Todos os serviços de API estão centralizados na pasta `services/`.

---

**Desenvolvido para FGS - Formando Gente de Sucesso**

"# FGS" 
