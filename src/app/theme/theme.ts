declare module '@mui/material/styles' {
  interface Palette {
    button: {
      primary: string;
      star: string;
      delete: string;
    };
  }
  
  interface PaletteOptions {
    button?: {
      primary: string;
      star: string;
      delete: string;
    };
  }
}

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
  alert: {
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

export interface AppTheme {
  palette: Palette;
  mode: "light" | "dark";
}

export const lightTheme: AppTheme = {
  mode: "light",
  palette: {
    background: {
      default: "#ffffff",
      paper: "#e6e6e6",
    },
    text: {
      primary: "#000000",
    },
    button: {
      primary: "#1976d2",
      star: "#ffb400",
      delete: "#d32f2f",
    },
    alert: {
      error: "d32f2f",
      success: "2d7a31",
      warning: "ea6a00",
      info: "0287cf",
    },
  },
};

export const darkTheme: AppTheme = {
  mode: "dark",
  palette: {
    background: {
      default: "#424242",
      paper: "#5c5c5c",
    },
    text: {
      primary: "#ffffff",
    },
    button: {
      primary: "#1976d2",
      star: "#ffb400",
      delete: "#d32f2f",
    },
    alert: {
      error: "d32f2f",
      success: "2d7a31",
      warning: "ea6a00",
      info: "0287cf",
    },
  },
};
