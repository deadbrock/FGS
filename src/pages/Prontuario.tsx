import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  Paper,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { 
  ProntuarioColaborador, 
  StatusProntuario, 
  ExameMedico, 
  Treinamento,
  AtestadoMedico,
  Ferias,
  Advertencia,
  DocumentoAnexado,
} from '../types/prontuario';
import { TabelaPaginada, Coluna } from '../components/TabelaPaginada';
import { FiltrosTabela } from '../components/FiltrosTabela';
import { StatusChip } from '../components/StatusChip';
import { 
  DadosPessoaisForm,
  DadosContratuaisForm,
  ExameMedicoForm,
  TreinamentoForm,
  AtestadoMedicoForm,
  FeriasForm,
  AdvertenciaForm,
  AnexosDocumentos,
} from '../components/prontuario';
import { formatarData } from '../utils/statusUtils';
import prontuarioService from '../services/prontuarioService.mock';
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
} from '../components';

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  cargo: string;
  setor: string;
  dataAdmissao: string;
  dataNascimento: string;
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO';
  foto?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Prontuario: React.FC = () => {
  useNavigationLog();
  
  // Estado de visualização: lista ou prontuário
  const [visualizacao, setVisualizacao] = useState<'lista' | 'prontuario'>('lista');
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null);
  
  // Filtros da lista de colaboradores
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: '',
    cargo: '',
    setor: '',
    status: '',
    dataAdmissaoInicio: '',
    dataAdmissaoFim: '',
    dataNascimentoInicio: '',
    dataNascimentoFim: '',
  });
  
  // Paginação da lista
  const [pagina, setPagina] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [totalColaboradores, setTotalColaboradores] = useState(0);
  
  // Lista de colaboradores (mock)
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do prontuário (quando um colaborador é selecionado)
  const [tabAtual, setTabAtual] = useState(0);
  const [prontuario, setProntuario] = useState<ProntuarioColaborador | null>(null);
  
  // Estados para exames
  const [exames, setExames] = useState<ExameMedico[]>([]);
  const [paginaExames, setPaginaExames] = useState(0);
  const [itensPorPaginaExames, setItensPorPaginaExames] = useState(10);
  const [totalExames, setTotalExames] = useState(0);
  const [filtroExames, setFiltroExames] = useState<StatusProntuario[]>([]);
  const [buscaExames, setBuscaExames] = useState('');
  
  // Estados para treinamentos
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [paginaTreinamentos, setPaginaTreinamentos] = useState(0);
  const [itensPorPaginaTreinamentos, setItensPorPaginaTreinamentos] = useState(10);
  const [totalTreinamentos, setTotalTreinamentos] = useState(0);
  const [filtroTreinamentos, setFiltroTreinamentos] = useState<StatusProntuario[]>([]);
  const [buscaTreinamentos, setBuscaTreinamentos] = useState('');
  
  // Estados para diálogos
  const [dialogExameAberto, setDialogExameAberto] = useState(false);
  const [dialogTreinamentoAberto, setDialogTreinamentoAberto] = useState(false);
  const [dialogAtestadoAberto, setDialogAtestadoAberto] = useState(false);
  const [dialogFeriasAberto, setDialogFeriasAberto] = useState(false);
  const [dialogAdvertenciaAberto, setDialogAdvertenciaAberto] = useState(false);
  
  const [exameAtual, setExameAtual] = useState<Partial<ExameMedico>>({});
  const [treinamentoAtual, setTreinamentoAtual] = useState<Partial<Treinamento>>({});
  const [atestadoAtual, setAtestadoAtual] = useState<Partial<AtestadoMedico>>({});
  const [feriasAtual, setFeriasAtual] = useState<Partial<Ferias>>({});
  const [advertenciaAtual, setAdvertenciaAtual] = useState<Partial<Advertencia>>({});
  
  // Estados para atestados
  const [atestados, setAtestados] = useState<AtestadoMedico[]>([]);
  
  // Estados para férias  
  const [ferias, setFerias] = useState<Ferias[]>([]);
  
  // Estados para advertências
  const [advertencias, setAdvertencias] = useState<Advertencia[]>([]);
  
  // Estados para documentos
  const [documentos, setDocumentos] = useState<DocumentoAnexado[]>([]);

  const carregarColaboradores = useCallback(async () => {
    setLoading(true);
    
    try {
      // Nomes realistas
      const nomesMasculinos = [
        'João Silva Santos', 'Carlos Eduardo Oliveira', 'Pedro Henrique Costa',
        'Rafael Almeida Souza', 'Lucas Martins Ferreira', 'Bruno Pereira Lima',
        'Guilherme Santos Rocha', 'Fernando Costa Silva', 'Rodrigo Alves Santos',
        'Thiago Souza Oliveira', 'Gabriel Lima Costa', 'André Pereira Santos',
        'Marcelo Silva Ferreira', 'Ricardo Costa Almeida', 'Felipe Santos Lima',
      ];

      const nomesFemininos = [
        'Maria Silva Santos', 'Ana Paula Oliveira', 'Juliana Costa Ferreira',
        'Fernanda Almeida Santos', 'Carla Souza Lima', 'Patricia Santos Costa',
        'Camila Oliveira Silva', 'Renata Ferreira Alves', 'Beatriz Costa Santos',
        'Amanda Lima Oliveira', 'Daniela Santos Ferreira', 'Larissa Costa Silva',
        'Mariana Almeida Santos', 'Priscila Oliveira Costa', 'Vanessa Santos Lima',
      ];

      const cargos = [
        'Analista de RH', 'Assistente Administrativo', 'Coordenador de Produção',
        'Gerente de Operações', 'Diretor Comercial', 'Analista Financeiro',
        'Assistente de TI', 'Coordenador de Vendas', 'Gerente de Projetos',
        'Analista de Marketing', 'Supervisor de Logística', 'Técnico de Manutenção',
      ];

      const setores = [
        'Recursos Humanos', 'Administrativo', 'Operacional', 'Comercial',
        'Financeiro', 'TI', 'Marketing', 'Logística', 'Produção',
      ];

      // Mock de dados - em produção viria do backend
      const mockColaboradores: Colaborador[] = Array.from({ length: 50 }, (_, i) => {
        const id = i + 1;
        const sexo = id % 2 === 0 ? 'M' : 'F';
        const nomes = sexo === 'M' ? nomesMasculinos : nomesFemininos;
        const nome = nomes[id % nomes.length];
        
        return {
          id: `${id}`,
          nome,
          cpf: `${String(id).padStart(3, '0')}.${String(id + 100).padStart(3, '0')}.${String(id + 200).padStart(3, '0')}-${String(id % 100).padStart(2, '0')}`,
          email: `${nome.toLowerCase().replace(/\s+/g, '.')}.${id}@fgs.com`,
          cargo: cargos[id % cargos.length],
          setor: setores[id % setores.length],
          dataAdmissao: new Date(2020 + (id % 5), id % 12, (id % 28) + 1).toISOString(),
          dataNascimento: new Date(1980 + (id % 30), id % 12, (id % 28) + 1).toISOString(),
          status: ['ATIVO', 'ATIVO', 'ATIVO', 'FERIAS', 'AFASTADO'][id % 5] as any,
        };
      });

      // Aplicar filtros
      let colaboradoresFiltrados = mockColaboradores;

      if (filtros.busca) {
        colaboradoresFiltrados = colaboradoresFiltrados.filter(c =>
          c.nome?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          c.cpf?.includes(filtros.busca) ||
          c.email?.toLowerCase().includes(filtros.busca.toLowerCase())
        );
      }

      if (filtros.cargo) {
        colaboradoresFiltrados = colaboradoresFiltrados.filter(c => c.cargo === filtros.cargo);
      }

      if (filtros.setor) {
        colaboradoresFiltrados = colaboradoresFiltrados.filter(c => c.setor === filtros.setor);
      }

      if (filtros.status) {
        colaboradoresFiltrados = colaboradoresFiltrados.filter(c => c.status === filtros.status);
      }

      // Paginação
      const inicio = pagina * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const colaboradoresPaginados = colaboradoresFiltrados.slice(inicio, fim);

      setColaboradores(colaboradoresPaginados);
      setTotalColaboradores(colaboradoresFiltrados.length);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      setColaboradores([]);
      setTotalColaboradores(0);
    } finally {
      setLoading(false);
    }
  }, [pagina, itensPorPagina, filtros]);

  // Carregar lista de colaboradores quando mudar visualização ou filtros
  useEffect(() => {
    if (visualizacao === 'lista') {
      carregarColaboradores();
    }
  }, [visualizacao, carregarColaboradores]);

  const handleSelecionarColaborador = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador);
    setVisualizacao('prontuario');
    carregarProntuario(colaborador.id);
  };

  const handleVoltarParaLista = () => {
    setVisualizacao('lista');
    setColaboradorSelecionado(null);
    setProntuario(null);
    setTabAtual(0);
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      cargo: '',
      setor: '',
      status: '',
      dataAdmissaoInicio: '',
      dataAdmissaoFim: '',
      dataNascimentoInicio: '',
      dataNascimentoFim: '',
    });
    setPagina(0);
  };

  // Funções do prontuário
  const carregarProntuario = async (colaboradorId: string) => {
    setLoading(true);
    try {
      const data = await prontuarioService.buscarProntuario(colaboradorId);
      setProntuario(data);
    } catch (error) {
      console.error('Erro ao carregar prontuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prontuario && tabAtual === 2) carregarExames();
    if (prontuario && tabAtual === 5) carregarTreinamentos();
  }, [tabAtual, paginaExames, itensPorPaginaExames, filtroExames, buscaExames, 
      paginaTreinamentos, itensPorPaginaTreinamentos, filtroTreinamentos, buscaTreinamentos]);

  const carregarExames = async () => {
    if (!prontuario) return;
    
    setLoading(true);
    try {
      const result = await prontuarioService.buscarExames(
        prontuario.id,
        paginaExames,
        itensPorPaginaExames,
        filtroExames,
        buscaExames
      );
      setExames(result.dados);
      setTotalExames(result.total);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarTreinamentos = async () => {
    if (!prontuario) return;
    
    setLoading(true);
    try {
      const result = await prontuarioService.buscarTreinamentos(
        prontuario.id,
        paginaTreinamentos,
        itensPorPaginaTreinamentos,
        filtroTreinamentos,
        buscaTreinamentos
      );
      setTreinamentos(result.dados);
      setTotalTreinamentos(result.total);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarExame = async (exame: Partial<ExameMedico>) => {
    if (!prontuario) return;
    
    try {
      if (exame.id) {
        await prontuarioService.atualizarExame(exame.id, exame);
      } else {
        await prontuarioService.criarExame(prontuario.id, exame);
      }
      setDialogExameAberto(false);
      setExameAtual({});
      carregarExames();
    } catch (error) {
      console.error('Erro ao salvar exame:', error);
      alert('Erro ao salvar exame');
    }
  };

  const handleSalvarTreinamento = async (treinamento: Partial<Treinamento>) => {
    if (!prontuario) return;
    
    try {
      // Validar campos obrigatórios
      if (!treinamento.titulo || !treinamento.dataInicio || !treinamento.dataFim) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }

      if (treinamento.id) {
        // Atualizar treinamento existente
        await prontuarioService.atualizarTreinamento(treinamento.id, treinamento);
      } else {
        // Criar novo treinamento
        await prontuarioService.criarTreinamento(prontuario.id, treinamento);
      }
      
      setDialogTreinamentoAberto(false);
      setTreinamentoAtual({});
      await carregarTreinamentos();
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
      alert('Erro ao salvar treinamento');
    }
  };

  const handleEditarExame = (exame: ExameMedico) => {
    setExameAtual(exame);
    setDialogExameAberto(true);
  };

  const handleEditarTreinamento = (treinamento: Treinamento) => {
    setTreinamentoAtual(treinamento);
    setDialogTreinamentoAberto(true);
  };

  const handleExcluirExame = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este exame?')) {
      try {
        await prontuarioService.excluirExame(id);
        carregarExames();
      } catch (error) {
        console.error('Erro ao excluir exame:', error);
      }
    }
  };

  const handleExcluirTreinamento = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este treinamento?')) {
      try {
        await prontuarioService.excluirTreinamento(id);
        carregarTreinamentos();
      } catch (error) {
        console.error('Erro ao excluir treinamento:', error);
      }
    }
  };

  // Handlers para Atestados
  const carregarAtestados = () => {
    if (prontuario) {
      setAtestados(prontuario.atestados || []);
    }
  };

  const handleSalvarAtestado = async (atestado: Partial<AtestadoMedico>) => {
    try {
      if (atestado.id) {
        // Editar atestado existente
        const atestadosAtualizados = atestados.map(a => 
          a.id === atestado.id ? { ...a, ...atestado } as AtestadoMedico : a
        );
        setAtestados(atestadosAtualizados);
      } else {
        // Adicionar novo atestado
        const novoAtestado: AtestadoMedico = {
          ...atestado,
          id: Date.now().toString(),
          colaboradorId: colaboradorSelecionado?.id || '',
        } as AtestadoMedico;
        setAtestados([...atestados, novoAtestado]);
      }
      setDialogAtestadoAberto(false);
      setAtestadoAtual({});
    } catch (error) {
      console.error('Erro ao salvar atestado:', error);
      alert('Erro ao salvar atestado');
    }
  };

  const handleExcluirAtestado = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este atestado?')) {
      try {
        const atestadosFiltrados = atestados.filter(a => a.id !== id);
        setAtestados(atestadosFiltrados);
      } catch (error) {
        console.error('Erro ao excluir atestado:', error);
        alert('Erro ao excluir atestado');
      }
    }
  };

  // Handlers para Férias
  const carregarFerias = () => {
    if (prontuario) {
      setFerias(prontuario.ferias || []);
    }
  };

  const handleSalvarFerias = async (feriasData: Partial<Ferias>) => {
    try {
      if (feriasData.id) {
        // Editar férias existentes
        const feriasAtualizadas = ferias.map(f => 
          f.id === feriasData.id ? { ...f, ...feriasData } as Ferias : f
        );
        setFerias(feriasAtualizadas);
      } else {
        // Adicionar novas férias
        const novasFerias: Ferias = {
          ...feriasData,
          id: Date.now().toString(),
          colaboradorId: colaboradorSelecionado?.id || '',
          periodoAquisitivo: feriasData.periodoAquisitivo || { inicio: '', fim: '' },
        } as Ferias;
        setFerias([...ferias, novasFerias]);
      }
      setDialogFeriasAberto(false);
      setFeriasAtual({});
    } catch (error) {
      console.error('Erro ao salvar férias:', error);
      alert('Erro ao salvar férias');
    }
  };

  const handleExcluirFerias = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro de férias?')) {
      try {
        const feriasFiltradas = ferias.filter(f => f.id !== id);
        setFerias(feriasFiltradas);
      } catch (error) {
        console.error('Erro ao excluir férias:', error);
        alert('Erro ao excluir férias');
      }
    }
  };

  // Handlers para Advertências
  const carregarAdvertencias = () => {
    if (prontuario) {
      setAdvertencias(prontuario.advertencias || []);
    }
  };

  const handleSalvarAdvertencia = async (advertencia: Partial<Advertencia>) => {
    try {
      if (advertencia.id) {
        // Editar advertência existente
        const advertenciasAtualizadas = advertencias.map(a => 
          a.id === advertencia.id ? { ...a, ...advertencia } as Advertencia : a
        );
        setAdvertencias(advertenciasAtualizadas);
      } else {
        // Adicionar nova advertência
        const novaAdvertencia: Advertencia = {
          ...advertencia,
          id: Date.now().toString(),
          colaboradorId: colaboradorSelecionado?.id || '',
          tipo: advertencia.tipo || 'Verbal',
          data: advertencia.data || new Date().toISOString().split('T')[0],
          motivo: advertencia.motivo || '',
          descricao: advertencia.descricao || '',
          aplicadoPor: advertencia.aplicadoPor || '',
        } as Advertencia;
        setAdvertencias([...advertencias, novaAdvertencia]);
      }
      setDialogAdvertenciaAberto(false);
      setAdvertenciaAtual({});
    } catch (error) {
      console.error('Erro ao salvar advertência:', error);
      alert('Erro ao salvar advertência');
    }
  };

  const handleExcluirAdvertencia = async (id: string) => {
    if (window.confirm('Deseja realmente excluir esta advertência?')) {
      try {
        const advertenciasFiltradas = advertencias.filter(a => a.id !== id);
        setAdvertencias(advertenciasFiltradas);
      } catch (error) {
        console.error('Erro ao excluir advertência:', error);
        alert('Erro ao excluir advertência');
      }
    }
  };

  // Handlers para Documentos
  const carregarDocumentos = () => {
    if (prontuario) {
      setDocumentos(prontuario.documentos || []);
    }
  };

  const handleUploadDocumento = async (documento: Partial<DocumentoAnexado>, arquivo: File) => {
    console.log('Documento enviado:', documento, arquivo);
    // Simular upload
    const novoDoc: DocumentoAnexado = {
      ...documento,
      id: Date.now().toString(),
      arquivo: {
        id: Date.now().toString(),
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size,
        url: URL.createObjectURL(arquivo),
        dataUpload: new Date().toISOString(),
      },
      dataUpload: new Date().toISOString(),
      uploadPor: 'Usuário Atual',
    } as DocumentoAnexado;
    
    setDocumentos([...documentos, novoDoc]);
  };

  const handleExcluirDocumento = async (id: string) => {
    setDocumentos(documentos.filter(d => d.id !== id));
  };

  // Carregar dados quando prontuário é carregado
  React.useEffect(() => {
    if (prontuario) {
      carregarAtestados();
      carregarFerias();
      carregarAdvertencias();
      carregarDocumentos();
    }
  }, [prontuario]);

  // Colunas da tabela de colaboradores
  const colunasColaboradores: Coluna<Colaborador>[] = [
    {
      id: 'nome',
      label: 'Colaborador',
      format: (_valor: any, col: Colaborador) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#a2122a' }}>
            {col?.nome?.charAt(0) || 'C'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {col?.nome || 'Nome não informado'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {col?.email || 'Email não informado'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'cpf',
      label: 'CPF',
      format: (_valor: any, col: Colaborador) => (
        <Typography variant="body2">{col?.cpf || '-'}</Typography>
      ),
    },
    {
      id: 'cargo',
      label: 'Cargo',
      format: (_valor: any, col: Colaborador) => (
        <Typography variant="body2">{col?.cargo || '-'}</Typography>
      ),
    },
    {
      id: 'setor',
      label: 'Setor',
      format: (_valor: any, col: Colaborador) => (
        <Typography variant="body2">{col?.setor || '-'}</Typography>
      ),
    },
    {
      id: 'dataAdmissao',
      label: 'Data de Admissão',
      format: (_valor: any, col: Colaborador) => (
        <Typography variant="body2">
          {col?.dataAdmissao ? formatarData(col.dataAdmissao) : '-'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      format: (_valor: any, col: Colaborador) => {
        const statusMap = {
          ATIVO: { label: 'Ativo', color: 'success' as const },
          INATIVO: { label: 'Inativo', color: 'error' as const },
          FERIAS: { label: 'Férias', color: 'info' as const },
          AFASTADO: { label: 'Afastado', color: 'warning' as const },
        };
        const status = col?.status ? statusMap[col.status] : { label: 'N/A', color: 'default' as const };
        return <Chip label={status.label} color={status.color} size="small" />;
      },
    },
    {
      id: 'acoes',
      label: 'Ações',
      format: (_valor: any, col: Colaborador) => (
        <GradientButton
          size="small"
          onClick={() => handleSelecionarColaborador(col)}
          startIcon={<PersonIcon />}
          disabled={!col}
        >
          Ver Prontuário
        </GradientButton>
      ),
    },
  ];

  // Colunas da tabela de exames
  const colunasExames: Coluna<ExameMedico>[] = [
    {
      id: 'tipo',
      label: 'Tipo de Exame',
      format: (_valor: any, exame: ExameMedico) => exame.tipo,
    },
    {
      id: 'dataRealizacao',
      label: 'Data de Realização',
      format: (_valor: any, exame: ExameMedico) => formatarData(exame.dataRealizacao),
    },
    {
      id: 'dataValidade',
      label: 'Validade',
      format: (_valor: any, exame: ExameMedico) => formatarData(exame.dataValidade),
    },
    {
      id: 'status',
      label: 'Status',
      format: (_valor: any, exame: ExameMedico) => <StatusChip status={exame.status} />,
    },
    {
      id: 'acoes',
      label: 'Ações',
      format: (_valor: any, exame: ExameMedico) => (
        <Box display="flex" gap={1}>
          <ActionButton
            action="edit"
            onClick={() => handleEditarExame(exame)}
          />
          <ActionButton
            action="delete"
            onClick={() => handleExcluirExame(exame.id)}
          />
        </Box>
      ),
    },
  ];

  // Colunas da tabela de treinamentos
  const colunasTreinamentos: Coluna<Treinamento>[] = [
    {
      id: 'nome',
      label: 'Treinamento',
      format: (_valor: any, t: Treinamento) => t.nome,
    },
    {
      id: 'dataRealizacao',
      label: 'Data de Realização',
      format: (_valor: any, t: Treinamento) => formatarData(t.dataRealizacao),
    },
    {
      id: 'dataValidade',
      label: 'Validade',
      format: (_valor: any, t: Treinamento) => t.dataValidade ? formatarData(t.dataValidade) : 'Sem validade',
    },
    {
      id: 'cargaHoraria',
      label: 'Carga Horária',
      format: (_valor: any, t: Treinamento) => `${t.cargaHoraria}h`,
    },
    {
      id: 'status',
      label: 'Status',
      format: (_valor: any, t: Treinamento) => <StatusChip status={t.status} />,
    },
    {
      id: 'acoes',
      label: 'Ações',
      format: (_valor: any, t: Treinamento) => (
        <Box display="flex" gap={1}>
          <ActionButton
            action="edit"
            onClick={() => handleEditarTreinamento(t)}
          />
          <ActionButton
            action="delete"
            onClick={() => handleExcluirTreinamento(t.id)}
          />
        </Box>
      ),
    },
  ];

  // VISUALIZAÇÃO: LISTA DE COLABORADORES
  if (visualizacao === 'lista') {
    return (
      <Box>
        <PageHeader
          title="Prontuário do Colaborador"
          subtitle="Selecione um colaborador para visualizar o prontuário completo"
          breadcrumbs={[
            { label: 'Início', path: '/' },
            { label: 'Prontuário' },
          ]}
        />

        {/* Filtros */}
        <AnimatedCard delay={0.1}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Buscar Colaboradores
              </Typography>
              <Button
                startIcon={<FilterListIcon />}
                onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
                variant="outlined"
              >
                {filtrosVisiveis ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </Box>

            {/* Busca Rápida */}
            <TextField
              fullWidth
              placeholder="Buscar por nome, CPF ou email..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Filtros Avançados */}
            <Collapse in={filtrosVisiveis}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Cargo"
                    value={filtros.cargo}
                    onChange={(e) => setFiltros({ ...filtros, cargo: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Analista de RH">Analista de RH</MenuItem>
                    <MenuItem value="Assistente Administrativo">Assistente Administrativo</MenuItem>
                    <MenuItem value="Coordenador de Produção">Coordenador de Produção</MenuItem>
                    <MenuItem value="Gerente de Operações">Gerente de Operações</MenuItem>
                    <MenuItem value="Diretor Comercial">Diretor Comercial</MenuItem>
                    <MenuItem value="Analista Financeiro">Analista Financeiro</MenuItem>
                    <MenuItem value="Assistente de TI">Assistente de TI</MenuItem>
                    <MenuItem value="Coordenador de Vendas">Coordenador de Vendas</MenuItem>
                    <MenuItem value="Gerente de Projetos">Gerente de Projetos</MenuItem>
                    <MenuItem value="Analista de Marketing">Analista de Marketing</MenuItem>
                    <MenuItem value="Supervisor de Logística">Supervisor de Logística</MenuItem>
                    <MenuItem value="Técnico de Manutenção">Técnico de Manutenção</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Setor"
                    value={filtros.setor}
                    onChange={(e) => setFiltros({ ...filtros, setor: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Recursos Humanos">Recursos Humanos</MenuItem>
                    <MenuItem value="Administrativo">Administrativo</MenuItem>
                    <MenuItem value="Operacional">Operacional</MenuItem>
                    <MenuItem value="Comercial">Comercial</MenuItem>
                    <MenuItem value="Financeiro">Financeiro</MenuItem>
                    <MenuItem value="TI">TI</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Logística">Logística</MenuItem>
                    <MenuItem value="Produção">Produção</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={filtros.status}
                    onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="ATIVO">Ativo</MenuItem>
                    <MenuItem value="INATIVO">Inativo</MenuItem>
                    <MenuItem value="FERIAS">Férias</MenuItem>
                    <MenuItem value="AFASTADO">Afastado</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" gap={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={limparFiltros}
                    >
                      Limpar
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Admissão de"
                    value={filtros.dataAdmissaoInicio}
                    onChange={(e) => setFiltros({ ...filtros, dataAdmissaoInicio: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Admissão até"
                    value={filtros.dataAdmissaoFim}
                    onChange={(e) => setFiltros({ ...filtros, dataAdmissaoFim: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Nascimento de"
                    value={filtros.dataNascimentoInicio}
                    onChange={(e) => setFiltros({ ...filtros, dataNascimentoInicio: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Nascimento até"
                    value={filtros.dataNascimentoFim}
                    onChange={(e) => setFiltros({ ...filtros, dataNascimentoFim: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </AnimatedCard>

        {/* Tabela de Colaboradores */}
        <AnimatedCard delay={0.2} sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                {totalColaboradores} colaborador{totalColaboradores !== 1 ? 'es' : ''} encontrado{totalColaboradores !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {loading ? (
              <SkeletonTable rows={10} columns={7} />
            ) : totalColaboradores === 0 ? (
              <Box textAlign="center" py={8}>
                <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum colaborador encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Tente ajustar os filtros ou realizar uma nova busca
                </Typography>
                <Button variant="outlined" onClick={limparFiltros}>
                  Limpar Filtros
                </Button>
              </Box>
            ) : (
              <TabelaPaginada
                dados={colaboradores}
                colunas={colunasColaboradores}
                total={totalColaboradores}
                pagina={pagina}
                itensPorPagina={itensPorPagina}
                onMudarPagina={(novaPagina) => setPagina(novaPagina)}
                onMudarItensPorPagina={(novosItens) => {
                  setItensPorPagina(novosItens);
                  setPagina(0);
                }}
              />
            )}
          </CardContent>
        </AnimatedCard>
      </Box>
    );
  }

  // VISUALIZAÇÃO: PRONTUÁRIO DO COLABORADOR SELECIONADO
  return (
    <Box>
      {/* Header com info do colaborador e botão voltar */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleVoltarParaLista}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
              variant="outlined"
            >
              Voltar
            </Button>

            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'white',
                color: '#a2122a',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {colaboradorSelecionado?.nome?.charAt(0) || 'C'}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={700}>
                {colaboradorSelecionado?.nome}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {colaboradorSelecionado?.cargo} • {colaboradorSelecionado?.setor}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                CPF: {colaboradorSelecionado?.cpf} • Email: {colaboradorSelecionado?.email}
              </Typography>
            </Box>
          </Box>

          <Box textAlign="right">
            <Chip
              label={
                colaboradorSelecionado?.status === 'ATIVO' ? 'Ativo' :
                colaboradorSelecionado?.status === 'FERIAS' ? 'Férias' :
                colaboradorSelecionado?.status === 'AFASTADO' ? 'Afastado' : 'Inativo'
              }
              sx={{
                bgcolor: 'white',
                color: '#a2122a',
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.9 }}>
              Admitido em {formatarData(colaboradorSelecionado?.dataAdmissao || '')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs do Prontuário */}
      {loading && !prontuario ? (
        <SkeletonTable rows={10} columns={4} />
      ) : (
        <AnimatedCard>
          <Card>
            <Tabs
              value={tabAtual}
              onChange={(e, newValue) => setTabAtual(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Dados Pessoais" />
              <Tab label="Dados Contratuais" />
              <Tab label="Exames Médicos" />
              <Tab label="Atestados" />
              <Tab label="Férias" />
              <Tab label="Treinamentos" />
              <Tab label="Advertências" />
              <Tab label="Anexos" />
            </Tabs>

            {/* Tab Panel 0: Dados Pessoais */}
            <TabPanel value={tabAtual} index={0}>
              <DadosPessoaisForm
                dados={prontuario?.dadosPessoais}
                onChange={(dados) => {
                  if (prontuario) {
                    setProntuario({ ...prontuario, dadosPessoais: dados });
                  }
                }}
              />
              <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button variant="outlined">Cancelar</Button>
                <GradientButton startIcon={<AddIcon />}>
                  Salvar Alterações
                </GradientButton>
              </Box>
            </TabPanel>

            {/* Tab Panel 1: Dados Contratuais */}
            <TabPanel value={tabAtual} index={1}>
              <DadosContratuaisForm
                dados={prontuario?.dadosContratuais}
                onChange={(dados) => {
                  if (prontuario) {
                    setProntuario({ ...prontuario, dadosContratuais: dados });
                  }
                }}
              />
              <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button variant="outlined">Cancelar</Button>
                <GradientButton startIcon={<AddIcon />}>
                  Salvar Alterações
                </GradientButton>
              </Box>
            </TabPanel>

            {/* Tab Panel 2: Exames Médicos */}
            <TabPanel value={tabAtual} index={2}>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Exames Médicos
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setExameAtual({});
                      setDialogExameAberto(true);
                    }}
                  >
                    Novo Exame
                  </GradientButton>
                </Box>

                <FiltrosTabela
                  busca={buscaExames}
                  onBuscaChange={setBuscaExames}
                  status={filtroExames}
                  onStatusChange={setFiltroExames}
                  onLimpar={() => {
                    setBuscaExames('');
                    setFiltroExames([]);
                  }}
                />

                <TabelaPaginada
                  dados={exames}
                  colunas={colunasExames}
                  total={totalExames}
                  pagina={paginaExames}
                  itensPorPagina={itensPorPaginaExames}
                  onMudarPagina={setPaginaExames}
                  onMudarItensPorPagina={setItensPorPaginaExames}
                />
              </Box>
            </TabPanel>

            {/* Tab Panel 3: Atestados */}
            <TabPanel value={tabAtual} index={3}>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Atestados Médicos
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAtestadoAtual({});
                      setDialogAtestadoAberto(true);
                    }}
                  >
                    Novo Atestado
                  </GradientButton>
                </Box>

                {atestados.length === 0 ? (
                  <Alert severity="info">Nenhum atestado médico registrado</Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data Emissão</TableCell>
                          <TableCell>Período de Afastamento</TableCell>
                          <TableCell>Dias</TableCell>
                          <TableCell>Médico</TableCell>
                          <TableCell>CID</TableCell>
                          <TableCell align="right">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {atestados.map((atestado) => (
                          <TableRow key={atestado.id} hover>
                            <TableCell>{formatarData(atestado.dataEmissao)}</TableCell>
                            <TableCell>
                              {formatarData(atestado.dataInicio)} até {formatarData(atestado.dataFim)}
                            </TableCell>
                            <TableCell>{atestado.diasAfastamento} dias</TableCell>
                            <TableCell>{atestado.medico}</TableCell>
                            <TableCell>{atestado.cid || '-'}</TableCell>
                            <TableCell align="right">
                              <ActionButton
                                action="edit"
                                onClick={() => {
                                  setAtestadoAtual(atestado);
                                  setDialogAtestadoAberto(true);
                                }}
                              />
                              <ActionButton
                                action="delete"
                                onClick={() => handleExcluirAtestado(atestado.id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            {/* Tab Panel 4: Férias */}
            <TabPanel value={tabAtual} index={4}>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Gerenciamento de Férias
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setFeriasAtual({});
                      setDialogFeriasAberto(true);
                    }}
                  >
                    Novo Período de Férias
                  </GradientButton>
                </Box>

                {ferias.length === 0 ? (
                  <Alert severity="info">Nenhum registro de férias encontrado</Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Período Aquisitivo</TableCell>
                          <TableCell>Período de Férias</TableCell>
                          <TableCell>Tipo</TableCell>
                          <TableCell>Dias Direito</TableCell>
                          <TableCell>Dias Gozados</TableCell>
                          <TableCell>Dias Restantes</TableCell>
                          <TableCell align="right">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ferias.map((feriasItem) => (
                          <TableRow key={feriasItem.id} hover>
                            <TableCell>
                              {formatarData(feriasItem.periodoAquisitivo.inicio)} até{' '}
                              {formatarData(feriasItem.periodoAquisitivo.fim)}
                            </TableCell>
                            <TableCell>
                              {feriasItem.dataInicio && feriasItem.dataFim
                                ? `${formatarData(feriasItem.dataInicio)} até ${formatarData(
                                    feriasItem.dataFim
                                  )}`
                                : 'Não agendado'}
                            </TableCell>
                            <TableCell>
                              <Chip label={feriasItem.tipo} size="small" color="primary" />
                            </TableCell>
                            <TableCell>{feriasItem.diasDireito}</TableCell>
                            <TableCell>{feriasItem.diasGozados}</TableCell>
                            <TableCell>
                              <Typography
                                fontWeight={600}
                                color={
                                  feriasItem.diasRestantes > 0 ? 'success.main' : 'text.secondary'
                                }
                              >
                                {feriasItem.diasRestantes}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <ActionButton
                                action="edit"
                                onClick={() => {
                                  setFeriasAtual(feriasItem);
                                  setDialogFeriasAberto(true);
                                }}
                              />
                              <ActionButton
                                action="delete"
                                onClick={() => handleExcluirFerias(feriasItem.id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            {/* Tab Panel 5: Treinamentos */}
            <TabPanel value={tabAtual} index={5}>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Treinamentos
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setTreinamentoAtual({});
                      setDialogTreinamentoAberto(true);
                    }}
                  >
                    Novo Treinamento
                  </GradientButton>
                </Box>

                <FiltrosTabela
                  busca={buscaTreinamentos}
                  onBuscaChange={setBuscaTreinamentos}
                  status={filtroTreinamentos}
                  onStatusChange={setFiltroTreinamentos}
                  onLimpar={() => {
                    setBuscaTreinamentos('');
                    setFiltroTreinamentos([]);
                  }}
                />

                <TabelaPaginada
                  dados={treinamentos}
                  colunas={colunasTreinamentos}
                  total={totalTreinamentos}
                  pagina={paginaTreinamentos}
                  itensPorPagina={itensPorPaginaTreinamentos}
                  onMudarPagina={setPaginaTreinamentos}
                  onMudarItensPorPagina={setItensPorPaginaTreinamentos}
                />
              </Box>
            </TabPanel>

            {/* Tab Panel 6: Advertências */}
            <TabPanel value={tabAtual} index={6}>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Advertências
                  </Typography>
                  <GradientButton
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAdvertenciaAtual({});
                      setDialogAdvertenciaAberto(true);
                    }}
                  >
                    Nova Advertência
                  </GradientButton>
                </Box>

                {advertencias.length === 0 ? (
                  <Alert severity="success">Nenhuma advertência registrada</Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Tipo</TableCell>
                          <TableCell>Motivo</TableCell>
                          <TableCell>Aplicado Por</TableCell>
                          <TableCell align="right">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {advertencias.map((advertencia) => (
                          <TableRow key={advertencia.id} hover>
                            <TableCell>{formatarData(advertencia.data)}</TableCell>
                            <TableCell>
                              <Chip
                                label={advertencia.tipo}
                                size="small"
                                color={
                                  advertencia.tipo === 'Verbal'
                                    ? 'warning'
                                    : advertencia.tipo === 'Escrita'
                                    ? 'error'
                                    : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell>{advertencia.motivo}</TableCell>
                            <TableCell>{advertencia.aplicadoPor}</TableCell>
                            <TableCell align="right">
                              <ActionButton
                                action="view"
                                onClick={() => {
                                  setAdvertenciaAtual(advertencia);
                                  setDialogAdvertenciaAberto(true);
                                }}
                              />
                              <ActionButton
                                action="delete"
                                onClick={() => handleExcluirAdvertencia(advertencia.id)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </TabPanel>

            {/* Tab Panel 7: Anexos */}
            <TabPanel value={tabAtual} index={7}>
              <AnexosDocumentos
                colaboradorId={colaboradorSelecionado?.id || ''}
                documentos={documentos}
                onUpload={handleUploadDocumento}
                onDelete={handleExcluirDocumento}
              />
            </TabPanel>
          </Card>
        </AnimatedCard>
      )}

      {/* Dialog Exame */}
      <Dialog
        open={dialogExameAberto}
        onClose={() => setDialogExameAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {exameAtual.id ? 'Editar Exame' : 'Novo Exame'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <ExameMedicoForm
              dados={exameAtual}
              onChange={(campo, valor) => {
                setExameAtual({ ...exameAtual, [campo]: valor });
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogExameAberto(false);
            setExameAtual({});
          }}>
            Cancelar
          </Button>
          <GradientButton onClick={() => handleSalvarExame(exameAtual)}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Treinamento */}
      <Dialog
        open={dialogTreinamentoAberto}
        onClose={() => setDialogTreinamentoAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {treinamentoAtual.id ? 'Editar Treinamento' : 'Novo Treinamento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TreinamentoForm
              dados={treinamentoAtual}
              onChange={(campo, valor) => {
                setTreinamentoAtual({ ...treinamentoAtual, [campo]: valor });
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogTreinamentoAberto(false);
            setTreinamentoAtual({});
          }}>
            Cancelar
          </Button>
          <GradientButton onClick={() => handleSalvarTreinamento(treinamentoAtual)}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Atestado */}
      <Dialog
        open={dialogAtestadoAberto}
        onClose={() => setDialogAtestadoAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {atestadoAtual.id ? 'Editar Atestado' : 'Novo Atestado Médico'}
        </DialogTitle>
        <DialogContent>
          <AtestadoMedicoForm
            dados={atestadoAtual}
            onChange={setAtestadoAtual}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAtestadoAberto(false)}>
            Cancelar
          </Button>
          <GradientButton onClick={() => handleSalvarAtestado(atestadoAtual)}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Férias */}
      <Dialog
        open={dialogFeriasAberto}
        onClose={() => setDialogFeriasAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {feriasAtual.id ? 'Editar Férias' : 'Novo Período de Férias'}
        </DialogTitle>
        <DialogContent>
          <FeriasForm
            dados={feriasAtual}
            onChange={setFeriasAtual}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogFeriasAberto(false)}>
            Cancelar
          </Button>
          <GradientButton onClick={() => handleSalvarFerias(feriasAtual)}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Advertência */}
      <Dialog
        open={dialogAdvertenciaAberto}
        onClose={() => setDialogAdvertenciaAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {advertenciaAtual.id ? 'Visualizar Advertência' : 'Nova Advertência'}
        </DialogTitle>
        <DialogContent>
          <AdvertenciaForm
            dados={advertenciaAtual}
            onChange={setAdvertenciaAtual}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAdvertenciaAberto(false)}>
            {advertenciaAtual.id ? 'Fechar' : 'Cancelar'}
          </Button>
          {!advertenciaAtual.id && (
            <GradientButton onClick={() => handleSalvarAdvertencia(advertenciaAtual)}>
              Salvar
            </GradientButton>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
