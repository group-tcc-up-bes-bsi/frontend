"use client"
import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import CustomButton from '../components/CustomButton';
import CustomLink from '../components/CustomLink';
import CustomTextField from '../components/CustomTextField';
import {
  Box,
  Container,
  CssBaseline,
  useMediaQuery,
  Theme
} from '@mui/material';
import CustomTypography from '../components/CustomTypography';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', { email, password });
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
              color: theme.palette.text.primary
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
              mb: 2,
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

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
              label="Password"
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
              type="submit"
              colorType="primary"
              hoverColorType="primary"
              onClick={() => { toggleTheme() }}
            />

            <CustomLink
              href="/register"
              text="Não tem conta? Cadastre-se"
              align="center"
              marginTop={2}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;