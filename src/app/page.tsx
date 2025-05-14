"use client"
import Login from "./pages/login/page";
import { ThemeProvider } from "./theme/ThemeContext";
import { CssBaseline } from '@mui/material';

export default function Home() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Login />
    </ThemeProvider>
  );
}