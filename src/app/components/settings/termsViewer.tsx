import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Backdrop, Box } from '@mui/material';
import CustomTypography from '../customTypography';
import { useAuth } from '../useAuth';
import { useTermFormStore } from '@/app/state/termFormState';

const TermsViewer: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const termText = useTermFormStore((state) => state.termText);
    const alterTermForm = useTermFormStore((state) => state.alter);
    const lines = termText.split("\n");

    return (
    <Box>
        <Backdrop
            open={true}
            onClick={() => alterTermForm(false)}
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
                    lg: '850px'
                },
                height: {
                    xs: '90vh',
                    md: '700px'
                },
                maxWidth: '95vw',
                maxHeight: '75vh',
                borderRadius: '4px',
                boxShadow: theme.shadows[3],
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                p: {
                    xs: 2,
                    md: 3
                },
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
                }
            }}
        >   
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                pr: { xs: 0.5, md: 1 }
            }}>
                {lines.map((line, index) => {
                    const isTitle = /^[0-9]+\./.test(line.trim());

                    return (
                        <CustomTypography
                            key={index}
                            text={line}
                            component={isTitle ? "h3" : "p"}
                            sx={{
                                color: theme.palette.text.primary,
                                mb: isTitle 
                                    ? { xs: 1.5, md: 2 }
                                    : { xs: 0.75, md: 1 },
                                mt: isTitle 
                                    ? { xs: 1.5, md: 2 }
                                    : 0,
                                fontWeight: isTitle ? "bold" : "normal",
                                whiteSpace: "pre-line",
                                fontSize: {
                                    xs: isTitle ? '1.1rem' : '0.9rem',
                                    md: 'inherit'
                                },
                                lineHeight: {
                                    xs: 1.4,
                                    md: 1.6
                                }
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    </Box>
);
};

export default TermsViewer;
