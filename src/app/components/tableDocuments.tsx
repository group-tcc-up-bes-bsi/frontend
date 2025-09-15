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
import { getDocuments } from '../services/Documents/DocumentsServices';
import { DocumentObj } from '../models/DocumentObj';
import { useFilterStore } from '../state/filterState';
import { useMsgConfirmStore } from '../state/msgConfirmState';
import MsgConfirm from './notification/msgConfirm';
import { useAuth } from './useAuth';
import { useDocumentFormStore } from '../state/documentFormState';
import DocumentForm from './documents/documentForm';
import { formatDate } from '../services/ConstantsTypes';

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
    const [orderBy, setOrderBy] = useState<keyof DocumentObj | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');


    const filteredDocuments = useMemo(() => {
        let docs = allDocuments;

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();
            docs = docs.filter((doc) =>
                doc.name.toLowerCase().includes(searchTerm) ||
                doc.type.toLowerCase().includes(searchTerm) ||
                formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
                formatDate(doc.lastModifiedDate).toLowerCase().includes(searchTerm) ||
                doc.version.toLowerCase().includes(searchTerm)
            );
        }

        if (orderBy) {
            docs = [...docs].sort((a, b) => {
                let valueA = a[orderBy];
                let valueB = b[orderBy];

                if (orderBy === 'creationDate' || orderBy === 'lastModifiedDate') {
                    valueA = new Date(valueA as Date).getTime();
                    valueB = new Date(valueB as Date).getTime();
                }

                if (valueA < valueB) return order === 'asc' ? -1 : 1;
                if (valueA > valueB) return order === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return docs;
    }, [allDocuments, filter, orderBy, order]);


    const handleOpen = () => {
        alterOption('Open Document');
        if (selectedDoc) {
            alterDoc(selectedDoc);
        }
        setAnchorEl(null);
    };

    const handleSort = (property: keyof DocumentObj) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos">
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Documento</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Tipo</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>
                            <TableSortLabel
                                active={orderBy === 'creationDate'}
                                direction={orderBy === 'creationDate' ? order : 'asc'}
                                onClick={() => handleSort('creationDate')}
                            >
                                Data de Criação
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>
                            <TableSortLabel
                                active={orderBy === 'lastModifiedDate'}
                                direction={orderBy === 'lastModifiedDate' ? order : 'asc'}
                                onClick={() => handleSort('lastModifiedDate')}
                            >
                                Última Alteração
                            </TableSortLabel>
                        </TableCell>

                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Organização</TableCell>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Versão Atual</TableCell>
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
                                        <MenuItem onClick={handleOpen}>Abrir</MenuItem>
                                        <MenuItem onClick={() => { toggleDocumentForm(doc) }}>Alterar</MenuItem>
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