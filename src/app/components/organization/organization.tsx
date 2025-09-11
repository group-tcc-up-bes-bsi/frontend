import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material';
import CustomTypography from '../customTypography';
import CustomComboBox from '../customComboBox';
import CustomTextField from '../customTextField';
import CustomButton from '../customButton';
import { MoreVert, Star } from '@mui/icons-material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import OrganizationForm from './organizationForm';
import { organizationType, organizationsTypeOptions } from '../../services/ConstantsTypes';
import { getMyOrganizations, getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useFilterStore } from '@/app/state/filterState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { useOrganizationStore } from '@/app/state/organizationState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import MsgConfirm from '../notification/msgConfirm';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { deleteOrganization } from '@/app/services/Organizations/deleteOrganization';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';

const Organization: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const { filter, setFilter } = useFilterStore();
    const organizationForm = useOrganizationFormStore((state) => state.organizationForm);
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationObj | null>(null);
    const alterOrganization = useOrganizationStore((state) => state.alter);
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj('info', 'Criação de Organização', 'Preencha os dados da Organização', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const alterOrg = useOrganizationStore((state) => state.alter);
    const alterOption = useOptionsDashboardStore((state) => state.alter);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                setLoading(true);
                try {
                    const result = await getMyOrganizations(userCurrent, theme);
                    setOrganizations(result.organizations);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [userCurrent, theme, organizationForm]);

    const handleChangeOrganizationType = (value: string) => {
        setSelectedOrganizationType(value);
    };

    const toggleOrganizationForm = () => {
        alterOrganizationForm(!organizationForm);
    }

    const filteredOrganizations = useMemo(() => {
        setLoading(true);

        let filtered = organizations;

        if (selectedOrganizationType == 'COLLABORATIVE') {
            filtered = filtered.filter((org) => org.organizationType === organizationType.COLLABORATIVE);
        } else if (selectedOrganizationType == 'INDIVIDUAL') {
            filtered = filtered.filter((org) => org.organizationType === organizationType.INDIVIDUAL);
        }

        if (!filter.trim()) {
            setTimeout(() => setLoading(false), 500);
            return filtered;
        }

        const searchTerm = filter.toLowerCase().trim();
        const result = filtered.filter((org) =>
            org.name.toLowerCase().includes(searchTerm) ||
            org.description.toLowerCase().includes(searchTerm)
        );

        setTimeout(() => setLoading(false), 300);
        return result;
    }, [organizations, filter, selectedOrganizationType]);

    const handleOrganizationAlter = async () => {
        if (selectedOrganization) {
            if (userCurrent != undefined) {
                try {
                    const result = await getOrganizationUsers(selectedOrganization.organizationId, userCurrent)
                    const users = result.users;
                    for (const user of users) {
                        if (user.username == userCurrent.username) {
                            if (user.userType.toString() == 'OWNER') {
                                alterOrganization(selectedOrganization);
                                toggleOrganizationForm();
                            } else {
                                setMessage(new MessageObj('warning', 'Não Permitido', 'Somente o proprietario pode realizar alterações', 'warning'));
                            }
                        }
                    }
                } catch (error) {
                    setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
                }
            }
        }
        setAnchorEl(null);
    };

    const handleOrganizationCreate = () => {
        const orgNull: OrganizationObj = {
            organizationId: 0,
            name: '',
            description: '',
            favorite: false,
            organizationType: undefined,
            borderColor: undefined,
            icon: undefined
        };
        alterOrganization(orgNull);
        toggleOrganizationForm();
    }

    const toggleConfirm = (organization: OrganizationObj) => {
        alterMsgConfirm(`excluir a organização ${organization.name}?`);
        alterConfirm(true);
        useMsgConfirmStore.getState().setOnConfirm(async () => {
            if (userCurrent) {
                await deleteOrganization(organization.organizationId, userCurrent);
                setOrganizations((prev) =>
                    prev.filter((org) => org.organizationId !== organization.organizationId)
                );
            }
        });
    };

    const handleEstatisticasClick = (organization: OrganizationObj) => {
        alterOption('StatsOrganization');
        alterOrg(organization);
        setAnchorEl(null);
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CustomButton
                            text="+ Nova Organização"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            onClick={handleOrganizationCreate}
                            paddingY={2}
                            marginTop={0.5}
                        />
                    </Box>
                    <Box sx={{ width: '60%' }}>
                        <CustomTextField
                            name="filter"
                            label="Informe um detalhe da organização"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                        />
                    </Box>
                    <Box sx={{ width: '25%' }}>
                        <CustomComboBox
                            name="organization-type"
                            label="Tipo"
                            value={selectedOrganizationType}
                            onChange={handleChangeOrganizationType}
                            options={organizationsTypeOptions}
                            focusedColor="primary"
                            hoverColor="info"
                        />
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.text.primary, marginBottom: 3 }} />
            <Box sx={{ backgroundColor: theme.palette.background.default, padding: 1 }}>
                <Box sx={{ width: '100%', display: 'flex', marginLeft: '3rem' }}>
                    <CustomTypography
                        text="Organizações"
                        component="h2"
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            mt: 1,
                            fontWeight: 'bold'
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            maxHeight: 'calc(85vh - 150px)',
                            overflowY: 'auto',
                            pr: 2,
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
                        {filteredOrganizations.map((org) => (
                            <Box
                                key={org.organizationId}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    border: `1px solid ${org.borderColor}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 4 }}>
                                        <Star sx={{ color: theme.palette.text.primary }} />
                                        <CustomTypography
                                            text={org.name}
                                            component="h2"
                                            variant="h5"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </Box>
                                    <CustomTypography
                                        text={org.organizationType || ''}
                                        component="p"
                                        variant="h6"
                                        sx={{ color: theme.palette.text.secondary, display: 'block' }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <CustomTypography
                                        text={org.description}
                                        component="p"
                                        variant="h6"
                                        sx={{ color: theme.palette.text.secondary, mb: 1 }}
                                    />
                                    <IconButton
                                        aria-label="more"
                                        onClick={(event) => {
                                            setAnchorEl(event.currentTarget);
                                            setSelectedOrganization(org);
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedOrganization?.organizationId === org.organizationId}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => ({})}>Abrir</MenuItem>
                                        <MenuItem onClick={handleOrganizationAlter}>Alterar</MenuItem>
                                        <MenuItem onClick={() => { handleEstatisticasClick(org) }}>Estatísticas</MenuItem>
                                        <MenuItem onClick={() => { toggleConfirm(org) }}>Excluir</MenuItem>
                                    </Menu>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                {organizationForm && <OrganizationForm />}
                {openConfirm && <MsgConfirm />}
            </Box>
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
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

export default Organization;
