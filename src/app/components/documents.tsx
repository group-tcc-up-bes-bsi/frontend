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
import CustomTypography from './customTypography';
import { useMsgConfirmStore } from '../state/msgConfirmState';
import MsgConfirm from './notification/msgConfirm';
import { useAuth } from './useAuth';

const Documents: React.FC = () => {
  useAuth();
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentObj | null>(null);
  const alterDoc = useDocumentStateStore((state) => state.alter);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const { filter } = useFilterStore();
  const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
  const alterConfirm = useMsgConfirmStore((state) => state.alter);
  const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);

  const allDocuments = getDocuments();

  const filteredDocuments = useMemo(() => {
    if (!filter.trim()) {
      return allDocuments;
    }

    const searchTerm = filter.toLowerCase().trim();

    return allDocuments.filter((doc) =>
      doc.documentName.toLowerCase().includes(searchTerm) ||
      doc.documentType.toLowerCase().includes(searchTerm) ||
      formatDate(doc.documentCreationDate).toLowerCase().includes(searchTerm) ||
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

  const toggleConfirm = (document: DocumentObj) => {
    alterMsgConfirm(`mover o documento ${document.documentName} para a Lixeira?`);
    alterConfirm(!openConfirm);
  }

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
        key={doc.documentId}
        width={240}
        borderRadius={2}
        p={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
        }}
      >
        <Box fontWeight="bold" fontSize="0.9rem">
          {doc.documentName}
        </Box>
        <Box fontWeight="bold" fontSize="0.9rem" mb={1}>
          Organização: {doc.organization.organizationName}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
              Tipo: {doc.documentType}
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
              open={Boolean(anchorEl) && selectedDoc?.documentId === doc.documentId}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => { setAnchorEl(null); }}>Alterar</MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); }}>Versões</MenuItem>
              <MenuItem onClick={handleEstatisticasClick}>Estatísticas</MenuItem>
              <MenuItem onClick={() => toggleConfirm(doc)}>Excluir</MenuItem>
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
            Alterado em {formatDate(doc.documentCreationDate)}
          </Box>
        </Box>
      </Box>
    ))}
      {openConfirm && (
        <MsgConfirm />
      )
      }
    </Box>
  );
};

export default Documents;