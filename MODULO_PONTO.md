# Módulo de Ponto e Frequência - FGS

## Visão Geral

O módulo de **Ponto e Frequência** permite o controle completo de horários, presença e pontualidade dos colaboradores. Está preparado para integração futura com sistema de reconhecimento facial.

---

## Funcionalidades Principais

### 1️⃣ Dashboard Inteligente
- **Situação do Dia**: Presentes, atrasados, ausentes e % de presença
- **Gráficos Visuais**: Presença dos últimos 7 dias com código de cores
- **Estatísticas Mensais**: Total de registros, média de horas, horas extras e atrasos
- **Alertas Automáticos**: Notificações de irregularidades

### 2️⃣ Visualização de Horários
- **Comparação Previsto x Realizado**: Visual claro com ícones de status
- **Detalhamento Completo**:
  - Entrada e saída
  - Intervalo (início e fim)
  - Horas trabalhadas
  - Horas extras
  - Atrasos contabilizados
- **Status Automático**: Presente, Atrasado, Falta, Férias, etc.

### 3️⃣ Regra dos 15 Minutos ⏰
```typescript
// IMPORTANTE: Atrasos < 15 minutos NÃO são contabilizados
calcularAtraso(horarioPrevisto: '08:00', horarioRealizado: '08:10')
// Retorna: 0 (não conta como atraso)

calcularAtraso(horarioPrevisto: '08:00', horarioRealizado: '08:20')
// Retorna: 20 (conta como atraso de 20 minutos)
```

### 4️⃣ Ranking de Pontualidade 🏆
- **Sistema de Pontuação** (0-100 pontos):
  - Base: 100 pontos
  - Desconto: -5 pontos por atraso
  - Desconto: -10 pontos por falta
- **Top 10 Colaboradores**
- **Medalhas**: 🥇 1º, 🥈 2º, 🥉 3º
- **Indicadores Visuais**: Barra de progresso e percentual

### 5️⃣ Relatórios Detalhados
- **Relatório de Atrasos**:
  - Total de atrasos
  - Média de atraso em minutos
  - Minutos acumulados por colaborador
  - Percentual de pontualidade
- **Relatório de Faltas**:
  - Faltas justificadas vs injustificadas
  - Datas das faltas
  - Percentual de presença
- **Exportação**: CSV para análise externa

### 6️⃣ Integração com Sistema Facial (Preparada)
```typescript
interface ConfiguracaoFacial {
  ativo: boolean;
  urlWebhook: string;
  tokenApi: string;
  toleranciaReconhecimento: number; // 0-100
  exigirMascara: boolean;
  salvarFotos: boolean;
  tempoMinimoBatidas: number; // Minutos entre batidas
}
```

---

## Estrutura de Arquivos

```
src/
├── types/
│   └── ponto.ts                    # Tipos TypeScript
├── utils/
│   └── pontoUtils.ts               # Funções auxiliares e cálculos
├── components/
│   └── ponto/
│       ├── VisualizacaoHorarios.tsx  # Comparação previsto x realizado
│       ├── GraficoPresenca.tsx       # Gráfico de barras de presença
│       └── RankingCard.tsx           # Card com ranking de pontualidade
├── services/
│   ├── pontoService.ts             # Serviço API (modo mock)
│   └── pontoService.mock.ts        # Dados mock
└── pages/
    └── Ponto.tsx                   # Página principal com abas
```

---

## Tipos de Dados

### Status do Dia
```typescript
enum StatusDia {
  PRESENTE = 'PRESENTE',
  FALTA = 'FALTA',
  ATRASADO = 'ATRASADO',
  FALTA_JUSTIFICADA = 'FALTA_JUSTIFICADA',
  FERIAS = 'FERIAS',
  FOLGA = 'FOLGA',
  FINAL_DE_SEMANA = 'FINAL_DE_SEMANA',
}
```

### Métodos de Registro
```typescript
enum MetodoRegistro {
  FACIAL = 'FACIAL',      // Reconhecimento facial
  DIGITAL = 'DIGITAL',    // Biometria digital
  CARTAO = 'CARTAO',      // Cartão RFID
  MANUAL = 'MANUAL',      // Registro manual pelo RH
  APP = 'APP',            // App móvel
}
```

### Resumo do Dia
```typescript
interface ResumoDia {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  data: string;
  
  // Comparação
  horarioPrevisto: {
    entrada: string;
    saida: string;
  };
  horarioRealizado: {
    entrada?: string;
    saida?: string;
  };
  
  // Cálculos
  horasTrabalhadas: number;  // Em minutos
  horasExtras: number;       // Em minutos
  atrasoMinutos: number;     // 0 se < 15 min
  
  // Status
  status: StatusDia;
  temJustificativa: boolean;
}
```

---

## Funções Utilitárias

