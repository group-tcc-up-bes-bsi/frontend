"use client"
import LoginPage from "./pages/LoginPage";
import { ThemeProvider } from "./theme/ThemeContext"; // Note a mudança no nome
import { CssBaseline } from '@mui/material';

export default function Home() {
  return (
    <ThemeProvider> {/* Agora usando o nome correto */}
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}