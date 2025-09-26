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
  const passwordType = showPassword ? 'text' : 'password';
  const inputType = shouldShowToggle ? passwordType : type;

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
      slotProps={{
        input: {
          endAdornment: shouldShowToggle ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: theme.palette.text.primary }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
          ...(props.slotProps?.input ?? {}),
        },
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
          '& textarea::-webkit-scrollbar': {
            width: '6px',
          },
          '& textarea::-webkit-scrollbar-track': {
            background: theme.palette.background.paper,
          },
          '& textarea::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '3px',
          },

          '& input': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'clip',
            display: 'inline-block',
            animation: value.length > 20 ? 'marquee 8s linear infinite' : 'none',
          },
        },

        '@keyframes marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
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
