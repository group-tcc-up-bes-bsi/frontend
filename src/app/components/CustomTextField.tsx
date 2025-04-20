"use client"
import { TextField, TextFieldProps } from '@mui/material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';

// Define the base props without extending TextFieldProps
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
  marginBottom?: number;
}

// Combine with TextFieldProps using intersection
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
  marginBottom = 3,
  ...props
}: CustomTextFieldProps) => {
  const { theme } = useCustomTheme();

  return (
    <TextField
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
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
        },
        mb: marginBottom,
        ...props.sx
      }}
      {...props}
    />
  );
};

export default CustomTextField;