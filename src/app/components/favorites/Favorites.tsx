import React, { useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    IconButton
} from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomTextField from '../CustomTextField';
import { Star } from '@mui/icons-material';
import { getOrganizationsFavorites } from '@/app/services/Organizations/OrganizationsServices';
import { getDocumentsFavorites } from '@/app/services/Documents/DocumentsServices';
import { useFilterStore } from '@/app/state/filterState';

const Favorites: React.FC = () => {
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();

    const [documents, setDocuments] = useState(getDocumentsFavorites());

    const filteredDocuments = useMemo(() => {
        if (!filter.trim()) {
            return documents;
        }

        const searchTerm = filter.toLowerCase().trim();

        return documents.filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.organization.title.toLowerCase().includes(searchTerm)
        );
    }, [documents, filter]);

    const [organizations, setOrganizations] = useState(getOrganizationsFavorites());

    const filteredOrganizations = useMemo(() => {
        if (!filter.trim()) {
            return organizations;
        }

        const searchTerm = filter.toLowerCase().trim();
        return organizations.filter((org) =>
            org.title.toLowerCase().includes(searchTerm) ||
            org.totDocuments.toString().includes(searchTerm)
        );
    }, [organizations, filter]);

    const handleFavoriteToggle = (doc: typeof documents[number]) => {
        doc.favorite = !doc.favorite;
        setDocuments([...documents]);
    };

    const handleFavoriteOrganizationToggle = (org: typeof organizations[number]) => {
        org.favorite = !org.favorite;
        setOrganizations([...organizations]);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '100%' }}>
                        <CustomTextField
                            name="filter"
                            label="Informe algo"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', width: '50%' }}>
                        <CustomTypography
                            text="Documentos"
                            component="h2"
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 1,
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
                            <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Documento</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Organização</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    <IconButton aria-label="star" onClick={() => handleFavoriteToggle(doc)}>
                                                        <Star sx={{
                                                            color: doc.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                                            transition: 'color 0.2s ease-in-out',
                                                            '&:hover': {
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{doc.name}</TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{doc.organization.title}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                    <Divider
                        orientation="vertical"
                        sx={{
                            backgroundColor: theme.palette.text.primary,
                            height: '70vh',
                            margin: '0 10px',
                            marginLeft: 2,
                            marginRight: 2,
                            padding: 0.05,
                            borderRadius: '20%'
                        }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', width: '50%' }}>
                        <CustomTypography
                            text="Organizações"
                            component="h2"
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 2,
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
                            }}
                        >
                            <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Organização</TableCell>
                                            <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Total de Arquivos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredOrganizations.map((org) => (
                                            <TableRow key={org.id}>
                                                <TableCell>
                                                    <IconButton aria-label="star" onClick={() => handleFavoriteOrganizationToggle(org)}>
                                                        <Star sx={{
                                                            color: org.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                                            transition: 'color 0.2s ease-in-out',
                                                            '&:hover': {
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{org.title}</TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{org.totDocuments}</TableCell>
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

export default Favorites;