import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box } from '@mui/material';
//import { getAuthToken } from '@/app/api/getAuthToken';


const Notification: React.FC = () => {
    const { theme } = useTheme();
    //const authToken = getAuthToken()

    return (
        <Box
            className="flex items-center justify-center"
        >
            <Box
                className="fixed inset-0 z-20 flex items-center justify-center"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    opacity: 0.5,
                    width: '100%',
                    height: '100%',
                    transition: 'all 0.3s ease',
                }}
            >
            </Box>
            <Box
                className="fixed inset-0 z-30 flex items-center justify-center p-8"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    opacity: 1,
                    width: '300px',
                    height: '350px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                }}
            >
                {/* Conteúdo da notificação vai aqui */}
            </Box>
        </Box>
    );
};

export default Notification;