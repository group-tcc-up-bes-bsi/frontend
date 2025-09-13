import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
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

const SettingsComponent: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const [countOrgs, setCountOrgs] = useState(0);
    const userCurrent = useUserStore((state) => state.userCurrent)
    const isDarkMode = useThemeStore((state) => state.theme);
    const setIsDarkMode = useThemeStore((state) => state.alter);
    const openNotification = useNotificationStore((state) => state.openNotification);
    const termForm = useTermFormStore((state) => state.termForm);
    const alterTermForm = useTermFormStore((state) => state.alter);
    const showAdminRequest = useAdminPassStore((state) => state.showAdminRequest);
    const alterAdminPass = useAdminPassStore((state) => state.alter);

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

    return (
        <Box sx={{
            maxWidth: '100%',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3
        }}>
            <Box sx={{
                backgroundColor: theme.palette.background.default,
                padding: 2,
                width: '70%'
            }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        ml: 10,
                        mr: 10,
                        paddingY: 5
                    }}>

                        <CustomTypography
                            text='Informações da conta'
                            component="h5"
                            variant='h5'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                            <CustomTypography
                                text={'Nome: ' + userCurrent?.username}
                                component="h5"
                                variant='h6'
                                align="center"
                                className="font-bold"
                                sx={{ color: theme.palette.text.primary, ml: 2 }}
                            />
                        </Box>
                        <CustomTypography
                            text='Documentos: 210'
                            component="h5"
                            variant='h6'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, ml: 2 }}
                        />
                        <CustomTypography
                            text={'Organizações: ' + countOrgs}
                            component="h5"
                            variant='h6'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, ml: 2 }}
                        />
                    </Box>
                    <Box sx={{
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <CustomTypography
                            text='Tema'
                            component="h5"
                            variant='h5'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, mb: 2 }}
                        />
                        <FormControl sx={{ marginLeft: 10 }}>
                            <RadioGroup
                                aria-labelledby="tema-radio-label"
                                value={isDarkMode ? 'Escuro' : 'Claro'}
                                name="tema-radio-group"
                            >
                                <FormControlLabel
                                    value="Claro"
                                    control={<Radio sx={{ color: theme.palette.text.primary, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                    label="Claro"
                                    onChange={() => setIsDarkMode(false)}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                                <FormControlLabel
                                    value="Escuro"
                                    control={<Radio sx={{ color: theme.palette.text.primary, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                    label="Escuro"
                                    onChange={() => setIsDarkMode(true)}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box >
                </Box>
                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginBottom: 3,
                    mt: 3
                }} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    ml: 10,
                    mr: 10
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <CustomTypography
                            text='Termos de Uso'
                            component="h5"
                            variant='h6'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, ml: 2 }}
                        />
                        <CustomButton
                            text="Visualizar"
                            fullWidth={false}
                            type="button"
                            onClick={() => alterTermForm(true)}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={2}
                            paddingX={4}
                        />
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <CustomTypography
                            text='Política de Privacidade'
                            component="h5"
                            variant='h6'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, ml: 2 }}
                        />
                        <CustomButton
                            text="Visualizar"
                            fullWidth={false}
                            type="button"
                            onClick={() => alterTermForm(true)}
                            colorType="primary"
                            hoverColorType="primary"
                            paddingY={2}
                            paddingX={4}
                        />
                    </Box>
                </Box>
                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginBottom: 3,
                    mt: 3
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, width: '100%' }}>
                    <CustomButton
                        text="Alterar senha"
                        fullWidth={false}
                        type="button"
                        onClick={handleSubmitUserName}
                        colorType="primary"
                        hoverColorType="primary"
                        paddingY={2}
                        paddingX={4}
                        marginTop={0.5}
                    />
                </Box>
            </Box>
            {termForm && (
                <TermsViewer />
            )
            }
            {showAdminRequest && (
                <PasswordModal />
            )}
        </Box >
    );
};

export default SettingsComponent;