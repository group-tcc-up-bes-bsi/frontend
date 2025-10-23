import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import CustomTypography from '../customTypography';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { useDocumentStore } from '@/app/state/documentState';
import { AuditLogObj } from '@/app/models/AuditLogObj';
import { useAuditLogStore } from '@/app/state/auditLogState';
import { getAuditLogsByDocument } from '@/app/services/Documents/getAuditLogsByDocument';
import { formatDate } from '@/app/services/ConstantsTypes';

const LogsViewer: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const userCurrent = useUserStore((state) => state.userCurrent);
    const document = useDocumentStore((state) => state.document);
    const alterOpenLog = useAuditLogStore((state) => state.alter);
    const [logs, setLogs] = useState<AuditLogObj[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!userCurrent || !document) return;

            setLoading(true);

            try {
                const result = await getAuditLogsByDocument(userCurrent, document);
                if (result.message.severity === 'success') {
                    setLogs(result.logs);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [userCurrent, document]);

    return (
        <Box>
            <Backdrop
                open={true}
                onClick={() => alterOpenLog(false)}
                sx={{
                    zIndex: 3,
                    marginTop: 3,
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
                        xs: '90vw',
                        sm: '90vw',
                        md: '800px',
                        lg: '900px'
                    },
                    height: {
                        xs: '90vh',
                        md: '700px'
                    },
                    maxWidth: '95vw',
                    maxHeight: '80vh',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: {
                        xs: 2,
                        md: 3
                    },
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <CustomTypography
                        text={`Logs de Auditoria - ${document?.name}`}
                        component="h2"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold',
                            fontSize: {
                                xs: '1.3rem',
                                md: '1.5rem'
                            },
                            mb: 1
                        }}
                    />
                </Box>

                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    pr: { xs: 0.5, md: 1 },
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : logs.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CustomTypography
                                text="Nenhum log de auditoria encontrado"
                                component="p"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    textAlign: 'center',
                                    fontSize: '1.1rem'
                                }}
                            />
                        </Box>
                    ) : (
                        logs.map((log, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: '8px',
                                    p: 2,
                                    mb: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                    <CustomTypography
                                        text={log.action}
                                        component="h3"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'start',
                                            color: theme.palette.text.primary,
                                            fontWeight: 'bold',
                                            fontSize: {
                                                xs: '1rem',
                                                md: '1.1rem'
                                            },
                                            flex: 0.8
                                        }}
                                    />
                                    {'timestamp' in log && (
                                        <CustomTypography
                                            text={formatDate(log.timestamp)}
                                            component="span"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic'
                                            }}
                                        />
                                    )}
                                    <CustomTypography
                                        text={'Usuário: ' + log.username}
                                        component="span"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontSize: '0.8rem',
                                            backgroundColor: theme.palette.action.hover,
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: '4px',
                                            ml: 1
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.text.primary}`
                }}>
                    <CustomTypography
                        text={`Total: ${logs.length} log(s)`}
                        component="p"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '0.9rem'
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default LogsViewer;