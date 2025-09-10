import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
import React, { useState, useMemo } from 'react';
import { useDocumentStore } from '../state/documentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';
import { formatDate, getDocuments } from '../services/Documents/DocumentsServices';
import { DocumentObj } from '../models/DocumentObj';
import { useFilterStore } from '../state/filterState';
import { useMsgConfirmStore } from '../state/msgConfirmState';
import MsgConfirm from './notification/msgConfirm';
import { useAuth } from './useAuth';
import { useDocumentFormStore } from '../state/documentFormState';
import DocumentForm from './documents/documentForm';

const TableDocuments = () => {
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
        if (!filter.trim()) {
            return allDocuments;
        }

        const searchTerm = filter.toLowerCase().trim();

        return allDocuments.filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.type.toLowerCase().includes(searchTerm) ||
            formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
            formatDate(doc.lastModifiedDate).toLowerCase().includes(searchTerm) ||
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
        alterMsgConfirm(`mover o documento ${document.name} para a Lixeira?`);
        alterConfirm(!openConfirm);
    }

    const toggleDocumentForm = (document: DocumentObj) => {
        alterDoc(document)
        alterDocumentForm(!documentForm);
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos">
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Documento</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Tipo</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>
                            <TableSortLabel>Data de Criação</TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>
                            <TableSortLabel>Última Alteração</TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Organização</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Versão</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredDocuments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{
                                backgroundColor: theme.palette.background.default,
                                py: 4
                            }}>
                                <Typography variant="h6" color={theme.palette.text.primary}>
                                    {filter ? 'Nenhum documento encontrado para o filtro informado' : 'Nenhum documento disponível'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredDocuments.map((doc) => (
                            <TableRow key={doc.documentId}>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {doc.name}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {doc.type}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {formatDate(doc.creationDate)}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {formatDate(doc.lastModifiedDate)}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {doc.organization.name}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            px: 1,
                                            borderRadius: 1,
                                            display: 'inline-block'
                                        }}
                                    >
                                        {doc.version}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
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
                                        <MenuItem onClick={() => { toggleDocumentForm(doc) }}>Alterar</MenuItem>
                                        <MenuItem onClick={() => { setAnchorEl(null); }}>Versões</MenuItem>
                                        <MenuItem onClick={handleEstatisticasClick}>Estatísticas</MenuItem>
                                        <MenuItem onClick={() => toggleConfirm(doc)}>Excluir</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {openConfirm && (
                <MsgConfirm />
            )
            }
            {documentForm && (<DocumentForm />)}
        </TableContainer>
    );
};

export default TableDocuments;