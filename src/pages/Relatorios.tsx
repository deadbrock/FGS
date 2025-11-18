import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import { FiltrosRelatorio } from '../components/relatorios/FiltrosRelatorio';
import { DashboardGeral, FiltrosRelatorio as FiltrosType } from '../types/relatorios';
import { formatarMoeda, formatarPercentual, formatarMes, exportarPDF, exportarExcel } from '../utils/relatoriosUtils';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import relatoriosService from '../services/relatoriosService';

export const Relatorios: React.FC = () => {
  useNavigationLog();

  const [dashboard, setDashboard] = useState<DashboardGeral | null>(null);
  const [filtros, setFiltros] = useState<FiltrosType>({
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31',
  });

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const dados = await relatoriosService.buscarDashboard();
      setDashboard(dados);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  const handleExportarPDF = () => {
    if (!dashboard || !dashboard.indicadoresPrincipais) return;
    
    const indicadores = dashboard.indicadoresPrincipais;
    const dados = {
      cabecalho: ['Indicador', 'Valor'],
      linhas: [
        ['Funcionários Ativos', indicadores.funcionariosAtivos || 0],
        ['Turnover Mensal', `${indicadores.turnoverMensal || 0}%`],
        ['Dias Perdidos (Atestados)', indicadores.diasPerdidosAtestados || 0],
        ['Treinamentos Vencidos', indicadores.treinamentosVencidos || 0],
        ['Custo Total Benefícios', formatarMoeda(indicadores.custoTotalBeneficios || 0)],
      ],
    };
    
    exportarPDF('Relatório Geral - FGS', dados, 'relatorio_geral');
  };

  const handleExportarExcel = () => {
    if (!dashboard || !dashboard.indicadoresPrincipais) return;
    
    const indicadores = dashboard.indicadoresPrincipais;
    const dados = [
      {
        Indicador: 'Funcionários Ativos',
        Valor: indicadores.funcionariosAtivos || 0,
      },
      {
        Indicador: 'Turnover Mensal',
        Valor: `${indicadores.turnoverMensal || 0}%`,
      },
    ];
    
    exportarExcel(dados, 'relatorio_geral');
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Relatórios e Indicadores
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análise completa de indicadores de RH
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportarPDF}
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChartIcon />}
            onClick={handleExportarExcel}
          >
            Excel
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <FiltrosRelatorio
          filtros={filtros}
          onChangeFiltros={setFiltros}
          onAplicar={carregarDashboard}
        />
      </Box>

      {dashboard && dashboard.indicadoresPrincipais && (
        <>
          {/* Indicadores Principais */}
          <Typography variant="h6" gutterBottom mb={2}>
            Indicadores Principais
          </Typography>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Funcionários Ativos"
                value={dashboard.indicadoresPrincipais.funcionariosAtivos || 0}
                subtitle={`${formatarPercentual(dashboard.indicadoresPrincipais.percentualAtivos || 0)}`}
                icon={<PeopleIcon />}
                color="#388e3c"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Turnover Mensal"
                value={`${dashboard.indicadoresPrincipais.turnoverMensal || 0}%`}
                subtitle={`${dashboard.indicadoresPrincipais.demissoesMes || 0} demissões`}
                icon={<TrendingUpIcon />}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Dias Perdidos (Atestados)"
                value={dashboard.indicadoresPrincipais.diasPerdidosAtestados || 0}
                subtitle={`${dashboard.indicadoresPrincipais.totalAtestadosMes || 0} atestados`}
                icon={<LocalHospitalIcon />}
                color="#d32f2f"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Treinamentos Vencidos"
                value={dashboard.indicadoresPrincipais.treinamentosVencidos || 0}
                subtitle={`${dashboard.indicadoresPrincipais.treinamentosAVencer || 0} a vencer`}
                icon={<SchoolIcon />}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Custo Total Benefícios"
                value={formatarMoeda(dashboard.indicadoresPrincipais.custoTotalBeneficios || 0)}
                subtitle={`${formatarMoeda(dashboard.indicadoresPrincipais.custoMedioPorFuncionario || 0)}/funcionário`}
                icon={<CardGiftcardIcon />}
                color="#7b1fa2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Taxa de Pontualidade"
                value={`${dashboard.indicadoresPrincipais.taxaPontualidade}%`}
                subtitle={`${dashboard.indicadoresPrincipais.totalHorasExtras}h extras`}
                icon={<AccessTimeIcon />}
                color="#00796b"
              />
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Funcionários por Setor
                  </Typography>
                  {dashboard.graficos.funcionariosPorSetor.map((item) => (
                    <Box key={item.setor} mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">{item.setor}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.total} ({formatarPercentual(item.percentual)})
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
                            width: `${item.percentual}%`,
                            bgcolor: '#388e3c',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <Box p={2}>
                  <Typography variant="h6" gutterBottom>
                    Evolução Turnover
                  </Typography>
                  {dashboard.graficos.turnoverMensal.map((item) => (
                    <Box key={item.mes} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{formatarMes(item.mes)}</Typography>
                      <Box display="flex" gap={2}>
                        <Typography variant="body2" color="success.main">
                          ↑ {item.admissoes}
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          ↓ {item.demissoes}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.turnover.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Alertas */}
          {dashboard.alertas.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom mb={2}>
                Alertas
              </Typography>
              {dashboard.alertas.map((alerta) => (
                <Alert key={alerta.id} severity={alerta.tipo === 'ERRO' ? 'error' : alerta.tipo === 'AVISO' ? 'warning' : 'info'} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{alerta.titulo}</Typography>
                  <Typography variant="body2">{alerta.mensagem}</Typography>
                </Alert>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

