import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText, Backdrop } from '@mui/material';
import { useNotificationStore } from '@/app/state/notificationState';
import { Close } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { MessageObj } from '@/app/models/MessageObj';
import { getInvites } from '@/app/services/Organizations/getInvites';
import { UserOrganization } from '@/app/models/UserObj';
import CustomAlert from '../customAlert';

const Notification: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const alterNotification = useNotificationStore((state) => state.alter);
    const userCurrent = useUserStore((state) => state.userCurrent)
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Tela Principal', '', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const [/*invites*/, setInvites] = useState<UserOrganization[]>([]);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                const result = await getInvites(userCurrent, theme);
                setInvites(result.users)
                setMessage(result.message);
            })();
        }
    }, [userCurrent, theme]);

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
                    width: '400px',
                    height: '450px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 1.5
                }}
            >
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
                    <List dense sx={{ py: 0 }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item) => (
                            <ListItem
                                key={item}
                                sx={{
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    py: 1.2,
                                    px: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                                    <ListItemText
                                        primary={`Convite da organização ${item}`}
                                        sx={{ flex: 1 }}
                                    />
                                    <CheckIcon
                                        sx={{
                                            fontSize: '1.5rem',
                                            color: theme.palette.text.secondary,
                                            cursor: 'pointer',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: theme.palette.success.light,
                                                color: theme.palette.success.dark,
                                            }
                                        }}
                                    />
                                    <Close
                                        sx={{
                                            fontSize: '1.5rem',
                                            color: theme.palette.text.secondary,
                                            cursor: 'pointer',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: theme.palette.error.light,
                                                color: theme.palette.error.main,
                                            }
                                        }}
                                    />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1500,
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

export default Notification;