import React, { useEffect, useState } from "react";
import { PieChart, BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDocumentStore } from "../../state/documentState";
import { Close } from '@mui/icons-material';
import { useOptionsDashboardStore } from "../../state/optionsDashboard";
import CustomButton from "../customButton";
import MonthsSelector from "../monthsSelector";
import { useAuth } from "../useAuth";
import Versions from "../versions/versions";
import { useDocumentVersionStore } from "@/app/state/dataDocumentVersion";
import { buildPieDataVersions } from "@/app/services/Documents/buildPieDocument";
import { buildBarDataVersions } from "@/app/services/Documents/buildBarDataVersions";
import { getVersionsByDocument } from "@/app/services/Versions/getVersions";
import { VersionObj } from "@/app/models/VersionObj";
import { useUserStore } from "@/app/state/userState";
import { useVersionFormStore } from "@/app/state/versionFormState";

const OpenDocument: React.FC = () => {
  useAuth();
  const theme = useTheme();
  const document = useDocumentStore((state) => state.document);
  const lastOption = useOptionsDashboardStore((state) => state.lastOption);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const dataBar = useDocumentVersionStore((state) => state.dataBar);
  const dataPie = useDocumentVersionStore((state) => state.dataPie);
  const alterPie = useDocumentVersionStore((state) => state.alterPie);
  const alterBar = useDocumentVersionStore((state) => state.alterBar);
  const [allVersions, setVersions] = useState<VersionObj[]>([]);
  const userCurrent = useUserStore((state) => state.userCurrent);
  const versionForm = useVersionFormStore((state) => state.versionForm);
  const [monthsCount, setMonthsCount] = React.useState(6);

  useEffect(() => {
    if (userCurrent != undefined) {
      (async () => {
        try {
          if (document) {
            const result = await getVersionsByDocument(userCurrent, document);
            setVersions(result.versions);
          }

        } finally { }
      })();
    }
  }, [userCurrent, theme, versionForm]);

  useEffect(() => {
    if (!allVersions) return;

    if (allVersions) {
      alterPie(buildPieDataVersions(allVersions));
      alterBar(buildBarDataVersions(allVersions, monthsCount));
    }
  }, [allVersions, monthsCount, alterPie, alterBar]);

  return (
    <Box sx={{
      p: 3, background: theme.palette.background.paper, height: '100%',
      maxHeight: 'calc(100vh - 50px)',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.palette.background.default,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.main,
        borderRadius: '3px',
      }
    }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
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
          {"Data criação: " + document?.creationDate?.toLocaleDateString("pt-BR", {})}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {"Organização: " + document?.organization.name}
        </Typography>
      </Box>
      <Versions />
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        mt: 5,
        background: theme.palette.background.default,
        padding: 5
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 7 }}>
            Versões por usuário
          </Typography>
          <PieChart
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
              paddingX: 10,
            }}
            series={[
              {
                data: dataPie || [],
                highlightScope: { fade: "global", highlight: "item" },
                innerRadius: 0,
                outerRadius: 200,
                paddingAngle: 0,
              },
            ]}
            height={500}
            margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
            colors={[
              "#8e24aa", "#039be5", "#fbc02d", "#fb8c00", "#d84315", "#6d4c41", "#757575",
              "#c62828", "#ad1457", "#4527a0", "#283593", "#0277bd", "#00838f", "#2e7d32",
              "#f9a825", "#ff7043", "#5d4037", "#616161", "#b71c1c", "#880e4f", "#1a237e",
            ]}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Versões por mês
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
                data: (dataBar || []).map((item) => item?.label || ""),
              },
            ]}
            series={[
              {
                data: (dataBar || []).map((item) => item?.value || 0),
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

export default OpenDocument;