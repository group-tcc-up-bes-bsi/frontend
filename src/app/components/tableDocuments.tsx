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
import { useDocumentStateStore } from '../state/documentState';
import { useOptionsDashboardStore } from '../state/optionsDashboard';
import { formatDate, getDocuments } from '../services/Documents/DocumentsServices';
import { DocumentObj } from '../models/DocumentObj';
import { useFilterStore } from '../state/filterState';
import { useMsgConfirmStore } from '../state/msgConfirmState';
import MsgConfirm from './notification/msgConfirm';
import { useAuth } from './useAuth';

const TableDocuments = () => {
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
            formatDate(doc.documentLastModifiedDate).toLowerCase().includes(searchTerm) ||
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
                        filteredDocuments.map((Doc) => (
                            <TableRow key={Doc.documentId}>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {Doc.documentName}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {Doc.documentType}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {formatDate(Doc.documentCreationDate)}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {formatDate(Doc.documentLastModifiedDate)}
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    {Doc.organization.organizationName}
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
                                        {Doc.version}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ background: theme.palette.background.default }}>
                                    <IconButton
                                        aria-label="more"
                                        onClick={(event) => {
                                            setAnchorEl(event.currentTarget);
                                            setSelectedDoc(Doc);
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedDoc?.documentId === Doc.documentId}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => { setAnchorEl(null); }}>Alterar</MenuItem>
                                        <MenuItem onClick={() => { setAnchorEl(null); }}>Versões</MenuItem>
                                        <MenuItem onClick={handleEstatisticasClick}>Estatísticas</MenuItem>
                                        <MenuItem onClick={() => toggleConfirm(Doc)}>Excluir</MenuItem>
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
        </TableContainer>
    );
};

export default TableDocuments;