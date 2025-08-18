import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface MonthsSelectorProps {
  monthsCount: number;
  setMonthsCount: (value: number) => void;
}

const MonthsSelector: React.FC<MonthsSelectorProps> = ({ monthsCount, setMonthsCount }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Typography variant="body1">Meses:</Typography>
      <select
        value={monthsCount}
        onChange={e => setMonthsCount(Number(e.target.value))}
        style={{
          padding: '4px 8px',
          borderRadius: 4,
          border: '1px solid',
          borderColor: theme.palette.text.primary,
        }}
      >
        {[3, 6, 9, 12].map(n => (
          <option
            key={n}
            value={n}
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            {n}
          </option>
        ))}
      </select>
    </Box>
  );
};

export default MonthsSelector;
