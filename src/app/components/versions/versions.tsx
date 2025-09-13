import React, { useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useAuth } from '../useAuth';
import { VersionObj } from '@/app/models/VersionObj';
import { useFilterStore } from '@/app/state/filterState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import { formatDate } from '@/app/services/ConstantsTypes';
import { getVersions } from '@/app/services/Versions/getVersions';
import CustomTypography from '../customTypography';
import MsgConfirm from '../notification/msgConfirm';
import { useVersionFormStore } from '@/app/state/versionFormState';
import { useVersionStore } from '@/app/state/versionState';
import VersionForm from './versionsForm';

const Versions: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedVersion, setSelectedVersion] = useState<VersionObj | null>(null);
    const { filter } = useFilterStore();
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
    const versionForm = useVersionFormStore((state) => state.versionForm);
    const alterVersionForm = useVersionFormStore((state) => state.alter);
    const alterVersion = useVersionStore((state) => state.alter);

    const allVersions = getVersions();

    const filteredVersions = useMemo(() => {
        let version = [...allVersions];

        if (filter.trim()) {
            const searchTerm = filter.toLowerCase().trim();

            version = version.filter((version) =>
                version.versionName.toLowerCase().includes(searchTerm) ||
                version.versionFilePath.toLowerCase().includes(searchTerm) ||
                formatDate(version.createdAt).toLowerCase().includes(searchTerm) ||
                version.document.name.toLowerCase().includes(searchTerm)
            );
        }

        return version.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [allVersions, filter]);

    const toggleConfirm = (version: VersionObj) => {
        alterMsgConfirm(`Excluir a versão ${version.versionName}?`);
        alterConfirm(!openConfirm);
    }

    const toggleVersionForm = (version: VersionObj) => {
        alterVersion(version);
        alterVersionForm(!versionForm);
        setAnchorEl(null);
    }

    return (
        <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            flexDirection={'column'}
            justifyContent='center'
            p={1}
            sx={{ backgroundColor: theme.palette.background.default }}
        >
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', width: '100%', justifyContent: 'center', padding: 1 }}>
                Versões
            </Typography>
            <Box
                display="flex"
                gap={2}
                flexWrap="wrap"
                justifyContent='center'
                p={1}
                sx={{
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
                }}
            >
                {filteredVersions.length === 0 ? (
                    <CustomTypography
                        text='Nenhuma versão encontrada para o filtro informado'
                        component="h6"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            mt: 1,
                        }}
                    />
                ) : filteredVersions.map((version) => (
                    <Box
                        key={version.documentVersionId}
                        width={240}
                        borderRadius={2}
                        p={2}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: 3,
                        }}
                    >
                        <Box fontWeight="bold" fontSize="0.9rem">
                            {version.versionName}
                        </Box>
                        <Box fontWeight="bold" fontSize="0.9rem" mb={1}>
                            Documento: {version.document.name}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                <Box fontSize="0.8rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                                    Path: {version.versionFilePath}
                                </Box>
                            </Box>
                            <Box mt={0.5}>
                                <IconButton
                                    aria-label="more"
                                    onClick={(event) => {
                                        setAnchorEl(event.currentTarget);
                                        setSelectedVersion(version);
                                    }}
                                >
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedVersion?.documentVersionId === version.documentVersionId}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem onClick={() => { toggleVersionForm(version) }}>Alterar</MenuItem>
                                    <MenuItem onClick={() => toggleConfirm(version)}>Excluir</MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box fontSize="0.75rem" mt={1} sx={{ color: theme.palette.text.primary }}>
                                Criado em {formatDate(version.createdAt)}
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
            {openConfirm && (
                <MsgConfirm />
            )
            }
            {versionForm && (<VersionForm />)}
        </Box>
    );
};

export default Versions;