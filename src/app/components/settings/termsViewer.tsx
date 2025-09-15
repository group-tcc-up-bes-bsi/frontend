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
                    width: '850px',
                    height: '700px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 3,
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
                {lines.map((line, index) => {
                    // Checa se é título (começa com número + ".")
                    const isTitle = /^[0-9]+\./.test(line.trim());

                    return (
                        <CustomTypography
                            key={index}
                            text={line}
                            component={isTitle ? "h3" : "p"}
                            variant={isTitle ? "h6" : "body1"}
                            sx={{
                                color: theme.palette.text.primary,
                                mb: isTitle ? 2 : 1,
                                mt: isTitle ? 2 : 0,
                                fontWeight: isTitle ? "bold" : "normal",
                                whiteSpace: "pre-line",
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

export default TermsViewer;
