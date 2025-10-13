import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, IconButton, Menu, MenuItem, CircularProgress, Typography, CardContent, Card, useMediaQuery, Chip } from '@mui/material';
import CustomTypography from '../customTypography';
import CustomComboBox from '../customComboBox';
import CustomTextField from '../customTextField';
import CustomButton from '../customButton';
import { MoreVert, Star } from '@mui/icons-material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import OrganizationForm from './organizationForm';
import { favoriteTypeOptions, organizationType, organizationsTypeOptions } from '../../services/ConstantsTypes';
import { getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useFilterStore } from '@/app/state/filterState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { useOrganizationStore } from '@/app/state/organizationState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import MsgConfirm from '../notification/msgConfirm';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { deleteOrganization } from '@/app/services/Organizations/deleteOrganization';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';
import { getOrganizations } from '@/app/services/Organizations/getOrganizations';
import { createFavoriteOrganization } from '@/app/services/Organizations/createFavoriteDocument';
import { deleteFavoriteOrganization } from '@/app/services/Organizations/deleteFavoriteDocument';
import { getOrganizationDocuments } from '@/app/services/Documents/getOrganizationDocuments';

const Organization: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const { filter, setFilter } = useFilterStore();
    const organizationForm = useOrganizationFormStore((state) => state.organizationForm);
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationObj | null>(null);
    const alterOrganization = useOrganizationStore((state) => state.alter);
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const alterOption = useOptionsDashboardStore((state) => state.alter);
    const [selectedFavorite, setSelectedFavorite] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));


    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                setLoading(true);
                try {
                    const result = await getOrganizations(userCurrent, theme);
                    setOrganizations(result.organizations);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [userCurrent, theme, organizationForm]);

    const handleChangeOrganizationType = (value: string) => {
        setSelectedOrganizationType(value);
    };

    const toggleOrganizationForm = () => {
        alterOrganizationForm(!organizationForm);
    }

    const filteredOrganizations = useMemo(() => {
        setLoading(true);

        let filtered = organizations;

        if (selectedOrganizationType === 'COLLABORATIVE') {
            filtered = filtered.filter((org) => org.organizationType === organizationType.COLLABORATIVE);
        } else if (selectedOrganizationType === 'INDIVIDUAL') {
            filtered = filtered.filter((org) => org.organizationType === organizationType.INDIVIDUAL);
        }

        if (selectedFavorite === 'true') {
            filtered = filtered.filter((org) => org.favorite === true);
        } else if (selectedFavorite === 'false') {
            filtered = filtered.filter((org) => org.favorite === false);
        }

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();
            filtered = filtered.filter(
                (org) =>
                    org.name.toLowerCase().includes(searchTerm) ||
                    org.description.toLowerCase().includes(searchTerm)
            );
        }

        setTimeout(() => setLoading(false), 300);
        return filtered;
    }, [organizations, filter, selectedOrganizationType, selectedFavorite]);


    const handleOrganizationAlter = async () => {
        if (selectedOrganization) {
            if (userCurrent != undefined) {
                try {
                    const result = await getOrganizationUsers(selectedOrganization.organizationId, userCurrent)
                    const users = result.users;
                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER') {
                                alterOrganization(selectedOrganization);
                                toggleOrganizationForm();
                            } else {
                                setMessage(new MessageObj('warning', 'Não Permitido', 'Somente o proprietario pode realizar Alterações', 'warning'));
                            }
                        }
                    }
                } catch (error) {
                    setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
                }
            }
        }
        setAnchorEl(null);
    };

    const handleOrganizationDelete = async () => {
        if (selectedOrganization) {
            if (userCurrent != undefined) {
                try {
                    const result = await getOrganizationUsers(selectedOrganization.organizationId, userCurrent)
                    const users = result.users;
                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER') {
                                alterMsgConfirm(`excluir a organização ${selectedOrganization.name}?`);
                                alterConfirm(true);
                                useMsgConfirmStore.getState().setOnConfirm(async () => {
                                    if (userCurrent) {
                                        const responseDocs = await getOrganizationDocuments(userCurrent, selectedOrganization);
                                        if (responseDocs.documents.length <= 0) {
                                            await deleteOrganization(selectedOrganization.organizationId, userCurrent);
                                            setOrganizations((prev) =>
                                                prev.filter((org) => org.organizationId !== selectedOrganization.organizationId)
                                            );
                                        } else {
                                            setMessage(new MessageObj(
                                                'error',
                                                'Não excluído',
                                                "A Organização possui documentos associados. Exclua todos os documentos antes de remover a organização.",
                                                'error'));
                                        }
                                    }
                                });
                            } else {
                                setMessage(new MessageObj('warning', 'Não Permitido', 'Somente o proprietario realizar Exclusão', 'warning'));
                            }
                        }
                    }
                } catch (error) {
                    setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
                }
            }
        }
        setAnchorEl(null);
    };

    const handleOrganizationCreate = () => {
        const orgNull: OrganizationObj = {
            organizationId: 0,
            name: '',
            description: '',
            favorite: false,
            organizationType: undefined,
            borderColor: undefined,
            icon: undefined
        };
        alterOrganization(orgNull);
        toggleOrganizationForm();
    }

    const handleOpen = (organization: OrganizationObj) => {
        alterOption('Open Organization');
        alterOrganization(organization);
        setAnchorEl(null);
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
                    gap: isMobile ? 0 : 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'center',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <CustomButton
                            text="+ Nova Organização"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            onClick={handleOrganizationCreate}
                            paddingY={isMobile ? 1 : 2}
                            marginTop={0.5}
                        />
                    </Box>

                    <Box sx={{ width: isMobile ? '100%' : isTablet ? '50%' : '40%' }}>
                        <CustomTextField
                            name="filter"
                            label="Informe um detalhe da organização"
                            type="text"
                            value={filter}
                            marginTop={isMobile ? 0.5 : 0}
                            marginBottom={isMobile ? 0 : 1}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                        />
                    </Box>

                    <Box sx={{ width: isMobile ? '100%' : isTablet ? '35%' : '25%' }}>
                        <CustomComboBox
                            name="organization-type"
                            label="Tipo da organização"
                            value={selectedOrganizationType}
                            marginBottom={isMobile ? 0 : 3}
                            onChange={handleChangeOrganizationType}
                            options={organizationsTypeOptions}
                            focusedColor="primary"
                            hoverColor="info"
                        />
                    </Box>

                    <Box sx={{ width: isMobile ? '100%' : isTablet ? '25%' : '15%' }}>
                        <Box sx={{ width: '100%' }}>
                            <CustomComboBox
                                name="user-invite"
                                label="Favorito?"
                                value={selectedFavorite}
                                onChange={handleChangeFavorite}
                                options={favoriteTypeOptions}
                                marginBottom={isMobile ? 2 : 3}
                                focusedColor="primary"
                                hoverColor="info"
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ backgroundColor: theme.palette.background.default, padding: isMobile ? 0.5 : 1 }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    mb: isMobile ? 1 : 2
                }}>
                    <CustomTypography
                        text="Organizações"
                        component="h2"
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                            color: theme.palette.text.primary,
                            mb: isMobile ? 1 : 2,
                            mt: isMobile ? 0 : 1,
                            fontWeight: 'bold'
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            maxHeight: isMobile ? "calc(85vh - 200px)" : "calc(85vh - 150px)",
                            overflowY: "auto",
                            p: isMobile ? 1 : 2,
                            "&::-webkit-scrollbar": { width: "6px" },
                            "&::-webkit-scrollbar-track": {
                                background: theme.palette.background.default,
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: "3px",
                            },
                        }}
                    >
                        {filteredOrganizations.length === 0 ? (
                            <Box
                                sx={{
                                    mb: 1,
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    variant={isMobile ? "body1" : "h6"}
                                    color={theme.palette.text.primary}
                                    textAlign="center"
                                >
                                    {'Nenhuma organização disponível'}
                                </Typography>
                            </Box>
                        ) :
                            filteredOrganizations.map((org) => (
                                <Card
                                    key={org.organizationId}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        borderColor: org.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderRadius: 2,
                                        boxShadow: 2,
                                    }}
                                >
                                    <CardContent sx={{ p: isMobile ? 1 : 1.5 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: isMobile ? 0.5 : 1,
                                                flexDirection: isMobile ? "column" : "row",
                                                gap: isMobile ? 1 : 0
                                            }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: isMobile ? "flex-start" : "center",
                                                gap: 1,
                                                flex: 1,
                                                flexWrap: 'wrap',
                                                width: isMobile ? '100%' : 'auto',
                                                flexDirection: isMobile ? 'column' : 'row'
                                            }}>
                                                <Box sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    width: isMobile ? '100%' : 'auto',
                                                    mb: isMobile ? 0.5 : 0
                                                }}>
                                                    <IconButton
                                                        aria-label="star"
                                                        onClick={() => handleFavoriteOrganizationToggle(org)}
                                                        size={isMobile ? "small" : "medium"}
                                                        sx={{
                                                            padding: isMobile ? '4px' : '8px',
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.action.hover,
                                                            }
                                                        }}
                                                    >
                                                        <Star sx={{
                                                            color: org.favorite ? theme.palette.button.star : theme.palette.text.primary,
                                                            transition: 'all 0.2s ease-in-out',
                                                            fontSize: isMobile ? '1.1rem' : '1.5rem'
                                                        }} />
                                                    </IconButton>

                                                    <CustomTypography
                                                        text={org.name}
                                                        component="h2"
                                                        variant={isMobile ? "body1" : "h6"}
                                                        sx={{
                                                            color: theme.palette.text.primary,
                                                            fontWeight: "bold",
                                                            fontSize: isMobile ? '0.85rem' : '1rem',
                                                            lineHeight: 1.2,
                                                            flex: 1,
                                                            wordBreak: 'break-word'
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: isMobile ? '100%' : 'auto',
                                                    ml: isMobile ? 4 : 1
                                                }}>
                                                    <Chip
                                                        label={org.organizationType || ""}
                                                        size={isMobile ? "small" : "medium"}
                                                        sx={{
                                                            fontWeight: "bold",
                                                            backgroundColor: org.organizationType?.toString() === "Colaborativo"
                                                                ? theme.palette.button.star
                                                                : theme.palette.primary.main,
                                                            color: org.organizationType?.toString() === "Colaborativo"
                                                                ? 'white'
                                                                : 'white',
                                                            fontSize: isMobile ? '0.7rem' : '0.8rem',
                                                            height: isMobile ? 24 : 32,
                                                            '& .MuiChip-label': {
                                                                px: isMobile ? 1 : 1.5
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{
                                                alignSelf: isMobile ? 'flex-end' : 'center',
                                                mt: isMobile ? -4 : 0
                                            }}>
                                                <IconButton
                                                    aria-label="options"
                                                    onClick={(event) => {
                                                        setAnchorEl(event.currentTarget);
                                                        setSelectedOrganization(org);
                                                    }}
                                                    size={isMobile ? "small" : "medium"}
                                                    sx={{
                                                        padding: isMobile ? '4px' : '8px',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover,
                                                        }
                                                    }}
                                                >
                                                    <MoreVert fontSize={isMobile ? "small" : "medium"} />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={
                                                        Boolean(anchorEl) &&
                                                        selectedOrganization?.organizationId === org.organizationId
                                                    }
                                                    onClose={() => setAnchorEl(null)}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <MenuItem
                                                        onClick={() => handleOpen(org)}
                                                        sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                                                    >
                                                        Abrir
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleOrganizationAlter}
                                                        sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                                                    >
                                                        Alterar
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleOrganizationDelete}
                                                        sx={{
                                                            fontSize: isMobile ? '0.8rem' : '0.875rem',
                                                            color: theme.palette.text.primary
                                                        }}
                                                    >
                                                        Excluir
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        </Box>

                                        {org.description && (
                                            <Typography
                                                variant={isMobile ? "body2" : "body2"}
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    whiteSpace: "pre-line",
                                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                                    lineHeight: 1.4,
                                                    mt: isMobile ? 0.5 : 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: isMobile ? 2 : 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {org.description}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </Box>
                )}

                {organizationForm && <OrganizationForm />}
                {openConfirm && <MsgConfirm />}
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

export default Organization;
