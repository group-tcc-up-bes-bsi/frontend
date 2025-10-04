import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText, Backdrop, CircularProgress } from '@mui/material';
import { useNotificationStore } from '@/app/state/notificationState';
import { Close } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { MessageObj } from '@/app/models/MessageObj';
import { getInvites } from '@/app/services/Organizations/getInvites';
import { UserOrganization } from '@/app/models/UserObj';
import CustomAlert from '../customAlert';
import CustomTypography from '../customTypography';
import { updateInvites } from '@/app/services/Organizations/updateInvites';

const Notification: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const alterNotification = useNotificationStore((state) => state.alter);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const [invites, setInvites] = useState<UserOrganization[]>([]);
    const [organizationsInvite, setOrganizationsInvite] = useState<{ organizationId: number; name: string }[]>([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        if (userCurrent) {
            (async () => {
                setLoading(true);
                try {
                    const result = await getInvites(userCurrent, theme);
                    setInvites(result.users);
                    setOrganizationsInvite(result.organizationsInvite);
                    setMessage(result.message);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [userCurrent, theme, refresh]);

    const handleAccepted = async (orgId: number) => {
        if (userCurrent != undefined) {
            try {
                const result = await updateInvites(orgId, userCurrent, true);
                setMessage(result.message);

                setRefresh(prev => prev + 1);
            } catch (error) {
                setMessage(new MessageObj(
                    'error',
                    'Erro inesperado',
                    `${error}`,
                    'error'
                ));

            }
        }
    }

    const handleRecused = async (orgId: number) => {
        if (userCurrent != undefined) {
            try {
                const result = await updateInvites(orgId, userCurrent, false);
                setMessage(result.message);

                setRefresh(prev => prev + 1);
            } catch (error) {
                setMessage(new MessageObj(
                    'error',
                    'Erro inesperado',
                    `${error}`,
                    'error'
                ));

            }
        }
    }

    return (
        <Box className="flex items-center justify-center">
            <Backdrop
                open={true}
                onClick={() => alterNotification(false)}
                sx={{
                    zIndex: 1320,
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            <Box
                className="fixed z-[1330] flex flex-col"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: {
                        xs: '95vw',   
                        sm: '380px',
                        md: '400px'   
                    },
                    height: {
                        xs: '75vh',   
                        sm: '420px', 
                        md: '450px'   
                    },
                    maxWidth: '400px', 
                    maxHeight: '90vh',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 1.5,
                }}
            >
                <CustomTypography
                    text={"Convites"}
                    component="h2"
                    variant="h6"
                    sx={{
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontWeight: 'bold',
                        width: '100%',
                        borderBottom: `1px solid ${theme.palette.text.primary}`,
                        fontSize: { xs: '1.1rem', md: '1.25rem' } 
                    }}
                />
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        my: 1,
                        px: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <CircularProgress color="primary" />
                        </Box>
                    ) : <List dense sx={{ py: 0 }}>
                        {invites.length > 0 ? (
                            invites.map((invite, index) => {
                                const org = organizationsInvite.find(
                                    (o) => o.organizationId === invite.organizationId
                                );

                                return (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            py: 1.2,
                                            px: 1,
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            width: '100%',
                                            alignItems: 'center',
                                        }}>
                                            <ListItemText
                                                primary={`Org: ${org?.name || 'Organização desconhecida'}`}
                                                sx={{
                                                    flex: 1,
                                                    '& .MuiTypography-root': {
                                                        fontSize: { xs: '0.9rem', sm: '1rem' } 
                                                    }
                                                }}
                                                primaryTypographyProps={{
                                                    noWrap: true,
                                                    title: org?.name 
                                                }}
                                            />
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignSelf: { xs: 'flex-end', sm: 'center' } 
                                            }}>
                                                <CheckIcon
                                                    onClick={() => org && handleAccepted(org.organizationId)}
                                                    sx={{
                                                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                                                        color: theme.palette.text.secondary,
                                                        cursor: 'pointer',
                                                        borderRadius: '50%',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.success.light,
                                                            color: theme.palette.success.dark,
                                                        },
                                                    }}
                                                />
                                                <Close
                                                    onClick={() => org && handleRecused(org.organizationId)}
                                                    sx={{
                                                        fontSize: { xs: '1.3rem', sm: '1.5rem' }, 
                                                        color: theme.palette.text.secondary,
                                                        cursor: 'pointer',
                                                        borderRadius: '50%',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.error.light,
                                                            color: theme.palette.error.main,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </ListItem>
                                );
                            })
                        ) : (
                            <ListItem>
                                <ListItemText
                                    primary="Nenhum convite encontrado"
                                    sx={{ textAlign: 'center' }}
                                    primaryTypographyProps={{
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }}
                                />
                            </ListItem>
                        )}
                    </List>
                    }
                </Box>
            </Box>
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: '5%', md: '10%' },
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1500,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
                        width: { xs: '90vw', sm: 'auto' },
                    }}
                >
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

export default Notification;
