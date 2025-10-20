import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatarTamanhoArquivo } from '../utils/statusUtils';

interface ArquivoUpload {
  file: File;
  preview?: string;
}

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // em MB
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  label?: string;
}

// Componente de upload de arquivos
export const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 5,
  multiple = false,
  onFilesSelected,
  label = 'Selecionar Arquivo',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivos, setArquivos] = useState<ArquivoUpload[]>([]);
  const [erro, setErro] = useState<string>('');

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setErro('');

    // Validar tamanho
    const arquivosGrandes = files.filter((file) => file.size > maxSize * 1024 * 1024);
    if (arquivosGrandes.length > 0) {
      setErro(`Arquivo(s) muito grande(s). Tamanho máximo: ${maxSize}MB`);
      return;
    }

    const novosArquivos: ArquivoUpload[] = files.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    if (multiple) {
      setArquivos([...arquivos, ...novosArquivos]);
      onFilesSelected([...arquivos.map((a) => a.file), ...files]);
    } else {
      setArquivos(novosArquivos);
      onFilesSelected(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const novosArquivos = arquivos.filter((_, i) => i !== index);
    setArquivos(novosArquivos);
    onFilesSelected(novosArquivos.map((a) => a.file));
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
        fullWidth
      >
        {label}
      </Button>

      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        Formatos aceitos: {accept} | Tamanho máximo: {maxSize}MB
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {erro}
        </Alert>
      )}

      {arquivos.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List>
            {arquivos.map((arquivo, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={arquivo.file.name}
                  secondary={formatarTamanhoArquivo(arquivo.file.size)}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

