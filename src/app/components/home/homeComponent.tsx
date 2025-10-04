import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, IconButton, Typography, useMediaQuery, } from '@mui/material';
import CustomTypography from '../customTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableDocuments from '../tableDocuments';
import Documents from '../documents';
import { useDocumentViewerStore } from '@/app/state/documentViewerState';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import { getOrganizations } from '@/app/services/Organizations/getOrganizations';
import { useNotificationStore } from '@/app/state/notificationState';
import { useOrganizationStore } from '@/app/state/organizationState';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';

const HomeComponent: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const modeViewer = useDocumentViewerStore((state) => state.mode);
    const alterModeViewer = useDocumentViewerStore((state) => state.alter);
    const [colorMode1, setColorMode1] = useState(theme.palette.button.primary);
    const [colorMode2, setColorMode2] = useState(theme.palette.text.primary);
    const userCurrent = useUserStore((state) => state.userCurrent)
    const [message] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);
    const openNotification = useNotificationStore((state) => state.openNotification);
    const alterOrg = useOrganizationStore((state) => state.alter);
    const alterOption = useOptionsDashboardStore((state) => state.alter);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleModeViewer = (mode: number) => {
        alterModeViewer(mode)
        if (mode == 1) {
            setColorMode1(theme.palette.button.primary)
            setColorMode2(theme.palette.text.primary)
        }
        if (mode == 2) {
            setColorMode1(theme.palette.text.primary)
            setColorMode2(theme.palette.button.primary)
        }
    };

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        toggleModeViewer(modeViewer)
    }, [modeViewer, theme]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                const result = await getOrganizations(userCurrent, theme);
                setOrganizations(result.organizations);
            })();
        }
    }, [userCurrent, theme, openNotification]);

    const handleOpen = (organization: OrganizationObj) => {
        alterOption('Open Organization');
        alterOrg(organization);
    };

    return (
        <Box sx={{ maxWidth: '100%', p: isMobile ? 1 : 0 }}>
            <Box sx={{
                display: 'flex',
                gap: isMobile ? 2 : 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                mb: isMobile ? 2 : 0
            }}>
                <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
                    <CustomTypography
                        text={"Usuário: " + userCurrent?.username}
                        component="h2"
                        variant={isMobile ? "body1" : "h6"}
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold',
                            padding: 1.5,
                            marginBottom: isMobile ? 0 : 1,
                            background: theme.palette.background.default,
                            textAlign: isMobile ? 'center' : 'left',
                            fontSize: isMobile ? '1.1rem' : '1.3rem'
                        }}
                    />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: isMobile ? 1 : 0.5,
                    display: 'flex',
                    marginBottom: isMobile ? 0 : 1,
                    alignItems: 'center',
                    borderRadius: 1
                }}>
                    <IconButton
                        onClick={() => { toggleModeViewer(1) }}
                        size={isMobile ? "small" : "medium"}
                    >
                        <Menu sx={{
                            color: colorMode1,
                            fontSize: isMobile ? 24 : 32
                        }} />
                    </IconButton>
                    <Divider
                        orientation="vertical"
                        sx={{
                            backgroundColor: theme.palette.text.primary,
                            height: isMobile ? 20 : 30,
                            margin: isMobile ? '0 5px' : '0 10px',
                            padding: 0.2,
                            borderRadius: '20%'
                        }} />
                    <IconButton
                        onClick={() => { toggleModeViewer(2) }}
                        size={isMobile ? "small" : "medium"}
                    >
                        <SpaceDashboard sx={{
                            color: colorMode2,
                            fontSize: isMobile ? 24 : 32
                        }} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{
                backgroundColor: theme.palette.background.default,
                padding: isMobile ? 0.5 : 1,
                mb: isMobile ? 2 : 0
            }}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    marginLeft: isMobile ? '0.5rem' : '1rem',
                    mb: 1
                }}>
                    <CustomTypography
                        text="Organizações Recentes"
                        component="h2"
                        variant={isMobile ? "body1" : "h6"}
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold',
                            fontSize: isMobile ? '1rem' : '1.25rem'
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: isMobile ? 1 : 3,
                        maxHeight: isMobile ? '200px' : 'calc(80vh - 150px)',
                        overflowX: 'auto',
                        pr: isMobile ? 1 : 2,
                        '&::-webkit-scrollbar': {
                            width: '2px',
                            height: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: theme.palette.background.default,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '6px',
                        },
                    }}
                >
                    {organizations.length === 0 ? (
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
                                variant={isMobile ? "body2" : "h6"}
                                color={theme.palette.text.primary}
                            >
                                {'Nenhuma organização disponível'}
                            </Typography>
                        </Box>
                    ) : (
                        organizations.map((org) => (
                            <Box
                                key={org.organizationId}
                                sx={{
                                    mb: 1,
                                    p: isMobile ? 0.5 : 1,
                                    display: 'flex',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        borderRadius: 1,
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                                onClick={() => { handleOpen(org) }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    gap: isMobile ? 2 : 4,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: isMobile ? 0.5 : 1,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {org.icon}
                                        <CustomTypography
                                            text={org.name}
                                            component="h2"
                                            variant={isMobile ? "body2" : "h6"}
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 'bold',
                                                mb: 0,
                                                whiteSpace: 'nowrap',
                                                fontSize: isMobile ? '0.9rem' : '1rem'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        )))}
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                width: '100%',
                background: theme.palette.background.default,
                marginTop: isMobile ? 1 : 2,
                paddingLeft: isMobile ? 1 : 2
            }}>
                <CustomTypography
                    text="Documentos Recentes"
                    component="h2"
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                        color: theme.palette.text.primary,
                        mt: 1,
                        fontWeight: 'bold',
                        fontSize: isMobile ? '1.1rem' : '1.5rem'
                    }}
                />
            </Box>

            {modeViewer == 1 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: isMobile ? 0.5 : 1,
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
                    <TableDocuments />
                </Box>
            )}

            {modeViewer == 2 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: isMobile ? 0.5 : 1,
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
                    <Documents />
                </Box>
            )}

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

export default HomeComponent;