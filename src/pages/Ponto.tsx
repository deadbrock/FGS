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
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import { VisualizacaoHorarios } from '../components/ponto/VisualizacaoHorarios';
import { GraficoPresenca } from '../components/ponto/GraficoPresenca';
import { RankingCard } from '../components/ponto/RankingCard';
import { TabelaPaginada, Coluna } from '../components/TabelaPaginada';
import {
  EstatisticasPonto,
  ResumoDia,
  RankingPontualidade,
  RelatorioAtrasos,
  AtrasoColaborador,
} from '../types/ponto';
import { formatarMinutosParaHoras } from '../utils/pontoUtils';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import pontoService from '../services/pontoService';
import { PageHeader, GradientButton, AnimatedCard } from '../components';

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

export const Ponto: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas, setEstatisticas] = useState<EstatisticasPonto | null>(null);
  const [resumosDias, setResumosDias] = useState<ResumoDia[]>([]);
  const [ranking, setRanking] = useState<RankingPontualidade | null>(null);
  const [relatorioAtrasos, setRelatorioAtrasos] = useState<RelatorioAtrasos | null>(null);
  const [dataInicio, setDataInicio] = useState('2024-10-01');
  const [dataFim, setDataFim] = useState('2024-10-31');

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useEffect(() => {
    if (tabAtual === 1) carregarResumosDias();
    if (tabAtual === 2) carregarRanking();
    if (tabAtual === 3) carregarRelatorios();
  }, [tabAtual, dataInicio, dataFim]);

  const carregarEstatisticas = async () => {
    try {
      const dados = await pontoService.buscarEstatisticas();
      setEstatisticas(dados);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarResumosDias = async () => {
    try {
      const dados = await pontoService.listarResumosDias(dataInicio, dataFim);
      setResumosDias(dados);
    } catch (error) {
      console.error('Erro ao carregar resumos:', error);
    }
  };

  const carregarRanking = async () => {
    try {
      const dados = await pontoService.buscarRanking(dataInicio, dataFim);
      setRanking(dados);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    }
  };

  const carregarRelatorios = async () => {
    try {
      const atrasos = await pontoService.gerarRelatorioAtrasos(dataInicio, dataFim);
      setRelatorioAtrasos(atrasos);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  };

  const colunasAtrasos: Coluna<AtrasoColaborador>[] = [
    { id: 'colaboradorNome', label: 'Colaborador', minWidth: 150 },
    { id: 'departamento', label: 'Departamento', minWidth: 120 },
    { id: 'totalAtrasos', label: 'Atrasos', minWidth: 80 },
    { id: 'minutosAcumulados', label: 'Minutos', minWidth: 100, format: (v) => `${v} min` },
    { id: 'percentualPontualidade', label: 'Pontualidade', minWidth: 100, format: (v) => `${v}%` },
  ];

  return (
    <Box>
      <PageHeader
        title="Ponto e Frequência"
        subtitle="Gestão completa de horários, presença e pontualidade"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Ponto e Frequência' },
        ]}
      />

      <AnimatedCard>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Dashboard" />
          <Tab label="Registros" />
          <Tab label="Ranking" />
          <Tab label="Relatórios" />
        </Tabs>

        {/* Aba 0: Dashboard */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            {estatisticas && (
              <>
                <Typography variant="h6" mb={3}>
                  Situação Hoje
                </Typography>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Presentes"
                      value={estatisticas.hoje.presentes}
                      icon={<PeopleIcon />}
                      color="#388e3c"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Atrasados"
                      value={estatisticas.hoje.atrasados}
                      icon={<AccessTimeIcon />}
                      color="#f57c00"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Ausentes"
                      value={estatisticas.hoje.ausentes}
                      icon={<WarningIcon />}
                      color="#d32f2f"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="% Presença"
                      value={`${estatisticas.hoje.percentualPresenca}%`}
                      icon={<TrendingUpIcon />}
                      color="#1976d2"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <GraficoPresenca dados={estatisticas.graficoPresenca} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <Box p={2}>
                        <Typography variant="h6" mb={2}>
                          Estatísticas do Mês
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Total de Registros
                            </Typography>
                            <Typography variant="h6">
                              {estatisticas.mes.totalRegistros}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Média Horas/Dia
                            </Typography>
                            <Typography variant="h6">
                              {formatarMinutosParaHoras(estatisticas.mes.mediaHorasTrabalhadas)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Horas Extras
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              {formatarMinutosParaHoras(estatisticas.mes.totalHorasExtras)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Total Atrasos
                            </Typography>
                            <Typography variant="h6" color="warning.main">
                              {estatisticas.mes.totalAtrasos}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Alert severity="info">
                    <strong>Regra de Atrasos:</strong> Atrasos menores que 15 minutos não são contabilizados
                  </Alert>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Aba 1: Registros */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <Box mb={3} display="flex" gap={2} alignItems="center">
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
              <GradientButton onClick={carregarResumosDias}>
                Buscar
              </GradientButton>
            </Box>

            {resumosDias.map((resumo) => (
              <Box key={resumo.id} mb={2}>
                <VisualizacaoHorarios resumoDia={resumo} />
              </Box>
            ))}

            {resumosDias.length === 0 && (
              <Alert severity="info">Nenhum registro encontrado no período</Alert>
            )}
          </Box>
        </TabPanel>

        {/* Aba 2: Ranking */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <Box mb={3} display="flex" gap={2} alignItems="center">
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
            </Box>

            {ranking && <RankingCard ranking={ranking.ranking} topN={10} />}
          </Box>
        </TabPanel>

        {/* Aba 3: Relatórios */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Relatório de Atrasos</Typography>
              <GradientButton gradient="secondary" startIcon={<DownloadIcon />}>
                Exportar CSV
              </GradientButton>
            </Box>

            {relatorioAtrasos && (
              <>
                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Total de Atrasos
                        </Typography>
                        <Typography variant="h4">{relatorioAtrasos.totalAtrasos}</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Média de Atraso
                        </Typography>
                        <Typography variant="h4">{relatorioAtrasos.mediaAtrasoMinutos} min</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <TabelaPaginada
                  colunas={colunasAtrasos}
                  dados={relatorioAtrasos.colaboradores}
                  total={relatorioAtrasos.colaboradores.length}
                  pagina={0}
                  itensPorPagina={10}
                  onMudarPagina={() => {}}
                  onMudarItensPorPagina={() => {}}
                />
              </>
            )}
          </Box>
        </TabPanel>
      </AnimatedCard>
    </Box>
  );
};

