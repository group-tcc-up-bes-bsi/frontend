import React, { useEffect, useState } from 'react';
import { Box, Backdrop, useMediaQuery } from '@mui/material';
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
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
                    if(result.organizations.length <= 0){
                        setMessage(
                            new MessageObj(
                                'error',
                                'Sem Organizações',
                                'Cadastre uma organização inicialmente',
                                'error'
                            ));
                        setTimeout(() => alterDocumentForm(false), 5000);
                    }
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

                await new Promise(resolve => setTimeout(resolve, 5000));
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
                    width: {
                        xs: '95vw',
                        sm: '90vw',
                        md: '800px',
                        lg: '900px',
                        xl: '1000px'
                    },
                    maxWidth: '95vw',
                    maxHeight: '80vh',
                    borderRadius: '4px',
                    boxShadow: 3,
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: {
                        xs: 2,
                        md: 3
                    },
                    overflowY: 'auto'
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <CustomTypography
                        text={document?.documentId == 0 ? 'Criar Documento' : 'Editar Documento'}
                        component="h2"
                        variant={isMobile ? "h6" : "h6"}
                        marginBottom={0}
                        marginTop={0}
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
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    gap: isMobile ? 2 : 4,
                    marginTop: 2,
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    <Box sx={{
                        width: isMobile ? '100%' : '33%',
                        flex: 1
                    }}>
                        <CustomTextField
                            name="Name"
                            label="Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>
                    <Box sx={{
                        width: isMobile ? '100%' : '33%',
                        flex: 1
                    }}>
                        <CustomTextField
                            name="Type"
                            label="Tipo"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>
                    <Box sx={{
                        width: isMobile ? '100%' : '33%',
                        flex: 1
                    }}>
                        <CustomComboBox
                            name="Organization"
                            label="Organização"
                            value={selectedOrganizationValue}
                            onChange={(value) => {
                                const org = organizations.find(org => org.organizationId.toString() === value);
                                setOrganization(org || null);
                            }}
                            options={organizationsOptions}
                            disabled={document?.organization.organizationId == 0 ? false : true}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            sx={{ marginTop: 0 }}
                        />
                    </Box>
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
                        rows={isMobile ? 6 : 10}
                        marginBottom={0}
                        marginTop={0}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: 'start',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 0.5 : 1,
                    width: '100%',
                    mt: 2
                }}>
                    <CustomTypography
                        text={"Criado em: " + formatDate(document?.creationDate ? new Date(document.creationDate) : new Date())}
                        component="p"
                        variant={isMobile ? "body2" : "h6"}
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: isMobile ? '14px' : '16px'
                        }}
                    />
                    {!isMobile && (
                        <Box sx={{ mx: 1, color: theme.palette.text.primary }}>•</Box>
                    )}
                    <CustomTypography
                        text={"Ultima modificação em: " + formatDate(document?.lastModifiedDate ? new Date(document.lastModifiedDate) : new Date())}
                        component="p"
                        variant={isMobile ? "body2" : "h6"}
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: isMobile ? '14px' : '16px'
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'end',
                    gap: 4,
                    marginTop: 2
                }}>
                    <CustomButton
                        text={document?.documentId == 0 ? "Salvar" : "Atualizar"}
                        type="button"
                        colorType="primary"
                        onClick={document?.documentId === 0 ? () => handleSave() : () => handleUpdate()}
                        hoverColorType="primary"
                        fullWidth={isMobile}
                        paddingY={1}
                        paddingX={3.0}
                        marginBottom={2}
                        marginTop={2}
                        sx={{
                            width: isMobile ? '100%' : 'auto'
                        }}
                    />
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
                            zIndex: 300
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