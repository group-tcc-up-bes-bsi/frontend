import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useNotificationStore } from '@/app/state/notificationState';
import { Close } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';

const Notification: React.FC = () => {
    const { theme } = useTheme();
    const alterNotification = useNotificationStore((state) => state.alter);

    return (
        <Box className="flex items-center justify-center">
            <Box
                className="fixed inset-0 z-[1320]"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    opacity: 0.5,
                    transition: 'all 0.3s ease',
                }}
            />
            <Box
                className="fixed z-[1330] flex flex-col"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    width: '300px',
                    height: '350px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 1.5
                }}
            >
                <Close
                    onClick={() => alterNotification(false)}
                    sx={{
                        fontSize: 30,
                        color: theme.palette.text.primary,
                        cursor: 'pointer',
                        alignSelf: 'flex-end',
                        '&:hover': {
                            color: theme.palette.error.main,
                        }
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
                                            '&:hover': {
                                                color: theme.palette.success.main,
                                            }
                                        }}
                                    />
                                    <Close
                                        sx={{
                                            fontSize: '1.5rem',
                                            color: theme.palette.text.secondary,
                                            cursor: 'pointer',
                                            '&:hover': {
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