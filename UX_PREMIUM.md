# 🎨 UX Premium - Sistema FGS

## ✨ Experiência do Usuário Aprimorada

---

## 📦 Pacotes Instalados

```bash
✅ framer-motion     - Animações suaves e profissionais
✅ notistack         - Sistema de notificações toast
```

---

## 🎯 Componentes de UX Implementados

### 1️⃣ **LoaderFGS** - Loader Animado com Logo

```tsx
import { LoaderFGS } from '../components';

// Full screen
<LoaderFGS message="Carregando..." fullScreen={true} />

// Inline
<LoaderFGS message="Salvando..." fullScreen={false} />
```

**Características:**
- ✅ Logo FGS pulsando no centro
- ✅ CircularProgress com gradiente
- ✅ 3 dots animados sincronizados
- ✅ Animação scale + opacity ao aparecer
- ✅ Background com gradiente suave
- ✅ Modo claro/escuro adaptável

**Animações:**
```tsx
Logo: scale [1, 1.05, 1] (2s repeat)
Dots: scale [1, 1.3, 1] + opacity (delay escalonado)
Container: scale 0.8 → 1 (0.5s ease-out)
```

---

### 2️⃣ **NotificationProvider** - Sistema de Toasts

```tsx
import { useNotification } from '../hooks/useNotification';

const { showSuccess, showError, showWarning, showInfo } = useNotification();

// Exemplos
showSuccess('✅ Usuário salvo com sucesso!');
showError('❌ Erro ao salvar usuário');
showWarning('⚠️ Atenção: Dados incompletos');
showInfo('ℹ️ Editando usuário...');
```

**Características:**
- ✅ 4 variantes (success, error, warning, info)
- ✅ Gradientes coloridos por tipo
- ✅ Ícones Material-UI
- ✅ Auto-hide em 4 segundos
- ✅ Botão de fechar
- ✅ Máximo 3 toasts simultâneos
- ✅ Posição: top-right
- ✅ Border-radius: 8px
- ✅ Box-shadow colorido

**Cores:**
```css
Success: linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)
Error:   linear-gradient(135deg, #d32f2f 0%, #f44336 100%)
Warning: linear-gradient(135deg, #f57c00 0%, #ff9800 100%)
Info:    linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)
```

---

### 3️⃣ **AnimatedModal** - Modais com Animação

```tsx
import { AnimatedModal } from '../components';

<AnimatedModal
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Título</DialogTitle>
  <DialogContent>
    {/* Conteúdo */}
  </DialogContent>
  <DialogActions>
    {/* Ações */}
  </DialogActions>
</AnimatedModal>
```

**Características:**
- ✅ Fade in/out suave (400ms)
- ✅ Scale 0.95 → 1 ao abrir
- ✅ TranslateY 20px → 0
- ✅ Border-radius: 16px
- ✅ Box-shadow: 0 24px 64px
- ✅ Overflow hidden
- ✅ Cubic-bezier easing

**Animação:**
```tsx
initial: { opacity: 0, scale: 0.95, y: 20 }
animate: { opacity: 1, scale: 1, y: 0 }
exit: { opacity: 0, scale: 0.95, y: 20 }
duration: 0.3s
easing: [0.4, 0, 0.2, 1]
```

---

### 4️⃣ **PageTransition** - Transição Entre Páginas

```tsx
// Já integrado no DashboardLayout!
<PageTransition>
  <Outlet />
</PageTransition>
```

**Características:**
- ✅ Fade in/out ao trocar de página
- ✅ TranslateY sutil (10px)
- ✅ AnimatePresence do Framer Motion
- ✅ Mode: wait (uma página sai antes da outra entrar)
- ✅ Duration: 0.3s
- ✅ Suavidade profissional

**Animação:**
```tsx
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -10 }
```

---

## 🎨 Estética Feminina-Profissional

### Paleta de Cores Suaves

**Gradientes Principais:**
```css
Rose:     #fff5f5 → #fde8e8 → #fbd5d5
Lavender: #f8f7ff → #ede9fe → #ddd6fe
Peach:    #fff7ed → #ffedd5 → #fed7aa
Mint:     #f0fdf4 → #dcfce7 → #bbf7d0
```

**Scrollbar Customizado:**
```css
Track:  linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%)
Thumb:  linear-gradient(180deg, #d4a5a5 0%, #b88888 100%)
Hover:  linear-gradient(180deg, #c99494 0%, #a77777 100%)
Border: 2px solid #f5f7fa
```

**Seleção de Texto:**
```css
Background: rgba(212, 165, 165, 0.3)
Color: #4a2c2a
```

**Focus:**
```css
Outline: 2px solid rgba(212, 165, 165, 0.6)
Offset: 2px
Border-radius: 4px
```

---

## ✨ Animações Globais

### Keyframes Disponíveis:

```css
@keyframes fadeIn
@keyframes fadeInUp
@keyframes fadeInDown
@keyframes slideInLeft
@keyframes slideInRight
@keyframes pulse
@keyframes shimmer
@keyframes cardShine
@keyframes dotPulse
```

### Classes Utilitárias:

