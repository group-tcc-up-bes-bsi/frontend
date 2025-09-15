import React, { useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useDocumentStore } from '../state/documentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';
import { DocumentObj } from '../models/DocumentObj';
import { getDocuments } from '../services/Documents/DocumentsServices';
import { useFilterStore } from '../state/filterState';
import CustomTypography from './customTypography';
import { useMsgConfirmStore } from '../state/msgConfirmState';
import MsgConfirm from './notification/msgConfirm';
import { useAuth } from './useAuth';
import { useDocumentFormStore } from '../state/documentFormState';
import DocumentForm from './documents/documentForm';
import { formatDate } from '../services/ConstantsTypes';

const Documents: React.FC = () => {
  useAuth();
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentObj | null>(null);
  const alterDoc = useDocumentStore((state) => state.alter);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const { filter } = useFilterStore();
  const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
  const alterConfirm = useMsgConfirmStore((state) => state.alter);
  const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
  const documentForm = useDocumentFormStore((state) => state.documentForm);
  const alterDocumentForm = useDocumentFormStore((state) => state.alter);

  const allDocuments = getDocuments();

  const filteredDocuments = useMemo(() => {
    let docs = [...allDocuments];

    if (filter.trim()) {
      const searchTerm = filter.toLowerCase().trim();

      docs = docs.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm) ||
        doc.type.toLowerCase().includes(searchTerm) ||
        formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
        doc.version.toLowerCase().includes(searchTerm)
      );
    }

    return docs.sort((a, b) => b.lastModifiedDate.getTime() - a.lastModifiedDate.getTime());
  }, [allDocuments, filter]);

  const handleOpen = () => {
    alterOption('Open Document');
    if (selectedDoc) {
      alterDoc(selectedDoc);
    }
    setAnchorEl(null);
  };

  const toggleConfirm = (document: DocumentObj) => {
    alterMsgConfirm(`mover o documento ${document.name} para a Lixeira?`);
    alterConfirm(!openConfirm);
  }

  const toggleDocumentForm = (document: DocumentObj) => {
    alterDoc(document)
    alterDocumentForm(!documentForm);
    setAnchorEl(null);
  }

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      justifyContent='center'
      p={1}
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
          {doc.name}
        </Box>
        <Box fontWeight="bold" fontSize="0.9rem" mb={1}>
          Organização: {doc.organization.name}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
              Tipo: {doc.type}
            </Box>
            <Box fontSize="0.8rem" mb={1} sx={{ color: theme.palette.text.primary }}>
              Versões: {doc.documentId}
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
              <MenuItem onClick={handleOpen}>Abrir</MenuItem>
              <MenuItem onClick={() => { toggleDocumentForm(doc) }}>Alterar</MenuItem>
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
            Alterado em {formatDate(doc.lastModifiedDate)}
          </Box>
        </Box>
      </Box>
    ))}
      {openConfirm && (
        <MsgConfirm />
      )
      }
      {documentForm && (<DocumentForm />)}
    </Box>
  );
};

export default Documents;