### Cálculo de Atraso
```typescript
calcularAtraso(horarioPrevisto: string, horarioRealizado: string): number
// Retorna 0 se atraso < 15 minutos (tolerância)
```

### Cálculo de Horas Trabalhadas
```typescript
calcularHorasTrabalhadas(
  entrada: string,
  saida: string,
  intervaloInicio?: string,
  intervaloFim?: string
): number // Retorna total em minutos, descontando intervalo
```

### Formatação
```typescript
formatarMinutosParaHoras(minutos: number): string
// Exemplo: 485 -> "08:05"

formatarHorario(horario: string | undefined): string
// Exemplo: undefined -> "--:--"
```

### Pontuação de Ranking
```typescript
calcularPontuacaoRanking(
  diasTrabalhados: number,
  atrasos: number,
  faltas: number
): number // 0-100 pontos
```

---

## Páginas e Navegação

### Página Principal: `/ponto`
Organizada em **4 abas**:

#### 📊 Aba 1: Dashboard
- Cards com estatísticas do dia
- Gráfico de presença dos últimos 7 dias
- Resumo mensal
- Alerta sobre regra dos 15 minutos

#### 📝 Aba 2: Registros
- Lista de resumos diários
- Filtros por período
- Visualização detalhada previsto x realizado
- Status de cada dia

#### 🏆 Aba 3: Ranking
- Top 10 colaboradores mais pontuais
- Sistema de medalhas
- Pontuação e percentuais
- Filtros por período

#### 📈 Aba 4: Relatórios
- Relatório de atrasos detalhado
- Tabela com todos os colaboradores
- Estatísticas gerais
- Exportação para CSV

---

## Permissões de Acesso

**Quem pode acessar:**
- ✅ Administrador (acesso total)
- ✅ RH (acesso total)
- ✅ Gestor (visualização e relatórios)

**Colaboradores comuns** não têm acesso ao módulo completo, mas podem:
- Ver seus próprios registros
- Solicitar justificativas

---

## Integração com Menu

O módulo foi adicionado ao menu lateral com:
- **Ícone**: ⏰ AccessTime
- **Título**: "Ponto e Frequência"
- **Posição**: Entre "Treinamentos" e "Configurações"
- **Rota**: `/ponto`

---

## Exemplos de Uso

### 1. Carregar Estatísticas
```typescript
const estatisticas = await pontoService.buscarEstatisticas();
console.log(estatisticas.hoje.presentes); // 238
```

### 2. Buscar Ranking
```typescript
const ranking = await pontoService.buscarRanking('2024-10-01', '2024-10-31');
console.log(ranking.ranking[0].colaboradorNome); // "Maria Santos"
```

### 3. Gerar Relatório
```typescript
const relatorio = await pontoService.gerarRelatorioAtrasos('2024-10-01', '2024-10-31');
console.log(relatorio.totalAtrasos); // 15
```

### 4. Exportar Espelho de Ponto
```typescript
const espelho = await pontoService.exportarEspelhoPonto('123', '2024-10');
// Retorna Blob HTML para download
```

---

## Cores e Estilos

### Cores de Status
```typescript
PRESENTE → #388e3c (verde)
ATRASADO → #f57c00 (laranja)
FALTA → #d32f2f (vermelho)
FALTA_JUSTIFICADA → #1976d2 (azul)
FERIAS → #9c27b0 (roxo)
FOLGA → #757575 (cinza)
```

### Sistema de Medalhas
- 🥇 **Ouro**: 1º lugar
- 🥈 **Prata**: 2º lugar
- 🥉 **Bronze**: 3º lugar
- **Numérico**: 4º em diante

---

## Próximos Passos

### Integração com Backend
1. Descomente o código em `pontoService.ts`
2. Configure os endpoints da API:
   - `GET /ponto/estatisticas`
   - `GET /ponto/resumos`
   - `GET /ponto/ranking`
   - `GET /ponto/relatorios/atrasos`
   - `GET /ponto/relatorios/faltas`
   - `GET /ponto/espelho/:id/:mes`

### Integração com Ponto Facial
1. Configure `ConfiguracaoFacial`
2. Implemente webhook para receber batidas
3. Armazene fotos (opcional)
4. Configure tolerância de reconhecimento

### Melhorias Futuras
- ⏳ **Banco de Horas**: Saldo acumulado
- 📱 **App Móvel**: Registro via celular com GPS
- 🔔 **Notificações Push**: Lembretes de batida
- 📊 **Dashboard Gestor**: Visão por equipe
- 🤖 **IA**: Detecção de padrões e sugestões

---

## Suporte

Para dúvidas ou problemas:
1. Consulte os comentários no código
2. Verifique os tipos em `src/types/ponto.ts`
3. Teste com dados mock antes de integrar backend

---

**Módulo desenvolvido para o sistema FGS - Formando Gente de Sucesso** 🚀

