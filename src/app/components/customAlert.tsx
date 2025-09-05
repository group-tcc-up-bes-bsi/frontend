import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '../theme/ThemeContext';

type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface CustomAlertProps {
  severity?: AlertSeverity;
  title: string;
  description: string;
  duration?: number;
  colorType?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  severity = 'success',
  title = '',
  description = '',
  colorType = 'success',
  duration = 5000,
  onClose
}) => {
  const [open, setOpen] = useState(true);
  const { theme } = useTheme();

  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, handleClose]);

  if (!open) return null;

  return (
    <Stack sx={{ width: '100%', mb: 2 }} spacing={1}>
      <Alert
        severity={severity}
        sx={{
          backgroundColor: theme.palette[colorType].main,
          color: theme.palette.text.primary,
          '& .MuiAlert-icon': {
            color: theme.palette.text.primary,
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {title}
        </Typography>
        <Typography variant="body2" color="inherit">
          {description}
        </Typography>
      </Alert>
    </Stack>
  );
};

export default CustomAlert;