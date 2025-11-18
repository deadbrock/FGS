import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Public as PublicIcon,
  Visibility as VisibilityIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  FilterList as FilterListIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';
import { StatCard, LoadingSkeleton, PageHeader } from '../components';
import { MapaRegioesList, CardEstadoDetalhes } from '../components/regionais';
import regionaisService from '../services/regionaisService';
import {
  EstadoBrasil,
  ColaboradorRegional,
  EstatisticasEstado,
  EstatisticasRegionais,
  RankingEstado,
} from '../types/regionais';
import { useTheme } from '../hooks/useTheme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const Regionais: React.FC = () => {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [tabAtual, setTabAtual] = useState(0);
  const [estadoSelecionado, setEstadoSelecionado] = useState<EstadoBrasil | null>(null);
  const [estatisticasGerais, setEstatisticasGerais] = useState<EstatisticasRegionais | null>(null);
  const [estatisticasEstado, setEstatisticasEstado] = useState<EstatisticasEstado | null>(null);
  const [colaboradores, setColaboradores] = useState<ColaboradorRegional[]>([]);
  const [ranking, setRanking] = useState<RankingEstado[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  
  // Estados para aba Colaboradores
  const [todosColaboradores, setTodosColaboradores] = useState<ColaboradorRegional[]>([]);
  const [buscaGlobal, setBuscaGlobal] = useState('');
  const [filtroGenero, setFiltroGenero] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<EstadoBrasil | 'TODOS'>('TODOS');
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<ColaboradorRegional | null>(null);
  
  // Estados para aba Administrativo
  const [buscaAdm, setBuscaAdm] = useState('');
  const [filtroGeneroAdm, setFiltroGeneroAdm] = useState<string>('TODOS');
  const [filtroEstadoAdm, setFiltroEstadoAdm] = useState<EstadoBrasil | 'TODOS'>('TODOS');
  const [filtroCargoAdm, setFiltroCargoAdm] = useState<string>('TODOS');

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  // Carregar dados do estado selecionado
  useEffect(() => {
    if (estadoSelecionado) {
      carregarDadosEstado();
    }
  }, [estadoSelecionado]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [stats, rankingData, todosColabs] = await Promise.all([
        regionaisService.getEstatisticasGerais(),
        regionaisService.getRankingEstados(),
        regionaisService.getAllColaboradores(),
      ]);
      
      setEstatisticasGerais(stats);
      setRanking(rankingData);
      setTodosColaboradores(todosColabs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosEstado = async () => {
    if (!estadoSelecionado) return;

    try {
      const [stats, cols] = await Promise.all([
        regionaisService.getEstatisticasEstado(estadoSelecionado),
        regionaisService.getColaboradoresPorEstado(estadoSelecionado),
      ]);
      
      setEstatisticasEstado(stats);
      setColaboradores(cols);
      setTabAtual(1); // Mudar para aba de detalhes
    } catch (error) {
      console.error('Erro ao carregar dados do estado:', error);
    }
  };

  const handleEstadoClick = (estado: EstadoBrasil) => {
    setEstadoSelecionado(estado);
  };

  const colaboradoresFiltrados = colaboradores.filter((col) => {
    const matchBusca = busca === '' ||
      col.nome.toLowerCase().includes(busca.toLowerCase()) ||
      col.email.toLowerCase().includes(busca.toLowerCase()) ||
      col.cargo.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'TODOS' || col.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  // Filtrar todos os colaboradores (aba Colaboradores)
  const colaboradoresGlobaisFiltrados = todosColaboradores.filter((col) => {
    const matchBusca = buscaGlobal === '' ||
      col.nome.toLowerCase().includes(buscaGlobal.toLowerCase()) ||
      col.email.toLowerCase().includes(buscaGlobal.toLowerCase()) ||
      col.cargo.toLowerCase().includes(buscaGlobal.toLowerCase()) ||
      col.cidade.toLowerCase().includes(buscaGlobal.toLowerCase());
    
    const matchGenero = filtroGenero === 'TODOS' || col.genero === filtroGenero;
    const matchEstado = filtroEstado === 'TODOS' || col.estado === filtroEstado;
    
    return matchBusca && matchGenero && matchEstado;
  });

  // Contar por gênero (filtrados)
  const totalMasculino = colaboradoresGlobaisFiltrados.filter(c => c.genero === 'MASCULINO').length;
  const totalFeminino = colaboradoresGlobaisFiltrados.filter(c => c.genero === 'FEMININO').length;

  // Função para verificar se é cargo administrativo/gestão
  const isCargoAdministrativo = (cargo: string): boolean => {
    const cargosAdministrativos = [
      // Gestão e Supervisão
      'supervisor',
      'supervisora',
      'encarregado',
      'encarregada',
      'coordenador',
      'coordenadora',
      'gerente',
      'diretor',
      'diretora',
      'gestor',
      'gestora',
      'líder',
      'chefe',
      'administrador',
      'administradora',
      // Administrativo
      'auxiliar administrativo',
      'assistente administrativo',
      'analista administrativo',
      // Departamento Pessoal
      'auxiliar departamento pessoal',
      'assistente departamento pessoal',
      'analista departamento pessoal',
      // RH
      'auxiliar de rh',
      'auxiliar rh',
      'assistente de rh',
      'assistente rh',
      'analista de rh',
      'analista rh',
      // Financeiro
      'auxiliar financeiro',
      'assistente financeiro',
      'analista financeiro',
      // Faturamento
      'auxiliar de faturamento',
      'auxiliar faturamento',
      'assistente de faturamento',
      'assistente faturamento',
      // Segurança do Trabalho
      'segurança do trabalho',
      'tecnico de segurança',
      'técnico de segurança',
      // Gerentes Específicos
      'gerente operacional',
      'gerente administrativo',
      // Genéricos (auxiliar, assistente, analista)
      'auxiliar',
      'assistente',
      'analista',
    ];
    
    const cargoLower = cargo.toLowerCase();
    return cargosAdministrativos.some(c => cargoLower.includes(c));
  };

  // Filtrar colaboradores administrativos
  const colaboradoresAdministrativos = todosColaboradores.filter(col => isCargoAdministrativo(col.cargo));

  // Filtrar colaboradores administrativos com filtros aplicados
  const colaboradoresAdministrativosFiltrados = colaboradoresAdministrativos.filter((col) => {
    const matchBusca = buscaAdm === '' ||
      col.nome.toLowerCase().includes(buscaAdm.toLowerCase()) ||
      col.email.toLowerCase().includes(buscaAdm.toLowerCase()) ||
      col.cargo.toLowerCase().includes(buscaAdm.toLowerCase()) ||
      col.cidade.toLowerCase().includes(buscaAdm.toLowerCase());
    
    const matchGenero = filtroGeneroAdm === 'TODOS' || col.genero === filtroGeneroAdm;
    const matchEstado = filtroEstadoAdm === 'TODOS' || col.estado === filtroEstadoAdm;
    
    // Filtro adicional por tipo de cargo
    let matchCargo = true;
    if (filtroCargoAdm !== 'TODOS') {
      matchCargo = col.cargo.toLowerCase().includes(filtroCargoAdm.toLowerCase());
    }
    
    return matchBusca && matchGenero && matchEstado && matchCargo;
  });

  // Contar por tipo de cargo administrativo
  const totalSupervisores = colaboradoresAdministrativosFiltrados.filter(c => 
    c.cargo.toLowerCase().includes('supervisor')
  ).length;
  const totalEncarregados = colaboradoresAdministrativosFiltrados.filter(c => 
    c.cargo.toLowerCase().includes('encarregado')
  ).length;
  const totalCoordenadores = colaboradoresAdministrativosFiltrados.filter(c => 
    c.cargo.toLowerCase().includes('coordenador') || c.cargo.toLowerCase().includes('gerente')
  ).length;

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Regionais"
          subtitle="Gestão regionalizada de colaboradores"
        />
        <LoadingSkeleton variant="stats" count={4} />
        <Box sx={{ mt: 4 }}>
          <LoadingSkeleton variant="table" count={5} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Regionais"
        subtitle="Visualização e gestão de colaboradores por região"
        icon={<PublicIcon />}
      />

      {/* Cards de Estatísticas Gerais */}
      {estatisticasGerais && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Colaboradores"
              value={estatisticasGerais.totalColaboradores}
              icon={<PeopleIcon />}
              color="#6366f1"
              trend={{
                value: estatisticasGerais.crescimentoAnual,
                isPositive: estatisticasGerais.crescimentoAnual >= 0,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Estados Ativos"
              value={estatisticasGerais.estadosAtivos}
              icon={<PublicIcon />}
              color="#8b5cf6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Unidades Ativas"
              value={estatisticasGerais.unidadesAtivas}
              icon={<BusinessIcon />}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Maior Concentração"
              value={estatisticasGerais.estadoMaiorConcentracao}
              subtitle={estatisticasGerais.regiaoMaiorConcentracao}
              icon={<TrendingUpIcon />}
              color="#f59e0b"
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={tabAtual}
          onChange={(e, newValue) => setTabAtual(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Visão por Regiões" />
          <Tab label="Detalhes do Estado" disabled={!estadoSelecionado} />
          <Tab label="Ranking de Estados" />
          <Tab label="Colaboradores" icon={<PeopleIcon />} iconPosition="start" />
          <Tab 
            label="Administrativo" 
            icon={<AdminPanelSettingsIcon />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Tab 0: Visão por Regiões */}
        <TabPanel value={tabAtual} index={0}>
          {estatisticasGerais && (
            <MapaRegioesList
              dadosEstados={estatisticasGerais.distribuicaoPorEstado}
              estadoSelecionado={estadoSelecionado}
              onEstadoClick={handleEstadoClick}
            />
          )}
        </TabPanel>

        {/* Tab 1: Detalhes do Estado */}
        <TabPanel value={tabAtual} index={1}>
          {estatisticasEstado && (
            <Box>
              <CardEstadoDetalhes estatisticas={estatisticasEstado} />

              {/* Lista de Colaboradores */}
              <Card sx={{ mt: 3, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Colaboradores - {estadoSelecionado}
                    </Typography>
                    <Chip
                      label={`${colaboradoresFiltrados.length} colaboradores`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {/* Filtros */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        placeholder="Buscar por nome, email ou cargo..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filtroStatus}
                          label="Status"
                          onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                          <MenuItem value="TODOS">Todos</MenuItem>
                          <MenuItem value="ATIVO">Ativos</MenuItem>
                          <MenuItem value="FERIAS">Férias</MenuItem>
                          <MenuItem value="AFASTADO">Afastados</MenuItem>
                          <MenuItem value="INATIVO">Inativos</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Tabela */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Colaborador</TableCell>
                          <TableCell>Cargo</TableCell>
                          <TableCell>Departamento</TableCell>
                          <TableCell>Cidade</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {colaboradoresFiltrados.slice(0, 10).map((col) => (
                          <TableRow key={col.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                  }}
                                >
                                  {col.nome.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {col.nome}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {col.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{col.cargo}</TableCell>
                            <TableCell>{col.departamento}</TableCell>
                            <TableCell>{col.cidade}</TableCell>
                            <TableCell>
                              <Chip
                                label={col.status}
                                size="small"
                                color={
                                  col.status === 'ATIVO'
                                    ? 'success'
                                    : col.status === 'FERIAS'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Ver detalhes">
                                <IconButton size="small">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}
        </TabPanel>

        {/* Tab 2: Ranking */}
        <TabPanel value={tabAtual} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Colaboradores</TableCell>
                  <TableCell align="right">Unidades</TableCell>
                  <TableCell align="right">Crescimento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ranking.map((item) => (
                  <TableRow
                    key={item.estado}
                    hover
                    onClick={() => handleEstadoClick(item.estado)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Chip
                        label={item.posicao}
                        size="small"
                        color={item.posicao <= 3 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {item.estado}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {item.nomeEstado}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        {item.totalColaboradores}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{item.unidades}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {item.crescimento >= 0 ? (
                          <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                        ) : (
                          <TrendingDownIcon fontSize="small" sx={{ color: '#ef4444' }} />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{
                            color: item.crescimento >= 0 ? '#10b981' : '#ef4444',
                          }}
                        >
                          {item.crescimento >= 0 ? '+' : ''}
                          {item.crescimento.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 3: Colaboradores */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={2}>
            {/* Cards de Estatísticas por Gênero */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Total</Typography>
                        <Typography variant="h4" fontWeight={700}>{colaboradoresGlobaisFiltrados.length}</Typography>
                        <Typography variant="caption">Colaboradores</Typography>
                      </Box>
                      <PeopleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setFiltroGenero(filtroGenero === 'MASCULINO' ? 'TODOS' : 'MASCULINO')}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Masculino</Typography>
                        <Typography variant="h4" fontWeight={700}>{totalMasculino}</Typography>
                        <Typography variant="caption">
                          {colaboradoresGlobaisFiltrados.length > 0 
                            ? ((totalMasculino / colaboradoresGlobaisFiltrados.length) * 100).toFixed(1) 
                            : '0.0'}%
                        </Typography>
                      </Box>
                      <MaleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setFiltroGenero(filtroGenero === 'FEMININO' ? 'TODOS' : 'FEMININO')}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Feminino</Typography>
                        <Typography variant="h4" fontWeight={700}>{totalFeminino}</Typography>
                        <Typography variant="caption">
                          {colaboradoresGlobaisFiltrados.length > 0 
                            ? ((totalFeminino / colaboradoresGlobaisFiltrados.length) * 100).toFixed(1) 
                            : '0.0'}%
                        </Typography>
                      </Box>
                      <FemaleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Estados</Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {new Set(colaboradoresGlobaisFiltrados.map(c => c.estado)).size}
                        </Typography>
                        <Typography variant="caption">Ativos</Typography>
                      </Box>
                      <PublicIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filtros */}
            <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <FilterListIcon />
                <Typography variant="h6" fontWeight={600}>Filtros</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nome, email, cargo ou cidade..."
                    value={buscaGlobal}
                    onChange={(e) => setBuscaGlobal(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Gênero</InputLabel>
                    <Select
                      value={filtroGenero}
                      label="Gênero"
                      onChange={(e) => setFiltroGenero(e.target.value)}
                    >
                      <MenuItem value="TODOS">Todos</MenuItem>
                      <MenuItem value="MASCULINO">
                        <Box display="flex" alignItems="center" gap={1}>
                          <MaleIcon fontSize="small" />
                          Masculino
                        </Box>
                      </MenuItem>
                      <MenuItem value="FEMININO">
                        <Box display="flex" alignItems="center" gap={1}>
                          <FemaleIcon fontSize="small" />
                          Feminino
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filtroEstado}
                      label="Estado"
                      onChange={(e) => setFiltroEstado(e.target.value as EstadoBrasil | 'TODOS')}
                    >
                      <MenuItem value="TODOS">Todos os Estados</MenuItem>
                      {estatisticasGerais && Object.keys(estatisticasGerais.distribuicaoPorEstado)
                        .sort()
                        .map((estado) => (
                          <MenuItem key={estado} value={estado}>
                            {estado} - {regionaisService.getNomeEstado(estado as EstadoBrasil)}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>

            {/* Tabela de Colaboradores */}
            <TableContainer component={Card}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Colaborador</TableCell>
                    <TableCell>Gênero</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Estado/Cidade</TableCell>
                    <TableCell>Admissão</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colaboradoresGlobaisFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box py={4}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum colaborador encontrado com os filtros aplicados
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    colaboradoresGlobaisFiltrados.slice(0, 50).map((col) => (
                      <TableRow key={col.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar src={col.avatar} sx={{ width: 40, height: 40 }}>
                              {col.nome.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {col.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {col.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={col.genero === 'MASCULINO' ? <MaleIcon /> : <FemaleIcon />}
                            label={col.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                            size="small"
                            color={col.genero === 'MASCULINO' ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{col.cargo}</TableCell>
                        <TableCell>{col.departamento}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {col.estado} - {regionaisService.getNomeEstado(col.estado)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {col.cidade}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(col.dataAdmissao).toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              onClick={() => setColaboradorSelecionado(col)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {colaboradoresGlobaisFiltrados.length > 50 && (
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Exibindo 50 de {colaboradoresGlobaisFiltrados.length} colaboradores. Use os filtros para refinar a busca.
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Tab 4: Administrativo */}
        <TabPanel value={tabAtual} index={4}>
          <Box p={2}>
            {/* Banner Informativo */}
            <Card 
              sx={{ 
                mb: 3, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <SupervisorAccountIcon sx={{ fontSize: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Quadro Administrativo
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Gestão, Supervisão, RH, Financeiro, Faturamento e Segurança do Trabalho
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Cards de Estatísticas Administrativas */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Total</Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {colaboradoresAdministrativosFiltrados.length}
                        </Typography>
                        <Typography variant="caption">Administrativos</Typography>
                      </Box>
                      <AdminPanelSettingsIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setFiltroCargoAdm(filtroCargoAdm === 'supervisor' ? 'TODOS' : 'supervisor')}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Supervisores</Typography>
                        <Typography variant="h4" fontWeight={700}>{totalSupervisores}</Typography>
                        <Typography variant="caption">
                          {colaboradoresAdministrativosFiltrados.length > 0 
                            ? ((totalSupervisores / colaboradoresAdministrativosFiltrados.length) * 100).toFixed(1) 
                            : '0.0'}%
                        </Typography>
                      </Box>
                      <SupervisorAccountIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setFiltroCargoAdm(filtroCargoAdm === 'encarregado' ? 'TODOS' : 'encarregado')}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Encarregados</Typography>
                        <Typography variant="h4" fontWeight={700}>{totalEncarregados}</Typography>
                        <Typography variant="caption">
                          {colaboradoresAdministrativosFiltrados.length > 0 
                            ? ((totalEncarregados / colaboradoresAdministrativosFiltrados.length) * 100).toFixed(1) 
                            : '0.0'}%
                        </Typography>
                      </Box>
                      <BusinessIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #c026d3 0%, #a21caf 100%)', 
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setFiltroCargoAdm(filtroCargoAdm === 'coordenador' ? 'TODOS' : 'coordenador')}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Coordenadores</Typography>
                        <Typography variant="h4" fontWeight={700}>{totalCoordenadores}</Typography>
                        <Typography variant="caption">
                          {colaboradoresAdministrativosFiltrados.length > 0 
                            ? ((totalCoordenadores / colaboradoresAdministrativosFiltrados.length) * 100).toFixed(1) 
                            : '0.0'}%
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filtros */}
            <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <FilterListIcon />
                <Typography variant="h6" fontWeight={600}>Filtros</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nome, email, cargo ou cidade..."
                    value={buscaAdm}
                    onChange={(e) => setBuscaAdm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Cargo</InputLabel>
                    <Select
                      value={filtroCargoAdm}
                      label="Tipo de Cargo"
                      onChange={(e) => setFiltroCargoAdm(e.target.value)}
                    >
                      <MenuItem value="TODOS">Todos os Cargos</MenuItem>
                      <MenuItem value="supervisor">Supervisores</MenuItem>
                      <MenuItem value="encarregado">Encarregados</MenuItem>
                      <MenuItem value="coordenador">Coordenadores</MenuItem>
                      <MenuItem value="gerente">Gerentes</MenuItem>
                      <MenuItem value="diretor">Diretores</MenuItem>
                      <MenuItem value="auxiliar">Auxiliares</MenuItem>
                      <MenuItem value="assistente">Assistentes</MenuItem>
                      <MenuItem value="analista">Analistas</MenuItem>
                      <MenuItem value="rh">RH</MenuItem>
                      <MenuItem value="financeiro">Financeiro</MenuItem>
                      <MenuItem value="faturamento">Faturamento</MenuItem>
                      <MenuItem value="segurança">Segurança do Trabalho</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Gênero</InputLabel>
                    <Select
                      value={filtroGeneroAdm}
                      label="Gênero"
                      onChange={(e) => setFiltroGeneroAdm(e.target.value)}
                    >
                      <MenuItem value="TODOS">Todos</MenuItem>
                      <MenuItem value="MASCULINO">Masculino</MenuItem>
                      <MenuItem value="FEMININO">Feminino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filtroEstadoAdm}
                      label="Estado"
                      onChange={(e) => setFiltroEstadoAdm(e.target.value as EstadoBrasil | 'TODOS')}
                    >
                      <MenuItem value="TODOS">Todos os Estados</MenuItem>
                      {estatisticasGerais && Object.keys(estatisticasGerais.distribuicaoPorEstado)
                        .sort()
                        .map((estado) => (
                          <MenuItem key={estado} value={estado}>
                            {estado} - {regionaisService.getNomeEstado(estado as EstadoBrasil)}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>

            {/* Tabela de Colaboradores Administrativos */}
            <TableContainer component={Card}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Colaborador</TableCell>
                    <TableCell>Cargo Administrativo</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Estado/Cidade</TableCell>
                    <TableCell>Admissão</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colaboradoresAdministrativosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box py={4}>
                          <AdminPanelSettingsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Nenhum colaborador administrativo encontrado
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {colaboradoresAdministrativos.length === 0 
                              ? 'Não há funcionários com cargos de supervisão ou gestão cadastrados'
                              : 'Ajuste os filtros para ver mais resultados'
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    colaboradoresAdministrativosFiltrados.slice(0, 50).map((col) => (
                      <TableRow key={col.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar 
                              src={col.avatar} 
                              sx={{ 
                                width: 40, 
                                height: 40,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                              }}
                            >
                              {col.nome.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {col.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {col.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={col.cargo}
                            size="small"
                            color="primary"
                            variant="outlined"
                            icon={<AdminPanelSettingsIcon />}
                          />
                        </TableCell>
                        <TableCell>{col.departamento}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {col.estado} - {regionaisService.getNomeEstado(col.estado)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {col.cidade}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(col.dataAdmissao).toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              onClick={() => setColaboradorSelecionado(col)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {colaboradoresAdministrativosFiltrados.length > 50 && (
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Exibindo 50 de {colaboradoresAdministrativosFiltrados.length} colaboradores administrativos.
                </Typography>
              </Box>
            )}

            {/* Informação sobre detecção automática */}
            <Card sx={{ mt: 3, p: 2, background: alpha('#6366f1', 0.05) }}>
              <Box display="flex" alignItems="start" gap={2}>
                <AdminPanelSettingsIcon sx={{ color: '#6366f1', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
                    Detecção Automática de Promoções
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    O sistema identifica automaticamente colaboradores com cargos administrativos incluindo: 
                    Gestão (Supervisor, Encarregado, Coordenador, Gerente, Diretor), 
                    Administrativo (Auxiliar, Assistente, Analista), 
                    RH, Financeiro, Faturamento e Segurança do Trabalho.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </TabPanel>
      </Card>

      {/* Dialog de Detalhes do Colaborador */}
      <Dialog
        open={colaboradorSelecionado !== null}
        onClose={() => setColaboradorSelecionado(null)}
        maxWidth="sm"
        fullWidth
      >
        {colaboradorSelecionado && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={colaboradorSelecionado.avatar} sx={{ width: 56, height: 56 }}>
                  {colaboradorSelecionado.nome.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {colaboradorSelecionado.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {colaboradorSelecionado.email}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Gênero</Typography>
                  <Box mt={0.5}>
                    <Chip
                      icon={colaboradorSelecionado.genero === 'MASCULINO' ? <MaleIcon /> : <FemaleIcon />}
                      label={colaboradorSelecionado.genero === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                      size="small"
                      color={colaboradorSelecionado.genero === 'MASCULINO' ? 'primary' : 'secondary'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Cargo</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {colaboradorSelecionado.cargo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Departamento</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {colaboradorSelecionado.departamento}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={colaboradorSelecionado.status}
                      size="small"
                      color={colaboradorSelecionado.status === 'ATIVO' ? 'success' : 'default'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Estado</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {colaboradorSelecionado.estado} - {regionaisService.getNomeEstado(colaboradorSelecionado.estado)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Cidade</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {colaboradorSelecionado.cidade}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Data de Admissão</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(colaboradorSelecionado.dataAdmissao).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
                {colaboradorSelecionado.telefone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Telefone</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {colaboradorSelecionado.telefone}
                    </Typography>
                  </Grid>
                )}
                {colaboradorSelecionado.unidade && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Unidade</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {colaboradorSelecionado.unidade}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setColaboradorSelecionado(null)}>
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

