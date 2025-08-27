import React, { useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider } from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomComboBox from '../CustomComboBox';
import CustomTextField from '../CustomTextField';
import CustomButton from '../CustomButton';
import { Star } from '@mui/icons-material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import OrganizationForm from './OrganizationForm';
import { organizationsType, organizationsTypeOptions } from '../../services/ConstantsTypes';
import { getOrganizationsByUser } from '@/app/services/Organizations/OrganizationsServices';
import { useFilterStore } from '@/app/state/filterState';

const Organization: React.FC = () => {
    const { theme } = useTheme();
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const { filter, setFilter } = useFilterStore();
    const organizationForm = useOrganizationFormStore((state) => state.organizationForm);
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);

    const handleChangeOrganizationType = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSelectedOrganizationType(event.target.value.trim());
    };

    const toggleOrganizationForm = () => {
        alterOrganizationForm(!organizationForm);
    }

    const organizations = getOrganizationsByUser(theme);

    const filteredOrganizations = useMemo(() => {
        let filtered = organizations;

        if (selectedOrganizationType == 'COLLABORATIVE') {
            filtered = filtered.filter((org) => org.type === organizationsType.COLLABORATIVE);
        } else if (selectedOrganizationType == 'INDIVIDUAL') {
            filtered = filtered.filter((org) => org.type === organizationsType.INDIVIDUAL);
        }

        if (!filter.trim()) {
            return filtered;
        }

        const searchTerm = filter.toLowerCase().trim();
        return filtered.filter((org) =>
            org.title.toLowerCase().includes(searchTerm) ||
            org.description.toLowerCase().includes(searchTerm) ||
            org.createdBy.toLowerCase().includes(searchTerm)
        );
    }, [organizations, filter]);

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
                            onClick={toggleOrganizationForm}
                            paddingY={2}
                            marginTop={0.5}
                        />
                    </Box>
                    <Box
                        sx={{ width: '60%' }}>
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
                <Box
                    sx={{ width: '100%', display: 'flex', marginLeft: '3rem' }}
                >
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
                            key={org.id}
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
                                        text={org.title}
                                        component="h2"
                                        variant="h5"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </Box>
                                <CustomTypography
                                    text={org.type}
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
                                <CustomButton
                                    text="Alterar"
                                    type="button"
                                    colorType="primary"
                                    hoverColorType="primary"
                                    fullWidth={false}
                                    paddingX={5.0}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
                {organizationForm && (
                    <OrganizationForm />
                )
                }
            </Box>
        </Box >
    );
};

export default Organization;