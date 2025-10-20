# 🎨 Componentes Modernos - FGS

## ✨ Novos Componentes Implementados

### 1️⃣ PageHeader
**Cabeçalho elegante com breadcrumbs**

```tsx
import { PageHeader, GradientButton } from '../components';

<PageHeader
  title="Gestão de Usuários"
  subtitle="Gerencie os usuários e suas permissões no sistema"
  breadcrumbs={[
    { label: 'Home', path: '/dashboard' },
    { label: 'Usuários' },
  ]}
  action={
    <GradientButton startIcon={<AddIcon />} onClick={handleAdd}>
      Adicionar Usuário
    </GradientButton>
  }
/>
```

**Recursos:**
- ✅ Título com gradiente vermelho/azul
- ✅ Subtítulo explicativo
- ✅ Breadcrumbs navegáveis
- ✅ Slot para ações (botões)
- ✅ Animação fadeInSlide

---

### 2️⃣ GradientButton
**Botões com gradiente premium**

```tsx
import { GradientButton } from '../components';

<GradientButton
  gradient="primary"  // primary | secondary | success | error
  loading={false}
  startIcon={<SaveIcon />}
  onClick={handleSave}
>
  Salvar
</GradientButton>
```

**Gradientes Disponíveis:**
- `primary`: Vermelho (#a2122a → #d4455d)
- `secondary`: Azul (#354a80 → #5f75b3)
- `success`: Verde (#388e3c → #66bb6a)
- `error`: Vermelho escuro (#d32f2f → #f44336)

**Recursos:**
- ✅ Gradiente vibrante
- ✅ Hover com transform (-2px)
- ✅ Sombra colorida
- ✅ Loading state com spinner
- ✅ Disabled state

---

### 3️⃣ AnimatedCard
**Cards com animação de entrada**

```tsx
import { AnimatedCard } from '../components';

<AnimatedCard delay={0.1}>
  <CardContent>
    {/* Seu conteúdo */}
  </CardContent>
</AnimatedCard>
```

**Recursos:**
- ✅ Border radius 16px
- ✅ Sombra suave
- ✅ Hover com elevação (-4px)
- ✅ Animação fadeInSlideUp
- ✅ Delay configurável

---

### 4️⃣ ActionButton
**Botões de ação com ícones**

```tsx
import { ActionButton } from '../components';

<ActionButton
  action="edit"     // edit | delete | view | save | add | download | upload | refresh
  onClick={handleEdit}
  tooltip="Editar usuário"
/>
```

**Ações Disponíveis:**
- `edit` - Azul (#1976d2)
- `delete` - Vermelho (#d32f2f)
- `view` - Verde (#388e3c)
- `save` - Verde (#388e3c)
- `add` - Azul (#1976d2)
- `download` - Laranja (#f57c00)
- `upload` - Azul (#1976d2)
- `refresh` - Cinza (#757575)

**Recursos:**
- ✅ Ícone colorido
- ✅ Tooltip automático
- ✅ Hover com scale (1.1x)
- ✅ Active com scale (0.95x)
- ✅ Background colorido no hover

---

### 5️⃣ SkeletonTable
**Loading states para tabelas**

```tsx
import { SkeletonTable, SkeletonCard, SkeletonStats } from '../components';

// Tabela
{loading ? <SkeletonTable rows={5} columns={6} /> : <Table>...</Table>}

// Card genérico
{loading ? <SkeletonCard /> : <Card>...</Card>}

// Card de estatísticas
{loading ? <SkeletonStats /> : <StatCard>...</StatCard>}
```

**Recursos:**
- ✅ Animação pulse
- ✅ Configurável (rows/columns)
- ✅ Múltiplos tamanhos
- ✅ Material-UI Skeleton

---

## 🎯 Padrões de Uso

### Estrutura de Página Padrão

```tsx
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
} from '../components';

export const MinhaPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Box>
      {/* 1. Header com breadcrumbs */}
      <PageHeader
        title="Meu Módulo"
        subtitle="Descrição do módulo"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Meu Módulo' },
        ]}
        action={
          <GradientButton startIcon={<AddIcon />} onClick={handleAdd}>
            Adicionar
          </GradientButton>
        }
      />

      {/* 2. Conteúdo em AnimatedCard */}
      <AnimatedCard>
        <CardContent>
          {loading ? (
            <SkeletonTable rows={5} columns={4} />
          ) : (
            <Table>
              {/* Tabela aqui */}
            </Table>
          )}
        </CardContent>
      </AnimatedCard>
    </Box>
  );
};
```

---

## ✨ Microanimações

### 1. Entrada de Página (PageHeader)
```css
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. Entrada de Card (AnimatedCard)
```css
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3. Entrada de Linha (TableRow)
```tsx
<TableRow
  sx={{
    animation: `fadeInRow 0.3s ease-out ${index * 0.05}s both`,
    '@keyframes fadeInRow': {
      from: {
        opacity: 0,
        transform: 'translateX(-10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
  }}
>
```

---

## 🎨 Exemplos de Implementação

### Exemplo 1: Página de Listagem

```tsx
<PageHeader
  title="Colaboradores"
  subtitle="Gerencie os colaboradores da empresa"
  breadcrumbs={[
    { label: 'Home', path: '/dashboard' },
    { label: 'Colaboradores' },
  ]}
  action={
    <GradientButton startIcon={<AddIcon />}>
      Novo Colaborador
    </GradientButton>
  }
/>

<AnimatedCard>
  <CardContent>
    <TextField placeholder="Buscar..." />
    <Table>
      {/* Linhas com ActionButton */}
      <ActionButton action="edit" onClick={handleEdit} />
      <ActionButton action="delete" onClick={handleDelete} />
    </Table>
  </CardContent>
</AnimatedCard>
```

### Exemplo 2: Página de Formulário

```tsx
<PageHeader
  title="Editar Usuário"
  breadcrumbs={[
    { label: 'Home', path: '/dashboard' },
    { label: 'Usuários', path: '/usuarios' },
    { label: 'Editar' },
  ]}
/>

<AnimatedCard delay={0.1}>
  <CardContent>
    <Grid container spacing={3}>
      {/* Campos do formulário */}
    </Grid>
    <Box mt={3} display="flex" gap={2}>
      <GradientButton
        gradient="primary"
        startIcon={<SaveIcon />}
        loading={saving}
      >
        Salvar
      </GradientButton>
      <GradientButton
        gradient="secondary"
        onClick={handleCancel}
      >
        Cancelar
      </GradientButton>
    </Box>
  </CardContent>
</AnimatedCard>
```

### Exemplo 3: Dashboard com Múltiplos Cards

```tsx
<PageHeader
  title="Dashboard"
  subtitle="Visão geral do sistema"
/>

<Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <AnimatedCard delay={0}>
      <CardContent>
        {loading ? <SkeletonStats /> : <StatCard />}
      </CardContent>
    </AnimatedCard>
  </Grid>
  <Grid item xs={12} md={4}>
    <AnimatedCard delay={0.1}>
      <CardContent>
        {loading ? <SkeletonStats /> : <StatCard />}
      </CardContent>
    </AnimatedCard>
  </Grid>
  <Grid item xs={12} md={4}>
    <AnimatedCard delay={0.2}>
      <CardContent>
        {loading ? <SkeletonStats /> : <StatCard />}
      </CardContent>
    </AnimatedCard>
  </Grid>
</Grid>
```

---

## 📦 Exports

Todos os componentes estão disponíveis em `src/components/index.ts`:

```tsx
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
  SkeletonCard,
  SkeletonStats,
} from '../components';
```

---

## ✅ Checklist de Atualização de Páginas

Para modernizar uma página existente:

- [ ] Adicionar `PageHeader` com breadcrumbs
- [ ] Trocar `Button` por `GradientButton`
- [ ] Envolver conteúdo em `AnimatedCard`
- [ ] Trocar `IconButton` por `ActionButton`
- [ ] Adicionar `SkeletonTable` para loading
- [ ] Adicionar animação nas linhas da tabela
- [ ] Padronizar espaçamentos e tipografia

---

## 🎯 Página Exemplo: Usuários

A página `src/pages/Usuarios.tsx` foi completamente atualizada como **modelo de referência**.

**Acesse:** `/usuarios` (apenas Admin e RH)

**Recursos implementados:**
- ✅ PageHeader com breadcrumbs
- ✅ GradientButton no topo
- ✅ AnimatedCard com hover
- ✅ ActionButton para editar/excluir
- ✅ SkeletonTable (quando loading=true)
- ✅ Animação fadeInRow nas linhas
- ✅ Campo de busca estilizado
- ✅ Rodapé com contadores

---

## 🚀 Próximos Passos

1. ✅ Atualizar demais páginas com os novos componentes
2. ✅ Criar modais padronizados
3. ✅ Adicionar snackbar/toast notifications
4. ✅ Criar formulários padronizados
5. ✅ Adicionar confirmação de ações críticas

---

**Desenvolvido com ❤️ para o Sistema FGS**

