import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, CircularProgress, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, } from '@mui/material';
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
import { getUserTypeLabel, userInviteAcceptedOptions } from '@/app/services/ConstantsTypes';
import TableDocuments from '../tableDocuments';
import { useOrganizationStore } from '@/app/state/organizationState';
import { getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useUserStore } from '@/app/state/userState';
import { UserOrganization } from '@/app/models/UserObj';
import CustomComboBox from '../customComboBox';
import { PieChart } from '@mui/x-charts';
import { buildPieDataDocumentsType, buildPieDataUser } from '@/app/services/Organizations/buildPieOrganization';
import { countOrganizationDocuments, getOrganizationDocuments } from '@/app/services/Documents/getOrganizationDocuments';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';


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
    const [selectedUserInvite, setSelectedUserInvite] = useState('');
    const [usersInvite, setUsersInvite] = useState<UserOrganization[]>([]);
    const [documents, setDocuments] = useState<DocumentObj[]>([]);
    const [loading, setLoading] = useState(false);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [documentsCount, setDocumentsCount] = useState(0);
    const [pieDataDoc, setPieDataDoc] = useState(() => buildPieDataDocumentsType(documents));
    const [message, setMessage] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const pieDataUser = useMemo(() => buildPieDataUser(usersInvite), [usersInvite]);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

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

    const toggleDocumentForm = async () => {
        if (userCurrent != undefined) {
            try {
                if (organization) {
                    const result = await getOrganizationUsers(organization?.organizationId, userCurrent)
                    const users = result.users;
                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER' || user.userType.toString() == 'WRITE') {
                                const document: DocumentObj = {
                                    documentId: 0,
                                    name: '',
                                    type: '',
                                    description: '',
                                    creationDate: new Date(),
                                    lastModifiedDate: new Date(),
                                    version: '',
                                    organization: {
                                        organizationId: organization.organizationId,
                                        name: organization.name,
                                        description: organization.description,
                                        favorite: organization.favorite,
                                        organizationType: organization.organizationType,
                                        borderColor: undefined,
                                        icon: undefined,
                                    },
                                    favorite: false,
                                }
                                alterDoc(document)
                                alterDocumentForm(!documentForm);
                            } else {
                                setMessage(new MessageObj('warning', 'Não Permitido', 'Usuário Visualizador não pode adicionar documentos', 'warning'));
                            }
                        }
                    }
                }
            } catch (error) {
                setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
            }
        }
    }


    useEffect(() => {
        setDocumentsCount(countOrganizationDocuments(documents))
        setPieDataDoc(buildPieDataDocumentsType(documents));
    }, [documents])

    useEffect(() => {
        if (organization?.organizationId !== 0 && organization != undefined && userCurrent != undefined) {
            (async () => {
                try {
                    const result = await getOrganizationUsers(organization.organizationId, userCurrent)
                    setUsersInvite(result.users);
                    buildPieDataUser(result.users);
                    const resultDocs = await getOrganizationDocuments(userCurrent, organization);
                    setDocuments([...resultDocs.documents])
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } finally { }
            })();
        }
    }, [userCurrent, theme, documentForm]);

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
        <Box
            sx={{
                background: theme.palette.background.paper,
                height: '100%',
                maxHeight: 'calc(100vh - 50px)',
                overflowY: 'auto',
                p: isMobile ? 1 : 3,
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
                gap: isMobile ? 2 : 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    <CustomButton
                        text="Adicionar Documento"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={toggleDocumentForm}
                        paddingY={isMobile ? 1 : 2.2}
                        marginBottom={0}
                        marginTop={0}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: isMobile ? 2 : 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: isMobile ? '100%' : '75%'
                }}>
                    <Box sx={{
                        width: isMobile ? '100%' : isTablet ? '75%' : '75%'
                    }}>
                        <CustomTextField
                            name="filter"
                            label="Detalhe do documento"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>

                    <Box sx={{
                        backgroundColor: theme.palette.background.default,
                        padding: isMobile ? 1.4 : 0.5,
                        display: 'flex',
                        borderRadius: 1,
                        alignItems: 'center',
                    }}>
                        <IconButton
                            onClick={() => { toggleModeViewer(1) }}
                            size={isMobile ? "small" : "medium"}
                        >
                            <Menu sx={{
                                color: colorMode1,
                                fontSize: isMobile ? 24 : 32
                            }} />
                        </IconButton>
                        <Divider
                            orientation="vertical"
                            sx={{
                                backgroundColor: theme.palette.text.primary,
                                height: isMobile ? 30 : 40,
                                margin: isMobile ? '0 5px' : '0 10px',
                                padding: isMobile ? 0.1 : 0.2,
                                borderRadius: '20%'
                            }} />
                        <IconButton
                            onClick={() => { toggleModeViewer(2) }}
                            size={isMobile ? "small" : "medium"}
                        >
                            <SpaceDashboard sx={{
                                color: colorMode2,
                                fontSize: isMobile ? 24 : 32
                            }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                width: '100%',
                background: theme.palette.background.default,
                marginTop: isMobile ? 1 : 2,
                paddingLeft: isMobile ? 1 : 2
            }}>
                <CustomTypography
                    text={"Documentos: " + documentsCount}
                    component="h2"
                    variant={isMobile ? "h6" : "h5"}
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
                    padding: isMobile ? 0.5 : 1,
                    maxHeight: isMobile ? '400px' : 'calc(85vh - 150px)',
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
            )}

            {modeViewer == 2 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: isMobile ? 0.5 : 1,
                    maxHeight: isMobile ? '400px' : 'calc(85vh - 150px)',
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

            <Box sx={{
                padding: isMobile ? 1 : 2,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: 'space-around',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginTop: isMobile ? '1rem' : '2rem',
                background: theme.palette.background.default,
                gap: isMobile ? 2 : 0
            }}>
                <Box sx={{
                    width: isMobile ? '100%' : '40%',
                    mb: isMobile ? 2 : 0
                }}>
                    <Typography
                        variant={isMobile ? "body1" : "h6"}
                        gutterBottom
                        sx={{ mb: 1, fontWeight: 'bold' }}
                    >
                        Filtro de Convite
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                        <CustomComboBox
                            name="user-invite"
                            label="Aceito?"
                            value={selectedUserInvite}
                            onChange={handleChangeUserInvite}
                            options={userInviteAcceptedOptions}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            sx={{ marginTop: 0 }}
                        />
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                        width: isMobile ? '100%' : '60%'
                    }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Box sx={{
                        backgroundColor: theme.palette.background.default,
                        padding: 1,
                        maxHeight: isMobile ? '300px' : 'calc(85vh - 150px)',
                        pr: isMobile ? 0 : 2,
                        overflowX: 'auto',
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
                            <Table
                                sx={{ minWidth: isMobile ? 250 : 500 }}
                                aria-label="tabela de Documentos"
                                size={isMobile ? "small" : "medium"}
                            >
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                        <TableCell sx={{
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            fontSize: isMobile ? '0.75rem' : '1rem'
                                        }}>Usuário</TableCell>
                                        <TableCell sx={{
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            fontSize: isMobile ? '0.75rem' : '1rem'
                                        }}>Tipo</TableCell>
                                        <TableCell sx={{
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            fontSize: isMobile ? '0.75rem' : '1rem'
                                        }}>Convite</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsersInvite.map((user) => (
                                        <TableRow key={user.username}>
                                            <TableCell sx={{
                                                background: theme.palette.background.default,
                                                fontSize: isMobile ? '0.8rem' : '1rem'
                                            }}>
                                                {user.username}
                                            </TableCell>
                                            <TableCell sx={{
                                                background: theme.palette.background.default,
                                                fontSize: isMobile ? '0.8rem' : '1rem'
                                            }}>
                                                {getUserTypeLabel(user.userType)}
                                            </TableCell>
                                            <TableCell sx={{
                                                background: theme.palette.background.default,
                                                fontSize: isMobile ? '0.8rem' : '1rem'
                                            }}>
                                                {
                                                    userInviteAcceptedOptions.find(
                                                        (opt) => opt.value === String(user.inviteAccepted)
                                                    )?.label || "-"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: isMobile ? 'column' : 'row',
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
                        sx={{ fontWeight: 'bold' }}
                    >
                        Documentos por Tipo
                    </Typography>
                    {pieDataDoc.length > 0 ? (
                        <Box>
                            <Box sx={{
                                border: '1px dashed',
                                borderColor: theme.palette.text.primary,
                                padding: isMobile ? 1 : 2,
                            }}>
                                <PieChart
                                    series={[{
                                        data: pieDataDoc,
                                        highlightScope: { fade: "global", highlight: "item" },
                                        outerRadius: isMobile ? 100 : 200,
                                    }]}
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
                                    maxHeight: isMobile ? '150px' : '200px',
                                    overflowY: 'auto',
                                    p: 1
                                }}>
                                    {pieDataDoc.map((item, index) => (
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
                                Sem documentos para a organização selecionada
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
                        Usuários por Tipo
                    </Typography>
                    {pieDataUser.length > 0 ? (
                        <Box>
                            <Box sx={{
                                border: '1px dashed',
                                borderColor: theme.palette.text.primary,
                                padding: isMobile ? 1 : 2,
                            }}>
                                <PieChart
                                    series={[{
                                        data: pieDataUser,
                                        highlightScope: { fade: "global", highlight: "item" },
                                        outerRadius: isMobile ? 100 : 200,
                                    }]}
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
                                    maxHeight: isMobile ? '150px' : '200px',
                                    overflowY: 'auto',
                                    p: 1
                                }}>
                                    {pieDataUser.map((item, index) => (
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
                                Sem usuários para a organização selecionada
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {showMessage && message && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? '5%' : '2%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
                        width: isMobile ? '90%' : 'auto',
                        zIndex: 9999
                    }}>
                    <CustomAlert
                        severity={message.severity}
                        colorType={message.colorType}
                        title={message.title}
                        description={message.description}
                    />
                </Box>
            )}
        </Box>
    );
};

export default OpenOrganization;