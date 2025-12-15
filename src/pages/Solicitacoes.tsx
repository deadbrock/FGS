import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  PersonAdd as PersonAddIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { PageHeader, AnimatedCard, StatCard } from '../components';
import { useNavigate } from 'react-router-dom';
import solicitacoesService from '../services/solicitacoesService';
import { EstatisticasSolicitacoes } from '../types/solicitacoes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

export const Solicitacoes: React.FC = () => {
  useNavigationLog();
  const navigate = useNavigate();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas, setEstatisticas] = useState<EstatisticasSolicitacoes | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      const data = await solicitacoesService.getEstatisticas();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const tiposExame = [
    {
      tipo: 'ASO_ADMISSIONAL',
      titulo: 'ASO Admissional',
      descricao: 'Exame obrigatório para novos colaboradores',
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      color: '#354a80',
      rota: '/solicitacoes/aso-admissional',
    },
    {
      tipo: 'PERIODICO',
      titulo: 'Periódicos',
      descricao: 'Exames periódicos de rotina',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      color: '#0288d1',
      rota: '/solicitacoes/periodicos',
    },
    {
      tipo: 'RETORNO_TRABALHO',
      titulo: 'Retorno ao Trabalho',
      descricao: 'Exame após afastamento',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      rota: '/solicitacoes/retorno-trabalho',
    },
    {
      tipo: 'MUDANCA_RISCO',
      titulo: 'Mudança de Risco',
      descricao: 'Exame por mudança de função/risco',
      icon: <MedicalIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      rota: '/solicitacoes/mudanca-risco',
    },
    {
      tipo: 'DEMISSIONAL',
      titulo: 'Demissional',
      descricao: 'Exame de desligamento',
      icon: <ExitIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      rota: '/solicitacoes/demissional',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Solicitações de Exames"
        subtitle="Gestão completa de exames ocupacionais - SST"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Solicitações' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<HospitalIcon />}
            onClick={() => navigate('/solicitacoes/clinicas')}
          >
            Gerenciar Clínicas
          </Button>
        }
      />

      {/* Estatísticas */}
      {estatisticas && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total de Solicitações"
              value={estatisticas.total.toString()}
              icon={<MedicalIcon />}
              color="#354a80"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Pendentes Agendamento"
              value={estatisticas.pendentes_agendamento.toString()}
              icon={<CalendarIcon />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Realizados este Mês"
              value={estatisticas.realizados_mes.toString()}
              icon={<AssignmentIcon />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Taxa de Aprovação"
              value={`${estatisticas.taxa_aprovacao.toFixed(1)}%`}
              icon={<PersonAddIcon />}
              color="#0288d1"
            />
          </Grid>
        </Grid>
      )}

      {/* Cards de Tipos de Exame */}
      <AnimatedCard>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Tipos de Exames Ocupacionais
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Selecione o tipo de exame para gerenciar solicitações e agendamentos
          </Typography>

          <Grid container spacing={3}>
            {tiposExame.map((exame) => (
              <Grid item xs={12} sm={6} md={4} key={exame.tipo}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(exame.rota)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          bgcolor: `${exame.color}15`,
                          color: exame.color,
                          p: 1.5,
                          borderRadius: 2,
                          mr: 2,
                        }}
                      >
                        {exame.icon}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {exame.titulo}
                        </Typography>
                        {estatisticas && (
                          <Chip
                            label={`${
                              estatisticas.por_tipo.find((t) => t.tipo_exame === exame.tipo)?.total || 0
                            } solicitações`}
                            size="small"
                            sx={{ bgcolor: `${exame.color}15`, color: exame.color }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {exame.descricao}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </AnimatedCard>

      {/* Informações Adicionais */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Sobre os Exames Ocupacionais
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Os exames ocupacionais são obrigatórios conforme a NR-7 e visam:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  Avaliar a aptidão do colaborador para a função
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Prevenir doenças ocupacionais
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Monitorar a saúde dos trabalhadores
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Cumprir exigências legais
                </Typography>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏥 Gestão de Clínicas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Cadastre e gerencie as clínicas parceiras para realização dos exames:
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<HospitalIcon />}
                onClick={() => navigate('/solicitacoes/clinicas')}
              >
                Acessar Cadastro de Clínicas
              </Button>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Box>
  );
};

