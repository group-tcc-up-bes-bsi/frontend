import React, { useState } from 'react';
import { Box, Backdrop } from '@mui/material';
import CustomTextField from '../customTextField';
import CustomComboBox from '../customComboBox';
import CustomButton from '../customButton';
import CustomTypography from '../customTypography';
import { useTheme } from '@/app/theme/ThemeContext';
import { formatDate } from '@/app/services/ConstantsTypes';
import { useAuth } from '../useAuth';
import { useVersionFormStore } from '@/app/state/versionFormState';
import { useVersionStore } from '@/app/state/versionState';
import { DocumentObj } from '@/app/models/DocumentObj';
import { UserObj } from '@/app/models/UserObj';

const VersionForm: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const alterVersionForm = useVersionFormStore((state) => state.alter);
    const version = useVersionStore((state) => state.version);
    const [versionName, setVersionName] = useState(version?.versionName || '');
    const [filePath, setFilePath] = useState(version?.versionFilePath || '');
    const [document, setDocument] = useState<DocumentObj | null>(version?.document || null);
    const [documents, /*setDocuments*/] = useState<DocumentObj[]>([]);
    const [user, setUser] = useState<UserObj | null>(version?.user || null);
    const [users, /*setUsers*/] = useState<UserObj[]>([]);

    const isValidDocument = document &&
        documents.some(d => d.documentId === document.documentId);

    const selectedDocumentValue = isValidDocument ?
        document.documentId.toString() : '';

    const documentsOptions = documents.map(d => ({
        label: d.name,
        value: d.documentId.toString()
    }));


    const isValidUser = user &&
        users.some(u => u.userId === user.userId);

    const selectedUserValue = isValidUser ?
        user.userId.toString() : '';

    const usersOptions = users.map(u => ({
        label: u.username,
        value: u.userId.toString()
    }));


    return (
        <Box>
            <Backdrop
                open={true}
                onClick={() => alterVersionForm(false)}
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
                    width: '800px',
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
                        text={version?.documentVersionId ? 'Editar Versão' : 'Criar Versão'}
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
                        name="VersionName"
                        label="Nome da Versão"
                        type="text"
                        value={versionName}
                        onChange={(e) => setVersionName(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />

                    <CustomComboBox
                        name="Document"
                        label="Documento Base"
                        value={selectedDocumentValue}
                        onChange={(value) => {
                            const doc = documents.find(d => d.documentId.toString() === value);
                            setDocument(doc || null);
                        }}
                        options={documentsOptions}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />
                </Box>

                <Box sx={{ width: '100%', display: 'flex', gap: 4, marginTop: 2 }}>
                    <CustomComboBox
                        name="User"
                        label="Usuário Criador"
                        value={selectedUserValue}
                        onChange={(value) => {
                            const usr = users.find(u => u.userId.toString() === value);
                            setUser(usr || null);
                        }}
                        options={usersOptions}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />
                </Box>

                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <CustomTextField
                        name="FilePath"
                        label="Caminho do Arquivo"
                        placeholder="/files/version_x.pdf"
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        fullWidth
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'start',
                    alignItems: 'start',
                    gap: 1,
                    width: '100%',
                    marginTop: 2
                }}>
                    <CustomTypography
                        text={"Criado em: " + formatDate(version?.createdAt ? new Date(version.createdAt) : new Date())}
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
                        text={version?.documentVersionId ? "Atualizar" : "Salvar"}
                        type="button"
                        colorType="primary"
                        onClick={() => { }}
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
    );
};

export default VersionForm;