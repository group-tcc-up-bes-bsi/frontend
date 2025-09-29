import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    IconButton,
    Typography,
    useMediaQuery,
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
import { DocumentObj } from '@/app/models/DocumentObj';
import { createFavoriteDocument } from '@/app/services/Documents/createFavoriteDocument';
import { deleteFavoriteDocument } from '@/app/services/Documents/deleteFavoriteDocument';
import { createFavoriteOrganization } from '@/app/services/Organizations/createFavoriteDocument';
import { deleteFavoriteOrganization } from '@/app/services/Organizations/deleteFavoriteDocument';
import { countOrganizationDocuments } from '@/app/services/Documents/getOrganizationDocuments';

const Favorites: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();
    const userCurrent = useUserStore((state) => state.userCurrent)
    const [documents, setDocuments] = useState<DocumentObj[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);
    const [message] = useState<MessageObj>(
        new MessageObj('info', 'Tela dos Favoritos', '', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
                const resultDocuments = await getDocuments(userCurrent, theme);
                setDocuments(resultDocuments.documents)
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


    const handleFavoriteToggle = async (doc: typeof documents[number]) => {
        if (doc.favorite === false) {
            doc.favorite = true;
            await createFavoriteDocument(doc.documentId, userCurrent!);
        } else {
            doc.favorite = false;
            await deleteFavoriteDocument(doc.documentId, userCurrent!);
        }
        setDocuments([...documents]);
    };

    const handleFavoriteOrganizationToggle = async (org: typeof organizations[number]) => {
        if (org.favorite === false) {
            org.favorite = true;
            await createFavoriteOrganization(org.organizationId, userCurrent!);
        } else {
            org.favorite = false;
            await deleteFavoriteOrganization(org.organizationId, userCurrent!);
        }
        setOrganizations([...organizations]);
    };

    const handleChangeFavorite = (value: string) => {
        setSelectedFavorite(value);
    };

    return (
        <Box sx={{ maxWidth: '100%', p: isMobile ? 1 : 0 }}>
            <Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: isMobile ? 2 : 4,
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    <Box sx={{ width: isMobile ? '100%' : '100%' }}>
                        <CustomTextField
                            name="filter"
                            label="Informe algo"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            sx={{ wordWrap: 'break-word' }}
                        />
                    </Box>
                    <Box sx={{ width: isMobile ? '100%' : '40%' }}>
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
            <Box sx={{
                backgroundColor: theme.palette.background.default,
                padding: isMobile ? 1 : 3
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 3 : 0
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        width: isMobile ? '100%' : '50%'
                    }}>
                        <CustomTypography
                            text="Documentos"
                            component="h2"
                            variant={isMobile ? "h6" : "h5"}
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 'bold'
                            }}
                        />
                        <Divider sx={{
                            backgroundColor: theme.palette.text.primary,
                            marginY: 1
                        }} />
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 1,
                                maxHeight: isMobile ? '400px' : 'calc(80vh - 150px)',
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
                            <TableContainer component={Paper} sx={{
                                background: 'transparent',
                                boxShadow: 'none',
                                maxWidth: '100%',
                                overflowX: 'auto'
                            }}>
                                <Table size={isMobile ? "small" : "small"}>
                                    <TableHead>
                                        <TableRow sx={{ display: isMobile ? 'none' : 'table-cell' }}>
                                            <TableCell sx={{ width: isMobile ? '40px' : 'auto' }} />
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem'
                                            }}>Documento</TableCell>
                                            {!isMobile && (
                                                <TableCell sx={{
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'bold',
                                                    fontSize: isMobile ? '0.75rem' : '1rem',
                                                }}>Organização</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDocuments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={isMobile ? 2 : 3} align="center">
                                                    <Typography
                                                        variant={isMobile ? "body2" : "h6"}
                                                        color={theme.palette.text.primary}
                                                    >
                                                        {filter ? 'Nenhum documento encontrado para o filtro informado' : 'Nenhum documento disponível'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) :
                                            filteredDocuments.map((doc) => (
                                                <TableRow key={doc.documentId}>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="star"
                                                            onClick={() => handleFavoriteToggle(doc)}
                                                            size={isMobile ? "small" : "medium"}
                                                        >
                                                            <Star sx={{
                                                                color: doc.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                                                transition: 'color 0.2s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)'
                                                                },
                                                                fontSize: isMobile ? '1.2rem' : '1.5rem'
                                                            }} />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        color: theme.palette.text.primary,
                                                        fontSize: isMobile ? '0.8rem' : '1rem'
                                                    }}>
                                                        {doc.name}
                                                        {isMobile && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: theme.palette.text.secondary,
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            >
                                                                {doc.organization.name}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    {!isMobile && (
                                                        <TableCell sx={{ color: theme.palette.text.primary }}>
                                                            {doc.organization.name}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>

                    {!isMobile && (
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
                            }}
                        />
                    )}

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        width: isMobile ? '100%' : '50%'
                    }}>
                        <CustomTypography
                            text="Organizações"
                            component="h2"
                            variant={isMobile ? "h6" : "h5"}
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 'bold'
                            }}
                        />

                        <Divider sx={{
                            backgroundColor: theme.palette.text.primary,
                            marginY: 1
                        }} />

                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 1,
                                maxHeight: isMobile ? '400px' : 'calc(80vh - 150px)',
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
                            <TableContainer component={Paper} sx={{
                                background: 'transparent',
                                boxShadow: 'none',
                                maxWidth: '100%',
                                overflowX: 'auto'
                            }}>
                                <Table size={isMobile ? "small" : "small"}>
                                    <TableHead>
                                        <TableRow sx={{ display: isMobile ? 'none' : 'table-cell' }}>
                                            <TableCell sx={{ width: isMobile ? '40px' : 'auto' }} />
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem'
                                            }}>Organização</TableCell>
                                            {!isMobile && (
                                                <TableCell sx={{
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'bold',
                                                    fontSize: isMobile ? '0.75rem' : '1rem'
                                                }}>Total de Documentos</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredOrganizations.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={isMobile ? 2 : 3} align="center">
                                                    <Typography
                                                        variant={isMobile ? "body2" : "h6"}
                                                        color={theme.palette.text.primary}
                                                    >
                                                        {filter ? 'Nenhuma organização encontrada para o filtro informado' : 'Nenhuma organização disponível'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) :
                                            filteredOrganizations.map((org) => {
                                                const orgDocuments = filteredDocuments.filter(
                                                    (doc) => doc.organization.organizationId === org.organizationId
                                                );
                                                return (
                                                    <TableRow key={org.organizationId}>
                                                        <TableCell>
                                                            <IconButton
                                                                aria-label="star"
                                                                onClick={() => handleFavoriteOrganizationToggle(org)}
                                                                size={isMobile ? "small" : "medium"}
                                                            >
                                                                <Star sx={{
                                                                    color: org.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                                                    transition: 'color 0.2s ease-in-out',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    fontSize: isMobile ? '1.2rem' : '1.5rem'
                                                                }} />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            color: theme.palette.text.primary,
                                                            fontSize: isMobile ? '0.8rem' : '1rem'
                                                        }}>
                                                            {org.name}
                                                            {isMobile && (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: theme.palette.text.secondary,
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                >
                                                                    Documentos: {countOrganizationDocuments(orgDocuments)}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        {!isMobile && (
                                                            <TableCell sx={{ color: theme.palette.text.primary }}>
                                                                {countOrganizationDocuments(orgDocuments)}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )
                                            })}
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
                        position: 'fixed',
                        bottom: isMobile ? '10%' : '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
                        width: isMobile ? '95%' : 'auto',
                        zIndex: 9999
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