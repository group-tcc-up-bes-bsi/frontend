import React, { useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useDocumentStateStore } from '../state/documentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';
import { DocumentObj } from '../models/DocumentObj';
import { formatDate, getDocuments } from '../services/Documents/DocumentsServices';
import { useFilterStore } from '../state/filterState';
import CustomTypography from './CustomTypography';

const Documents: React.FC = () => {
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentObj | null>(null);
  const alterDoc = useDocumentStateStore((state) => state.alter);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const { filter } = useFilterStore();

  const allDocuments = getDocuments();

  const filteredDocuments = useMemo(() => {
    if (!filter.trim()) {
      return allDocuments;
    }

    const searchTerm = filter.toLowerCase().trim();

    return allDocuments.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      formatDate(doc.updatedAt).toLowerCase().includes(searchTerm) ||
      doc.version.toLowerCase().includes(searchTerm)
    );
  }, [allDocuments, filter]);

  const handleEstatisticasClick = () => {
    alterOption('Stats');
    if (selectedDoc) {
      alterDoc(selectedDoc);
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
    >{filteredDocuments.length === 0 ? (
      <CustomTypography
        text='Nenhum documento encontrado para o filtro informado'
        component="h6"
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          mt: 1,
        }}
      />
    ) : filteredDocuments.map((doc) => (
      <Box
        key={doc.id}
        width={240}
        borderRadius={2}
        p={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
        }}
      >
        <Box fontWeight="bold" fontSize="0.9rem" mb={1}>
          {doc.name}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
              Tipo: {doc.type}
            </Box>
            <Box fontSize="0.8rem" mb={1} sx={{ color: theme.palette.text.primary }}>
              Versão: {doc.version}
            </Box>
          </Box>
          <Box mt={0.5}>
            <IconButton
              aria-label="more"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setSelectedDoc(doc);
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedDoc?.id === doc.id}
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
            src={doc.imagemSrc}
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
            Alterado em {formatDate(doc.updatedAt)}
          </Box>
        </Box>
      </Box>
    ))}
    </Box>
  );
};

export default Documents;