import React, { useEffect, useRef, useState } from 'react';
import { Box, Backdrop, IconButton, useMediaQuery } from '@mui/material';
import CustomTextField from '../customTextField';
import CustomButton from '../customButton';
import CustomTypography from '../customTypography';
import { useTheme } from '@/app/theme/ThemeContext';
import { useAuth } from '../useAuth';
import { useVersionFormStore } from '@/app/state/versionFormState';
import { useVersionStore } from '@/app/state/versionState';
import PreviewVersion from './previewVersion';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';
import { useUserStore } from '@/app/state/userState';
import { useDocumentStore } from '@/app/state/documentState';
import { createVersion } from '@/app/services/Versions/createVersion';
import { updateVersion } from '@/app/services/Versions/updateVersion';
import { downloadVersion } from '@/app/services/Versions/downloadVersion';
import { Download } from '@mui/icons-material';

const VersionForm: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const userCurrent = useUserStore((state) => state.userCurrent);
    const alterVersionForm = useVersionFormStore((state) => state.alter);
    const version = useVersionStore((state) => state.version);
    const [versionName, setVersionName] = useState(version?.name || '');
    const [file, setFile] = useState<File | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<MessageObj>(
        new MessageObj()
    );
    const [showMessage, setShowMessage] = useState(false);
    const doc = useDocumentStore((state) => state.document);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            if (versionName.trim() === "") {
                setVersionName(selectedFile.name);
            }
            setFile(selectedFile);
        }
    };

    const handleCreateVersion = async () => {
        if (!file) {
            setMessage(new MessageObj("error", "Erro", "Por favor, anexe um arquivo.", "error"));
            return;
        }
        if (versionName.trim() === "") {
            setMessage(new MessageObj("error", "Erro", "Por favor, insira um nome para a versão.", "error"));
            return;
        }
        if (versionName.includes(" ")) {
            setMessage(new MessageObj("error", "Erro", "O nome da versão não pode conter espaços.", "error"));
            return;
        }
        try {
            if (userCurrent && doc) {
                const result = await createVersion(userCurrent, doc, versionName, file);
                setMessage(result);
                if (result.severity === "success") {
                    alterVersionForm(false);
                }
            }
        } catch (error) {
            console.error(error);
            setMessage(new MessageObj("error", "Erro de servidor", "Não foi possível criar a versão.", "error"));
        }
    };

    const handleUpdateVersion = async () => {
        if (versionName.trim() === "") {
            setMessage(new MessageObj("error", "Erro", "Por favor, insira um nome para a versão.", "error"));
            return;
        }
        if (versionName.trim().length !== versionName.length) {
            setMessage(new MessageObj("error", "Erro", "O nome da versão não pode conter espaços.", "error"));
            return;
        }
        try {
            if (userCurrent && version) {
                const result = await updateVersion(userCurrent, version, versionName);
                setMessage(result);
                if (result.severity === "success") {
                    alterVersionForm(false);
                }
            }
        } catch (error) {
            console.error(error);
            setMessage(new MessageObj("error", "Erro de servidor", "Não foi possível atualizar a versão.", "error"));
        }
    }

    useEffect(() => {
        const download = async () => {
            if (userCurrent && version?.documentVersionId) {
                const result = await downloadVersion(userCurrent, version.documentVersionId);
                setMessage(result.message);
                if (result.file) {
                    setFile(result.file);
                }
            }
        };
        download();
    }, [alterVersionForm]);

    const handleDownloadVersion = () => {
        if (!file) return;
        if (!version) return;
        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <Box>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

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
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    maxWidth: '90%',
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: theme.palette.background.default,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CustomTypography
                    text={version?.documentVersionId ? 'Editar Versão' : 'Criar Versão'}
                    component="h2"
                    variant="h6"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${theme.palette.text.primary}`,
                        pb: 1,
                    }}
                />

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
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    {!isMobile &&
                        <CustomButton
                            text="Pré-visualizar"
                            type="button"
                            colorType="secondary"
                            onClick={() => setPreviewOpen(true)}
                            hoverColorType="secondary"
                            fullWidth={true}
                            paddingY={1}
                            disabled={!file}
                        />}

                    <IconButton
                        color="primary"
                        onClick={handleDownloadVersion}
                        disabled={!file}
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            p: 0,
                        }}
                    >
                        <Download sx={{ fontSize: 38 }} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <CustomButton
                        text="Anexar Documento"
                        type="button"
                        colorType="primary"
                        onClick={handleAttachFile}
                        hoverColorType="primary"
                        fullWidth={true}
                        disabled={!!version?.documentVersionId}
                        paddingY={1}
                        paddingX={3}
                    />

                    <CustomButton
                        text={version?.documentVersionId ? 'Atualizar' : 'Salvar'}
                        type="button"
                        colorType="primary"
                        onClick={
                            version?.documentVersionId ? handleUpdateVersion : handleCreateVersion
                        }
                        hoverColorType="primary"
                        fullWidth={false}
                        paddingY={1}
                        paddingX={3}
                    />
                </Box>
            </Box>

            {previewOpen && file && <PreviewVersion file={file} onClose={() => setPreviewOpen(false)} />}
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1500,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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

export default VersionForm;