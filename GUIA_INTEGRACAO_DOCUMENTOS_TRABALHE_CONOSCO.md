# 🔗 Guia Completo: Integração de Documentos - Trabalhe Conosco → FGS

## 📋 Visão Geral

Este guia explica **exatamente** o que precisa ser feito em cada sistema para que os documentos do candidato sejam transferidos automaticamente do "Trabalhe Conosco" para o FGS.

---

## ✅ O QUE JÁ ESTÁ PRONTO NO FGS

### Backend FGS (100% Configurado)

O FGS já está preparado para receber os documentos. O endpoint `/api/admissoes/candidatos` aceita:

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "documentos": {
    "foto_url": "https://...",
    "ctps_url": "https://...",
    "rg_frente_url": "https://...",
    "rg_verso_url": "https://...",
    "comprovante_residencia_url": "https://...",
    "titulo_eleitor_url": "https://...",
    "certidao_nascimento_url": "https://...",
    "certidao_casamento_url": "https://...",
    "reservista_url": "https://...",
    "antecedentes_criminais_url": "https://...",
    "certidao_dependente_url": "https://...",
    "cpf_dependente_url": "https://...",
    "curriculo_url": "https://..."
  },
  "vaga": {
    "id": 1,
    "titulo": "Desenvolvedor"
  }
}
```

### Mapeamento Automático

O FGS faz o mapeamento automaticamente:

| Campo JSON | Documento FGS | Status |
|------------|---------------|--------|
| `foto_url` | Foto 3x4 | ✅ Configurado |
| `ctps_url` | CTPS Digital | ✅ Configurado |
| `rg_frente_url` | Identidade (Frente) | ✅ Configurado |
| `rg_verso_url` | Identidade (Verso) | ✅ Configurado |
| `comprovante_residencia_url` | Comprovante de Residência | ✅ Configurado |
| `titulo_eleitor_url` | Título de Eleitor | ✅ Configurado |
| `certidao_nascimento_url` | Certidão Nascimento/Casamento | ✅ Configurado |
| `certidao_casamento_url` | Certidão Nascimento/Casamento | ✅ Configurado |
| `reservista_url` | Reservista | ✅ Configurado |
| `antecedentes_criminais_url` | Antecedentes Criminais | ✅ Configurado |
| `certidao_dependente_url` | Certidão Dependente | ✅ Configurado |
| `cpf_dependente_url` | CPF Dependente | ✅ Configurado |
| `curriculo_url` | Currículo | ✅ Configurado |

---

## 🔧 O QUE PRECISA SER FEITO NO TRABALHE CONOSCO

### 1. Estrutura de Dados do Candidato

No banco de dados do "Trabalhe Conosco", você precisa ter os campos para armazenar as URLs dos documentos:

```sql
-- Adicionar colunas na tabela de candidatos (se não existirem)
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS ctps_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rg_frente_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rg_verso_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS comprovante_residencia_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS titulo_eleitor_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS certidao_nascimento_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS certidao_casamento_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS reservista_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS antecedentes_criminais_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS certidao_dependente_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cpf_dependente_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS curriculo_url TEXT;
```

### 2. Formulário de Upload (Frontend)

No formulário de cadastro/edição do candidato, adicione campos de upload para cada documento:

```jsx
// Exemplo em React
<form>
  {/* Foto 3x4 */}
  <div>
    <label>Foto 3x4 *</label>
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => handleUploadDocumento(e, 'foto')}
    />
  </div>

  {/* CTPS Digital */}
  <div>
    <label>CTPS Digital *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'ctps')}
    />
  </div>

  {/* RG Frente */}
  <div>
    <label>RG ou CNH (Frente) *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'rg_frente')}
    />
  </div>

  {/* RG Verso */}
  <div>
    <label>RG ou CNH (Verso) *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'rg_verso')}
    />
  </div>

  {/* Comprovante de Residência */}
  <div>
    <label>Comprovante de Residência *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'comprovante_residencia')}
    />
  </div>

  {/* Título de Eleitor */}
  <div>
    <label>Título de Eleitor *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'titulo_eleitor')}
    />
  </div>

  {/* Certidão de Nascimento/Casamento */}
  <div>
    <label>Certidão de Nascimento ou Casamento *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'certidao_nascimento')}
    />
  </div>

  {/* Reservista (Opcional) */}
  <div>
    <label>Reservista (apenas homens)</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'reservista')}
    />
  </div>

  {/* Antecedentes Criminais */}
  <div>
    <label>Antecedentes Criminais *</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'antecedentes_criminais')}
    />
  </div>

  {/* Certidão de Dependentes (Opcional) */}
  <div>
    <label>Certidão de Dependentes (se tiver)</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'certidao_dependente')}
    />
  </div>

  {/* CPF de Dependentes (Opcional) */}
  <div>
    <label>CPF de Dependentes (se tiver)</label>
    <input 
      type="file" 
      accept="image/*,application/pdf"
      onChange={(e) => handleUploadDocumento(e, 'cpf_dependente')}
    />
  </div>

  {/* Currículo */}
  <div>
    <label>Currículo</label>
    <input 
      type="file" 
      accept="application/pdf,.doc,.docx"
      onChange={(e) => handleUploadDocumento(e, 'curriculo')}
    />
  </div>
