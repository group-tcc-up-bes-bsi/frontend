"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import {
    Box,
    Container,
    CssBaseline,
    useMediaQuery,
    Theme,
} from '@mui/material';
import CustomTypography from '../../components/CustomTypography';
import CustomAlert from '../../components/CustomAlert';
import { MessageObj } from '@/app/models/MessageObj';
import { createUser } from '@/app/api/UserRequest';

const Register: React.FC = () => {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Cadastro', 'Por favor, realize seu cadastro', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const { theme, isDarkMode } = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const isValidEmail = (email: string) => {
        return email.includes("@") && email.includes(".") && !email.includes(" ");
    };

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    const handleSubmit = async () => {
        if (!user.trim()) {
            setMessage(new MessageObj('error', 'Erro', 'O nome de usuário é obrigatório', 'error'));
            return;
        }

        if (!email.trim()) {
            setMessage(new MessageObj('error', 'Erro', 'O email é obrigatório', 'error'));
            return;
        } else if (!isValidEmail(email)) {
            setMessage(new MessageObj('error', 'Erro', 'Por favor, insira um email válido', 'error'));
            return;
        }
        if (password.length < 4) {
            setMessage(new MessageObj('error', 'Erro', 'A senha deve ter no mínimo 4 caracteres', 'error'));
            return;
        }
        if (password !== confirmPassword) {
            setMessage(new MessageObj('error', 'Erro', 'As senhas não coincidem', 'error'));
            return;
        }
        try {
            const result = await createUser(user, password, email);
            setMessage(result.message);

            await new Promise(resolve => setTimeout(resolve, 1000));
            if (result.message.severity === 'success') {
                window.location.href = "/";
            }
        } catch (error) {
            setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            width: '100%',
            backgroundColor: theme.palette.background.default
        }}>
            <CssBaseline />

            {/* Right side - Image/Title (60%) */}
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

                    {/* Title Overlay */}
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
                            text="Crie sua conta"
                            component="h2"
                            variant="h5"
                            align="center"
                        />

                        <CustomButton
                            text="Voltar"
                            href='/'
                            type="submit"
                            colorType="primary"
                            hoverColorType="primary"
                            fullWidth={false}
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>

                    <Box component="form" sx={{ mt: 2 }}>
                        <CustomTextField
                            name="userName"
                            label="Usuário"
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                        />

                        <CustomTextField
                            name="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                        />

                        <CustomTextField
                            name="password"
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            showPasswordToggle
                        />

                        <CustomTextField
                            name="password"
                            label="Confirme a senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            showPasswordToggle
                        />

                        <CustomButton
                            text="Confirmar Cadastro"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            onClick={handleSubmit}
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

export default Register;