import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Divider, } from '@mui/material';
import CustomTypography from '../customTypography';
import Menu from '@mui/icons-material/Menu';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import Documents from '../documents';
import CustomButton from '../customButton';
import CustomTextField from '../customTextField';
import { useDocumentViewerStore } from '@/app/state/documentViewerState';
import { useFilterStore } from '@/app/state/filterState';
import { useAuth } from '../useAuth';
import { useDocumentFormStore } from '@/app/state/documentFormState';
import DocumentForm from '../documents/documentForm';
import { useDocumentStore } from '@/app/state/documentState';
import { DocumentObj } from '@/app/models/DocumentObj';
import { organizationType } from '@/app/services/ConstantsTypes';
import TableDocuments from '../tableDocuments';
import { useOrganizationStore } from '@/app/state/organizationState';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';

const OpenOrganization: React.FC = () => {
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
    const organization = useOrganizationStore((state) => state.organization);
    const alterOrg = useOrganizationStore((state) => state.alter);
    const alterOption = useOptionsDashboardStore((state) => state.alter);

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
            creator: '',
            imagemSrc: '',
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

    const handleEstatisticasClick = () => {
        if (organization != undefined) {
            alterOption('StatsOrganization');
            alterOrg(organization);
        }
    };

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton
                        text="Adicionar Documento"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={toggleDocumentForm}
                        paddingY={2}
                    />
                </Box>
                <Box
                    sx={{ width: '55%' }}>
                    <CustomTextField
                        name="filter"
                        label="Informe um detalhe"
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        focusedColor="primary"
                        hoverColor="info"
                        marginBottom={2}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton
                        text="Estatísticas"
                        type="button"
                        colorType="primary"
                        hoverColorType="primary"
                        onClick={handleEstatisticasClick}
                        paddingY={2}
                    />
                </Box>
                <Box sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    display: 'flex',
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
                    text="Documentos da Organização: 10"
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
        </Box >
    );
};

export default OpenOrganization;