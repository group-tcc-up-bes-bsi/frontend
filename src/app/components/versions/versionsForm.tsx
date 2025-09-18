import React, { useRef, useState } from 'react';
import { Box, Backdrop } from '@mui/material';
import CustomTextField from '../customTextField';
import CustomButton from '../customButton';
import CustomTypography from '../customTypography';
import { useTheme } from '@/app/theme/ThemeContext';
import { useAuth } from '../useAuth';
import { useVersionFormStore } from '@/app/state/versionFormState';
import { useVersionStore } from '@/app/state/versionState';
import PreviewVersion from './previewVersion';

const VersionForm: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const alterVersionForm = useVersionFormStore((state) => state.alter);
    const version = useVersionStore((state) => state.version);
    const [versionName, setVersionName] = useState(version?.versionName || '');
    const [file, setFile] = useState<File | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
        }
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
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 4, marginTop: 2 }}>
                    {file && (
                        <CustomButton
                            text={"Pré-visualizar"}
                            type="button"
                            colorType="secondary"
                            onClick={() => setPreviewOpen(true)}
                            hoverColorType="secondary"
                            fullWidth={false}
                            paddingY={1}
                            paddingX={3.0}
                            marginBottom={2}
                            marginTop={2}
                        />
                    )}
                    <CustomButton
                        text={"Anexar Documento"}
                        type="button"
                        colorType="primary"
                        onClick={() => { handleAttachFile() }}
                        hoverColorType="primary"
                        fullWidth={false}
                        paddingY={1}
                        paddingX={3.0}
                        marginBottom={2}
                        marginTop={2}
                    />
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

            {previewOpen && file && (
                <PreviewVersion file={file} onClose={() => setPreviewOpen(false)} />
            )}
        </Box>
    );
};

export default VersionForm;