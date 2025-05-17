"use client"
import { 
  TextField, 
  TextFieldProps, 
  MenuItem,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';

interface CustomComboBoxBaseProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
  focusedColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  hoverColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  marginBottom?: number;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
}

type CustomComboBoxProps = CustomComboBoxBaseProps & Omit<TextFieldProps, keyof CustomComboBoxBaseProps>;

const CustomComboBox = ({
  name,
  label,
  value,
  onChange,
  margin = 'normal',
  required = true,
  fullWidth = true,
  autoComplete,
  focusedColor = 'primary',
  hoverColor = 'info',
  marginBottom = 3,
  options,
  ...props
}: CustomComboBoxProps) => {
  const { theme } = useCustomTheme();

  return (
    <TextField
      select
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }
          }
        },
        ...props.SelectProps
      }}
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
    >
      {options.map((option) => (
        <MenuItem 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
            },
            '&.Mui-selected:hover': {
              backgroundColor: theme.palette.action.selected,
            }
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomComboBox;