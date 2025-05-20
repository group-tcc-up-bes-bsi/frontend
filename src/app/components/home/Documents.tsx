import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
  Box,
  IconButton,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface FileItem {
  id: string;
  nome: string;
  tipo: string;
  dataCriacao: Date;
  ultimaAlteracao: Date;
  versao: string;
}

const Documents: React.FC = () => {
  const { theme } = useTheme();

  const files: FileItem[] = [
    {
      id: '1',
      nome: 'Documento.pdf',
      tipo: 'PDF',
      dataCriacao: new Date('2023-10-15'),
      ultimaAlteracao: new Date('2023-10-20'),
      versao: 'Teste'
    },
    {
      id: '2',
      nome: 'Planilha.xlsx',
      tipo: 'Excel',
      dataCriacao: new Date('2023-09-10'),
      ultimaAlteracao: new Date('2023-10-18'),
      versao: '2.0'
    },
    {
      id: '3',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '4',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '5',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '6',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '7',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '8',
      nome: 'Documento.pdf',
      tipo: 'PDF',
      dataCriacao: new Date('2023-10-15'),
      ultimaAlteracao: new Date('2023-10-20'),
      versao: 'Teste'
    },
    {
      id: '9',
      nome: 'Planilha.xlsx',
      tipo: 'Excel',
      dataCriacao: new Date('2023-09-10'),
      ultimaAlteracao: new Date('2023-10-18'),
      versao: '2.0'
    },
    {
      id: '10',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '11',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '12',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '13',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    },
    {
      id: '14',
      nome: 'Apresentação.pptx',
      tipo: 'PowerPoint',
      dataCriacao: new Date('2023-08-05'),
      ultimaAlteracao: new Date('2023-10-15'),
      versao: '1.5'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
            {file.nome}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
              <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                Tipo: {file.tipo}
              </Box>
              <Box fontSize="0.8rem" mb={1} sx={{ color: theme.palette.text.primary }}>
                Versão: {file.versao}
              </Box>
            </Box>
            <Box mt={0.5}>
              <IconButton aria-label="more">
                <MoreVert />
              </IconButton>
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
              Alterado em {formatDate(file.ultimaAlteracao)}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Documents;