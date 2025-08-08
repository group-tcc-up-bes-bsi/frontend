"use client"
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';
import { useState } from 'react';

interface CustomTextFieldBaseProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  fullWidth?: boolean;
  type?: string;
  autoComplete?: string;
  focusedColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  hoverColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  marginTop?: number;
  marginBottom?: number;
  showPasswordToggle?: boolean;
}

type CustomTextFieldProps = CustomTextFieldBaseProps & Omit<TextFieldProps, keyof CustomTextFieldBaseProps>;

const CustomTextField = ({
  name,
  label,
  value,
  onChange,
  margin = 'normal',
  required = true,
  fullWidth = true,
  type = 'text',
  autoComplete,
  focusedColor = 'primary',
  hoverColor = 'info',
  marginTop = 2,
  marginBottom = 3,
  showPasswordToggle = type === 'password',
  multiline = false,
  maxRows,
  ...props
}: CustomTextFieldProps) => {
  const { theme } = useCustomTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const shouldShowToggle = showPasswordToggle && type === 'password';
  const inputType = shouldShowToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <TextField
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      name={name}
      label={label}
      type={inputType}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: shouldShowToggle ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              sx={{ color: theme.palette.text.primary }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
        ...props.InputProps
      }}
      multiline={multiline}
      maxRows={maxRows}
      sx={{
        '& .MuiInputLabel-root': {
          color: theme.palette.text.primary,
          '&.Mui-focused': {
            color: theme.palette.text.primary
          }
        },
        '& .MuiOutlinedInput-root': {
          color: theme.palette.text.primary,
          '& fieldset': {
            borderColor: theme.palette.text.primary
          },
          '&:hover fieldset': {
            borderColor: theme.palette[hoverColor].main
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette[focusedColor].main
          },
          // Estilos para a barra de rolagem
          '& textarea::-webkit-scrollbar': {
            width: '6px',
          },
          '& textarea::-webkit-scrollbar-track': {
            background: theme.palette.background.paper,
          },
          '& textarea::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main, // Azul do tema
            borderRadius: '3px',
          },
        },
        mb: marginBottom,
        mt: marginTop,
        ...props.sx
      }}
      {...props}
    />
  );
};

export default CustomTextField;