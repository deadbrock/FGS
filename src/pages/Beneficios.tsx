import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import { TabelaPaginada, Coluna } from '../components/TabelaPaginada';
import { BeneficioForm } from '../components/beneficios/BeneficioForm';
import { HistoricoAlteracoes } from '../components/beneficios/HistoricoAlteracoes';
import { RelatorioCustos } from '../components/beneficios/RelatorioCustos';
import {
  Beneficio,
  BeneficioColaborador,
  EstatisticasBeneficios,
  HistoricoBeneficio,
  RelatorioCustos as RelatorioCustosType,
} from '../types/beneficios';
import {
  formatarMoeda,
  getTipoNome,
  getStatusNome,
  getTipoIcone,
} from '../utils/beneficiosUtils';
import { formatarData } from '../utils/statusUtils';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import beneficiosService from '../services/beneficiosService';
import { PageHeader, GradientButton, AnimatedCard, ActionButton } from '../components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Beneficios: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas, setEstatisticas] = useState<EstatisticasBeneficios | null>(null);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosColaborador, setBeneficiosColaborador] = useState<BeneficioColaborador[]>([]);
  const [historico, setHistorico] = useState<HistoricoBeneficio[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioCustosType | null>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [beneficioEdit, setBeneficioEdit] = useState<Beneficio | undefined>();
  
  const [dataInicio, setDataInicio] = useState('2024-01-01');
  const [dataFim, setDataFim] = useState('2024-12-31');

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useEffect(() => {
    if (tabAtual === 1) carregarBeneficios();
    if (tabAtual === 2) carregarBeneficiosColaborador();
    if (tabAtual === 3) carregarHistorico();
    if (tabAtual === 4) carregarRelatorio();
  }, [tabAtual]);

  const carregarEstatisticas = async () => {
    try {
      const dados = await beneficiosService.buscarEstatisticas();
      setEstatisticas(dados);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarBeneficios = async () => {
    try {
      const dados = await beneficiosService.listarBeneficios();
      setBeneficios(dados);
    } catch (error) {
      console.error('Erro ao carregar benefícios:', error);
    }
  };

  const carregarBeneficiosColaborador = async () => {
    try {
      const dados = await beneficiosService.listarBeneficiosColaborador();
      setBeneficiosColaborador(dados);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const carregarHistorico = async () => {
    try {
      // buscarHistorico precisa de colaboradorId, mas como não temos, retornamos array vazio
      // ou podemos buscar todos os benefícios de colaboradores
      const dados = await beneficiosService.getAll();
      // Converter BeneficioColaborador[] para HistoricoBeneficio[]
      setHistorico(dados.map((b: any) => ({
        id: b.id,
        tipoAlteracao: 'CONCESSAO',
        dataAlteracao: b.data_inicio || b.created_at,
        beneficioNome: b.tipo_beneficio_nome || 'Benefício',
        colaboradorNome: b.colaborador_nome || 'N/A',
        valorAnterior: undefined,
        valorNovo: b.valor,
        motivo: 'Concessão inicial',
        observacoes: b.observacoes,
        alteradoPor: 'Sistema',
      })));
    } catch (error) {
      console.error('Erro:', error);
      setHistorico([]);
    }
  };

  const carregarRelatorio = async () => {
    try {
      const dados = await beneficiosService.gerarRelatorioCustos(dataInicio, dataFim);
      setRelatorio(dados);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSaveBeneficio = async (beneficio: Partial<Beneficio>) => {
    try {
      if (beneficioEdit) {
        await beneficiosService.updateTipo(beneficioEdit.id, beneficio);
      } else {
        await beneficiosService.createTipo(beneficio);
      }
      setDialogOpen(false);
      setBeneficioEdit(undefined);
      await carregarBeneficios();
      await carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar benefício. Tente novamente.');
    }
  };

  const handleExcluirBeneficio = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este benefício?')) {
      return;
    }

    try {
      await beneficiosService.deleteTipo(id);
      await carregarBeneficios();
      await carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir benefício. Tente novamente.');
    }
  };

  const colunasBeneficios: Coluna<Beneficio>[] = [
    {
      id: 'tipo',
      label: 'Tipo',
      minWidth: 200,
      format: (value) => (
        <Box display="flex" alignItems="center" gap={1}>
          <span>{getTipoIcone(value as any)}</span>
          <span>{getTipoNome(value as any)}</span>
        </Box>
      ),
    },
    { id: 'nome', label: 'Nome', minWidth: 150 },
    { id: 'fornecedor', label: 'Fornecedor', minWidth: 120 },
    { id: 'custoEmpresa', label: 'Custo Empresa', minWidth: 120, format: (v) => formatarMoeda(v as number) },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value) => (
        <Chip label={getStatusNome(value as any)} size="small" color="success" />
      ),
    },
    {
      id: 'id',
      label: 'Ações',
      minWidth: 120,
      format: (value, row) => (
        <Box display="flex" gap={1}>
          <ActionButton
            action="edit"
            onClick={() => {
              setBeneficioEdit(row as Beneficio);
              setDialogOpen(true);
            }}
          />
          <ActionButton
            action="delete"
            onClick={() => handleExcluirBeneficio((row as Beneficio).id)}
          />
        </Box>
      ),
    },
  ];

  const colunasColaborador: Coluna<BeneficioColaborador>[] = [
    { id: 'colaboradorNome', label: 'Colaborador', minWidth: 150 },
    {
      id: 'beneficio',
      label: 'Benefício',
      minWidth: 180,
      format: (value) => getTipoNome((value as any).tipo),
    },
    {
      id: 'valorConcedido',
      label: 'Valor',
      minWidth: 120,
      format: (v) => formatarMoeda(v as number),
    },
    {
      id: 'dataInicio',
      label: 'Data Início',
      minWidth: 120,
      format: (v) => formatarData(v as string),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value) => (
        <Chip label={getStatusNome(value as any)} size="small" color="success" />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Gestão de Benefícios"
        subtitle="Controle completo de benefícios, custos e histórico"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Benefícios' },
        ]}
      />

      <AnimatedCard>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Dashboard" />
          <Tab label="Benefícios" />
          <Tab label="Colaboradores" />
          <Tab label="Histórico" />
          <Tab label="Relatórios" />
        </Tabs>

        {/* Aba 0: Dashboard */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            {estatisticas && (
              <>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Benefícios Ativos"
                      value={estatisticas.totalAtivos}
                      icon={<CardGiftcardIcon />}
                      color="#388e3c"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Colaboradores Atendidos"
                      value={estatisticas.totalColaboradoresAtendidos}
                      icon={<PeopleIcon />}
                      color="#1976d2"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Custo Mensal Empresa"
                      value={formatarMoeda(estatisticas.custoMensalEmpresa)}
                      icon={<AttachMoneyIcon />}
                      color="#f57c00"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Custo Total Mensal"
                      value={formatarMoeda(estatisticas.custoMensalTotal)}
                      icon={<TrendingUpIcon />}
                      color="#a2122a"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <Box p={2}>
                        <Typography variant="h6" mb={2}>
                          Distribuição por Tipo
                        </Typography>
                        {estatisticas.distribuicaoPorTipo && Array.isArray(estatisticas.distribuicaoPorTipo) && estatisticas.distribuicaoPorTipo.length > 0 ? (
                          estatisticas.distribuicaoPorTipo.map((item) => (
                            <Box key={item.tipo} mb={2}>
                              <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography variant="body2">
                                  {getTipoIcone(item.tipo)} {item.nome}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {item.quantidade}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  height: 8,
                                  bgcolor: '#e0e0e0',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    height: '100%',
                                    width: `${item.percentual || 0}%`,
                                    bgcolor: '#388e3c',
                                  }}
                                />
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum dado disponível
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <Box p={2}>
                        <Typography variant="h6" mb={2}>
                          Evolução de Custos
                        </Typography>
                        {estatisticas.evolucaoCustos && Array.isArray(estatisticas.evolucaoCustos) && estatisticas.evolucaoCustos.length > 0 ? (
                          estatisticas.evolucaoCustos.map((item) => (
                            <Box key={item.mes} display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2">{item.mes}/2024</Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {formatarMoeda(item.custoTotal || 0)}
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Nenhum dado disponível
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Aba 1: Benefícios */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <Box mb={3} display="flex" justifyContent="space-between">
              <Typography variant="h6">Cadastro de Benefícios</Typography>
              <GradientButton
                startIcon={<AddIcon />}
                onClick={() => {
                  setBeneficioEdit(undefined);
                  setDialogOpen(true);
                }}
              >
                Novo Benefício
              </GradientButton>
            </Box>

            <TabelaPaginada
              colunas={colunasBeneficios}
              dados={beneficios}
              total={beneficios.length}
              pagina={0}
              itensPorPagina={10}
              onMudarPagina={() => {}}
              onMudarItensPorPagina={() => {}}
            />
          </Box>
        </TabPanel>

        {/* Aba 2: Colaboradores */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <Box mb={3}>
              <Typography variant="h6">Benefícios por Colaborador</Typography>
            </Box>

            <TabelaPaginada
              colunas={colunasColaborador}
              dados={beneficiosColaborador}
              total={beneficiosColaborador.length}
              pagina={0}
              itensPorPagina={10}
              onMudarPagina={() => {}}
              onMudarItensPorPagina={() => {}}
            />
          </Box>
        </TabPanel>

        {/* Aba 3: Histórico */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            <HistoricoAlteracoes historico={historico} />
          </Box>
        </TabPanel>

        {/* Aba 4: Relatórios */}
        <TabPanel value={tabAtual} index={4}>
          <Box p={3}>
            <Box mb={3} display="flex" gap={2} alignItems="center" justifyContent="space-between">
              <Box display="flex" gap={2}>
                <TextField
                  type="date"
                  label="Data Início"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="Data Fim"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <GradientButton onClick={carregarRelatorio}>
                  Gerar
                </GradientButton>
              </Box>
              <GradientButton gradient="secondary" startIcon={<DownloadIcon />}>
                Exportar
              </GradientButton>
            </Box>

            {relatorio && <RelatorioCustos relatorio={relatorio} />}
          </Box>
        </TabPanel>
      </AnimatedCard>

      <BeneficioForm
        open={dialogOpen}
        beneficio={beneficioEdit}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveBeneficio}
      />
    </Box>
  );
};

