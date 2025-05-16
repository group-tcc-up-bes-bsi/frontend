import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import { Close } from '@mui/icons-material';
import CustomTextField from '../CustomTextField';
import CustomComboBox from '../CustomComboBox';
import CustomButton from '../CustomButton';
import CustomTypography from '../CustomTypography';

const OrganizationForm: React.FC = () => {
    const { theme } = useTheme();
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    const handleChangeOrganizationType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOrganizationType(event.target.value);
    };

    const organizationsType = [
        { value: 'INDIVIDUAL', label: 'Individual' },
        { value: 'COLLABORATIVE', label: 'Colaborativo' },
    ];


    const handleChangeUserType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUserType(event.target.value);
    };

    const userType = [
        { value: 'READ', label: 'Editor' },
        { value: 'VIEWER', label: 'Visualizador' },
    ];

    return (
        <Box className="flex items-center justify-center">
            <Box
                className="fixed inset-0 z-[1320]"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    opacity: 0.5,
                    transition: 'all 0.3s ease',
                }}
            />
            <Box
                className="fixed z-[1330] flex flex-col"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: '1200px',
                    height: '750px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 4
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <CustomTypography
                        text="Organizações"
                        component="h2"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            mt: 1,
                            fontWeight: 'bold'
                        }}
                    />
                    <Close
                        onClick={() => alterOrganizationForm(false)}
                        sx={{
                            marginBottom: 2,
                            fontSize: 30,
                            color: theme.palette.text.primary,
                            cursor: 'pointer',
                            alignSelf: 'flex-end',
                            '&:hover': {
                                color: theme.palette.error.main,
                            }
                        }}
                    />
                </Box>
                <Box>
                    <Box
                        sx={{ width: '100%', display: 'flex', gap: 4 }}>
                        <CustomTextField
                            name="Name"
                            label="Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />
                        <CustomTextField
                            name="Email"
                            label="Email"
                            type="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <CustomButton
                            text="Procurar"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', gap: 4 }}>
                        <CustomComboBox
                            name="organization-type"
                            label="Tipo"
                            value={selectedOrganizationType}
                            onChange={handleChangeOrganizationType}
                            options={organizationsType}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />

                        <CustomComboBox
                            name="user-type"
                            label="Permissões"
                            value={selectedUserType}
                            onChange={handleChangeUserType}
                            options={userType}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <CustomButton
                            text="Adicionar"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={2}
                            marginTop={0}
                        />
                    </Box>
                    <Box
                        sx={{ width: '100%', display: 'flex', gap: 4 }}>
                        <Box sx={{ width: '50%' }}>
                            <CustomTextField
                                name="Description"
                                label="Descrição"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                focusedColor="primary"
                                hoverColor="info"
                                marginTop={0}
                                marginBottom={2}
                                multiline={true}
                                maxRows={12}
                            />
                        </Box>
                        <Box
                            sx={{
                                width: '50%',
                                border: 1,
                                borderColor: 'text.primary',
                                borderRadius: 1,
                                padding: 2,
                                height: '310px',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: theme.palette.background.paper,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '3px',
                                },
                            }}>
                            <List dense sx={{ py: 0 }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item) => (
                                    <ListItem
                                        key={item}
                                        sx={{
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            py: 1.2,
                                            px: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                                            <ListItemText
                                                primary={`Usuario ${item}`}
                                                sx={{ flex: 1 }}
                                            />
                                            <Close
                                                sx={{
                                                    fontSize: '1.5rem',
                                                    color: theme.palette.text.secondary,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        color: theme.palette.error.main,
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 4 }}>
                        <CustomButton
                            text="Excluir"
                            type="button"
                            colorType="error"
                            hoverColorType="error"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={2}
                            marginTop={2}
                        />
                        <CustomButton
                            text="Salvar"
                            type="button"
                            colorType="primary"
                            hoverColorType="primary"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={2}
                            marginTop={2}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default OrganizationForm;