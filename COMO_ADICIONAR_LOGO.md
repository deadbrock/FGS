# 🎨 Como Adicionar a Logo FGS

## 📍 Localização do Arquivo

Para adicionar a logo do sistema, você precisa colocar o arquivo `logo-fgs.png` na pasta `public`:

```
FGS/
└── public/
    └── logo-fgs.png  ← Coloque seu arquivo aqui
```

## 📐 Especificações da Imagem

### Recomendações de Tamanho:
- **Altura recomendada**: 80-120px
- **Largura**: Proporcional (o sistema ajusta automaticamente)
- **Formato**: PNG com fundo transparente (recomendado)
- **Resolução**: @2x para telas retina (alta resolução)

### Tamanhos Exibidos no Sistema:
- **Small** (AppBar): 40px de altura
- **Medium** (Login): 56px de altura
- **Large** (Tela inicial): 80px de altura

## ✅ Como Funciona

O componente `Logo` foi atualizado para:

1. **Usar a imagem automaticamente** quando `logo-fgs.png` estiver na pasta `public`
2. **Fallback inteligente**: Se a imagem não for encontrada, exibe o texto "FGS" estilizado
3. **Responsivo**: Ajusta o tamanho automaticamente conforme o contexto
4. **Animações**: Hover suave com escala e brilho

## 🎯 Onde a Logo Aparece

A logo será exibida em:
- ✅ **AppBar** (menu superior) - tamanho small, apenas imagem
- ✅ **Sidebar** (menu lateral) - tamanho pequeno com texto opcional
- ✅ **Tela de Login** - tamanho large com texto completo
- ✅ **Outras áreas** conforme necessário

## 🔧 Configuração do Componente

O componente `Logo.tsx` aceita as seguintes props:

```typescript
<Logo 
  size="small"      // 'small' | 'medium' | 'large'
  showText={false}  // true | false
  variant="image"   // 'image' | 'default'
/>
```

### Exemplos de Uso:

**No AppBar (menu superior):**
```typescript
<Logo size="small" showText={false} variant="image" />
```

**Na tela de Login:**
```typescript
<Logo size="large" showText={true} variant="image" />
```

**Versão texto (sem imagem):**
```typescript
<Logo size="medium" showText={true} variant="default" />
```

## 📝 Após Adicionar a Logo

1. Coloque o arquivo `logo-fgs.png` na pasta `FGS/public/`
2. O sistema detectará automaticamente a imagem
3. Não é necessário reiniciar ou recompilar
4. Se estiver em desenvolvimento, apenas recarregue a página (F5)

## 🎨 Dicas de Design

Para melhor resultado visual:

- Use PNG com **fundo transparente**
- Mantenha proporções **horizontais** (logo mais larga que alta)
- Evite textos muito pequenos na logo
- Teste em **modo claro e escuro** para garantir boa visibilidade
- Exporte em **alta resolução** (@2x ou @3x)

## ⚠️ Troubleshooting

**A logo não aparece?**
- Verifique se o arquivo está em `FGS/public/logo-fgs.png`
- Confirme que o nome está correto (minúsculas, com hífen)
- Limpe o cache do navegador (Ctrl+F5)
- Verifique o console do navegador para erros

**A logo está cortada?**
- Ajuste as dimensões da imagem original
- Verifique se a proporção está adequada
- Teste com diferentes tamanhos

## 🚀 Resultado Final

Após adicionar a logo, o sistema terá uma identidade visual profissional e consistente em todas as telas!

---

**Desenvolvido por**: Sistema FGS  
**Última atualização**: 2025

