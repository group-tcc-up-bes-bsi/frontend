import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    IconButton
} from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomTextField from '../CustomTextField';
import { Star } from '@mui/icons-material';

const Favorites: React.FC = () => {
    const { theme } = useTheme();
    const [filter, setFilter] = useState('');

    const [documents, setDocuments] = useState([
        { favorite: true, name: 'Requisitos', organization: 'TCC' },
        { favorite: true, name: 'Contrato de compra', organization: 'Compras' },
        { favorite: false, name: 'index', organization: 'Não Definido' },
        { favorite: false, name: 'Livro', organization: 'Não Definido' },
        { favorite: false, name: 'Nota fornecedor 100', organization: 'Compras' },
        { favorite: false, name: 'História de usuário', organization: 'TCC' },
    ]);

    const [organizations, setOrganizations] = useState([
        { favorite: true, name: 'TCC', total: 10 },
        { favorite: false, name: 'Compras', total: 2 },
    ]);

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
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Box sx={{ width: '50%' }}>
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
                            text="Documents"
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
                                            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>File</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Organization</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documents.map((doc, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <IconButton aria-label="star">
                                                        <Star onClick={() => handleFavoriteToggle(doc)} sx={{ color: doc.favorite ? theme.palette.button.star : theme.palette.text.primary }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{doc.name}</TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{doc.organization}</TableCell>
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
                            padding: 0.2,
                            borderRadius: '20%'
                        }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', width: '50%' }}>
                        <CustomTypography
                            text="Organizations"
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
                                            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Organization</TableCell>
                                            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Total Files</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {organizations.map((org, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <IconButton aria-label="star">
                                                        <Star onClick={() => handleFavoriteOrganizationToggle(org)} sx={{ color: org.favorite ? theme.palette.button.star : theme.palette.text.primary }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{org.name}</TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{org.total}</TableCell>
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