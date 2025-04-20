interface Palette {
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
    };
    button: {
      primary: string;
      star: string;
      delete: string;
    };
  }
  
  export interface AppTheme {
    palette: Palette;
    mode: 'light' | 'dark';
  }
  
  export interface AlertColors {
    error: string;
    warning: string;
    info: string;
    success: string;
    text: string;
  }
  
  export const lightTheme: AppTheme = {
    mode: 'light',
    palette: {
      background: {
        default: '#ffffff',
        paper: '#e6e6e6',
      },
      text: {
        primary: '#000000',
      },
      button: {
        primary: '#1976d2',
        star: '#ffb400',
        delete: '#d32f2f',
      },
    },
  };
  
  export const darkTheme: AppTheme = {
    mode: 'dark',
    palette: {
      background: {
        default: '#424242',
        paper: '#5c5c5c',
      },
      text: {
        primary: '#ffffff',
      },
      button: {
        primary: '#1976d2',
        star: '#ffb400',
        delete: '#d32f2f',
      },
    },
  };