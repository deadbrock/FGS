# 📄 Integração Trabalhe Conosco - Documentos

## Documentos Suportados

O sistema FGS agora suporta o recebimento automático de documentos do sistema "Trabalhe Conosco".

### Lista de Documentos Admissionais

| # | Documento | Tipo no Sistema | Obrigatório | Campo JSON |
|---|-----------|----------------|-------------|------------|
| 1 | Foto 3x4 | `FOTO_3X4` | ✓ | `foto_url` |
| 2 | CTPS Digital | `CTPS_DIGITAL` | ✓ | `ctps_url` |
| 3 | Identidade (Frente) | `RG_FRENTE` | ✓ | `rg_frente_url` |
| 4 | Identidade (Verso) | `RG_VERSO` | ✓ | `rg_verso_url` |
| 5 | Comprovante de Residência | `COMPROVANTE_RESIDENCIA` | ✓ | `comprovante_residencia_url` |
| 6 | Certidão Nascimento/Casamento | `CERTIDAO_NASCIMENTO_CASAMENTO` | ✓ | `certidao_nascimento_url` ou `certidao_casamento_url` |
| 7 | Reservista | `RESERVISTA` | ○ | `reservista_url` |
| 8 | Título de Eleitor | `TITULO_ELEITOR` | ✓ | `titulo_eleitor_url` |
| 9 | Antecedentes Criminais | `ANTECEDENTES_CRIMINAIS` | ✓ | `antecedentes_criminais_url` |
| 10 | Certidão Dependente | `CERTIDAO_DEPENDENTE` | ○ | `certidao_dependente_url` |
| 11 | CPF Dependente | `CPF_DEPENDENTE` | ○ | `cpf_dependente_url` |
| 12 | Currículo | `CURRICULO` | ○ | `curriculo_url` |

## Exemplo de Request Completo

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  "endereco": {
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro"
  },
  "documentos": {
    "curriculo_url": "https://res.cloudinary.com/.../curriculo.pdf",
    "foto_url": "https://res.cloudinary.com/.../foto.jpg",
    "rg_frente_url": "https://res.cloudinary.com/.../rg_frente.jpg",
    "rg_verso_url": "https://res.cloudinary.com/.../rg_verso.jpg",
    "ctps_url": "https://res.cloudinary.com/.../ctps.pdf",
    "comprovante_residencia_url": "https://res.cloudinary.com/.../comprovante.pdf",
    "titulo_eleitor_url": "https://res.cloudinary.com/.../titulo.pdf",
    "certidao_nascimento_url": "https://res.cloudinary.com/.../certidao.pdf",
    "reservista_url": "https://res.cloudinary.com/.../reservista.pdf",
    "antecedentes_criminais_url": "https://res.cloudinary.com/.../antecedentes.pdf",
    "certidao_dependente_url": "https://res.cloudinary.com/.../certidao_dep.pdf",
    "cpf_dependente_url": "https://res.cloudinary.com/.../cpf_dep.pdf"
  },
  "vaga": {
    "id": 1,
    "titulo": "Desenvolvedor Full Stack",
    "departamento": "TI",
    "tipo_contrato": "CLT",
    "salario": 8000.00
  },
  "origem": "trabalhe_conosco",
  "candidato_id_origem": 42,
  "data_cadastro": "2025-01-15T10:30:00Z"
}
```

## Como Funciona

### 1. Recebimento do Candidato

Quando um candidato é enviado do "Trabalhe Conosco" para o FGS:

```
POST /api/admissoes/candidatos
```

### 2. Criação Automática de Documentos

O sistema:
1. Cria a admissão
2. Busca todos os templates de documentos obrigatórios
3. Para cada template:
   - Verifica se existe URL no campo correspondente
   - Se existir: marca como `RECEBIDO` e salva a URL
   - Se não existir: marca como `PENDENTE`

### 3. Status dos Documentos

- **PENDENTE**: Documento ainda não foi enviado
- **RECEBIDO**: Documento foi recebido do Trabalhe Conosco
- **APROVADO**: Documento foi validado pelo DP/RH
- **REPROVADO**: Documento foi rejeitado (precisa reenviar)

### 4. Visualização no Painel

No painel de admissões do FGS, os documentos aparecerão:
- ✅ Verde: Recebidos e aprovados
- 🟡 Amarelo: Recebidos, aguardando validação
- ⭕ Cinza: Pendentes (não enviados)
- ❌ Vermelho: Reprovados

## Benefícios

✅ **Automação Total**: Documentos enviados automaticamente do Trabalhe Conosco para o FGS

✅ **Rastreabilidade**: Cada documento tem histórico de recebimento e validação

✅ **Redução de Trabalho Manual**: DP não precisa solicitar documentos já enviados

✅ **Agilidade**: Processo de admissão mais rápido

## Campos Opcionais vs Obrigatórios

### Obrigatórios (✓)
- Foto 3x4
- CTPS Digital
- RG (Frente e Verso)
- Comprovante de Residência
- Certidão Nascimento/Casamento
- Título de Eleitor
- Antecedentes Criminais

### Opcionais (○)
- Reservista (apenas para homens)
- Certidão de Dependentes (apenas se tiver)
- CPF de Dependentes (apenas se tiver)
- Currículo (informativo)

## Próximos Passos

1. Atualizar sistema "Trabalhe Conosco" para enviar URLs dos documentos
2. Testar integração com documentos reais
3. Validar recebimento no painel FGS
4. Treinar equipe DP para validação de documentos

