"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import CustomButton from '../../components/CustomButton';
import CustomLink from '../../components/CustomLink';
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
import { authLoginUser } from '../../api/UserRequest';
import { MessageObj } from '@/app/models/MessageObj';

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

  const handleSubmit = () => {
    authLoginUser(user, password)
      .then(result => {
        setMessage(result.message);
        localStorage.setItem('jwtToken', result.token);
      })
      .catch(error => setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error')));
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
            src="/login/img_fundo_1.png"
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

      {/* Left side - Login Form (40% on desktop, 100% on mobile) */}
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

          <Box component="form" sx={{ mt: 2 }}>
            <CustomTextField
              name="Usuário"
              label="Usuário"
              type="text"
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
              href="/register"
              text="Esqueceu sua senha?"
              align="right"
              marginTop={2}
              marginBottom={2}
            />

            <CustomButton
              text="Entrar"
              type="button"
              colorType="primary"
              hoverColorType="primary"
              onClick={handleSubmit}
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