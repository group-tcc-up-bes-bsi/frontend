import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Backdrop, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import CustomTextField from '../CustomTextField';
import { useAdminPassStore } from '@/app/state/adminPassState';

const AdminPasswordModal: React.FC = () => {
    const { theme } = useTheme();
    const alterAdminPass = useAdminPassStore((state) => state.alter);
    const [password, setPassword] = useState('');

    const handleClose = () => alterAdminPass(false);
    const handleConfirm = () => {
        console.log('Senha digitada:', password);
        handleClose();
    };

    return (
        <Box className="flex items-center justify-center">
            <Backdrop
                open={true}
                onClick={handleClose}
                sx={{
                    zIndex: 1320,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            <Box
                className="fixed z-[1330] flex flex-col"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: '300px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 2,
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{
                        color: theme.palette.text.primary,
                        fontSize: '1.2rem',
                        margin: 0
                    }}>
                        Senha de Administrador
                    </h2>
                    <Close
                        onClick={handleClose}
                        sx={{
                            fontSize: 24,
                            color: theme.palette.text.secondary,
                            cursor: 'pointer',
                            '&:hover': {
                                color: theme.palette.error.main,
                            }
                        }}
                    />
                </Box>

                <CustomTextField
                    name="password"
                    label="Digite a senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusedColor="primary"
                    hoverColor="info"
                />

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleConfirm}
                    sx={{
                        py: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.getContrastText(theme.palette.primary.main),
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    }}
                >
                    Confirmar
                </Button>
            </Box>
        </Box>
    );
};

export default AdminPasswordModal;