```css
.fade-in          → fadeIn 0.5s
.fade-in-up       → fadeInUp 0.6s
.fade-in-down     → fadeInDown 0.6s
.slide-in-left    → slideInLeft 0.5s
.slide-in-right   → slideInRight 0.5s
.glass-effect     → glassmorphism
.card-hover       → hover suave
.shadow-soft      → sombra leve
.shadow-soft-lg   → sombra média
.skeleton         → loading shimmer
.card-shine       → brilho animado
```

---

## 🎯 Exemplo de Uso Completo

```tsx
import React, { useState } from 'react';
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  LoaderFGS,
  AnimatedModal,
} from '../components';
import { useNotification } from '../hooks/useNotification';

export const MinhaPagina: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotification();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setDialogOpen(false);
      showSuccess('✅ Salvo com sucesso!');
    }, 1500);
  };

  const handleDelete = () => {
    showError('❌ Erro ao excluir');
  };

  return (
    <Box>
      <PageHeader
        title="Minha Página"
        subtitle="Descrição"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Minha Página' },
        ]}
        action={
          <GradientButton
            onClick={() => {
              setDialogOpen(true);
              showInfo('ℹ️ Abrindo formulário...');
            }}
          >
            Adicionar
          </GradientButton>
        }
      />

      <AnimatedCard>
        <CardContent>
          {/* Conteúdo */}
          <ActionButton action="edit" onClick={() => showInfo('Editando...')} />
          <ActionButton action="delete" onClick={handleDelete} />
        </CardContent>
      </AnimatedCard>

      <AnimatedModal open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Formulário</DialogTitle>
        <DialogContent>
          {loading ? (
            <LoaderFGS message="Salvando..." fullScreen={false} />
          ) : (
            <Box>{/* Campos */}</Box>
          )}
        </DialogContent>
        <DialogActions>
          <GradientButton gradient="secondary" onClick={() => setDialogOpen(false)}>
            Cancelar
          </GradientButton>
          <GradientButton onClick={handleSave} loading={loading}>
            Salvar
          </GradientButton>
        </DialogActions>
      </AnimatedModal>
    </Box>
  );
};
```

---

## 📐 Tipografia Suave

```css
Headings: 'Poppins', sans-serif (weight: 600)
Body:     'Inter', sans-serif (line-height: 1.6)
Letter-spacing: -0.02em (headings)
```

---

## 🎭 Tooltips Melhorados

Todos os `ActionButton` já possuem tooltips:

```tsx
<ActionButton 
  action="edit" 
  onClick={handleEdit}
  tooltip="Editar usuário"  // Opcional - usa label padrão
/>
```

**Tooltips Padrões:**
- edit → "Editar"
- delete → "Excluir"
- view → "Visualizar"
- save → "Salvar"
- add → "Adicionar"
- download → "Download"
- upload → "Upload"
- refresh → "Atualizar"

---

## 🌈 Modo Escuro Adaptado

```css
Background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)
Scrollbar Thumb: linear-gradient(180deg, #9d7b7b 0%, #8a6868 100%)
Selection: rgba(157, 123, 123, 0.4)
```

---

## ✅ Feedback Visual Implementado

### Ao Salvar:
```tsx
showSuccess('✅ Salvo com sucesso!');
// + LoaderFGS durante o processo
// + AnimatedModal com animação suave
```

### Ao Editar:
```tsx
showInfo('ℹ️ Editando registro...');
// + Modal abre com fade + scale
// + Campos com foco suave
```

### Ao Excluir:
```tsx
showWarning('⚠️ Tem certeza?');
// Depois de confirmar:
showError('🗑️ Registro excluído');
// + ActionButton com hover vermelho
```

### Ao Carregar:
```tsx
<LoaderFGS 
  message="Carregando dados..."
  fullScreen={false}
/>
// + Logo pulsando
// + Dots animados
// + Texto fade in
```

---

## 📱 Responsividade

Todos os componentes são **totalmente responsivos**:
- LoaderFGS adapta tamanho
- Toasts posicionam-se corretamente
- Modais ajustam-se ao mobile
- Transições mantêm performance

---

## 🚀 Performance

- **Framer Motion**: Otimizado para 60fps
- **Notistack**: Gerenciamento eficiente de toasts
- **CSS Animations**: Hardware-accelerated
- **Lazy Loading**: Componentes sob demanda

---

## 📋 Checklist de UX

✅ Feedback visual em todas as ações  
✅ Loader animado com identidade FGS  
✅ Transições suaves entre páginas  
✅ Tooltips explicativos  
✅ Animações em modais  
✅ Estética feminina-profissional  
✅ Paleta de cores harmoniosa  
✅ Contraste suave  
✅ Scrollbar customizado  
✅ Seleção de texto personalizada  
✅ Focus acessível  
✅ Glassmorphism  
✅ Gradientes suaves  
✅ Sombras delicadas  
✅ Tipografia moderna  
✅ Modo claro/escuro  

---

## 🎊 Resultado Final

Um sistema com:
- ✨ UX profissional e moderna
- 💎 Animações suaves e naturais
- 🎨 Estética feminina elegante
- 📱 Responsividade perfeita
- ⚡ Performance otimizada
- 🌈 Feedback visual constante
- 💕 Experiência delicada e harmoniosa

---

**Desenvolvido com ❤️ e atenção aos detalhes para o Sistema FGS**

