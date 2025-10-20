import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { validarCSV, parseCSV, gerarTemplateCSV } from '../../utils/treinamentosUtils';
import { LinhaCSV, ErroImportacao } from '../../types/treinamentos';

interface ImportacaoCSVProps {
  onImportar: (dados: LinhaCSV[]) => Promise<void>;
}

export const ImportacaoCSV: React.FC<ImportacaoCSVProps> = ({ onImportar }) => {
  const [etapa, setEtapa] = useState(0);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dados, setDados] = useState<LinhaCSV[]>([]);
  const [erros, setErros] = useState<ErroImportacao[]>([]);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState('');

  const etapas = ['Selecionar Arquivo', 'Validar Dados', 'Importar'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErro('');
    const validacao = validarCSV(file);
    
    if (!validacao.valido) {
      setErro(validacao.erro || 'Arquivo inválido');
      return;
    }

    setArquivo(file);
    lerArquivo(file);
  };

  const lerArquivo = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const conteudo = e.target?.result as string;
        const dadosCSV = parseCSV(conteudo);
        
        setDados(dadosCSV);
        setEtapa(1);
      } catch (error: any) {
        setErro(error.message || 'Erro ao ler arquivo');
      }
    };
    
    reader.readAsText(file);
  };

  const validarDados = () => {
    const errosValidacao: ErroImportacao[] = [];
    
    dados.forEach((linha, index) => {
      if (!linha.cpf || !linha.colaborador || !linha.tipoTreinamento || !linha.dataRealizacao) {
        errosValidacao.push({
          linha: index + 2, // +2 porque linha 1 é cabeçalho e index começa em 0
          colaborador: linha.colaborador || 'N/A',
          erro: 'Campos obrigatórios faltando (CPF, Colaborador, Tipo, Data)',
        });
      }
      
      // Validar formato de CPF
      if (linha.cpf && !linha.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
        errosValidacao.push({
          linha: index + 2,
          colaborador: linha.colaborador,
          erro: 'CPF em formato inválido. Use: 000.000.000-00',
        });
      }
      
      // Validar formato de data
      if (linha.dataRealizacao && !linha.dataRealizacao.match(/^\d{4}-\d{2}-\d{2}$/)) {
        errosValidacao.push({
          linha: index + 2,
          colaborador: linha.colaborador,
          erro: 'Data em formato inválido. Use: AAAA-MM-DD',
        });
      }
    });
    
    setErros(errosValidacao);
    
    if (errosValidacao.length === 0) {
      setEtapa(2);
    }
  };

  const handleImportar = async () => {
    setProcessando(true);
    setProgresso(0);

    try {
      // Simula progresso
      const intervalo = setInterval(() => {
        setProgresso((prev) => Math.min(prev + 10, 90));
      }, 200);

      await onImportar(dados);
      
      clearInterval(intervalo);
      setProgresso(100);
      
      // Resetar após sucesso
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (error: any) {
      setErro(error.message || 'Erro ao importar dados');
    } finally {
      setProcessando(false);
    }
  };

  const handleReset = () => {
    setEtapa(0);
    setArquivo(null);
    setDados([]);
    setErros([]);
    setProgresso(0);
    setErro('');
  };

  return (
    <Box>
      <Stepper activeStep={etapa} sx={{ mb: 4 }}>
        {etapas.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Etapa 0: Selecionar Arquivo */}
      {etapa === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Formato do CSV:</strong>
            </Typography>
            <Typography variant="caption">
              cpf, colaborador, tipoTreinamento, dataRealizacao, dataValidade, instrutor, instituicao, nota, observacoes
            </Typography>
          </Alert>

          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={gerarTemplateCSV}
            >
              Baixar Template CSV
            </Button>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Selecionar Arquivo CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileSelect}
              />
            </Button>
          </Box>

          {arquivo && (
            <Alert severity="success">
              Arquivo selecionado: <strong>{arquivo.name}</strong>
            </Alert>
          )}

          {erro && <Alert severity="error">{erro}</Alert>}
        </Box>
      )}

      {/* Etapa 1: Validar Dados */}
      {etapa === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Dados Encontrados: {dados.length} registros
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Linha</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Colaborador</TableCell>
                  <TableCell>Treinamento</TableCell>
                  <TableCell>Data Realização</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.slice(0, 10).map((linha, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 2}</TableCell>
                    <TableCell>{linha.cpf}</TableCell>
                    <TableCell>{linha.colaborador}</TableCell>
                    <TableCell>{linha.tipoTreinamento}</TableCell>
                    <TableCell>{linha.dataRealizacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {dados.length > 10 && (
            <Typography variant="caption" color="text.secondary">
              Mostrando 10 de {dados.length} registros
            </Typography>
          )}

          {erros.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Foram encontrados {erros.length} erro(s):
              </Typography>
              {erros.slice(0, 5).map((erro, index) => (
                <Typography key={index} variant="caption" display="block">
                  Linha {erro.linha} ({erro.colaborador}): {erro.erro}
                </Typography>
              ))}
            </Alert>
          )}

          <Box display="flex" gap={2} mt={3}>
            <Button variant="outlined" onClick={handleReset}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={validarDados}
              disabled={dados.length === 0}
            >
              Validar e Continuar
            </Button>
          </Box>
        </Box>
      )}

      {/* Etapa 2: Importar */}
      {etapa === 2 && (
        <Box>
          {!processando && progresso < 100 && (
            <>
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                <Typography variant="subtitle2">
                  Dados validados com sucesso!
                </Typography>
                <Typography variant="body2">
                  {dados.length} registros prontos para importação
                </Typography>
              </Alert>

              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => setEtapa(1)}>
                  Voltar
                </Button>
                <Button variant="contained" onClick={handleImportar}>
                  Confirmar Importação
                </Button>
              </Box>
            </>
          )}

          {processando && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Importando dados... {progresso}%
              </Typography>
              <LinearProgress variant="determinate" value={progresso} />
            </Box>
          )}

          {progresso === 100 && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <Typography variant="subtitle2">
                Importação concluída com sucesso!
              </Typography>
              <Typography variant="body2">
                {dados.length} treinamentos foram importados
              </Typography>
            </Alert>
          )}

          {erro && <Alert severity="error">{erro}</Alert>}
        </Box>
      )}
    </Box>
  );
};

