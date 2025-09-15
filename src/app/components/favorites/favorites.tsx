import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    IconButton,
} from '@mui/material';
import CustomTypography from '../customTypography';
import CustomTextField from '../customTextField';
import { Star } from '@mui/icons-material';
import { getDocuments } from '@/app/services/Documents/DocumentsServices';
import { useFilterStore } from '@/app/state/filterState';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { getOrganizations } from '@/app/services/Organizations/getOrganizations';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import CustomComboBox from '../customComboBox';
import { favoriteTypeOptions } from '@/app/services/ConstantsTypes';

const Favorites: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();
    const userCurrent = useUserStore((state) => state.userCurrent)
    const [documents, setDocuments] = useState(getDocuments());
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);
    const [message] = useState<MessageObj>(
        new MessageObj('info', 'Tela dos Favoritos', '', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState('');

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);


    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                const result = await getOrganizations(userCurrent, theme);
                setOrganizations(result.organizations);
            })();
        }
    }, [userCurrent, theme]);

    const filteredDocuments = useMemo(() => {
        let filtered = documents;

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();
            filtered = filtered.filter((doc) =>
                doc.name.toLowerCase().includes(searchTerm) ||
                doc.organization.name.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedFavorite === 'true') {
            filtered = filtered.filter((doc) => doc.favorite === true);
        } else if (selectedFavorite === 'false') {
            filtered = filtered.filter((doc) => doc.favorite === false);
        }

        return filtered;
    }, [documents, filter, selectedFavorite]);

    const filteredOrganizations = useMemo(() => {
        let filtered = organizations;

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();
            filtered = filtered.filter((org) =>
                org.name.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedFavorite === 'true') {
            filtered = filtered.filter((org) => org.favorite === true);
        } else if (selectedFavorite === 'false') {
            filtered = filtered.filter((org) => org.favorite === false);
        }

        return filtered;
    }, [organizations, filter, selectedFavorite]);


    const handleFavoriteToggle = (doc: typeof documents[number]) => {
        doc.favorite = !doc.favorite;
        setDocuments([...documents]);
    };

    const handleFavoriteOrganizationToggle = (org: typeof organizations[number]) => {
        org.favorite = !org.favorite;
        setOrganizations([...organizations]);
    };

    const handleChangeFavorite = (value: string) => {
        setSelectedFavorite(value);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
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
                    <Box sx={{ width: '40%' }}>
                        <Box sx={{ width: '100%' }}>
                            <CustomComboBox
                                name="user-invite"
                                label="Favorito?"
                                value={selectedFavorite}
                                onChange={handleChangeFavorite}
                                options={favoriteTypeOptions}
                                focusedColor="primary"
                                hoverColor="info"
                            />
                        </Box>
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
                                            <TableRow key={doc.documentId}>
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
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{doc.organization.name}</TableCell>
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
                                            <TableRow key={org.organizationId}>
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
                                                <TableCell sx={{ color: theme.palette.text.primary }}>{org.name}</TableCell>
                                                <TableCell sx={{ color: theme.palette.text.primary }}>10</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
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

export default Favorites;