# 🔌 CONEXÃO FRONTEND ↔ BACKEND

Este documento resume a conexão completa entre frontend e backend do sistema FGS.

---

## ✅ SERVICES CONECTADOS (7 módulos)

### 1. 👤 **USUÁRIOS + AUTH**
- **Service:** `usuariosService.ts` + `authService.ts`
- **Backend:** `/api/usuarios` + `/api/auth`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - Login com JWT
  - CRUD de usuários
  - Verificação de email disponível

---

### 2. 👥 **COLABORADORES**
- **Service:** `colaboradoresService.ts` (novo)
- **Backend:** `/api/colaboradores`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - CRUD completo
  - Filtros avançados (status, departamento, cargo, estado, gênero)
  - Paginação e ordenação
  - Estatísticas

---

### 3. 🗺️ **REGIONAIS**
- **Service:** `regionaisService.ts` (novo)
- **Backend:** `/api/regionais`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - Estatísticas por estado
  - Lista de colaboradores regionais
  - Filtro por administrativos
  - Distribuição por gênero

---

### 4. ⏰ **PONTO ELETRÔNICO**
- **Service:** `pontoService.ts`
- **Backend:** `/api/ponto`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - Configurações de jornada
  - Registro de ponto
  - Aprovação/rejeição
  - Espelho mensal
  - Estatísticas

---

### 5. 📄 **DOCUMENTOS**
- **Service:** `documentosService.ts` (novo)
- **Backend:** `/api/documentos`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - Upload de arquivos (PDF, DOC, XLS, IMG)
  - Download seguro
  - Controle de validade
  - Alertas de vencimento
  - Estatísticas

---

### 6. 🎁 **BENEFÍCIOS**
- **Service:** `beneficiosService.ts`
- **Backend:** `/api/beneficios`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - CRUD de tipos de benefícios
  - Vinculação a colaboradores
  - Controle de valores e status
  - Estatísticas (custo total mensal)

---

### 7. 📚 **TREINAMENTOS**
- **Service:** `treinamentosService.ts`
- **Backend:** `/api/treinamentos`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - CRUD de cursos
  - Gestão de turmas
  - Vinculação a colaboradores
  - Controle de NRs (validade)
  - Estatísticas (vencidos, vencendo)

---

### 8. 📊 **RELATÓRIOS**
- **Service:** `relatoriosService.ts`
- **Backend:** `/api/relatorios`
- **Status:** ✅ **CONECTADO**
- **Funcionalidades:**
  - Dashboard geral (KPIs)
  - Relatório de colaboradores (CSV)
  - Relatório de benefícios
  - Relatório de treinamentos
  - Aniversariantes
  - Férias

---

## ⏳ MÓDULOS PENDENTES

### 9. 📢 **COMUNICAÇÃO**
- **Service:** `comunicacaoService.mock.ts` (ainda em mock)
- **Backend:** ❌ Não implementado
- **Motivo:** Módulo secundário, pode ser implementado na Fase 2

---

## 🗑️ ARQUIVOS MOCK DELETADOS

- ❌ `regionaisService.mock.ts` (983 linhas)
- ❌ `beneficiosService.mock.ts` (456 linhas)
- ❌ `prontuarioService.mock.ts` (892 linhas)
- ❌ `treinamentosService.mock.ts` (734 linhas)
- ❌ `relatoriosService.mock.ts` (512 linhas)
- ❌ `pontoService.mock.ts` (678 linhas)
- ❌ `authService.mock.ts` (124 linhas)

**Total:** ~4.400 linhas de código mock removidas

---

## 📦 SERVICES CRIADOS/ATUALIZADOS

### Novos Services (4):
1. `colaboradoresService.ts` (175 linhas)
2. `regionaisService.ts` (95 linhas)
3. `documentosService.ts` (175 linhas)
4. `pontoService.ts` (195 linhas)

### Services Atualizados (3):
1. `beneficiosService.ts` (180 linhas)
2. `treinamentosService.ts` (235 linhas)
3. `relatoriosService.ts` (145 linhas)

**Total:** ~1.200 linhas de código real (conectado ao backend)

---

## 🔧 CONFIGURAÇÃO

### Variável de Ambiente

Todos os services usam a mesma variável de ambiente:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
```

### Desenvolvimento Local:
```env
# .env.local
VITE_API_URL=http://localhost:3333
```

### Produção (Vercel):
```env
# Variável de ambiente no Vercel
VITE_API_URL=https://seu-backend.railway.app
```

---

## 📡 ESTRUTURA DOS SERVICES

Todos os services seguem o mesmo padrão:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

class MeuService {
  private api = axios.create({
    baseURL: `${API_URL}/api/meu-modulo`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getAll(filtros?: any): Promise<any[]> {
    try {
      const response = await this.api.get('/', { params: filtros });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro:', error);
      throw new Error(error.response?.data?.error || 'Erro genérico');
    }
  }

  // ... outros métodos CRUD
}

export default new MeuService();
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ ~~Criar todos os backends~~ (COMPLETO)
2. ✅ ~~Conectar services ao backend~~ (COMPLETO)
3. ✅ ~~Remover arquivos mock~~ (COMPLETO)
4. ⏳ **Testar cada módulo** (PRÓXIMO)
5. ⏳ Atualizar páginas que usam os services
6. ⏳ Configurar variáveis de ambiente no Vercel
7. ⏳ Deploy e teste em produção

---

## 📝 OBSERVAÇÕES

- **Axios** é usado em todos os services (não `fetch`)
- **Todos os services** têm tratamento de erro consistente
- **Interfaces TypeScript** estão definidas em cada service
- **Upload de arquivos** usa `FormData` (multipart/form-data)
- **Downloads** usam `responseType: 'blob'`
- **Paginação** é suportada onde aplicável

---

**Status Geral:** 🎉 **FRONTEND 88% CONECTADO AO BACKEND**

- ✅ 7 de 8 módulos conectados
- ✅ 61 rotas REST disponíveis
- ✅ ~4.400 linhas de mock removidas
- ✅ ~1.200 linhas de código real

---

**Última atualização:** 13/11/2024 - 13h30

