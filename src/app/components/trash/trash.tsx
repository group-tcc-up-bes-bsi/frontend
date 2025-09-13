import React, { useMemo } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    IconButton,
    TableSortLabel
} from '@mui/material';
import CustomTypography from '../customTypography';
import CustomTextField from '../customTextField';
import { CachedRounded, Delete } from '@mui/icons-material';
import CustomButton from '../customButton';
import { DocumentObj } from '@/app/models/DocumentObj';
import { getDocumentsTrash } from '@/app/services/Documents/DocumentsServices';
import { useFilterStore } from '@/app/state/filterState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import MsgConfirm from '../notification/msgConfirm';
import { useAuth } from '../useAuth';
import { formatDate } from '@/app/services/ConstantsTypes';

const Trash: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);

    const documents: DocumentObj[] = getDocumentsTrash();

    const filteredDocuments = useMemo(() => {
        if (!filter.trim()) {
            return documents;
        }

        const searchTerm = filter.toLowerCase().trim();

        return documents.filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.type.toLowerCase().includes(searchTerm) ||
            formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
            formatDate(doc.lastModifiedDate).toLowerCase().includes(searchTerm) ||
            doc.version.toLowerCase().includes(searchTerm)
        );
    }, [documents, filter]);

    const toggleConfirm = (document: DocumentObj) => {
        alterMsgConfirm(`excluir permanentemente documento ${document.name}?`);
        alterConfirm(!openConfirm);
    }

    const toggleConfirmEmpty = () => {
        alterMsgConfirm(`esvaziar a lixeira?`);
        alterConfirm(!openConfirm);
    }

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Box sx={{ width: '100%', display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '50%' }}>
                            <CustomTextField
                                name="filter"
                                label="Informe um detalhe do documento"
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                focusedColor="primary"
                                hoverColor="info"
                            />
                        </Box>
                        <CustomButton
                            fullWidth={false}
                            text="Esvaziar Lixeira"
                            type="button"
                            onClick={toggleConfirmEmpty}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={2}
                            marginTop={0.5}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                        <CustomTypography
                            width={100}
                            text="Documentos"
                            component="h2"
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 3,
                                mt: 1,
                                fontWeight: 'bold'
                            }}
                        />
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 1,
                                maxHeight: 'calc(80vh - 150px)',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: theme.palette.background.default,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '3px',
                                },
                            }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Documento</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Tipo</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>
                                                <TableSortLabel sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Data de Criação</TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Última Alteração</TableSortLabel>
                                            </TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Organização</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Versão</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDocuments.map((doc) => (
                                            <TableRow key={doc.documentId}>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{doc.name}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{doc.type}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(doc.creationDate)}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(doc.lastModifiedDate)}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{doc.organization.name}</TableCell>
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
                                                    <IconButton aria-label="more">
                                                        <CachedRounded sx={{ color: theme.palette.text.primary }} />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => toggleConfirm(doc)}>
                                                        <Delete color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {openConfirm && (
                <MsgConfirm />
            )
            }
        </Box>
    );
};

export default Trash;