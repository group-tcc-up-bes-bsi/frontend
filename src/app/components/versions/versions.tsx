import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useAuth } from '../useAuth';
import { VersionObj } from '@/app/models/VersionObj';
import { useFilterStore } from '@/app/state/filterState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import { formatDate, organizationType } from '@/app/services/ConstantsTypes';
import CustomTypography from '../customTypography';
import MsgConfirm from '../notification/msgConfirm';
import { useVersionFormStore } from '@/app/state/versionFormState';
import { useVersionStore } from '@/app/state/versionState';
import VersionForm from './versionsForm';
import CustomButton from '../customButton';
import { useUserStore } from '@/app/state/userState';
import CustomTextField from '../customTextField';
import { getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useOrganizationStore } from '@/app/state/organizationState';
import CustomAlert from '../customAlert';
import { MessageObj } from '@/app/models/MessageObj';
import { getVersionsByDocument } from '@/app/services/Versions/getVersions';
import { useDocumentStore } from '@/app/state/documentState';
import { deleteVersion } from '@/app/services/Versions/deleteVersion';
import { updateActiveVersion } from '@/app/services/Documents/updateActiveVersion';
import { getDocumentById } from '@/app/services/Documents/getDocumentByID';

const Versions: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedVersion, setSelectedVersion] = useState<VersionObj | null>(null);
    const { filter, setFilter } = useFilterStore();
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
    const versionForm = useVersionFormStore((state) => state.versionForm);
    const alterVersionForm = useVersionFormStore((state) => state.alter);
    const alterVersion = useVersionStore((state) => state.alter);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const organization = useOrganizationStore((state) => state.organization);
    const [message, setMessage] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allVersions, setVersions] = useState<VersionObj[]>([]);
    const document = useDocumentStore((state) => state.document);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [currentVersion, setCurrentVersion] = useState<string>("");

    useEffect(() => {
        const fetchDocumentVersion = async () => {
            try {
                if (userCurrent && document) {
                    const result = await getDocumentById(userCurrent, document);
                    if (result.document) {
                        setCurrentVersion(result.document.version);
                    }
                }
            } finally { }
        };

        fetchDocumentVersion();
    }, [allVersions, userCurrent, document]);

    useEffect(() => {
        if (!userCurrent || !document) return;
        (async () => {
            setLoading(true);
            try {
                const result = await getVersionsByDocument(userCurrent, document);
                const sorted = result.versions.sort((a, b) => {
                    if (a.name === document.version) return -1;
                    if (b.name === document.version) return 1;
                    return b.creationDate.getTime() - a.creationDate.getTime();
                });
                setVersions(sorted);
            } finally {
                setLoading(false);
            }
        })();
    }, [userCurrent, document, versionForm]);

    const filteredVersions = useMemo(() => {
        const term = filter.toLowerCase().trim();
        return allVersions
            .filter(
                (v) =>
                    v.name.toLowerCase().includes(term) ||
                    v.filePath.toLowerCase().includes(term) ||
                    formatDate(v.creationDate).toLowerCase().includes(term)
            )
            .sort((a, b) => {
                if (a.name === currentVersion) return -1;
                if (b.name === currentVersion) return 1;
                return b.creationDate.getTime() - a.creationDate.getTime();
            });
    }, [allVersions, filter, currentVersion]);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    const toggleVersionForm = async (version: VersionObj) => {
        if (userCurrent != undefined) {
            try {
                if (organization) {
                    const result = await getOrganizationUsers(organization?.organizationId, userCurrent)
                    const users = result.users;
                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER' || user.userType.toString() == 'WRITE') {
                                alterVersion(version);
                                alterVersionForm(!versionForm);
                            }
                            else {
                                setMessage(new MessageObj('warning', 'Não Permitido', 'Usuário Visualizador não pode adicionar versões', 'warning'));
                            }
                        }
                    }
                }

            } catch (error) {
                setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
            }
        }
        setAnchorEl(null);
    }

    const toggleCreateVersionForm = async () => {
        if (userCurrent) {
            try {
                if (organization) {
                    const result = await getOrganizationUsers(
                        organization?.organizationId,
                        userCurrent
                    );

                    const users = result.users;

                    for (const user of users) {
                        if (user.username === userCurrent.username) {
                            if (
                                user.userType.toString() === "OWNER" ||
                                user.userType.toString() === "WRITE"
                            ) {
                                const version: VersionObj = {
                                    documentVersionId: 0,
                                    name: "",
                                    filePath: "",
                                    creationDate: new Date(),
                                    document: {
                                        documentId: 0,
                                        name: "",
                                        type: "",
                                        description: "",
                                        creationDate: new Date(),
                                        lastModifiedDate: new Date(),
                                        organization: {
                                            organizationId: 0,
                                            name: "",
                                            description: "",
                                            favorite: false,
                                            organizationType: organizationType.ALL,
                                            borderColor: "",
                                            icon: null,
                                        },
                                        version: "",
                                        favorite: false,
                                    },
                                    user: {
                                        userId: userCurrent?.userId,
                                        username: userCurrent?.username,
                                        jwtToken: userCurrent?.jwtToken,
                                    },
                                };

                                alterVersion(version);
                                alterVersionForm(!versionForm);
                            } else {
                                setMessage(
                                    new MessageObj(
                                        "warning",
                                        "Não Permitido",
                                        "Usuário Visualizador não pode adicionar versões",
                                        "warning"
                                    )
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                setMessage(
                    new MessageObj("error", "Erro inesperado", `${error}`, "error")
                );
            }
            setAnchorEl(null);
        }
    };

    const handleDeleteVersion = async () => {
        if (selectedVersion && document) {
            alterVersion(selectedVersion);
            alterMsgConfirm(`excluir a versão ${selectedVersion.name}?`);
            alterConfirm(true);

            if (userCurrent != undefined) {
                try {
                    const result = await getOrganizationUsers(
                        document?.organization.organizationId,
                        userCurrent
                    );
                    const users = result.users;

                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER') {
                                useMsgConfirmStore.getState().setOnConfirm(async () => {
                                    if (userCurrent) {
                                        const result = await deleteVersion(
                                            userCurrent,
                                            selectedVersion.documentVersionId
                                        );
                                        setLoading(true);
                                        const resultVersions = await getVersionsByDocument(userCurrent, document);
                                        setVersions(resultVersions.versions);
                                        if (currentVersion === selectedVersion.name) {
                                            const versionsUpdated = resultVersions.versions;

                                            if (versionsUpdated.length > 0) {
                                                const activeVersion = versionsUpdated.reduce((latest, current) =>
                                                    current.creationDate > latest.creationDate ? current : latest
                                                );

                                                await updateActiveVersion(
                                                    document.documentId,
                                                    activeVersion.documentVersionId,
                                                    userCurrent
                                                );
                                                setCurrentVersion(activeVersion.name);
                                            } else {
                                                setCurrentVersion("");
                                            }
                                        }

                                        setLoading(false);
                                        setMessage(result.message);
                                    }
                                });
                            } else {
                                setMessage(
                                    new MessageObj(
                                        'warning',
                                        'Não Permitido',
                                        'Somente o proprietario realizar Exclusão',
                                        'warning'
                                    )
                                );
                            }
                        }
                    }
                } catch (error) {
                    setMessage(
                        new MessageObj(
                            'error',
                            'Erro inesperado',
                            `${error}`,
                            'error'
                        )
                    );
                }
            }
        }
        setAnchorEl(null);
    };

    return (
        <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            flexDirection={'column'}
            justifyContent='center'
            p={isMobile ? 0.5 : 1}
            sx={{ backgroundColor: theme.palette.background.default }}
        >
            <Box display={'flex'}
                justifyContent={'space-between'}
                paddingX={isMobile ? 1 : 12}
                height={isMobile ? 'auto' : 90}
                gap={isMobile ? 2 : 6}
                marginTop={2}
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems={isMobile ? 'stretch' : 'center'}
            >
                <CustomButton
                    text={"+ Nova Versão"}
                    type="button"
                    colorType="primary"
                    onClick={toggleCreateVersionForm}
                    hoverColorType="primary"
                    fullWidth={isMobile}
                    paddingY={1}
                    paddingX={3.0}
                    sx={{
                        width: isMobile ? '100%' : 'auto',
                        minWidth: isMobile ? 'auto' : '140px'
                    }}
                />
                <Box sx={{
                    width: isMobile ? '100%' : '85%',
                    mt: 0
                }}>
                    <CustomTextField
                        name="filter"
                        label="Informe um detalhe da versão"
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        marginTop={0}
                        marginBottom={0}
                    />
                </Box>
            </Box>

            <Typography
                variant={isMobile ? "h5" : "h4"}
                gutterBottom
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: isMobile ? 1 : 0,
                    marginTop: 0,
                    marginBottom: 0,
                }}
            >
                Versões
            </Typography>

            <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
                justifyContent={isMobile ? 'center' : 'center'}
                p={isMobile ? 0.5 : 1}
                sx={{
                    padding: 1,
                    maxHeight: isMobile ? 'calc(85vh - 200px)' : 'calc(85vh - 150px)',
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
                }}
            >
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                        width: '100%'
                    }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : filteredVersions.length === 0 ? (
                    <CustomTypography
                        text='Nenhuma versão encontrada para o filtro informado'
                        component="h6"
                        variant={isMobile ? "body1" : "h6"}
                        sx={{
                            color: theme.palette.text.primary,
                            mt: 1,
                            textAlign: 'center',
                            width: '100%'
                        }}
                    />
                ) : filteredVersions.map((version) => (
                    <Box
                        key={version.documentVersionId}
                        width={isMobile ? '100%' : isTablet ? 200 : 240}
                        maxWidth={isMobile ? '100%' : 240}
                        borderRadius={2}
                        p={isMobile ? 1.5 : 2}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: 2,
                            border: `2px solid ${currentVersion == version.name
                                ? theme.palette.button.primary
                                : theme.palette.divider}`,
                        }}
                    >
                        <Box fontWeight="bold"
                            fontSize={isMobile ? "0.8rem" : "0.9rem"}
                            sx={{ color: theme.palette.text.primary }}
                        >
                            Versão: {version.name}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mt: 1
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1
                            }}>
                                <Box
                                    fontSize={isMobile ? "0.7rem" : "0.8rem"}
                                    sx={{ color: theme.palette.text.primary }}
                                >
                                    Criador: {version.user.username}
                                </Box>
                                <Box
                                    fontSize={isMobile ? "0.65rem" : "0.75rem"}
                                    mt={1}
                                    sx={{ color: theme.palette.text.secondary }}
                                >
                                    Criado em {formatDate(version.creationDate)}
                                </Box>
                            </Box>
                            <Box mt={0.5}>
                                <IconButton
                                    aria-label="more"
                                    onClick={(event) => {
                                        setAnchorEl(event.currentTarget);
                                        setSelectedVersion(version);
                                    }}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        padding: isMobile ? '4px' : '8px',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                >
                                    <MoreVert fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedVersion?.documentVersionId === version.documentVersionId}
                                    onClose={() => setAnchorEl(null)}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => { toggleVersionForm(version) }}
                                        sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                                    >
                                        Alterar
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleDeleteVersion}
                                        sx={{
                                            fontSize: isMobile ? '0.8rem' : '0.875rem',
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        Excluir
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
            <CustomTypography
                text={`Versão atual em azul`}
                component="p"
                sx={{
                    fontStyle: 'italic',
                    color: theme.palette.button.primary,
                    fontSize: '0.9rem'
                }}
            />

            {openConfirm && <MsgConfirm />}
            {versionForm && <VersionForm />}
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? '10%' : '5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1500,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
                        width: isMobile ? '95%' : 'auto',
                    }}
                >
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

export default Versions;