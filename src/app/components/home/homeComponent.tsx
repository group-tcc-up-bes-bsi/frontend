import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, } from '@mui/material';
import CustomTypography from '../customTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableDocuments from '../tableDocuments';
import Documents from '../documents';
import { useDocumentViewerStore } from '@/app/state/documentViewerState';
import { getMyOrganizations } from '@/app/services/Organizations/organizationsServices';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';

const HomeComponent: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const modeViewer = useDocumentViewerStore((state) => state.mode);
    const alterModeViewer = useDocumentViewerStore((state) => state.alter);
    const [colorMode1, setColorMode1] = useState(theme.palette.button.primary);
    const [colorMode2, setColorMode2] = useState(theme.palette.text.primary);
    const userCurrent = useUserStore((state) => state.userCurrent)
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Tela Principal', '', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);

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
    }, [modeViewer]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                const result = await getMyOrganizations(userCurrent, theme);
                setOrganizations(result.organizations);
                setMessage(result.message);
            })();
        }
    }, [userCurrent, theme]);

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <CustomTypography
                        text="Usuário: Gregory"
                        component="h2"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold',
                            padding: 1,
                            marginBottom: 1,
                            background: theme.palette.background.default
                        }}
                    />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    display: 'flex',
                    marginBottom: 1,
                    alignItems: 'center',
                }}>
                    <Menu onClick={() => { toggleModeViewer(1) }} sx={{ color: colorMode1, fontSize: 32 }} />
                    <Divider
                        orientation="vertical"
                        sx={{
                            backgroundColor: theme.palette.text.primary,
                            height: 30,
                            margin: '0 10px',
                            padding: 0.2,
                            borderRadius: '20%'
                        }} />
                    <SpaceDashboard onClick={() => { toggleModeViewer(2) }} sx={{ color: colorMode2, fontSize: 32 }} />
                </Box>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 1 }}>
                <Box
                    sx={{ width: '100%', display: 'flex', marginLeft: '1rem' }}
                >
                    <CustomTypography
                        text="Organização Recentes"
                        component="h2"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        maxHeight: 'calc(85vh - 150px)',
                        overflowX: 'auto',
                        pr: 2,
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
                    {organizations.map((org) => (
                        <Box
                            key={org.organizationId}
                            sx={{
                                mb: 1,
                                p: 1,
                                display: 'flex',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    borderRadius: 1,
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                            onClick={() => ({})}
                        >
                            <Box sx={{
                                display: 'flex',
                                gap: 4,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {org.icon}
                                    <CustomTypography
                                        text={org.name}
                                        component="h2"
                                        variant="h6"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 'bold',
                                            mb: 0,
                                            whiteSpace: 'nowrap',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                width: '100%',
                background: theme.palette.background.default,
                marginTop: 2,
                paddingLeft: 2
            }}>
                <CustomTypography
                    text="Documentos Recentes"
                    component="h2"
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        mt: 1,
                        fontWeight: 'bold',
                    }}
                />
            </Box>
            {modeViewer == 1 && (
                <Box sx={{
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
                    <TableDocuments />
                </Box>
            )
            }
            {modeViewer == 2 && (
                <Box sx={{
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
                    <Documents />
                </Box>
            )}
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
        </Box >
    );
};

export default HomeComponent;