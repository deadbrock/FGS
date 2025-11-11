# 📸 Sistema de Fotos de Usuários

## Visão Geral

O sistema FGS agora exibe a foto do usuário de forma destacada no sidebar, acima do card de informações do usuário.

## Características Visuais

### 🎨 Design da Foto do Usuário
- **Tamanho**: Avatar grande de 100x100 pixels
- **Posição**: Centralizado acima do card de informações
- **Efeito de Borda**: Borda animada com gradiente (roxo → rosa)
- **Animação**: Efeito de pulso suave na borda
- **Hover**: Aumenta 5% ao passar o mouse
- **Sombra**: Sombra dinâmica que intensifica no hover
- **Fallback**: Exibe inicial do nome quando não há foto

### 📱 Layout do Sidebar

```
┌─────────────────────┐
│                     │
│   [FOTO GRANDE]     │ ← Foto 100x100px com borda animada
│                     │
├─────────────────────┤
│   ┌─────────────┐   │
│   │   Card de   │   │ ← Card com informações
│   │  Informações│   │   - Nome do usuário
│   │             │   │   - Badge do cargo/role
│   │             │   │   - Cargo
│   └─────────────┘   │   - Departamento
│                     │
│   [Menu Items]      │
│                     │
└─────────────────────┘
```

## Como Adicionar Fotos

### Opção 1: URLs Externas (Atual)

Os usuários mock atualmente usam URLs do serviço `pravatar.cc`:

```typescript
{
  id: '1',
  nome: 'Administrador Sistema',
  email: 'admin@fgs.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  // ... outros campos
}
```

### Opção 2: Fotos Locais

Para usar fotos locais do projeto:

1. **Crie a pasta de avatares**:
   ```
   FGS/public/avatars/
   ```

2. **Adicione as imagens**:
   ```
   FGS/public/avatars/admin.jpg
   FGS/public/avatars/rh.jpg
   FGS/public/avatars/gestor.jpg
   ```

3. **Atualize o mock service** (`src/services/authService.mock.ts`):
   ```typescript
   {
     id: '1',
     nome: 'Administrador Sistema',
     email: 'admin@fgs.com',
     avatar: '/avatars/admin.jpg', // Caminho relativo ao public
     // ... outros campos
   }
   ```

### Opção 3: Integração com Backend

Quando integrar com um backend real:

```typescript
// API retorna:
{
  id: '1',
  nome: 'João Silva',
  avatar: 'https://api.fgs.com/avatars/joao-silva.jpg',
  // ... outros campos
}
```

## Formatos Suportados

- **JPG/JPEG**: Recomendado para fotos
- **PNG**: Recomendado para imagens com transparência
- **WEBP**: Formato moderno e otimizado
- **GIF**: Suportado (mas evite usar animações)

## Recomendações de Imagem

### Dimensões Ideais
- **Resolução mínima**: 150x150 pixels
- **Resolução recomendada**: 200x200 pixels
- **Proporção**: 1:1 (quadrada)

### Otimização
- **Tamanho de arquivo**: Máximo 200KB
- **Compressão**: Use ferramentas como TinyPNG
- **Qualidade**: 80-90% para JPG

### Enquadramento
- Centralizar o rosto
- Evitar cortes na cabeça
- Usar fundo neutro ou desfocado
- Boa iluminação

## Comportamento do Sistema

### Com Foto (`avatar` definido)
1. ✅ Exibe a imagem do usuário
2. ✅ Aplica borda animada
3. ✅ Mostra efeitos de hover
4. ✅ Fallback para inicial do nome se imagem falhar

### Sem Foto (`avatar` undefined)
1. ✅ Exibe avatar com inicial do nome
2. ✅ Usa gradiente roxo como fundo
3. ✅ Mantém todos os efeitos visuais
4. ✅ Mesmo tamanho e posicionamento

## Testando as Fotos

### 1. Login com Diferentes Usuários

```
Administrador: admin@fgs.com / admin123
Gerente RH: rh@fgs.com / rh123
Gestor: gestor@fgs.com / gestor123
Colaborador: colaborador@fgs.com / colab123
Segurança: seguranca@fgs.com / seguranca123
```

### 2. Verificar Visualização

- ✅ Foto aparece centralizada no topo do sidebar
- ✅ Borda animada com efeito de pulso
- ✅ Hover aumenta a foto suavemente
- ✅ Card abaixo mostra informações do usuário

### 3. Testar Fallback

Para testar o fallback (quando não há foto):

1. Remova temporariamente o campo `avatar` de um usuário
2. Faça login com esse usuário
3. Verifique se a inicial aparece no avatar

## Personalização Adicional

### Alterar Tamanho da Foto

Edite `src/layouts/DashboardLayout.tsx`:

```typescript
<Avatar
  src={user?.avatar}
  sx={{
    width: 120,  // ← Altere aqui (padrão: 100)
    height: 120, // ← Altere aqui (padrão: 100)
    // ...
  }}
>
```

### Alterar Cores da Borda

```typescript
'&::before': {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)', // ← Altere as cores
  // #6366f1 = Roxo
  // #8b5cf6 = Violeta
  // #ec4899 = Rosa
}
```

### Desabilitar Animação

```typescript
'&::before': {
  // ... outras propriedades
  // animation: 'pulse 2s ease-in-out infinite', // ← Comente esta linha
}
```

## Troubleshooting

### Foto não aparece
1. ✅ Verificar se o caminho da imagem está correto
2. ✅ Verificar se a imagem existe no servidor
3. ✅ Verificar CORS se usar URL externa
4. ✅ Verificar console do navegador para erros
5. ✅ Limpar cache do navegador (Ctrl + Shift + R)

### Foto distorcida
1. ✅ Usar imagens quadradas (1:1)
2. ✅ Verificar `objectFit: 'cover'` no CSS (padrão do Avatar)

### Foto muito grande/pequena
1. ✅ Ajustar `width` e `height` no componente Avatar
2. ✅ Manter proporção 1:1 (quadrada)

### Borda não anima
1. ✅ Verificar se o navegador suporta CSS animations
2. ✅ Verificar se não há conflitos de CSS

## Próximos Passos

### Upload de Foto
Quando implementar upload de fotos:

```typescript
// Endpoint para upload
POST /api/users/avatar
Content-Type: multipart/form-data

// Resposta
{
  avatarUrl: 'https://api.fgs.com/avatars/user-123.jpg'
}
```

### Redimensionamento Automático
- Implementar resize no backend
- Gerar thumbnails otimizados
- Armazenar em CDN para performance

### Cache e Performance
- Usar lazy loading para imagens
- Implementar cache de avatares
- Comprimir imagens automaticamente

## Suporte

Para mais informações sobre personalização visual, consulte:
- `src/layouts/DashboardLayout.tsx` - Layout do sidebar
- `src/services/authService.mock.ts` - Dados dos usuários mock
- `src/types/index.ts` - Interface User com campo avatar

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0

