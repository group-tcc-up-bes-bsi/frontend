import React, { useEffect, useState } from 'react';
import { Box, Backdrop } from '@mui/material';
import CustomTextField from '../customTextField';
import CustomComboBox from '../customComboBox';
import CustomButton from '../customButton';
import CustomTypography from '../customTypography';
import CustomAlert from '../customAlert';
import { useDocumentFormStore } from '@/app/state/documentFormState';
import { OrganizationObj } from '@/app/models/OrganizationObj';
import { useUserStore } from '@/app/state/userState';
import { useDocumentStore } from '@/app/state/documentState';
import { MessageObj } from '@/app/models/MessageObj';
import { useTheme } from '@/app/theme/ThemeContext';
import { formatDate } from '@/app/services/ConstantsTypes';
import { getOrganizations } from '@/app/services/Organizations/getOrganizations';
import { createDocument } from '@/app/services/Documents/createDocument';
import { updateDocument } from '@/app/services/Documents/updateDocument';

const DocumentForm: React.FC = () => {
    const { theme } = useTheme();
    const document = useDocumentStore((state) => state.document);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [name, setName] = useState(document?.name || '');
    const [type, setType] = useState(document?.type || '');
    const [description, setDescription] = useState(document?.description || '');
    const [organization, setOrganization] = useState(document?.organization || null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState<MessageObj>(
        document?.documentId == 0 ? new MessageObj('info', 'Criação de Documento', 'Preencha os dados do Documento', 'info')
            : new MessageObj('info', 'Edição do Documento', 'Preencha os dados do Documento', 'info')
    );
    const alterDocumentForm = useDocumentFormStore((state) => state.alter);
    const [organizations, setOrganizations] = useState<OrganizationObj[]>([]);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                try {
                    const result = await getOrganizations(userCurrent, theme);
                    setOrganizations(result.organizations);
                } finally {
                }
            })();
        }
    }, [userCurrent, theme]);

    const isValidOrganization = organization &&
        organizations.some(org => org.organizationId === organization.organizationId);

    const selectedOrganizationValue = isValidOrganization ?
        organization.organizationId.toString() : '';

    const organizationsOptions = [
        ...organizations.map(org => ({
            label: org.name,
            value: org.organizationId.toString()
        }))
    ];


    const handleSave = async () => {
        if (name.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Nome obrigatório',
                'Por favor, preencha o nome do documento.',
                'error'
            ));
            return;
        }
        if (description.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Descrição obrigatória',
                'Por favor, preencha a descrição do documento.',
                'error'
            ));
            return;
        }
        if (type.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Tipo obrigatório',
                'Por favor, selecione o tipo do documento.',
                'error'
            ));
            return;
        }
        if (!selectedOrganizationValue) {
            setMessage(new MessageObj(
                'error',
                'Organização obrigatória',
                'Por favor, selecione uma organização.',
                'error'
            ));
            return;
        }

        if (userCurrent != undefined && organization) {
            try {
                const result = await createDocument(name, description, type, organization?.organizationId, userCurrent)
                setMessage(result.message);

                await new Promise(resolve => setTimeout(resolve, 1000));
                alterDocumentForm(false);

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
                'Por favor, preencha o nome do documento.',
                'error'
            ));
            return;
        }
        if (description.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Descrição obrigatória',
                'Por favor, preencha a descrição do documento.',
                'error'
            ));
            return;
        }
        if (type.trim() === '') {
            setMessage(new MessageObj(
                'error',
                'Tipo obrigatório',
                'Por favor, selecione o tipo do documento.',
                'error'
            ));
            return;
        }
        if (userCurrent != undefined && organization) {
            try {
                if (document?.documentId) {
                    const result = await updateDocument(document?.documentId, name, description, type, userCurrent)
                    setMessage(result.message);

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    alterDocumentForm(false);
                }
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

    return (
        <Box>
            <Backdrop
                open={true}
                onClick={() => alterDocumentForm(false)}
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
                    width: '1000px',
                    maxWidth: '90%',
                    borderRadius: '4px',
                    boxShadow: 3,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 3
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <CustomTypography
                        text={document?.documentId == 0 ? 'Criar Documento' : 'Editar Documento'}
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

                <Box sx={{ width: '100%', display: 'flex', gap: 4, marginTop: 2 }}>
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
                        name="Type"
                        label="Tipo"
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />

                    <CustomComboBox
                        name="Organization"
                        label="Organização"
                        value={selectedOrganizationValue}
                        onChange={(value) => {
                            const org = organizations.find(org => org.organizationId.toString() === value);
                            setOrganization(org || null);
                        }}
                        options={organizationsOptions}
                        disabled={document?.documentId == 0 ? false : true}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />

                </Box>

                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <CustomTextField
                        name="Description"
                        label="Descrição"
                        placeholder="Descreva o documento..."
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        fullWidth
                        multiline
                        rows={10}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'start',
                    alignItems: 'start',
                    gap: 1,
                    width: '100%'
                }}>
                    <CustomTypography
                        text={"Criado em: " + formatDate(document?.creationDate ? new Date(document.creationDate) : new Date())}
                        component="p"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '16px'
                        }}
                    />
                    <CustomTypography
                        text={"Ultima modificação em: " + formatDate(document?.lastModifiedDate ? new Date(document.lastModifiedDate) : new Date())}
                        component="p"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '16px'
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 4, marginTop: 2 }}>
                    <CustomButton
                        text={document?.documentId == 0 ? "Salvar" : "Atualizar"}
                        type="button"
                        colorType="primary"
                        onClick={document?.documentId === 0 ? () => handleSave() : () => handleUpdate()}
                        hoverColorType="primary"
                        fullWidth={false}
                        paddingY={1}
                        paddingX={3.0}
                        marginBottom={2}
                        marginTop={2}
                    />
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

export default DocumentForm;