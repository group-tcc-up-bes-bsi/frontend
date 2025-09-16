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
    Typography,
    CircularProgress
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
import React, { useState, useMemo, useEffect } from 'react';
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
import { useUserStore } from '../state/userState';
import { useOrganizationStore } from '../state/organizationState';
import { getOrganizationDocuments } from '../services/Documents/getOrganizationDocuments';

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
    const [orderBy, setOrderBy] = useState<keyof DocumentObj | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const userCurrent = useUserStore((state) => state.userCurrent);
    const organization = useOrganizationStore((state) => state.organization);
    const [allDocuments, setDocuments] = useState<DocumentObj[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                setLoading(true);
                try {
                    if (organization?.organizationId) {
                        const result = await getOrganizationDocuments(userCurrent, organization);
                        setDocuments(result.documents);
                    } else {
                        const result = await getDocuments(userCurrent,theme);
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
        setLoading(true);

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();
            docs = docs.filter((doc) =>
                doc.name.toLowerCase().includes(searchTerm) ||
                doc.type.toLowerCase().includes(searchTerm) ||
                formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
                formatDate(doc.lastModifiedDate).toLowerCase().includes(searchTerm) ||
                doc.version.toLowerCase().includes(searchTerm)
            );
            setTimeout(() => setLoading(false), 300);
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
        setTimeout(() => setLoading(false), 300);
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
                        <TableCell>Documento</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'creationDate'}
                                direction={orderBy === 'creationDate' ? order : 'asc'}
                                onClick={() => handleSort('creationDate')}
                            >
                                Data de Criação
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'lastModifiedDate'}
                                direction={orderBy === 'lastModifiedDate' ? order : 'asc'}
                                onClick={() => handleSort('lastModifiedDate')}
                            >
                                Última Alteração
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Organização</TableCell>
                        <TableCell>Versão Atual</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <CircularProgress color="primary" />
                            </TableCell>
                        </TableRow>
                    ) : filteredDocuments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography variant="h6" color={theme.palette.text.primary}>
                                    {filter ? 'Nenhum documento encontrado para o filtro informado' : 'Nenhum documento disponível'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredDocuments.map((doc) => (
                            <TableRow key={doc.documentId}>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{formatDate(doc.creationDate)}</TableCell>
                                <TableCell>{formatDate(doc.lastModifiedDate)}</TableCell>
                                <TableCell>{doc.organization.name}</TableCell>
                                <TableCell>
                                    <Box sx={{ px: 1, borderRadius: 1, display: 'inline-block', backgroundColor: theme.palette.background.paper }}>
                                        {doc.version}
                                    </Box>
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {openConfirm && <MsgConfirm />}
            {documentForm && <DocumentForm />}
        </TableContainer>
    );
};

export default TableDocuments;