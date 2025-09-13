import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material';
import CustomTypography from '../customTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import Documents from '../documents';
import CustomButton from '../customButton';
import CustomTextField from '../customTextField';
import { useDocumentViewerStore } from '@/app/state/documentViewerState';
import { useFilterStore } from '@/app/state/filterState';
import { useAuth } from '../useAuth';
import { useDocumentFormStore } from '@/app/state/documentFormState';
import DocumentForm from '../documents/documentForm';
import { useDocumentStore } from '@/app/state/documentState';
import { DocumentObj } from '@/app/models/DocumentObj';
import { getUserTypeLabel, organizationType, userInviteAcceptedOptions } from '@/app/services/ConstantsTypes';
import TableDocuments from '../tableDocuments';
import { useOrganizationStore } from '@/app/state/organizationState';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';
import { getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useUserStore } from '@/app/state/userState';
import { UserOrganization } from '@/app/models/UserObj';
import CustomComboBox from '../customComboBox';
import { Close } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';
import { buildPieDataDocumentsType, buildPieDataUser } from '@/app/services/Organizations/buildPieOrganization';
import { getDocuments } from '@/app/services/Documents/DocumentsServices';


const OpenOrganization: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();
    const modeViewer = useDocumentViewerStore((state) => state.mode);
    const alterModeViewer = useDocumentViewerStore((state) => state.alter);
    const [colorMode1, setColorMode1] = useState(theme.palette.button.primary);
    const [colorMode2, setColorMode2] = useState(theme.palette.text.primary);
    const documentForm = useDocumentFormStore((state) => state.documentForm);
    const alterDocumentForm = useDocumentFormStore((state) => state.alter);
    const alterDoc = useDocumentStore((state) => state.alter);
    const organization = useOrganizationStore((state) => state.organization);
    const alterOption = useOptionsDashboardStore((state) => state.alter);
    const lastOption = useOptionsDashboardStore((state) => state.lastOption);
    const [selectedUserInvite, setSelectedUserInvite] = useState('');
    const [usersInvite, setUsersInvite] = useState<UserOrganization[]>([]);
    const [documents, /*setDocuments*/] = useState<DocumentObj[]>([]);
    const [loading, setLoading] = useState(false);
    const userCurrent = useUserStore((state) => state.userCurrent);

    const pieDataDoc = useMemo(() => buildPieDataDocumentsType(getDocuments()), [documents])

    const pieDataUser = useMemo(() => buildPieDataUser(usersInvite), [usersInvite]);

    const toggleModeViewer = (mode: number) => {
        alterModeViewer(mode)
        if (mode == 1) {
            setColorMode1(theme.palette.button.primary)
            setColorMode2(theme.palette.text.primary)
        }
        if (mode == 2) {
            setColorMode1(theme.palette.text.primary)
            setColorMode2(theme.palette.button.primary)
        }
    };

    useEffect(() => {
        toggleModeViewer(modeViewer)
    },);

    const toggleDocumentForm = () => {
        const document: DocumentObj = {
            documentId: 0,
            name: '',
            type: '',
            description: '',
            creationDate: new Date(),
            lastModifiedDate: new Date(),
            version: '',
            creator: '',
            imagemSrc: '',
            organization: {
                organizationId: 0,
                name: '',
                description: '',
                favorite: false,
                organizationType: organizationType.INDIVIDUAL,
                borderColor: undefined,
                icon: undefined,
            },
            favorite: false,
        }
        alterDoc(document)
        alterDocumentForm(!documentForm);
    }

    useEffect(() => {
        if (organization?.organizationId !== 0 && organization != undefined && userCurrent != undefined) {
            (async () => {
                try {
                    const result = await getOrganizationUsers(organization.organizationId, userCurrent)
                    setUsersInvite(result.users);
                    buildPieDataUser(result.users);
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
            <Box sx={{
                display: 'flex',
                gap: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton
                        text="Adicionar Documento"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={toggleDocumentForm}
                        paddingY={2}
                    />
                </Box>
                <Box
                    sx={{ width: '55%' }}>
                    <CustomTextField
                        name="filter"
                        label="Informe um detalhe"
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    display: 'flex',
                }}>
                    <Menu onClick={() => { toggleModeViewer(1) }} sx={{ color: colorMode1, fontSize: 32 }} />
                    <Divider
                        orientation="vertical"
                        sx={{
                            backgroundColor: theme.palette.text.primary,
                            height: 30,
                            margin: '0 10px',
                            padding: 0.2,
                            borderRadius: '20%'
                        }} />
                    <SpaceDashboard onClick={() => { toggleModeViewer(2) }} sx={{ color: colorMode2, fontSize: 32 }} />
                </Box>
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
            <Box sx={{
                display: 'flex',
                width: '100%',
                background: theme.palette.background.default,
                marginTop: 2,
                paddingLeft: 2
            }}>
                <CustomTypography
                    text="Documentos da Organização: 10"
                    component="h2"
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        mt: 1,
                        fontWeight: 'bold',
                    }}
                />
            </Box>
            {modeViewer == 1 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    maxHeight: 'calc(85vh - 150px)',
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
                    <TableDocuments />
                </Box>
            )
            }
            {modeViewer == 2 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    maxHeight: 'calc(85vh - 150px)',
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
                    <Documents />
                </Box>
            )}
            {documentForm && <DocumentForm />}

            <Box sx={{ padding: 2, display: "flex", flexDirection: "row", justifyContent: 'space-around', alignItems: 'center', marginTop: '2rem', background: theme.palette.background.default }}>
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
                        padding: 1,
                        maxHeight: 'calc(85vh - 150px)',
                        pr: 2,
                        '&::-webkit-scrollbar': {
                            width: '2px',
                            height: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: theme.palette.background.default,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '6px',
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
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 3,
                mt: 5,
                background: theme.palette.background.default,
                padding: 5
            }}>
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

export default OpenOrganization;