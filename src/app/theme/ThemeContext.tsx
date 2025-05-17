"use client"
import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { useThemeStore } from '../state/themeState';

interface ThemeContextValue {
  theme: ReturnType<typeof createTheme>;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDarkMode = useThemeStore((state) => state.theme);
  const setIsDarkMode = useThemeStore((state) => state.alter);;
  const [mounted, setMounted] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = useMemo(() => {
    const baseTheme = isDarkMode ? darkTheme : lightTheme;
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: baseTheme.palette.button.primary,
        },
        error: {
          main: baseTheme.palette.button.delete,
        },
        background: {
          default: baseTheme.palette.background.default,
          paper: baseTheme.palette.background.paper,
        },
        text: {
          primary: baseTheme.palette.text.primary,
        },
        button: {
          primary:  baseTheme.palette.button.primary,
          star:  baseTheme.palette.button.star,
          delete:  baseTheme.palette.button.delete,
        }
      },
    });
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Don't render until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};