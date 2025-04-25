"use client"
import Login from "./pages/Login";
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