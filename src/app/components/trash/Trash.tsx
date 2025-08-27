import React, { useMemo } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    IconButton,
    TableSortLabel
} from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomTextField from '../CustomTextField';
import { CachedRounded, Delete } from '@mui/icons-material';
import CustomButton from '../CustomButton';
import { DocumentObj } from '@/app/models/DocumentObj';
import { formatDate, getDocumentsTrash } from '@/app/services/Documents/DocumentsServices';
import { useFilterStore } from '@/app/state/filterState';

const Trash: React.FC = () => {
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();

    const documents: DocumentObj[] = getDocumentsTrash();

    const filteredDocuments = useMemo(() => {
        if (!filter.trim()) {
            return documents;
        }

        const searchTerm = filter.toLowerCase().trim();

        return documents.filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.type.toLowerCase().includes(searchTerm) ||
            formatDate(doc.createdAt).toLowerCase().includes(searchTerm) ||
            formatDate(doc.updatedAt).toLowerCase().includes(searchTerm) ||
            doc.version.toLowerCase().includes(searchTerm)
        );
    }, [documents, filter]);

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
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Versão</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{doc.name}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{doc.type}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(doc.createdAt)}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>{formatDate(doc.updatedAt)}</TableCell>
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
                                                    <IconButton aria-label="delete">
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
        </Box>
    );
};

export default Trash;