"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import CustomButton from '../../components/customButton';
import CustomLink from '../../components/customLink';
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
import { authLoginUser } from '../../services/User/authLogin';
import { MessageObj } from '@/app/models/MessageObj';
import { getMeAuth } from '@/app/services/User/GetAuthToken';

const Login: React.FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<MessageObj>(
    new MessageObj('info', 'Bem-vindo', 'Por favor, faça login', 'info')
  );
  const [showMessage, setShowMessage] = useState(false);
  const { theme, isDarkMode } = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  }, [message]);

  useEffect(() => {
    (async () => {
      const me = await getMeAuth();
      if (me) {
        window.location.replace('/pages/dashboard');
      }
    })();
  }, []);

  const handleSubmit = async () => {
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
    try {
      const result = await authLoginUser(user, password);
      setMessage(result.message);

      await new Promise(resolve => setTimeout(resolve, 1000));
      if (result.message.severity === 'success') {
        localStorage.setItem('jwtToken', result.token);
        window.location.replace('/pages/dashboard');
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
            src="/login/img_fundo_1.png"
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
                width: 80,
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
          p: 3
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

          <CustomTypography
            text="Login"
            component="h2"
            variant="h5"
            align="center"
            marginBottom={4}
          />

            <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            >
            <CustomTextField
              name="user"
              label="Usuário"
              type="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              focusedColor="primary"
              hoverColor="info"
            />

            <CustomTextField
              name="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusedColor="primary"
              hoverColor="info"
            />

            <CustomLink
              href="/pages/resetPassword"
              text="Esqueceu sua senha?"
              align="right"
              marginTop={2}
              marginBottom={2}
            />

            <CustomButton
              text="Entrar"
              type="submit"
              colorType="primary"
              hoverColorType="primary"
            />

            <CustomLink
              href='/pages/register'
              text="Não tem conta? Cadastre-se"
              align="center"
              marginTop={2}
              marginBottom={2}
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
        </Container>
      </Box>
    </Box>
  );
};

export default Login;