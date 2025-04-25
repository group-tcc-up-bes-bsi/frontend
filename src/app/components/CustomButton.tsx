"use client"
import { Button, ButtonProps } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

interface CustomButtonProps extends ButtonProps {
  text: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  colorType?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  hoverColorType?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingY?: number;
}

const CustomButton = ({
  text,
  onClick,
  fullWidth = true,
  variant = 'contained',
  colorType = 'primary',
  hoverColorType,
  marginTop = 2,
  marginBottom = 2,
  marginLeft = 0,
  marginRight = 0,
  paddingY = 1.5,
  ...props
}: CustomButtonProps) => {
  const { theme } = useTheme();
  
  const hoverColor = hoverColorType || colorType;

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      onClick={onClick}
      sx={{
        mt: marginTop,
        mb: marginBottom,
        ml: marginLeft,
        mr: marginRight,
        py: paddingY,
        backgroundColor: theme.palette[colorType].main,
        '&:hover': {
          backgroundColor: theme.palette[hoverColor].main,
          opacity: 0.9
        },
        ...props.sx
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;