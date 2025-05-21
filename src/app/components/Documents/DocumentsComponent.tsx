import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, } from '@mui/material';
import CustomTypography from '../CustomTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableDocuments from '../TableDocuments';
import Documents from '../Documents';
import CustomButton from '../CustomButton';
import CustomTextField from '../CustomTextField';

const DocumentsComponent: React.FC = () => {
    const { theme } = useTheme();
    const [modeViewer, setModeViewer] = useState(1);
    const [colorMode1, setColorMode1] = useState(theme.palette.button.primary);
    const [colorMode2, setColorMode2] = useState(theme.palette.text.primary);
    const [filter, setFilter] = useState('');

    const toggleModeViewer = (mode: number) => {
        setModeViewer(mode)
        if (mode == 1) {
            setColorMode1(theme.palette.button.primary)
            setColorMode2(theme.palette.text.primary)
        }
        if (mode == 2) {
            setColorMode1(theme.palette.text.primary)
            setColorMode2(theme.palette.button.primary)
        }
    };

    useEffect(() => {
        toggleModeViewer(modeViewer)
    },);

    const toggleDocumentForm = () => {

    }

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton
                        text="+ Novo Documento"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={toggleDocumentForm}
                        paddingY={2}
                        marginTop={0.5}
                    />
                </Box>
                <Box
                    sx={{ width: '75%' }}>
                    <CustomTextField
                        name="filter"
                        label="Informe um detalhe do documento"
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                    />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    display: 'flex',
                    marginBottom: 1,
                    alignItems: 'center',
                }}>
                    <Menu onClick={() => { toggleModeViewer(1) }} sx={{ color: colorMode1, fontSize: 32 }} />
                    <Divider
                        orientation="vertical"
                        sx={{
                            backgroundColor: theme.palette.text.primary,
                            height: 30,
                            margin: '0 10px',
                            padding: 0.2,
                            borderRadius: '20%'
                        }} />
                    <SpaceDashboard onClick={() => { toggleModeViewer(2) }} sx={{ color: colorMode2, fontSize: 32 }} />
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                width: '100%',
                background: theme.palette.background.default,
                marginTop: 2,
                paddingLeft: 2
            }}>
                <CustomTypography
                    text="Arquivos Recentes"
                    component="h2"
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        mt: 1,
                        fontWeight: 'bold',
                    }}
                />
            </Box>
            {modeViewer == 1 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    maxHeight: 'calc(80vh - 150px)',
                    overflowY: 'auto',
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
                }}>
                    <TableDocuments />
                </Box>
            )
            }
            {modeViewer == 2 && (
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    maxHeight: 'calc(80vh - 150px)',
                    overflowY: 'auto',
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
                }}>
                    <Documents />
                </Box>
            )}
        </Box >
    );
};

export default DocumentsComponent;