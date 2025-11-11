# 📱 Sistema Responsivo FGS

O sistema FGS foi totalmente adaptado para funcionar perfeitamente em qualquer tamanho de monitor.

## 📏 Breakpoints

O sistema utiliza os seguintes breakpoints:

| Tamanho | Largura | Descrição |
|---------|---------|-----------|
| **Mobile** | < 768px | Smartphones |
| **Tablet** | 768px - 1023px | Tablets e telas pequenas |
| **Desktop** | 1024px - 1439px | Monitores padrão |
| **Large** | 1440px - 1919px | Monitores grandes |
| **XLarge** | >= 1920px | Monitores ultra-wide e 4K |

## 🎯 Recursos Implementados

### 1. Layout Responsivo

#### **Desktop (>= 1024px)**
- ✅ Drawer lateral permanente
- ✅ Drawer pode ser recolhido
- ✅ Foto do usuário grande (100px)
- ✅ Todos os detalhes visíveis
- ✅ Padding generoso (24-40px)

#### **Tablet (768px - 1023px)**
- ✅ Drawer temporário (overlay)
- ✅ Fecha automaticamente ao navegar
- ✅ Layout otimizado para tela média
- ✅ Padding médio (16-20px)

#### **Mobile (< 768px)**
- ✅ Drawer temporário (overlay)
- ✅ Versão simplificada do perfil do usuário
- ✅ Avatar menor (48px)
- ✅ Padding reduzido (12-16px)
- ✅ Touch targets de 44x44px mínimo
- ✅ Tabs com scroll horizontal

### 2. Componentes Adaptados

#### **StatCard**
- Ajusta tamanho de fonte automaticamente
- Ícones menores em mobile
- Layout em coluna em mobile
- Hover effects desabilitados em mobile

#### **Tabelas**
- Scroll horizontal em mobile
- Células com padding reduzido
- Font-size ajustado

#### **Formulários**
- Campos em coluna única no mobile
- Botões full-width em mobile
- Inputs maiores para melhor usabilidade touch

#### **Dialogs/Modals**
- Margem reduzida em mobile
- Ocupam quase toda a tela em mobile
- Fácil fechamento com gestos

### 3. Typography Responsiva

```css
/* Mobile */
h1: 1.75rem (28px)
h2: 1.5rem (24px)
h3: 1.25rem (20px)

/* Desktop */
h1: 2.25rem (36px)
h2: 1.875rem (30px)
h3: 1.5rem (24px)
```

### 4. Spacing Responsivo

```css
/* Mobile */
padding: 12px
margin: 8-12px

/* Tablet */
padding: 16px
margin: 12-16px

/* Desktop */
padding: 24px
margin: 16-24px

/* Large */
padding: 32px
margin: 24-32px

/* XLarge */
padding: 40px
margin: 32-40px
```

## 🛠️ Ferramentas Disponíveis

### Hook `useResponsive()`

```typescript
import { useResponsive } from '../hooks/useResponsive';

function MyComponent() {
  const { 
    isMobile,    // < 768px
    isTablet,    // 768px - 1023px
    isDesktop,   // 1024px - 1439px
    isLarge,     // 1440px - 1919px
    isXLarge,    // >= 1920px
    screenSize,  // 'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge'
    width,       // Largura atual em px
    height       // Altura atual em px
  } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### Componente `ResponsiveContainer`

```typescript
import { ResponsiveContainer } from '../components/ResponsiveContainer';

function MyPage() {
  return (
    <ResponsiveContainer>
      {/* Padding automático baseado no tamanho da tela */}
      <h1>Minha Página</h1>
    </ResponsiveContainer>
  );
}

// Com padding customizado
<ResponsiveContainer noPadding>
  <Content />
</ResponsiveContainer>

// Com maxWidth customizado
<ResponsiveContainer 
  customMaxWidth={{
    mobile: '100%',
    tablet: 720,
    desktop: 1200,
    large: 1400,
    xlarge: 1600,
  }}
>
  <Content />
</ResponsiveContainer>
```

### Classes CSS Utilitárias

```css
/* Mostrar/Esconder baseado no tamanho */
.hide-mobile     /* Esconde em mobile */
.hide-desktop    /* Esconde em desktop */
.show-mobile     /* Mostra apenas em mobile */
.show-tablet     /* Mostra apenas em tablet */
.show-desktop    /* Mostra apenas em desktop */

