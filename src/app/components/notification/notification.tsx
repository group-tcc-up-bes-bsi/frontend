import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText, Backdrop } from '@mui/material';
import { useNotificationStore } from '@/app/state/notificationState';
import { Close } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../useAuth';

const Notification: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const alterNotification = useNotificationStore((state) => state.alter);

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
        </Box>
    );
};

export default Notification;