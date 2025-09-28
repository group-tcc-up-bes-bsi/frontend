import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Backdrop, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import CustomTextField from '../customTextField';
import { useAdminPassStore } from '@/app/state/adminPassState';
import { updatePasswordUser } from '@/app/services/User/updateUser';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';

const AdminPasswordModal: React.FC = () => {
    const { theme } = useTheme();
    const alterAdminPass = useAdminPassStore((state) => state.alter);
    const admin = useAdminPassStore((state) => state.Admin);
    const [adminPass, setAdminPass] = useState('');
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Administrador', 'Informe senha do adminstrador', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const handleClose = () => alterAdminPass(false);

    const handleConfirm = async () => {
        try {
            if (admin) {
                const result = await updatePasswordUser(admin.userId, admin.UserName, admin.Password, adminPass);
                setMessage(result.message);

                await new Promise(resolve => setTimeout(resolve, 1000));
                if (result.message.severity === 'success') {
                    handleClose();
                    window.location.href = "/";
                }
            }
        } finally { }
    };

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

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
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    focusedColor="primary"
                    hoverColor="info"
                    sx={{wordWrap: 'break-word'}}
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

export default AdminPasswordModal;