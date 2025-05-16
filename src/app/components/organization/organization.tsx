import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider } from '@mui/material';
import CustomTypography from '../CustomTypography';
import CustomComboBox from '../CustomComboBox';
import CustomTextField from '../CustomTextField';
import CustomButton from '../CustomButton';
import { OrganizationObj } from '../../models/OrganizationObj';
import { Star } from '@mui/icons-material';

const Organization: React.FC = () => {
    const { theme } = useTheme();
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const [filter, setFilter] = useState('');

    const handleChangeOrganizationType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOrganizationType(event.target.value);
    };

    const organizationsType = [
        { value: 'INDIVIDUAL', label: 'Individual' },
        { value: 'COLLABORATIVE', label: 'Colaborativo' },
        { value: 'ALL', label: 'Todos' },
    ];

    const organizations: OrganizationObj[] = [
        {
            id: '1',
            title: 'Tcc',
            description: 'Organização criada com o intuito de ter um local para salvamento dos dados do nosso tcc para apoio mutuo e versionamento',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        },
        {
            id: '2',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        },
        {
            id: '3',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        },
        {
            id: '4',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        },
        {
            id: '5',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        }, {
            id: '6',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        },
        {
            id: '7',
            title: 'Compras',
            description: 'Organização pessoal para salvar documentos de compras realizadas pela minha empresa.',
            createdBy: 'Criado por Lucas@gmail.com',
            borderColor: theme.palette.text.primary
        }
    ];

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
                            options={organizationsType}
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
                    {organizations.map((org) => (
                        <Box
                            key={org.id}
                            sx={{
                                mb: 4,
                                p: 2,
                                border: `1px solid ${org.borderColor}`,
                                borderRadius: 1
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 4 }}>
                                    <Star sx={{ color: theme.palette.text.primary }} />
                                    <CustomTypography
                                        text={org.title}
                                        component="h2"
                                        variant="h6"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 'bold',
                                            mb: 1
                                        }}
                                    />
                                </Box>
                                <CustomTypography
                                    text={org.createdBy}
                                    component="p"
                                    variant="h6"
                                    sx={{ color: theme.palette.text.primary, display: 'block', mb: 1 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                                <CustomTypography
                                    text={org.description}
                                    component="p"
                                    variant="h6"
                                    sx={{ color: theme.palette.text.primary, mb: 2 }}
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
            </Box>
        </Box >
    );
};

export default Organization;