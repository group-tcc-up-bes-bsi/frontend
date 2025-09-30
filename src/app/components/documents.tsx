import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
  Box,
  CircularProgress,
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
import { useUserStore } from '../state/userState';
import { useOrganizationStore } from '../state/organizationState';
import { getOrganizationDocuments } from '../services/Documents/getOrganizationDocuments';
import { getOrganizationUsers } from '../services/Organizations/organizationsServices';
import { MessageObj } from '../models/MessageObj';
import CustomAlert from './customAlert';
import { moveDocumentToTrash } from '../services/Documents/trashDocument';

const Documents: React.FC = () => {
  useAuth();
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentObj | null>(null);
  const alterDoc = useDocumentStore((state) => state.alter);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const { filter } = useFilterStore();
  const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
  const documentForm = useDocumentFormStore((state) => state.documentForm);
  const alterDocumentForm = useDocumentFormStore((state) => state.alter);
  const userCurrent = useUserStore((state) => state.userCurrent);
  const organization = useOrganizationStore((state) => state.organization);
  const alterOrganization = useOrganizationStore((state) => state.alter);
  const [allDocuments, setDocuments] = useState<DocumentObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageObj>();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  }, [message]);

  useEffect(() => {
    if (userCurrent != undefined) {
      (async () => {
        setLoading(true);
        try {
          if (organization?.organizationId) {
            const result = await getOrganizationDocuments(userCurrent, organization);
            setDocuments(result.documents);
          } else {
            const result = await getDocuments(userCurrent, theme);
            setDocuments(result.documents)
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [userCurrent, theme, documentForm]);

  const filteredDocuments = useMemo(() => {
    let docs = allDocuments;

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
      alterOrganization(selectedDoc.organization)
    }
    setAnchorEl(null);
  };

  const toggleConfirm = async (document: DocumentObj) => {
    if (userCurrent != undefined) {
      const result = await moveDocumentToTrash(userCurrent, document.documentId)
      if(result.message.severity = 'success'){
        setMessage(new MessageObj('success', 'Documento Movido', 'Documento Movido para a Lixeira', 'success'))
      }
    }
    setAnchorEl(null);
  }

  const toggleDocumentForm = async (document: DocumentObj) => {
    if (userCurrent != undefined) {
      try {
        if (organization?.organizationId) {
          const result = await getOrganizationUsers(organization?.organizationId, userCurrent)
          const users = result.users;
          for (const user of users) {
            if (user.username == userCurrent.username) {
              if (user.userType.toString() == 'OWNER' || user.userType.toString() == 'WRITE') {
                alterDoc(document)
                alterDocumentForm(!documentForm);
                setAnchorEl(null);
              } else {
                setMessage(new MessageObj('warning', 'Não Permitido', 'Usuário Visualizador não pode alterar', 'warning'));
              }
            }
          }
        } else {
          const result = await getOrganizationUsers(document.organization.organizationId, userCurrent)
          const users = result.users;
          for (const user of users) {
            if (user.username == userCurrent.username) {
              if (user.userType.toString() == 'OWNER' || user.userType.toString() == 'WRITE') {
                alterDoc(document)
                alterDocumentForm(!documentForm);
                setAnchorEl(null);
              } else {
                setMessage(new MessageObj('warning', 'Não Permitido', 'Usuário Visualizador não pode alterar', 'warning'));
              }
            }
          }
        }
      } catch (error) {
        setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
      }
    }
  }

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      justifyContent="center"
      p={1}
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredDocuments.length === 0 ? (
        <CustomTypography
          text="Nenhum documento encontrado para o filtro informado"
          component="h6"
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            mt: 1,
          }}
        />
      ) : (
        filteredDocuments.map((doc) => (
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
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                  Tipo: {doc.type.toUpperCase()}
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
                  <MenuItem onClick={() => toggleDocumentForm(doc)}>Alterar</MenuItem>
                  <MenuItem onClick={() => toggleConfirm(doc)}>Excluir</MenuItem>
                </Menu>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box fontSize="0.75rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                Alterado em {formatDate(doc.lastModifiedDate)}
              </Box>
            </Box>
          </Box>
        ))
      )}
      {openConfirm && <MsgConfirm />}
      {documentForm && <DocumentForm />}
      {showMessage && message && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            textAlign: 'left',
          }}>
          <CustomAlert
            severity={message.severity}
            colorType={message.colorType}
            title={message.title}
            description={message.description}
          />
        </Box>
      )}
    </Box>
  );
};

export default Documents;