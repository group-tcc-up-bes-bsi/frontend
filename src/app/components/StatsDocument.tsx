import React from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useDocumentStateStore } from "../state/DocumentState";
import { Close } from '@mui/icons-material';
import { useOptionsDashboardStore } from "../state/optionsDashboard";


const StatsDocument: React.FC = () => {
  const theme = useTheme();
  const file = useDocumentStateStore((state) => state.document);
  const lastOption = useOptionsDashboardStore((state) => state.lastOption);
  const alterOption = useOptionsDashboardStore((state) => state.alter);

  const pieData = [
    { id: 0, value: 10, label: "Gregory" },
    { id: 1, value: 20, label: "Lucas" },
    { id: 2, value: 30, label: "Adam" },
  ];

  const barData = [
    { label: "Gregory", value: 15 },
    { label: "Lucas", value: 25 },
    { label: "Adam", value: 35 },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {file?.name}
      </Typography>
      <Close
        onClick={() => {alterOption(lastOption);}}
      sx={{
        fontSize: 30,
        color: theme.palette.text.primary,
        cursor: 'pointer',
        alignSelf: 'flex-end',
        '&:hover': {
          color: theme.palette.error.main,
        }
      }}
      />
      <Typography variant="h5" gutterBottom>
        {file?.createdAt?.toLocaleDateString("pt-BR", {})}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {file?.creator}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Distribution
          </Typography>
          <PieChart
            sx={{
              border: '1px solid #fff',
            }}
            series={[
              {
                data: pieData,
                highlightScope: { fade: "global", highlight: "item" },
                innerRadius: 0,
                outerRadius: 200,
                paddingAngle: 1,
              },
            ]}
            height={500}
            margin={{ top: 20, right: 5, bottom: 20, left: 20 }}
            colors={[
              "#8e24aa", "#039be5", "#fbc02d", "#fb8c00", "#d84315", "#6d4c41", "#757575",
              "#c62828", "#ad1457", "#4527a0", "#283593", "#0277bd", "#00838f", "#2e7d32",
              "#f9a825", "#ff7043", "#5d4037", "#616161", "#b71c1c", "#880e4f", "#1a237e",
            ]}
          />
        </Box>

        {/* Gráfico de Barras (BarChart) */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Performance
          </Typography>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: barData.map((item) => item.label)
              }
            ]}
            series={[
              {
                data: barData.map((item) => item.value),
                color: theme.palette.info.main,
              },
            ]}
            height={300}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsDocument;