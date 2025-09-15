import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Backdrop } from '@mui/material';
import { useOrganizationFormStore } from '@/app/state/organizationFormState';
import { Close } from '@mui/icons-material';
import CustomTextField from '../customTextField';
import CustomComboBox from '../customComboBox';
import CustomButton from '../customButton';
import CustomTypography from '../customTypography';
import { getUserTypeLabel, organizationsTypeOptionsNoAll, userType, userTypeOptionsNoOwner } from '../../services/ConstantsTypes';
import { getOrganizationUsers } from '@/app/services/Organizations/organizationsServices';
import { useOrganizationStore } from '@/app/state/organizationState';
import { getByUserName } from '@/app/services/User/getByUserName';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import { UserOrganization } from '@/app/models/UserObj';
import { useUserStore } from '@/app/state/userState';
import { createOrganization } from '@/app/services/Organizations/createOrganization';
import { useAuth } from '../useAuth';
import { addOrganizationUser } from '@/app/services/Organizations/addOrganizationUser';
import { removeOrganizationUser } from '@/app/services/Organizations/removeOrganizationUser';
import { updateOrganizationUser } from '@/app/services/Organizations/updateOrganizationUser';
import { updateOrganization } from '@/app/services/Organizations/updateOrganization';

const OrganizationForm: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const organization = useOrganizationStore((state) => state.organization);
    const alterOrganizationForm = useOrganizationFormStore((state) => state.alter);
    const [selectedOrganizationType, setSelectedOrganizationType] = useState('');
    const [selectedUserType, setSelectedUserType] = useState('');
    const [name, setName] = useState(organization?.name || '');
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState(organization?.description || '');
    const [message, setMessage] = useState<MessageObj>(
        organization?.organizationId == 0 ? new MessageObj('info', 'Criação de Organização', 'Preencha os dados da Organização', 'info')
            : new MessageObj('info', 'Edição de Organização', 'Preencha os dados da Organização', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);
    const [user, setUser] = useState<UserOrganization | null>(null);
    const [users, setUsers] = useState<UserOrganization[]>([]);
    const [usersDel, setUsersDel] = useState<UserOrganization[]>([]);
    const [initialUsers, setInitialUsers] = useState<UserOrganization[]>([]);
    const userCurrent = useUserStore((state) => state.userCurrent)

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    const handleChangeOrganizationType = (value: string) => {
        setSelectedOrganizationType(value);
    };

    const handleChangeUserType = (value: string) => {
        setSelectedUserType(value);
    };

    useEffect(() => {
        let value = '';
        if (organization?.organizationType == 'Colaborativo') {
            value = 'COLLABORATIVE';
            handleChangeOrganizationType(value);
        } else if (organization?.organizationType == 'Individual') {
            value = 'INDIVIDUAL';
            handleChangeOrganizationType(value);
        }
        if (organization?.organizationId !== 0 && organization != undefined && userCurrent != undefined) {
            (async () => {
                try {
                    const result = await getOrganizationUsers(organization.organizationId, userCurrent)
                    setUsers(result.users);
                    setInitialUsers(result.users);
                    setMessage(result.message);

                } catch (error) {
                    setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
                }
            })();
        } else {
            if (userCurrent != undefined) {
                const newUser: UserOrganization = {
                    userId: 0,
                    organizationId: 0,
                    username: userCurrent.username,
                    userType: userType.OWNER,
                    inviteAccepted: true,
                };

                setUsers([...users, newUser]);
            }
        }
    }, [organization]);

    const handleFindUser = async () => {
        try {
            const result = await getByUserName(username, userCurrent!);
            setMessage(result.message);

            await new Promise(resolve => setTimeout(resolve, 1000));
            if (result.message.severity === 'success') {
                setUser(result.user);
            }
        } catch (error) {
            setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
        }
    }

    const addUser = () => {
        if (selectedOrganizationType === 'INDIVIDUAL') {
            setMessage(new MessageObj(
                'warning',
                'Bloqueado',
                `Não permitido adicionar usuário para organizações individuais`,
                'warning'
            ));
            return;
        }
        if (user) {
            if (selectedUserType !== '') {
                const exists = users.some(u => u.username === user.username);

                if (exists) {
                    setMessage(new MessageObj(
                        'warning',
                        'Usuário já adicionado',
                        `O usuário "${user.username}" já está na lista.`,
                        'warning'
                    ));
                    return;
                }

                const newUser: UserOrganization = {
                    userId: 0,
                    organizationId: 0,
                    username: user.username,
                    userType: selectedUserType as userType,
                    inviteAccepted: false,
                };

                setUsers([...users, newUser]);
                setUser(null);
                setUsername('');
                setSelectedUserType('');
            } else {
                setMessage(new MessageObj(
                    'error',
                    'Tipo de usuário não selecionado',
                    'Selecione um tipo de usuário para adicionar.',
                    'error'
                ));
            }
        } else {
            setMessage(new MessageObj(
                'error',
                'Usuário não encontrado',
                'Primeiro realize a busca pelo nome do usuário.',
                'error'
            ));
        }
    };

    const removeUser = (username: string) => {
        const userToRemove = users.find(u => u.username === username);

        if (userToRemove) {
            setUsers(users.filter(u => u.username !== username));
            setUsersDel([...usersDel, userToRemove]);
        }
    };

    const handleSave = async () => {
        if (name.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Nome obrigatório',
                'Por favor, preencha o nome da organização.',
                'error'
            ));
            return;
        }
        if (description.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Descrição obrigatória',
                'Por favor, preencha a descrição da organização.',
                'error'
            ));
            return;
        }
        if (selectedOrganizationType === '') {
            setMessage(new MessageObj(
                'error',
                'Tipo obrigatório',
                'Por favor, selecione o tipo da organização.',
                'error'
            ));
            return;
        }
        if (userCurrent != undefined) {
            try {
                const result = await createOrganization(name, description, selectedOrganizationType, userCurrent);
                setMessage(result.message);

                if (selectedOrganizationType !== 'INDIVIDUAL') {
                    if (result.message.severity === 'success') {
                        for (const user of users) {
                            if (user.userType != userType.OWNER) {
                                try {

                                    if (userCurrent != undefined) {
                                        const resultUser = await getByUserName(user.username, userCurrent);
                                        const userAdd: UserOrganization = {
                                            userId: resultUser.user.userId,
                                            organizationId: result.organizationId,
                                            username: user.username,
                                            userType: user.userType,
                                            inviteAccepted: false,
                                        }
                                        await addOrganizationUser(userAdd, userCurrent);
                                    }
                                } catch (err) {
                                    console.error(`Erro ao adicionar ${user.username}`, err);
                                }
                            }
                        }
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                alterOrganizationForm(false);
            } catch (error) {
                setMessage(new MessageObj(
                    'error',
                    'Erro inesperado',
                    `${error}`,
                    'error'
                ));
            }
        }
    }

    const handleUpdate = async () => {
        if (name.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Nome obrigatório',
                'Por favor, preencha o nome da organização.',
                'error'
            ));
            return;
        }
        if (description.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Descrição obrigatória',
                'Por favor, preencha a descrição da organização.',
                'error'
            ));
            return;
        }
        if (selectedOrganizationType === '') {
            setMessage(new MessageObj(
                'error',
                'Tipo obrigatório',
                'Por favor, selecione o tipo da organização.',
                'error'
            ));
            return;
        }
        if (userCurrent != undefined) {
            try {
                if (organization != undefined) {
                    const result = await updateOrganization(organization?.organizationId, name, description, selectedOrganizationType, userCurrent!);
                    setMessage(result.message);

                    if (result.message.severity === "success") {
                        const toAdd = users.filter(
                            u => !initialUsers.some(init => init.username === u.username)
                        );

                        const toRemove = initialUsers.filter(
                            u => !users.some(curr => curr.username === u.username)
                        );

                        const toUpdate = users.filter(
                            u => {
                                const old = initialUsers.find(init => init.username === u.username);
                                return old && old.userType !== u.userType;
                            }
                        );

                        for (const user of toAdd) {
                            if (user.userType != userType.OWNER) {
                                try {
                                    if (userCurrent != undefined) {
                                        const resultUser = await getByUserName(user.username, userCurrent);
                                        const userAdd: UserOrganization = {
                                            userId: resultUser.user.userId,
                                            organizationId: organization.organizationId,
                                            username: user.username,
                                            userType: user.userType,
                                            inviteAccepted: false,
                                        }
                                        await addOrganizationUser(userAdd, userCurrent);
                                    }
                                } catch (err) {
                                    console.error(`Erro ao adicionar ${user.username}`, err);
                                }
                            }
                        }
                        for (const user of toRemove) {
                            try {
                                const resultUser = await getByUserName(user.username, userCurrent);
                                const userRemove: UserOrganization = {
                                    userId: resultUser.user.userId,
                                    organizationId: organization.organizationId,
                                    username: user.username,
                                    userType: user.userType,
                                    inviteAccepted: false,
                                }
                                await removeOrganizationUser(userRemove, userCurrent!);
                            } catch (err) {
                                console.error(`Erro ao adicionar ${user.username}`, err);
                            }
                        }

                        for (const user of toUpdate) {
                            try {
                                const resultUser = await getByUserName(user.username, userCurrent);
                                const userUpdate: UserOrganization = {
                                    userId: resultUser.user.userId,
                                    organizationId: organization.organizationId,
                                    username: user.username,
                                    userType: user.userType,
                                    inviteAccepted: false,
                                }
                                await updateOrganizationUser(userUpdate, userCurrent!);
                            } catch (err) {
                                console.error(`Erro ao adicionar ${user.username}`, err);
                            }
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    alterOrganizationForm(false);
                }
            } catch (error) {
                setMessage(new MessageObj('error', 'Erro inesperado', `${error}`, 'error'));
            }
        }
    }

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
                    height: '700px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 3
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <CustomTypography
                        text={organization?.name == '' ? "Criar Organização" : "Editar Organização"}
                        component="h2"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            mb: 1,
                            padding: 1,
                            fontWeight: 'bold',
                            width: '100%',
                            borderBottom: `1px solid ${theme.palette.text.primary}`,
                        }}
                    />
                </Box>
                <Box>
                    <Box
                        sx={{ width: '100%', display: 'flex', gap: 4, marginTop: 1 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <CustomButton
                                text="Buscar"
                                type="button"
                                colorType="primary"
                                onClick={handleFindUser}
                                hoverColorType="primary"
                                fullWidth={false}
                                sx={{ width: '120px', height: '56px', marginTop: '16px' }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', gap: 4 }}>
                        <CustomComboBox
                            name="organization-type"
                            label="Tipo"
                            value={selectedOrganizationType}
                            onChange={(value) => handleChangeOrganizationType(value)}
                            options={organizationsTypeOptionsNoAll}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />

                        <CustomComboBox
                            name="user-type"
                            label="Permissões"
                            value={selectedUserType}
                            onChange={(value) => handleChangeUserType(value)}
                            options={userTypeOptionsNoOwner}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={2}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <CustomButton
                                text="Adicionar"
                                type="button"
                                colorType="primary"
                                onClick={addUser}
                                hoverColorType="primary"
                                fullWidth={false}
                                sx={{ width: '120px', height: '56px', marginTop: '16px' }}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{ width: '100%', display: 'flex', gap: 4, marginTop: 2 }}>
                        <Box sx={{
                            width: { xs: '100%', lg: '50%' }
                        }}>
                            <CustomTextField
                                name="Description"
                                label='Descrição'
                                placeholder="Descreva a finalidade desta organização..."
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                focusedColor="primary"
                                hoverColor="info"
                                fullWidth
                                marginTop={0}
                                multiline={true}
                                rows={12}
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
                                        key={user.username}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            py: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', width: '70%', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                            <CustomTypography
                                                text={user.username}
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
                                            />
                                            {user.username === userCurrent?.username ? (
                                                <CustomTypography
                                                    text={getUserTypeLabel(user.userType)}
                                                    variant="body2"
                                                    sx={{ color: theme.palette.text.secondary }}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 0.6 }}>
                                                    <CustomComboBox
                                                        name={`user-type-${user.username}`}
                                                        label=""
                                                        value={user.userType}
                                                        onChange={(newValue) => {
                                                            setUsers((prevUsers) =>
                                                                prevUsers.map((u) =>
                                                                    u.username === user.username
                                                                        ? { ...u, userType: newValue as userType }
                                                                        : u
                                                                )
                                                            );
                                                        }}
                                                        options={userTypeOptionsNoOwner}
                                                        focusedColor="primary"
                                                        hoverColor="info"
                                                        marginBottom={0}
                                                        sx={{marginTop: 0}}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                        {user.username !== userCurrent?.username && (
                                            <Close
                                                onClick={() => removeUser(user.username)}
                                                sx={{
                                                    fontSize: '1.5rem',
                                                    color: theme.palette.text.secondary,
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.error.light,
                                                        color: theme.palette.error.main,
                                                    }
                                                }}
                                            />)}
                                    </Box>
                                ))}
                            </Box>

                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 4 }}>
                        <CustomButton
                            text={organization?.name == '' ? "Salvar" : "Atualizar"}
                            type="button"
                            colorType="primary"
                            onClick={() => organization?.name == '' ? handleSave() : handleUpdate()}
                            hoverColorType="primary"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={2}
                            marginTop={2}
                        />
                    </Box>
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
        </Box>
    );
};

export default OrganizationForm;