/* Uso em MUI */
sx={{ display: { xs: 'none', md: 'block' } }}  /* Esconde em mobile */
sx={{ display: { xs: 'block', md: 'none' } }}  /* Mostra apenas em mobile */
```

## 📐 Sistema de Grid MUI

O Material-UI usa um sistema de 12 colunas responsivo:

```typescript
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* 
      xs={12}: 100% em mobile
      sm={6}:  50% em tablet
      md={4}:  33% em desktop
      lg={3}:  25% em monitores grandes
    */}
  </Grid>
</Grid>
```

## 🎨 Exemplos de Uso

### Exemplo 1: Card Responsivo

```typescript
<Card
  sx={{
    p: { xs: 2, sm: 2.5, md: 3 },
    mb: { xs: 2, md: 3 },
  }}
>
  <Typography 
    variant="h4"
    sx={{
      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
    }}
  >
    Título
  </Typography>
</Card>
```

### Exemplo 2: Botões Responsivos

```typescript
<Button
  fullWidth={isMobile}
  size={isMobile ? 'medium' : 'large'}
  sx={{
    minHeight: { xs: 44, md: 48 }, // Touch target
  }}
>
  Salvar
</Button>
```

### Exemplo 3: Table Responsiva

```typescript
<TableContainer
  sx={{
    overflowX: { xs: 'auto', md: 'visible' },
  }}
>
  <Table
    sx={{
      minWidth: { xs: 600, md: 'auto' },
    }}
  >
    {/* ... */}
  </Table>
</TableContainer>
```

## ✅ Checklist de Responsividade

Ao criar novos componentes, verifique:

- [ ] Funciona bem em mobile (< 768px)?
- [ ] Funciona bem em tablet (768px - 1023px)?
- [ ] Funciona bem em desktop (>= 1024px)?
- [ ] Touch targets têm pelo menos 44x44px?
- [ ] Textos são legíveis em todas as telas?
- [ ] Imagens se adaptam ao tamanho?
- [ ] Tabelas têm scroll horizontal se necessário?
- [ ] Formulários são fáceis de usar no mobile?
- [ ] Modais não cortam conteúdo importante?
- [ ] Performance é boa em dispositivos móveis?

## 🚀 Boas Práticas

### 1. Mobile First
Sempre comece o design/código pensando em mobile, depois adapte para desktop.

### 2. Touch Targets
Elementos clicáveis devem ter no mínimo 44x44px em mobile.

### 3. Readable Font Sizes
Fonte mínima de 16px em mobile para evitar zoom automático.

### 4. Safe Areas
Considere notches e bordas arredondadas em smartphones modernos.

### 5. Performance
- Use lazy loading para imagens
- Minimize reflows ao redimensionar
- Use `will-change` com cuidado
- Throttle eventos de resize

### 6. Testing
Teste em:
- ✅ Chrome DevTools (vários dispositivos)
- ✅ Firefox Responsive Design Mode
- ✅ Dispositivos reais quando possível

## 📱 Testando Responsividade

### No Chrome DevTools:
1. Pressione `F12` ou `Ctrl+Shift+I`
2. Clique no ícone de dispositivo móvel (ou `Ctrl+Shift+M`)
3. Selecione diferentes dispositivos no dropdown
4. Ou arraste para redimensionar manualmente

### Dispositivos Comuns:
- **iPhone SE**: 375x667px
- **iPhone 12/13/14**: 390x844px
- **iPhone 14 Pro Max**: 430x932px
- **iPad**: 768x1024px
- **iPad Pro**: 1024x1366px
- **Desktop HD**: 1920x1080px
- **Desktop 4K**: 3840x2160px

## 🔧 Arquivos Importantes

- `src/styles/responsive.css` - Estilos globais responsivos
- `src/hooks/useResponsive.ts` - Hook de detecção de tela
- `src/components/ResponsiveContainer.tsx` - Container adaptável
- `src/layouts/DashboardLayout.tsx` - Layout principal responsivo

## 💡 Dicas

1. **Use MUI Breakpoints**: `theme.breakpoints.down('sm')`, `theme.breakpoints.up('md')`
2. **sx prop é seu amigo**: Valores responsivos inline
3. **Grid é poderoso**: Use para layouts complexos
4. **Stack para simplicidade**: Layouts em coluna/linha
5. **useMediaQuery**: Para lógica condicional baseada em tela

## 📞 Suporte

Se encontrar problemas de responsividade:
1. Verifique o console para erros
2. Teste em diferentes tamanhos de tela
3. Verifique se está usando os breakpoints corretos
4. Consulte a documentação do Material-UI

---

**Sistema 100% Responsivo! ✨**

