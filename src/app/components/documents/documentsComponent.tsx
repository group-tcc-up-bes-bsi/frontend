import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, IconButton, useMediaQuery, } from '@mui/material';
import CustomTypography from '../customTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableDocuments from '../tableDocuments';
import Documents from '../documents';
import CustomButton from '../customButton';
import CustomTextField from '../customTextField';
import { useDocumentViewerStore } from '@/app/state/documentViewerState';
import { useFilterStore } from '@/app/state/filterState';
import { useAuth } from '../useAuth';
import { useDocumentFormStore } from '@/app/state/documentFormState';
import DocumentForm from './documentForm';
import { useDocumentStore } from '@/app/state/documentState';
import { DocumentObj } from '@/app/models/DocumentObj';
import { organizationType } from '@/app/services/ConstantsTypes';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';

const DocumentsComponent: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const { filter, setFilter } = useFilterStore();
    const modeViewer = useDocumentViewerStore((state) => state.mode);
    const alterModeViewer = useDocumentViewerStore((state) => state.alter);
    const [colorMode1, setColorMode1] = useState(theme.palette.button.primary);
    const [colorMode2, setColorMode2] = useState(theme.palette.text.primary);
    const documentForm = useDocumentFormStore((state) => state.documentForm);
    const alterDocumentForm = useDocumentFormStore((state) => state.alter);
    const alterDoc = useDocumentStore((state) => state.alter);
    const [message] = useState<MessageObj>();
    const [showMessage, setShowMessage] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);


    const toggleModeViewer = (mode: number) => {
        alterModeViewer(mode)
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
        const document: DocumentObj = {
            documentId: 0,
            name: '',
            type: '',
            description: '',
            creationDate: new Date(),
            lastModifiedDate: new Date(),
            version: '',
            organization: {
                organizationId: 0,
                name: '',
                description: '',
                favorite: false,
                organizationType: organizationType.INDIVIDUAL,
                borderColor: undefined,
                icon: undefined,
            },
            favorite: false,
        }
        alterDoc(document)
        alterDocumentForm(!documentForm);
    }

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{
                display: 'flex',
                gap: isMobile ? 2 : 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                width: '100%',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
                    <CustomButton
                        text="+ Novo Documento"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={toggleDocumentForm}
                        paddingY={isMobile ? 1 : 2}
                        marginTop={0}
                        marginBottom={0}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: isMobile ? 2 : 4,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: isMobile ? '100%' : '75%'
                }}>
                    <Box sx={{
                        width: isMobile ? '100%' : isTablet ? '75%' : '75%'
                    }}>
                        <CustomTextField
                            name="filter"
                            label="Detalhe do documento"
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            focusedColor="primary"
                            hoverColor="info"
                            marginBottom={0}
                            marginTop={0}
                        />
                    </Box>

                    <Box sx={{
                        backgroundColor: theme.palette.background.default,
                        padding: isMobile ? 1.4 : 0.5,
                        display: 'flex',
                        borderRadius: 1,
                        alignItems: 'center',
                    }}>
                        <IconButton
                            onClick={() => { toggleModeViewer(1) }}
                            size={isMobile ? "small" : "medium"}
                        >
                            <Menu sx={{
                                color: colorMode1,
                                fontSize: isMobile ? 24 : 32
                            }} />
                        </IconButton>
                        <Divider
                            orientation="vertical"
                            sx={{
                                backgroundColor: theme.palette.text.primary,
                                height: isMobile ? 30 : 40,
                                margin: isMobile ? '0 5px' : '0 10px',
                                padding: isMobile ? 0.1 : 0.2,
                                borderRadius: '20%'
                            }} />
                        <IconButton
                            onClick={() => { toggleModeViewer(2) }}
                            size={isMobile ? "small" : "medium"}
                        >
                            <SpaceDashboard sx={{
                                color: colorMode2,
                                fontSize: isMobile ? 24 : 32
                            }} />
                        </IconButton>
                    </Box>
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
                    text="Documentos"
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
                    maxHeight: 'calc(85vh - 150px)',
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
                    maxHeight: 'calc(85vh - 150px)',
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
            {documentForm && <DocumentForm />}
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
        </Box >
    );
};

export default DocumentsComponent;