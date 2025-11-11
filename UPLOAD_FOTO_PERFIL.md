# 📸 Upload de Foto de Perfil

## Funcionalidade Implementada

O sistema agora permite que os usuários façam upload e alterem suas fotos de perfil através da página de Configurações.

## Como Usar

### 1. Acessar Configurações
- Clique no menu **"Configurações"** no sidebar
- Ou acesse diretamente `/configuracoes`

### 2. Alterar Foto do Perfil

**Opção 1: Botão de Câmera**
- Clique no ícone de câmera 📷 no canto inferior direito do avatar

**Opção 2: Botão "Alterar Foto"**
- Clique no botão "Alterar Foto" abaixo do avatar

### 3. Selecionar Imagem
- Escolha uma imagem do seu computador
- Formatos aceitos: **JPG, JPEG, PNG, GIF, WEBP**
- Tamanho máximo: **5MB**

### 4. Confirmação
- A foto será exibida imediatamente como preview
- Uma mensagem de sucesso será exibida
- A página será recarregada automaticamente
- A nova foto aparecerá no **sidebar** e em todas as páginas

## Características

### ✅ Validações Automáticas

1. **Tipo de Arquivo**
   - Apenas imagens são aceitas
   - Mensagem de erro se selecionar outro tipo

2. **Tamanho do Arquivo**
   - Máximo de 5MB
   - Mensagem de erro se exceder o limite

3. **Preview Instantâneo**
   - Visualize a foto antes de confirmar
   - Aparece imediatamente após selecionar

### 🎨 Interface Moderna

- **Avatar com Gradiente**: Design moderno com gradiente roxo
- **Botão de Câmera Flutuante**: Ícone de câmera no canto do avatar
- **Sombra e Bordas**: Visual profissional e elegante
- **Responsivo**: Funciona em desktop e mobile

### 💾 Armazenamento

Atualmente, a foto é armazenada:
1. **localStorage**: `@FGS:userAvatar` (base64)
2. **Objeto do usuário**: Atualizado no `@FGS:user`

## Fluxo de Funcionamento

```
1. Usuário clica em "Alterar Foto"
   ↓
2. Sistema abre diálogo de seleção de arquivo
   ↓
3. Usuário seleciona imagem
   ↓
4. Sistema valida tipo e tamanho
   ↓
5. Imagem é convertida para base64
   ↓
6. Preview é exibido no avatar
   ↓
7. Foto é salva no localStorage
   ↓
8. Mensagem de sucesso é exibida
   ↓
9. Página recarrega (para atualizar sidebar)
   ↓
10. Nova foto aparece em todo o sistema
```

## Código Principal

### Handler de Upload

```typescript
const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validações
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    // Converter para base64 e salvar
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      localStorage.setItem('@FGS:userAvatar', reader.result as string);
      
      // Atualizar objeto do usuário
      const storedUser = localStorage.getItem('@FGS:user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.avatar = reader.result as string;
        localStorage.setItem('@FGS:user', JSON.stringify(userObj));
      }
      
      // Recarregar página
      window.location.reload();
    };
    reader.readAsDataURL(file);
  }
};
```

### Componente Avatar

```tsx
<Box sx={{ position: 'relative' }}>
  <Avatar
    src={avatarPreview || undefined}
    sx={{
      width: 120,
      height: 120,
      bgcolor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      fontSize: '3rem',
      fontWeight: 700,
      border: '4px solid',
      borderColor: 'background.paper',
      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
    }}
  >
    {!avatarPreview && (user?.nome?.charAt(0).toUpperCase() || 'U')}
  </Avatar>
  
  <IconButton
    sx={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      bgcolor: 'primary.main',
      color: 'white',
    }}
    onClick={handleAvatarClick}
  >
    <PhotoCameraIcon fontSize="small" />
  </IconButton>
</Box>

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  style={{ display: 'none' }}
  onChange={handleAvatarChange}
/>
```

## Integração com Backend (Futuro)

