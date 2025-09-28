import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    IconButton,
    useMediaQuery
} from '@mui/material';
import CustomTypography from '../customTypography';
import CustomTextField from '../customTextField';
import { CachedRounded, Delete } from '@mui/icons-material';
import CustomButton from '../customButton';
import { DocumentObj } from '@/app/models/DocumentObj';
import { getDocumentsTrash } from '@/app/services/Documents/DocumentsServices';
import { useFilterStore } from '@/app/state/filterState';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import MsgConfirm from '../notification/msgConfirm';
import { useAuth } from '../useAuth';
import { formatDate } from '@/app/services/ConstantsTypes';
import { MessageObj } from '@/app/models/MessageObj';
import CustomAlert from '../customAlert';

const Trash: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const { filter, setFilter } = useFilterStore();
    const openConfirm = useMsgConfirmStore((state) => state.openConfirm);
    const alterConfirm = useMsgConfirmStore((state) => state.alter);
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alterMsg);
    const [message] = useState<MessageObj>(
        new MessageObj('info', 'Tela da Lixeira', '', 'info')
    );
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [message]);


    const documents: DocumentObj[] = getDocumentsTrash();

    const filteredDocuments = useMemo(() => {
        if (!filter.trim()) {
            return documents;
        }

        const searchTerm = filter.toLowerCase().trim();

        return documents.filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm) ||
            doc.type.toLowerCase().includes(searchTerm) ||
            formatDate(doc.creationDate).toLowerCase().includes(searchTerm) ||
            formatDate(doc.lastModifiedDate).toLowerCase().includes(searchTerm) ||
            doc.version.toLowerCase().includes(searchTerm) ||
            doc.organization.name.toLowerCase().includes(searchTerm)
        );
    }, [documents, filter]);

    const toggleConfirm = (document: DocumentObj) => {
        alterMsgConfirm(`excluir permanentemente documento ${document.name}?`);
        alterConfirm(!openConfirm);
    }

    const toggleConfirmEmpty = () => {
        alterMsgConfirm(`esvaziar a lixeira?`);
        alterConfirm(!openConfirm);
    }

    return (
        <Box sx={{ maxWidth: '100%', p: isMobile ? 1 : 0 }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        gap: isMobile ? 0 : 0,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: isMobile ? 'column' : 'row'
                    }}>
                        <Box sx={{ width: isMobile ? '100%' : '50%' }}>
                            <CustomTextField
                                name="filter"
                                label="Informe um detalhe do documento"
                                type="text"
                                value={filter}
                                marginBottom={0}
                                onChange={(e) => setFilter(e.target.value)}
                                focusedColor="primary"
                                hoverColor="info"
                                sx={{wordWrap: 'break-word'}}
                            />
                        </Box>
                        <CustomButton
                            fullWidth={isMobile}
                            text="Esvaziar Lixeira"
                            type="button"
                            onClick={toggleConfirmEmpty}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={isMobile ? 1 : 2}
                            paddingX={2}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: theme.palette.background.default, p: isMobile ? 1 : 3, marginTop: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                        <CustomTypography
                            text="Documentos"
                            component="h2"
                            variant={isMobile ? "h6" : "h5"}
                            sx={{
                                color: theme.palette.text.primary,
                                mb: isMobile ? 2 : 3,
                                mt: isMobile ? 0 : 1,
                                fontWeight: 'bold'
                            }}
                        />
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 1,
                                maxHeight: isMobile ? 'calc(100vh - 200px)' : 'calc(80vh - 150px)',
                            }}>
                            <TableContainer sx={{
                                maxWidth: '100%',
                                overflowY: 'auto',
                                overflowX: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                    height: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: theme.palette.background.default,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '3px',
                                },
                            }}>
                                <Table sx={{ minWidth: 650 }} aria-label="tabela de Documentos" size={isMobile ? "small" : "medium"}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem',
                                            }}>Documento</TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem',
                                                display: isMobile ? 'none' : 'table-cell'
                                            }}>Tipo</TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem',
                                                display: isSmallScreen ? 'none' : 'table-cell'
                                            }}>
                                                Data Criação
                                            </TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem',
                                                display: isLargeScreen ? 'table-cell' : 'none'
                                            }}>
                                                Última Alteração
                                            </TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem',
                                                display: isMobile ? 'none' : 'table-cell'
                                            }}>Organização</TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem'
                                            }}>Versão Atual</TableCell>
                                            <TableCell sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                fontSize: isMobile ? '0.75rem' : '1rem'
                                            }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDocuments.map((doc) => (
                                            <TableRow key={doc.documentId}>
                                                <TableCell sx={{
                                                    background: theme.palette.background.default,
                                                    display: isSmallScreen ? 'none' : 'table-cell'
                                                }}>{doc.name}</TableCell>
                                                <TableCell sx={{
                                                    background: theme.palette.background.default,
                                                    display: isMobile ? 'none' : 'table-cell'
                                                }}>{doc.type}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span>{formatDate(doc.creationDate)}</span>
                                                        {isSmallScreen && (
                                                            <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                                                                {doc.name}
                                                            </span>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{
                                                    background: theme.palette.background.default,
                                                    display: isLargeScreen ? 'table-cell' : 'none'
                                                }}>{formatDate(doc.lastModifiedDate)}</TableCell>
                                                <TableCell sx={{
                                                    background: theme.palette.background.default,
                                                    display: isMobile ? 'none' : 'table-cell'
                                                }}>{doc.organization.name}</TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: theme.palette.background.paper,
                                                            color: theme.palette.text.primary,
                                                            px: 1,
                                                            borderRadius: 1,
                                                            display: 'inline-block',
                                                            fontSize: isMobile ? '0.8rem' : '1rem'
                                                        }}
                                                    >
                                                        {doc.version}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ background: theme.palette.background.default }}>
                                                    <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1 }}>
                                                        <IconButton
                                                            aria-label="more"
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ padding: isMobile ? '4px' : '8px' }}
                                                        >
                                                            <CachedRounded sx={{
                                                                fontSize: isMobile ? '1.2rem' : '1.5rem'
                                                            }} />
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => toggleConfirm(doc)}
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ padding: isMobile ? '4px' : '8px' }}
                                                        >
                                                            <Delete color="error" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {openConfirm && (
                <MsgConfirm />
            )}
            {showMessage && message && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? '10%' : '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        textAlign: 'left',
                        width: isMobile ? '95%' : 'auto',
                        zIndex: 9999
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
    );
};

export default Trash;