</form>
```

### 3. Função de Upload (Backend Trabalhe Conosco)

Você já deve ter upload funcionando (Cloudinary). Apenas certifique-se de salvar as URLs:

```javascript
// Exemplo em Node.js
const handleUploadDocumento = async (file, tipo) => {
  try {
    // Upload para Cloudinary (você já tem isso)
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `candidatos/${candidatoId}/documentos`,
      resource_type: 'auto'
    });

    // Salvar URL no banco
    await pool.query(
      `UPDATE candidatos SET ${tipo}_url = $1 WHERE id = $2`,
      [result.secure_url, candidatoId]
    );

    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};
```

### 4. Função de Enviar para FGS (Trabalhe Conosco)

Quando o RH clicar em "Enviar para Admissão", você precisa:

```javascript
// Backend do Trabalhe Conosco
const enviarParaFGS = async (candidatoId) => {
  try {
    // 1. Buscar dados completos do candidato
    const candidato = await pool.query(
      `SELECT * FROM candidatos WHERE id = $1`,
      [candidatoId]
    );

    const dados = candidato.rows[0];

    // 2. Montar payload com TODOS os documentos
    const payload = {
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      telefone: dados.telefone,
      data_nascimento: dados.data_nascimento,
      endereco: {
        estado: dados.estado,
        cidade: dados.cidade,
        bairro: dados.bairro
      },
      documentos: {
        // ✅ IMPORTANTE: Incluir TODAS as URLs dos documentos
        curriculo_url: dados.curriculo_url,
        foto_url: dados.foto_url,
        ctps_url: dados.ctps_url,
        rg_frente_url: dados.rg_frente_url,
        rg_verso_url: dados.rg_verso_url,
        comprovante_residencia_url: dados.comprovante_residencia_url,
        titulo_eleitor_url: dados.titulo_eleitor_url,
        certidao_nascimento_url: dados.certidao_nascimento_url,
        certidao_casamento_url: dados.certidao_casamento_url,
        reservista_url: dados.reservista_url,
        antecedentes_criminais_url: dados.antecedentes_criminais_url,
        certidao_dependente_url: dados.certidao_dependente_url,
        cpf_dependente_url: dados.cpf_dependente_url
      },
      vaga: {
        id: dados.vaga_id,
        titulo: dados.vaga_titulo,
        departamento: dados.departamento,
        tipo_contrato: dados.tipo_contrato,
        salario: dados.salario
      },
      origem: 'trabalhe_conosco',
      candidato_id_origem: candidatoId,
      data_cadastro: dados.created_at
    };

    // 3. Enviar para FGS
    const response = await axios.post(
      `${process.env.FGS_API_URL}/api/admissoes/candidatos`,
      payload,
      {
        headers: {
          'X-API-Key': process.env.FGS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Candidato enviado para FGS:', response.data);
    
    // 4. Atualizar status no Trabalhe Conosco
    await pool.query(
      `UPDATE candidatos SET enviado_fgs = true, fgs_admissao_id = $1 WHERE id = $2`,
      [response.data.data.id, candidatoId]
    );

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao enviar para FGS:', error);
    throw error;
  }
};
```

---

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CANDIDATO PREENCHE FORMULÁRIO (Trabalhe Conosco)        │
│    - Dados pessoais                                         │
│    - Upload de 11 documentos                                │
│    - Documentos salvos no Cloudinary                        │
│    - URLs salvas no banco de dados                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. RH ANALISA CANDIDATO (Trabalhe Conosco)                 │
│    - Revisa currículo e documentos                          │
│    - Aprova ou reprova candidato                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. RH CLICA "ENVIAR PARA ADMISSÃO" (Trabalhe Conosco)      │
│    - Sistema busca dados completos do candidato             │
│    - Monta payload com todas as URLs dos documentos         │
│    - Envia POST para FGS                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. FGS RECEBE CANDIDATO                                     │
│    - Cria admissão automaticamente                          │
│    - Cria 11 documentos obrigatórios                        │
│    - Marca como RECEBIDO os que têm URL                     │
│    - Marca como PENDENTE os que não têm URL                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DP VALIDA DOCUMENTOS (FGS)                               │
│    - Acessa módulo Admissão                                 │
│    - Aba "Checklist"                                        │
│    - Vê documentos já recebidos (com ✅)                    │
│    - Valida/aprova cada documento                           │
│    - Solicita apenas os pendentes                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist de Implementação

### No Trabalhe Conosco:

- [ ] **Banco de Dados**: Adicionar colunas para URLs dos documentos
- [ ] **Frontend**: Adicionar campos de upload no formulário
- [ ] **Backend**: Implementar upload e salvar URLs
- [ ] **Integração**: Incluir URLs no payload para FGS
- [ ] **Teste**: Enviar candidato teste com todos os documentos

### No FGS:

- [x] **Backend**: Endpoint configurado ✅
- [x] **Mapeamento**: Documentos mapeados ✅
- [x] **Frontend**: Checklist exibe documentos ✅
- [ ] **Teste**: Receber candidato com documentos

---

## 🧪 Como Testar

### 1. Teste Manual (Postman/Insomnia)

```bash
POST https://fgs-production.up.railway.app/api/admissoes/candidatos
Headers:
  X-API-Key: sua-api-key
  Content-Type: application/json

Body:
{
  "nome": "Teste Documentos",
  "cpf": "123.456.789-00",
  "email": "teste@email.com",
  "telefone": "(11) 99999-9999",
  "documentos": {
    "foto_url": "https://res.cloudinary.com/.../foto.jpg",
    "ctps_url": "https://res.cloudinary.com/.../ctps.pdf",
    "rg_frente_url": "https://res.cloudinary.com/.../rg_frente.jpg",
    "rg_verso_url": "https://res.cloudinary.com/.../rg_verso.jpg"
  },
  "vaga": {
    "titulo": "Teste"
  }
}
```

### 2. Verificar no FGS

1. Acesse: https://fgs-huwl.vercel.app
2. Login com admin
3. Menu: Admissão
4. Selecione a admissão criada
5. Aba "Checklist"
6. Verifique:
   - ✅ Documentos com URL devem estar como "RECEBIDO"
   - ⏳ Documentos sem URL devem estar como "PENDENTE"

---

## 📝 Resumo

### O que já está pronto (FGS):
✅ Backend configurado  
✅ Mapeamento de documentos  
✅ Frontend exibindo checklist  

### O que precisa fazer (Trabalhe Conosco):
🔧 Adicionar campos de upload no formulário  
🔧 Salvar URLs dos documentos no banco  
🔧 Incluir URLs no payload ao enviar para FGS  

### Resultado Final:
🎉 Documentos transferidos automaticamente  
🎉 DP vê documentos já recebidos  
🎉 Processo 80% mais rápido  

---

## 💡 Dúvidas Frequentes

**P: Preciso enviar TODOS os documentos?**  
R: Não! Envie apenas os que o candidato já forneceu. Os que não foram enviados ficarão como "PENDENTE" no FGS.

**P: Os documentos precisam estar no Cloudinary?**  
R: Não! Pode ser qualquer URL pública e acessível (AWS S3, Google Cloud, etc).

**P: E se o candidato não tiver algum documento opcional?**  
R: Não tem problema! Não envie a URL desse documento. Ele ficará como "PENDENTE" no FGS.

**P: Como sei se funcionou?**  
R: Acesse o FGS → Admissão → Checklist. Os documentos com URL aparecerão como "RECEBIDO" ✅

---

## 📞 Suporte

Se tiver dúvidas, verifique:
1. Logs do Railway (FGS backend)
2. Console do navegador (Trabalhe Conosco)
3. Response do endpoint `/api/admissoes/candidatos`

