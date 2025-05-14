import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useNotificationStore } from '@/app/state/notificationState';
import { Close } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
//import { getAuthToken } from '@/app/api/getAuthToken';


const Notification: React.FC = () => {
    const { theme } = useTheme();
    const alterNotification = useNotificationStore((state) => state.alter);
    //const authToken = getAuthToken()

    return (
        <Box
            className="flex items-center justify-center"
        >
            <Box
                className="fixed inset-0 z-[1320]"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    opacity: 0.5,
                    transition: 'all 0.3s ease',
                }}
            />
            <Box
                className="fixed z-[1330]"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    width: '300px',
                    height: '350px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 1
                }}
            >
                <Close
                    onClick={() => alterNotification(false)}
                    sx={{
                        fontSize: 30,
                        color: theme.palette.text.primary,
                        cursor: 'pointer',
                        '&:hover': {
                            color: theme.palette.error.main,
                        }
                    }}
                />
                <Box>
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            marginY: 1,
                            paddingX: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '4px',
                        }}
                    >
                        <List dense>
                            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                <ListItem
                                    key={item}
                                    sx={{
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        paddingY: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        <ListItemText
                                            primary={`Mensagem de notificação ${item}`}
                                        />
                                        <CheckIcon
                                            sx={{
                                                fontSize: '1.6rem',
                                                color: theme.palette.text.primary,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: theme.palette.success.main,
                                                }
                                            }}
                                        />
                                        <Close
                                            sx={{
                                                fontSize: '1.6rem',
                                                color: theme.palette.text.primary,
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
        </Box>
    );
};

export default Notification;