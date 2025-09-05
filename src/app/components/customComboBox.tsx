"use client";

import React from "react";
import { TextField, TextFieldProps, MenuItem } from "@mui/material";
import { useTheme as useCustomTheme } from "../theme/ThemeContext";

interface CustomComboBoxProps
  extends Omit<TextFieldProps, "onChange" | "value" | "name" | "label"> {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  marginBottom?: number;
  focusedColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  hoverColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

const CustomComboBox: React.FC<CustomComboBoxProps> = ({
  name,
  label,
  value,
  onChange,
  margin = "normal",
  required = true,
  fullWidth = true,
  autoComplete,
  focusedColor = "primary",
  hoverColor = "info",
  marginBottom = 3,
  options,
  sx,
  ...props
}) => {
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
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      slotProps={{
        select: {
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            },
          },
          ...(props.slotProps?.select ?? {}),
        },
      }}
      sx={{
        "& .MuiInputLabel-root": {
          color: theme.palette.text.primary,
          "&.Mui-focused": { color: theme.palette.text.primary },
        },
        "& .MuiOutlinedInput-root": {
          color: theme.palette.text.primary,
          "& fieldset": { borderColor: theme.palette.text.primary },
          "&:hover fieldset": { borderColor: theme.palette[hoverColor].main },
          "&.Mui-focused fieldset": { borderColor: theme.palette[focusedColor].main },
        },
        mb: marginBottom,
        ...sx,
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            "&:hover": { backgroundColor: theme.palette.action.hover },
            "&.Mui-selected": { backgroundColor: theme.palette.action.selected },
            "&.Mui-selected:hover": { backgroundColor: theme.palette.action.selected },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomComboBox;
