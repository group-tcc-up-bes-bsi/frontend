"use client"
import { Typography, TypographyProps } from '@mui/material';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';

interface CustomTypographyProps {
  text?: string;
  component?: React.ElementType;
  variant?: TypographyProps['variant'];
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  colorType?: 'primary' | 'secondary';
  marginBottom?: number | string;
  fontWeight?: number | string;
  sx?: TypographyProps['sx'];
}

const CustomTypography = ({
  text,
  component = 'h2',
  variant = 'h5',
  align = 'center',
  gutterBottom = true,
  colorType = 'primary',
  marginBottom = 0,
  fontWeight,
  sx = {},
  ...props
}: CustomTypographyProps & Omit<TypographyProps, keyof CustomTypographyProps>) => {
  const { theme } = useCustomTheme();

  return (
    <Typography
      component={component}
      variant={variant}
      align={align}
      gutterBottom={gutterBottom}
      sx={{
        color: theme.palette.text[colorType],
        mb: marginBottom,
        fontWeight,
        ...sx
      }}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default CustomTypography;