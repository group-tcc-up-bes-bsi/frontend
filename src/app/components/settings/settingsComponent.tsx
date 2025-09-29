import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    useMediaQuery,
    Theme,
    CssBaseline,
} from '@mui/material';
import CustomTypography from '../customTypography';
import CustomButton from '../customButton';
import { useAuth } from '../useAuth';
import { useUserStore } from '@/app/state/userState';
import { countOrganizations, getOrganizations } from '@/app/services/Organizations/getOrganizations';
import { useThemeStore } from '@/app/state/themeState';
import { useNotificationStore } from '@/app/state/notificationState';
import { useTermFormStore } from '@/app/state/termFormState';
import TermsViewer from './termsViewer';
import { useAdminPassStore } from '@/app/state/adminPassState';
import PasswordModal from '../admin/passwordModal';
import { useOrganizationStore } from '@/app/state/organizationState';
import { countDocuments, getDocuments } from '@/app/services/Documents/DocumentsServices';

const SettingsComponent: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [countOrgs, setCountOrgs] = useState(0);
    const [countDocs, setCountDocs] = useState(0);
    const userCurrent = useUserStore((state) => state.userCurrent)
    const isDarkMode = useThemeStore((state) => state.theme);
    const setIsDarkMode = useThemeStore((state) => state.alter);
    const openNotification = useNotificationStore((state) => state.openNotification);
    const termForm = useTermFormStore((state) => state.termForm);
    const alterTermForm = useTermFormStore((state) => state.alter);
    const alterText = useTermFormStore((state) => state.alterText);
    const showAdminRequest = useAdminPassStore((state) => state.showAdminRequest);
    const alterAdminPass = useAdminPassStore((state) => state.alter);
    const organization = useOrganizationStore((state) => state.organization);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        if (userCurrent != undefined) {
            (async () => {
                try {
                    if (!organization?.organizationId) {
                        const result = await getDocuments(userCurrent, theme);
                        setCountDocs(countDocuments(result.documents))
                    }
                } finally { }
            })();
        }
    }, [userCurrent, theme, openNotification]);


    useEffect(() => {
        if (!userCurrent) return;

        (async () => {
            const result = await getOrganizations(userCurrent, theme);
            setCountOrgs(countOrganizations(result.organizations));
        })();
    }, [userCurrent, theme, openNotification]);

    const handleSubmitUserName = async () => {
        if (userCurrent != undefined) {
            alterAdminPass(true);
        }
    }

    const handleViewTerms = async () => {
        const response = await fetch("/terms.txt");
        const text = await response.text();
        alterTermForm(true);
        alterText(text);
    };

    const handleViewPrivacyPolicy = async () => {
        const response = await fetch("/privacyPolicy.txt");
        const text = await response.text();
        alterTermForm(true);
        alterText(text);
    };

    return (
        <Box sx={{
            width: '100%',
            padding: { xs: 1, md: 3 }
        }}>
            <CssBaseline />

            <Box sx={{
                backgroundColor: theme.palette.background.default,
                padding: { xs: 2, md: 3 },
                width: { xs: '100%', md: '90%', lg: '70%' },
                maxWidth: '1200px',
                margin: '0 auto',
                borderRadius: { xs: 1, md: 2 },
                boxShadow: { xs: 1, md: 3 }
            }}>
                <CustomTypography
                    text='Configurações da Conta'
                    component="h1"
                    variant={isMobile ? 'h5' : 'h4'}
                    align="center"
                    className="font-bold"
                    sx={{
                        color: theme.palette.text.primary,
                        mb: 1,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                />
                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginY: 1
                }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 3, md: 4 }
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'start' },
                        width: { xs: '100%', md: '50%' },
                        padding: { xs: 1, md: 3 }
                    }}>
                        <CustomTypography
                            text='Informações da conta'
                            component="h2"
                            variant={isMobile ? 'h6' : 'h5'}
                            align={isMobile ? 'center' : 'left'}
                            className="font-bold"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 2,
                                width: '100%'
                            }}
                        />

                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'start', md: 'start' },
                            gap: 1.3,
                            marginLeft: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'center', md: 'start' },
                                gap: 1,
                                textAlign: { xs: 'center', md: 'left' }
                            }}>
                                <CustomTypography
                                    text={'Nome: ' + (userCurrent?.username || 'N/A')}
                                    component="p"
                                    variant={isMobile ? 'body1' : 'h6'}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            </Box>

                            <CustomTypography
                                text={'Documentos: ' + countDocs}
                                component="p"
                                variant={isMobile ? 'body1' : 'h6'}
                                sx={{ color: theme.palette.text.primary }}
                            />

                            <CustomTypography
                                text={'Organizações: ' + countOrgs}
                                component="p"
                                variant={isMobile ? 'body1' : 'h6'}
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </Box>
                    </Box>


                    <Box sx={{
                        width: { xs: '100%', md: '50%' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: { xs: 1, md: 3 }
                    }}>
                        <CustomTypography
                            text='Tema'
                            component="h2"
                            variant={isMobile ? 'h6' : 'h5'}
                            align="center"
                            className="font-bold"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 2,
                                width: '100%'
                            }}
                        />

                        <FormControl sx={{
                            width: '100%',
                            marginLeft: { xs: 0, md: 10 }
                        }}>
                            <RadioGroup
                                aria-labelledby="tema-radio-label"
                                value={isDarkMode ? 'Escuro' : 'Claro'}
                                name="tema-radio-group"
                                sx={{
                                    flexDirection: { xs: 'row', md: 'column' },
                                    justifyContent: { xs: 'space-around', md: 'flex-start' },
                                    gap: { xs: 1, md: 2 }
                                }}
                            >
                                <FormControlLabel
                                    value="Claro"
                                    control={<Radio sx={{
                                        color: theme.palette.text.primary,
                                        '&.Mui-checked': { color: theme.palette.primary.main }
                                    }} />}
                                    label="Claro"
                                    onChange={() => setIsDarkMode(false)}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                                <FormControlLabel
                                    value="Escuro"
                                    control={<Radio sx={{
                                        color: theme.palette.text.primary,
                                        '&.Mui-checked': { color: theme.palette.primary.main }
                                    }} />}
                                    label="Escuro"
                                    onChange={() => setIsDarkMode(true)}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>

                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginY: 3
                }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    gap: 2,
                    paddingX: { xs: 1, md: 10 }
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', md: 'center' },
                        gap: { xs: 2, md: 0 }
                    }}>
                        <CustomTypography
                            text='Termos de Uso'
                            component="h3"
                            variant={isMobile ? 'body1' : 'h6'}
                            sx={{ color: theme.palette.text.primary }}
                        />
                        <CustomButton
                            text="Visualizar"
                            fullWidth={isMobile}
                            type="button"
                            onClick={handleViewTerms}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={isMobile ? 1.5 : 2}
                            paddingX={isMobile ? 2 : 4}
                            sx={{ minWidth: { xs: '100%', md: 'auto' } }}
                        />
                    </Box>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', md: 'center' },
                        gap: { xs: 2, md: 0 }
                    }}>
                        <CustomTypography
                            text='Política de Privacidade'
                            component="h3"
                            variant={isMobile ? 'body1' : 'h6'}
                            sx={{ color: theme.palette.text.primary }}
                        />
                        <CustomButton
                            text="Visualizar"
                            fullWidth={isMobile}
                            type="button"
                            onClick={handleViewPrivacyPolicy}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={isMobile ? 1.5 : 2}
                            paddingX={isMobile ? 2 : 4}
                            sx={{ minWidth: { xs: '100%', md: 'auto' } }}
                        />
                    </Box>
                </Box>

                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginY: 3
                }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    paddingX: { xs: 1, md: 10 }

                }}>
                    <CustomButton
                        text="Alterar senha"
                        fullWidth={isMobile}
                        type="button"
                        onClick={handleSubmitUserName}
                        colorType="primary"
                        hoverColorType="primary"
                        paddingY={isMobile ? 1.5 : 2}
                        paddingX={isMobile ? 3 : 4}
                        marginTop={0.5}
                        sx={{
                            maxWidth: { xs: '100%', md: 'auto' },
                            minWidth: { xs: '100%', md: '200px' }
                        }}
                    />
                </Box>
            </Box>

            {termForm && <TermsViewer />}
            {showAdminRequest && <PasswordModal />}
        </Box>
    );
};

export default SettingsComponent;