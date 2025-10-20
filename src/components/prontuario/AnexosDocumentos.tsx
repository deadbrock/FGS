import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DocumentoAnexado, CategoriaDocumento } from '../../types/prontuario';
import { GradientButton } from '../GradientButton';
import { formatarData } from '../../utils/statusUtils';

interface AnexosDocumentosProps {
  colaboradorId: string;
  documentos: DocumentoAnexado[];
  onUpload: (documento: Partial<DocumentoAnexado>, arquivo: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AnexosDocumentos: React.FC<AnexosDocumentosProps> = ({
  colaboradorId,
  documentos,
  onUpload,
  onDelete,
}) => {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaDocumento>(CategoriaDocumento.OUTROS);
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const categorias = Object.values(CategoriaDocumento);

  const formatarTamanho = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      alert('Selecione um arquivo para enviar');
      return;
    }

    setUploading(true);
    try {
      await onUpload(
        {
          colaboradorId,
          categoria,
          descricao,
          observacoes,
        },
        arquivo
      );

      // Limpar formulário
      setCategoria(CategoriaDocumento.OUTROS);
      setDescricao('');
      setObservacoes('');
      setArquivo(null);
      setDialogAberto(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este documento?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Erro ao excluir documento:', error);
        alert('Erro ao excluir documento');
      }
    }
  };

  const getCategoriaIcon = (categoria: CategoriaDocumento) => {
    return <InsertDriveFileIcon />;
  };

  const getCategoriaColor = (categoria: CategoriaDocumento): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colorMap: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      [CategoriaDocumento.RG]: 'primary',
      [CategoriaDocumento.CPF]: 'primary',
      [CategoriaDocumento.CNH]: 'info',
      [CategoriaDocumento.CONTRATO_TRABALHO]: 'success',
      [CategoriaDocumento.ATESTADO_MEDICO]: 'error',
      [CategoriaDocumento.EXAME_ADMISSIONAL]: 'warning',
      [CategoriaDocumento.CERTIFICADO_TREINAMENTO]: 'success',
      [CategoriaDocumento.DIPLOMA]: 'secondary',
    };
    return colorMap[categoria] || 'default';
  };

  // Agrupar documentos por categoria
  const documentosPorCategoria = documentos.reduce((acc, doc) => {
    const cat = doc.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<CategoriaDocumento, DocumentoAnexado[]>);

  return (
    <Box>
      {/* Header com botão de upload */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Documentos Anexados
        </Typography>
        <GradientButton
          startIcon={<UploadFileIcon />}
          onClick={() => setDialogAberto(true)}
        >
          Novo Documento
        </GradientButton>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary">
                {documentos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Documentos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {Object.keys(documentosPorCategoria).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categorias
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {formatarTamanho(
                  documentos.reduce((sum, doc) => sum + doc.arquivo.tamanho, 0)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tamanho Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de documentos */}
      {documentos.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum documento anexado ainda. Clique em "Novo Documento" para adicionar.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Nome do Arquivo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data de Upload</TableCell>
                <TableCell>Tamanho</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentos.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Chip
                      icon={getCategoriaIcon(doc.categoria)}
                      label={doc.categoria}
                      color={getCategoriaColor(doc.categoria)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <InsertDriveFileIcon color="action" />
                      <Typography variant="body2">{doc.arquivo.nome}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {doc.descricao || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatarData(doc.dataUpload)}</TableCell>
                  <TableCell>{formatarTamanho(doc.arquivo.tamanho)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      title="Visualizar"
                      onClick={() => window.open(doc.arquivo.url, '_blank')}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      title="Download"
                      onClick={() => window.open(doc.arquivo.url, '_blank')}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      title="Excluir"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de Upload */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Anexar Novo Documento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Categoria do Documento"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaDocumento)}
                required
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: RG atualizado, Atestado médico de 15/01/2024"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                multiline
                rows={2}
                placeholder="Informações adicionais sobre o documento..."
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ height: 56 }}
              >
                {arquivo ? arquivo.name : 'Selecionar Arquivo'}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {arquivo && (
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Tamanho: {formatarTamanho(arquivo.size)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleUpload} disabled={!arquivo || uploading}>
            {uploading ? 'Enviando...' : 'Enviar Documento'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