Quando integrar com um backend real, você precisará:

### 1. Criar Endpoint de Upload

```typescript
// POST /api/users/avatar
const formData = new FormData();
formData.append('avatar', file);

const response = await fetch('/api/users/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const { avatarUrl } = await response.json();
```

### 2. Atualizar AuthContext

```typescript
// No AuthContext, adicionar método updateAvatar
const updateAvatar = async (avatarUrl: string) => {
  setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
  localStorage.setItem('@FGS:user', JSON.stringify({ ...user, avatar: avatarUrl }));
};
```

### 3. Processar Imagem no Backend

```typescript
// Backend (Node.js exemplo)
const multer = require('multer');
const sharp = require('sharp');

// Redimensionar e otimizar
await sharp(file.path)
  .resize(300, 300)
  .jpeg({ quality: 90 })
  .toFile(outputPath);
```

## Melhorias Futuras

### 📋 Funcionalidades Planejadas

1. **Crop/Redimensionamento**
   - Permitir recortar imagem antes de salvar
   - Ajustar zoom e posição

2. **Filtros e Edição**
   - Aplicar filtros básicos
   - Ajustar brilho e contraste

3. **Webcam**
   - Tirar foto diretamente pela webcam
   - Útil para cadastros rápidos

4. **Histórico de Fotos**
   - Manter histórico de fotos antigas
   - Permitir reverter para foto anterior

5. **Compressão Automática**
   - Reduzir tamanho automaticamente
   - Otimizar para web

6. **Validação Avançada**
   - Detectar rostos na imagem
   - Sugerir melhor enquadramento

## Troubleshooting

### Foto não aparece após upload
1. ✅ Verificar se o navegador suporta `FileReader`
2. ✅ Limpar cache do navegador (Ctrl + Shift + R)
3. ✅ Verificar console para erros JavaScript
4. ✅ Confirmar que localStorage está habilitado

### Erro ao selecionar arquivo
1. ✅ Verificar se o arquivo é realmente uma imagem
2. ✅ Confirmar tamanho do arquivo (máx. 5MB)
3. ✅ Tentar formato diferente (JPG em vez de PNG)

### Foto muito grande/pequena
1. ✅ Redimensionar antes de fazer upload
2. ✅ Usar ferramentas online de compressão
3. ✅ Ajustar no editor de imagens

### Foto não atualiza no sidebar
1. ✅ Aguardar o reload automático da página
2. ✅ Fazer logout e login novamente
3. ✅ Limpar localStorage e refazer login

## Recomendações de Imagem

### 📐 Dimensões Ideais
- **Resolução mínima**: 200x200 pixels
- **Resolução recomendada**: 400x400 pixels
- **Proporção**: 1:1 (quadrada)

### 📊 Qualidade
- **Formato**: JPG para fotos, PNG para ilustrações
- **Qualidade JPG**: 80-90%
- **Tamanho**: 100KB - 500KB ideal

### 🎨 Conteúdo
- ✅ Rosto centralizado
- ✅ Boa iluminação
- ✅ Fundo neutro ou desfocado
- ✅ Foto profissional
- ❌ Evitar fotos muito escuras
- ❌ Evitar múltiplas pessoas
- ❌ Evitar imagens pixeladas

## Segurança

### 🔒 Considerações

1. **Validação Client-Side**
   - Verificação de tipo e tamanho
   - Previne uploads desnecessários

2. **Validação Server-Side** (quando implementar)
   - Verificar novamente tipo e tamanho
   - Escanear por malware
   - Validar dimensões reais da imagem

3. **Armazenamento Seguro**
   - Não armazenar imagens com nomes originais
   - Usar UUIDs para nomes de arquivo
   - Separar por pastas de usuários

## Suporte

Para mais informações:
- `src/pages/Configuracoes.tsx` - Implementação principal
- `src/layouts/DashboardLayout.tsx` - Exibição no sidebar
- `src/services/authService.mock.ts` - Dados dos usuários

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0

