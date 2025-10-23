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
import { IconButton, useMediaQuery } from "@mui/material";
import { useAuditLogStore } from "@/app/state/auditLogState";
import LogsViewer from "../auditLogs/logsViewer";

const OpenDocument: React.FC = () => {
  useAuth();
  const theme = useTheme();
  const document = useDocumentStore((state) => state.document);
  const openLog = useAuditLogStore((state) => state.openLog);
  const alterOpenLog = useAuditLogStore((state) => state.alter);
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    alterPie(buildPieDataVersions(allVersions));
    alterBar(buildBarDataVersions(allVersions, monthsCount));
  }, [allVersions, monthsCount, alterPie, alterBar]);

  return (
    <Box sx={{
      p: isMobile ? 1 : 3,
      background: theme.palette.background.paper,
      height: '100%',
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
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          gap: isMobile ? 2 : 4,
          alignItems: 'center',
          flex: 1
        }}>
          <CustomButton
            text="Visualizar log"
            type="button"
            colorType="primary"
            hoverColorType="primary"
            paddingY={1}
            paddingX={isMobile ? 2 : 3}
            fullWidth={false}
            sx={{
              minWidth: isMobile ? '140px' : 'auto'
            }}
            onClick={() => alterOpenLog(!openLog)}
          />
          <IconButton
            onClick={() => { alterOption(lastOption); }}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                color: theme.palette.error.main,
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <Close sx={{ fontSize: isMobile ? 24 : 30 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: 'space-between',
        mt: 2,
        gap: isMobile ? 1 : 0
      }}>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          gutterBottom
          sx={{ fontWeight: isMobile ? 'bold' : 'normal' }}
        >
          {"Data criação: " + (document?.creationDate?.toLocaleDateString("pt-BR", {}) || 'N/A')}
        </Typography>

      </Box>

      <Versions />

      <Box sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 3,
        mt: isMobile ? 3 : 5,
        background: theme.palette.background.default,
        padding: isMobile ? 2 : 5
      }}>
        <Box sx={{
          flex: 1,
          width: isMobile ? '100%' : '50%'
        }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            gutterBottom
            sx={{
              mb: isMobile ? 1 : 7,
              fontWeight: 'bold'
            }}
          >
            Versões por usuário
          </Typography>
          {dataPie && dataPie.length > 0 ? (
            <Box sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
              padding: isMobile ? 1 : 2,
              overflow: 'auto'
            }}>

              <PieChart
                series={[
                  {
                    data: dataPie || [],
                    highlightScope: { fade: "global", highlight: "item" },
                    innerRadius: 0,
                    outerRadius: isMobile ? 120 : 200,
                    paddingAngle: 0,
                  },
                ]}
                height={isMobile ? 300 : 500}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                colors={[
                  "#8e24aa", "#039be5", "#fbc02d", "#fb8c00", "#d84315", "#6d4c41", "#757575",
                  "#c62828", "#ad1457", "#4527a0", "#283593", "#0277bd", "#00838f", "#2e7d32",
                ]}
                sx={{
                  width: '100%',
                  '& .MuiChartsLegend-root': {
                    display: 'none !important',
                  }
                }}
              />
              <Box sx={{
                mt: 2,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 1,
                maxHeight: isMobile ? '120px' : '150px',
                overflowY: 'auto',
                p: 1
              }}>
                {dataPie.map((item, index) => (
                  <Box key={item.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: [
                        "#8e24aa", "#039be5", "#fbc02d", "#fb8c00", "#d84315", "#6d4c41", "#757575",
                        "#c62828", "#ad1457", "#4527a0", "#283593", "#0277bd", "#00838f", "#2e7d32",
                      ][index % 14],
                      borderRadius: '2px'
                    }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: 'inherit'
                      }}
                    >
                      {item.label}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                height: isMobile ? 200 : 500,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed',
                borderColor: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  textAlign: 'center',
                  p: 2
                }}
              >
                Sem versões para o documento selecionado
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{
          flex: 1,
          width: isMobile ? '100%' : '50%'
        }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Versões por mês
          </Typography>

          <Box sx={{ mb: isMobile ? 0 : 2 }}>
            <MonthsSelector
              monthsCount={monthsCount}
              setMonthsCount={setMonthsCount}
            />
          </Box>

          {dataBar?.length && dataBar?.length > 0 ? (
            <Box sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
              padding: isMobile ? 1 : 2,
              overflow: 'auto'
            }}>
              <BarChart
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
                height={isMobile ? 300 : 553}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                sx={{
                  width: '95%',
                }}
              />
            </Box>) : (
            <Box
              sx={{
                height: isMobile ? 200 : 500,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed',
                borderColor: theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  textAlign: 'center',
                  p: 2
                }}
              >
                Sem versões para o documento selecionado
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {openLog && <LogsViewer />}
    </Box>
  );
};

export default OpenDocument;