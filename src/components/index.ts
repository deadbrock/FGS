// Barrel export para componentes
export { Loading } from './Loading';
export { Logo } from './Logo';
export { PrivateRoute } from './PrivateRoute';
export { RoleBadge } from './RoleBadge';
export { StatCard } from './StatCard';
export { StatusChip } from './StatusChip';
export { FileUpload } from './FileUpload';
export { TabelaPaginada } from './TabelaPaginada';
export { FiltrosTabela } from './FiltrosTabela';
export { ErrorBoundary } from './ErrorBoundary';

// Novos componentes modernos
export { PageHeader } from './PageHeader';
export { GradientButton } from './GradientButton';
export { SkeletonTable, SkeletonCard, SkeletonStats } from './SkeletonTable';
export { AnimatedCard } from './AnimatedCard';
export { ActionButton } from './ActionButton';
export type { ActionType } from './ActionButton';
export { ModernTable, TableCellStatus, TableCellAvatar } from './ModernTable';
export type { ColumnDef } from './ModernTable';
export { LoadingSkeleton, PageLoadingSkeleton } from './LoadingSkeleton';

// Componentes de UX
export { LoaderFGS } from './LoaderFGS';
export { AnimatedModal } from './AnimatedModal';
export { PageTransition } from './PageTransition';

// Componentes do Prontuário
export * from './prontuario/DadosPessoaisForm';
export * from './prontuario/DadosContratuaisForm';
export * from './prontuario/ExameMedicoForm';
export * from './prontuario/TreinamentoForm';

// Componentes de Treinamentos
export * from './treinamentos/TipoTreinamentoForm';
export * from './treinamentos/ImportacaoCSV';
export * from './treinamentos/AlertasVencimento';
export * from './treinamentos/AgendamentoMassa';

// Componentes de Ponto
export * from './ponto/VisualizacaoHorarios';
export * from './ponto/GraficoPresenca';
export * from './ponto/RankingCard';

// Componentes de Benefícios
export * from './beneficios/BeneficioForm';
export * from './beneficios/HistoricoAlteracoes';
export * from './beneficios/RelatorioCustos';

// Componentes de Comunicação
export * from './comunicacao/ComunicadoForm';
export * from './comunicacao/HistoricoComunicados';

// Componentes de Relatórios
export * from './relatorios/FiltrosRelatorio';

// Componentes de Integrações
export * from './integracoes/ConfiguracaoPonto';
export * from './integracoes/ConfiguracaoEmail';
export * from './integracoes/ConfiguracaoWhatsApp';
export * from './integracoes/ImportacaoExportacao';
