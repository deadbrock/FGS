import React from 'react';
import { IconButton, Tooltip, alpha } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RefreshIcon from '@mui/icons-material/Refresh';

export type ActionType =
  | 'edit'
  | 'delete'
  | 'view'
  | 'save'
  | 'add'
  | 'download'
  | 'upload'
  | 'refresh';

interface ActionButtonProps {
  action: ActionType;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}

const actionConfig: Record<
  ActionType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  edit: { icon: <EditIcon />, color: '#1976d2', label: 'Editar' },
  delete: { icon: <DeleteIcon />, color: '#d32f2f', label: 'Excluir' },
  view: { icon: <VisibilityIcon />, color: '#388e3c', label: 'Visualizar' },
  save: { icon: <SaveIcon />, color: '#388e3c', label: 'Salvar' },
  add: { icon: <AddIcon />, color: '#1976d2', label: 'Adicionar' },
  download: { icon: <DownloadIcon />, color: '#f57c00', label: 'Download' },
  upload: { icon: <UploadIcon />, color: '#1976d2', label: 'Upload' },
  refresh: { icon: <RefreshIcon />, color: '#757575', label: 'Atualizar' },
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onClick,
  tooltip,
  disabled = false,
}) => {
  const config = actionConfig[action];
  const label = tooltip || config.label;

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          size="small"
          sx={{
            color: config.color,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(config.color, 0.1),
              transform: 'scale(1.1)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {config.icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

