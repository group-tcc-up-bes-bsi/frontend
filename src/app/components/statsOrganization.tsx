import React, { useEffect, useMemo, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useOrganizationStore } from "../state/organizationState";
import { Close } from '@mui/icons-material';
import { useOptionsDashboardStore } from "../state/optionsDashboard";
import { useAuth } from "./useAuth";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CustomComboBox from "./customComboBox";
import { getUserTypeLabel, userInviteAcceptedOptions } from "../services/ConstantsTypes";
import { UserOrganization } from "../models/UserObj";
import { useUserStore } from "../state/userState";
import { getOrganizationUsers } from "../services/Organizations/organizationsServices";

const StatsOrganization: React.FC = () => {
  useAuth();
  const theme = useTheme();
  const organization = useOrganizationStore((state) => state.organization);
  const lastOption = useOptionsDashboardStore((state) => state.lastOption);
  const alterOption = useOptionsDashboardStore((state) => state.alter);
  const [selectedUserInvite, setSelectedUserInvite] = useState('');
  const [usersInvite, serUsersInvite] = useState<UserOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  const userCurrent = useUserStore((state) => state.userCurrent);

  const pieDataDoc = [
    { id: 0, value: 10, label: "PDF" },
    { id: 1, value: 20, label: "Word" },
    { id: 2, value: 30, label: "Excel" },
  ];

  const pieDataUser = [
    { id: 0, value: 10, label: "Visualizador" },
    { id: 1, value: 20, label: "Editor" },
  ];

  useEffect(() => {
    if (organization?.organizationId !== 0 && organization != undefined && userCurrent != undefined) {
      (async () => {
        try {
          const result = await getOrganizationUsers(organization.organizationId, userCurrent)
          serUsersInvite(result.users);
        } finally { }
      })();
    }
  }, [userCurrent, theme]);

  const filteredUsersInvite = useMemo(() => {
    setLoading(true);

    let filtered = usersInvite;

    if (selectedUserInvite == 'true') {
      filtered = filtered.filter((user) => user.inviteAccepted == true);
    } else if (selectedUserInvite == 'false') {
      filtered = filtered.filter((user) => user.inviteAccepted == false);
    }

    setTimeout(() => setLoading(false), 300);
    return filtered;
  }, [usersInvite, selectedUserInvite]);

  const handleChangeUserInvite = (value: string) => {
    setSelectedUserInvite(value);
  };

  return (
    <Box sx={{
      p: 3, background: theme.palette.background.default, height: '100%',
      backgroundColor: theme.palette.background.default,
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
    }} >
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ width: '40%' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
            Filtro de Convite
          </Typography>
          <Box sx={{ width: '100%' }}>
            <CustomComboBox
              name="user-invite"
              label="Tipo"
              value={selectedUserInvite}
              onChange={handleChangeUserInvite}
              options={userInviteAcceptedOptions}
              focusedColor="primary"
              hoverColor="info"
            />
          </Box>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Box sx={{
            backgroundColor: theme.palette.background.default,
            maxHeight: 'calc(45vh - 250px)',
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
            },
          }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                    <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Usuário</TableCell>
                    <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Tipo</TableCell>
                    <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '1rem' }}>Convite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsersInvite.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell sx={{ background: theme.palette.background.default }}>
                        {user.username}
                      </TableCell>
                      <TableCell sx={{ background: theme.palette.background.default }}>
                        {getUserTypeLabel(user.userType)}
                      </TableCell>
                      <TableCell sx={{ background: theme.palette.background.default }}>
                        {
                          userInviteAcceptedOptions.find(
                            (opt) => opt.value === String(user.inviteAccepted)
                          )?.label || "-"
                        }
                      </TableCell>
                    </TableRow>
                  ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 4, alignItems: 'center' }}>
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

      <Box sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, gap: 3, mt: 5 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Documentos por Tipo
          </Typography>
          <PieChart
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
              paddingX: 40,
            }}
            series={[
              {
                data: pieDataDoc,
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
            Usuários por Tipo
          </Typography>
          <PieChart
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.text.primary,
              paddingX: 40,
            }}
            series={[
              {
                data: pieDataUser,
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
      </Box>
    </Box >
  );
};

export default StatsOrganization;