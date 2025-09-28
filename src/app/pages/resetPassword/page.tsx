"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import CustomButton from '../../components/customButton';
import CustomTextField from '../../components/customTextField';
import {
    Box,
    Container,
    CssBaseline,
    useMediaQuery,
    Theme,
} from '@mui/material';
import CustomTypography from '../../components/customTypography';
import CustomAlert from '../../components/customAlert';
import { MessageObj } from '@/app/models/MessageObj';
import AdminPasswordModal from '@/app/components/admin/adminPasswordModal';
import { Admin, useAdminPassStore } from '@/app/state/adminPassState';

const ResetPassword: React.FC = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Alteração de senha', 'Informe seus dados', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const { theme, isDarkMode } = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const showAdminRequest = useAdminPassStore((state) => state.showAdminRequest);
    const alterAdminPass = useAdminPassStore((state) => state.alter);
    const alterAdmin = useAdminPassStore((state) => state.alterAdmin);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);


    useEffect(() => {
        if (showAdminRequest) {
            alterAdminPass(true);
        }
    }, [showAdminRequest]);

    const handleSubmitUserName = async () => {
        if (!user.trim()) {
            setMessage(new MessageObj('error', 'Erro', 'O usuário é obrigatório', 'error'));
            return;
        }
        if (password.length < 4) {
            setMessage(new MessageObj('error', 'Erro', 'A senha deve ter no mínimo 4 caracteres', 'error'));
            return;
        }
        if (!password.trim()) {
            setMessage(new MessageObj('error', 'Erro', 'A senha inválida', 'error'));
            return;
        }
        const admin: Admin = {
            userId: 0,
            UserName: user,
            Password: password,
            AdminPass: ''
        }

        alterAdmin(admin);
        alterAdminPass(true);
    }

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            width: '100%',
            backgroundColor: theme.palette.background.default
        }}>
            <CssBaseline />

            {!isMobile && (
                <Box
                    sx={{
                        width: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        height: '100%',
                        overflow: 'hidden',
                        backgroundColor: theme.palette.background.paper
                    }}
                >
                    <Box
                        component="img"
                        src="/login/img_fundo_2.png"
                        alt="imagem de fundo"
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            opacity: isDarkMode ? 0.8 : 1
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            textAlign: 'center',
                            color: theme.palette.text.primary,
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="logo marca"
                            sx={{
                                height: 80,
                                width: 80
                            }}
                        />
                        <CustomTypography
                            text="DocDash"
                            component="h2"
                            variant="h4"
                            align="center"
                            marginBottom={0}
                        />
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    p: 3,
                }}
            >
                <Container maxWidth="sm">
                    {isMobile && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 6,
                            gap: 2
                        }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="logo marca"
                                sx={{
                                    height: 60,
                                    width: 60
                                }}
                            />

                            <CustomTypography
                                text="DocDash"
                                component="h2"
                                variant="h4"
                                align="center"
                                marginBottom={0}
                            />
                        </Box>
                    )}



                    <Box component="form"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <CustomTypography
                            text="Alteração de senha"
                            component="h2"
                            variant="h5"
                            align="center"
                        />

                        <CustomButton
                            text="Voltar"
                            href='/'
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            fullWidth={false}
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>

                    <Box component="form" sx={{ mt: 2 }}>
                        <CustomTextField
                            name="user"
                            label="Usuario"
                            type="user"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            sx={{wordWrap: 'break-word'}}
                        />

                        <CustomTextField
                            name="password"
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            sx={{wordWrap: 'break-word'}}
                        />

                        {showAdminRequest && (
                            <AdminPasswordModal />
                        )}
                        <CustomButton
                            text="Alterar senha"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            onClick={() => handleSubmitUserName()}
                        />

                        {showMessage && message && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '10%',
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
                    </Box>
                </Container >
            </Box >
        </Box >
    );
};

export default ResetPassword;