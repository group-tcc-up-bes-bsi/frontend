import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { FileItem } from '../models/FileItem';
import { useDocumentStateStore } from '../state/DocumentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';

const Documents: React.FC = () => {
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const alterFile = useDocumentStateStore((state) => state.alter);
  const alterOption = useOptionsDashboardStore((state) => state.alter);

  const files: FileItem[] = [
    {
      id: '1',
      name: 'Documento.pdf',
      type: 'PDF',
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2023-10-20'),
      version: 'Teste',
      creator: 'Usuário 1'
    },
    {
      id: '2',
      name: 'Planilha.xlsx',
      type: 'Excel',
      createdAt: new Date('2023-09-10'),
      updatedAt: new Date('2023-10-18'),
      version: '2.0',
      creator: 'Usuário 2'
    },
    {
      id: '3',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 3'
    },
    {
      id: '4',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 4'
    },
    {
      id: '5',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 5'
    },
    {
      id: '6',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 6'
    },
    {
      id: '7',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 7'
    },
    {
      id: '8',
      name: 'Documento.pdf',
      type: 'PDF',
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2023-10-20'),
      version: 'Teste',
      creator: 'Usuário 8'
    },
    {
      id: '9',
      name: 'Planilha.xlsx',
      type: 'Excel',
      createdAt: new Date('2023-09-10'),
      updatedAt: new Date('2023-10-18'),
      version: '2.0',
      creator: 'Usuário 9'
    },
    {
      id: '10',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 10'
    },
    {
      id: '11',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 11'
    },
    {
      id: '12',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 12'
    },
    {
      id: '13',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 13'
    },
    {
      id: '14',
      name: 'Apresentação.pptx',
      type: 'PowerPoint',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-10-15'),
      version: '1.5',
      creator: 'Usuário 14'
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleEstatisticasClick = () => {
    alterOption('Stats');
    if (selectedFile) {
      alterFile(selectedFile);
    }
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      justifyContent='center'
      p={2}
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      {files.map((file) => (
        <Box
          key={file.id}
          width={240}
          borderRadius={2}
          p={2}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: 3,
          }}
        >
          <Box fontWeight="bold" fontSize="0.9rem" mb={1}>
            {file.name}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
              <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                Tipo: {file.type}
              </Box>
              <Box fontSize="0.8rem" mb={1} sx={{ color: theme.palette.text.primary }}>
                Versão: {file.version}
              </Box>
            </Box>
            <Box mt={0.5}>
              <IconButton
                aria-label="more"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                  setSelectedFile(file);
                }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedFile?.id === file.id}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => { setAnchorEl(null); }}>Alterar</MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); }}>Versões</MenuItem>
                <MenuItem onClick={handleEstatisticasClick}>Estatísticas</MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); }}>Excluir</MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/login/img_fundo_1.png"
              alt="imagem de fundo"
              sx={{
                height: 150,
                width: 170,
                objectFit: 'cover'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box fontSize="0.75rem" mt={1} sx={{ color: theme.palette.text.primary }}>
              Alterado em {formatDate(file.updatedAt)}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Documents;