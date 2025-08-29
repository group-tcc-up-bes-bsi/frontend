import React, { useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Backdrop } from '@mui/material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import { Close } from '@mui/icons-material';
import CustomTextField from '../CustomTextField';
import CustomComboBox from '../CustomComboBox';
import CustomButton from '../CustomButton';
import CustomTypography from '../CustomTypography';
import { organizationsTypeOptions, userTypeOptions } from '../../services/ConstantsTypes';
import { getUsersOrganization } from '@/app/services/User/getUsersOrganization';
import { useOrganizationStateStore } from '@/app/state/organizationState';

const OrganizationForm: React.FC = () => {
    const { theme } = useTheme();
    const organization = useOrganizationStateStore((state) => state.organization);
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('');
    const [name, setName] = useState(organization?.title || '');
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState(organization?.description || '');

    const handleChangeOrganizationType = (value: string) => {
        setSelectedOrganizationType(value);
    };

    const handleChangeUserType = (value: string) => {
        setSelectedUserType(value);
    };

    const users = getUsersOrganization();

    return (
        <Box>
            <Backdrop
                open={true}
                onClick={() => alterOrganizationForm(false)}
                sx={{
                    zIndex: 3,
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            <Box
                sx={{
                    zIndex: 200,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.default,
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
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
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
                            name="username"
                            label="Usuário"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(value) => handleChangeOrganizationType(value)}
                            options={organizationsTypeOptions}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />

                        <CustomComboBox
                            name="user-type"
                            label="Permissões"
                            value={selectedUserType}
                            onChange={(value) => handleChangeUserType(value)}
                            options={userTypeOptions}
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
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    maxHeight: '310px',
                                    p: 2,
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
                                }}
                            >
                                {users.map((user) => (
                                    <Box
                                        key={user.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            py: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex',width: '70%', justifyContent: 'space-between' ,gap: 1 }}>
                                            <CustomTypography
                                                text={user.username}
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                                            />
                                            <CustomTypography
                                                text={`${user.type}`}
                                                variant="body2"
                                                sx={{ color: theme.palette.text.secondary }}
                                            />
                                        </Box>
                                        <Close
                                            sx={{
                                                fontSize: '1.5rem',
                                                color: theme.palette.text.secondary,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: theme.palette.error.main,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>

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