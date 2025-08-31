import React from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDocumentStateStore } from "../state/documentState";
import { Close } from '@mui/icons-material';
import { useOptionsDashboardStore } from "../state/optionsDashboard";
import CustomButton from "./CustomButton";
import MonthsSelector from "./MonthsSelector";

const StatsDocument: React.FC = () => {
  const theme = useTheme();
  const document = useDocumentStateStore((state) => state.document);
  const lastOption = useOptionsDashboardStore((state) => state.lastOption);
  const alterOption = useOptionsDashboardStore((state) => state.alter);

  const pieData = [
    { id: 0, value: 10, label: "Gregory" },
    { id: 1, value: 20, label: "Lucas" },
    { id: 2, value: 30, label: "Adam" },
  ];

  const [monthsCount, setMonthsCount] = React.useState(6);

  const getLastMonths = (numMonths: number) => {
    const months = [];
    const now = new Date();
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");
      months.push({ label, value: 12 });
    }
    return months;
  };

  const barData = getLastMonths(monthsCount);

  return (
    <Box sx={{ p: 3, background: theme.palette.background.default, height: '100%' }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {document?.documentName}
        </Typography>


        <Box sx={{ display: "flex", flexDirection: "row", gap: 4, alignItems: 'center' }}>
          <CustomButton
            text="Visualizar log"
            type="button"
            colorType="primary"
            hoverColorType="primary"
            paddingY={1}
            paddingX={3}
            fullWidth={false}
          />
          <Close
            onClick={() => { alterOption(lastOption); }}
            sx={{
              fontSize: 30,
              color: theme.palette.text.primary,
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.error.main,
              }
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {"Data criação: " + document?.documentCreationDate?.toLocaleDateString("pt-BR", {})}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {"Criado por " + document?.creator}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mt: 5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 7 }}>
            Alterações por usuário
          </Typography>
          <PieChart
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
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

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Alterações por mês
          </Typography>
          <MonthsSelector
            monthsCount={monthsCount}
            setMonthsCount={setMonthsCount}
          />
          <BarChart
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
            }}
            xAxis={[
              {
                scaleType: "band",
                data: (barData || []).map((item) => item?.label || ""),
              },
            ]}
            series={[
              {
                data: (barData || []).map((item) => item?.value || 0),
                color: theme.palette.info.main,
              },
            ]}
            height={500}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StatsDocument;