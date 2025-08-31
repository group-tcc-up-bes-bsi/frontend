import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import {
    Box,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
} from '@mui/material';
import CustomTypography from '../CustomTypography';
import { AccountCircleRounded, CachedRounded } from '@mui/icons-material';
import CustomButton from '../CustomButton';

const SettingsComponent: React.FC = () => {
    const { theme } = useTheme();

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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginBottom: 3
                }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AccountCircleRounded sx={{
                            color: theme.palette.text.primary,
                            fontSize: 100
                        }} />

                    </Box>
                    <CustomTypography
                        text='Usuário'
                        component="h5"
                        variant='h5'
                        align="center"
                        className="font-bold"
                        sx={{ color: theme.palette.text.primary }}
                    />
                </Box>
                <Divider sx={{
                    backgroundColor: theme.palette.text.primary,
                    marginBottom: 3
                }} />
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        ml: 10,
                        mr: 10
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
                                text='Nome: Teste'
                                component="h5"
                                variant='h6'
                                align="center"
                                className="font-bold"
                                sx={{ color: theme.palette.text.primary, ml: 2 }}
                            />
                            <IconButton aria-label="more">
                                <CachedRounded sx={{ color: theme.palette.text.primary }} />
                            </IconButton>
                        </Box>
                        <CustomTypography
                            text='Arquivos: 210'
                            component="h5"
                            variant='h6'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary, ml: 2 }}
                        />
                        <CustomTypography
                            text='Organizações: 5'
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
                                defaultValue="claro"
                                name="tema-radio-group"
                            >
                                <FormControlLabel
                                    value="claro"
                                    control={<Radio sx={{ color: theme.palette.text.primary, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                    label="Claro"
                                    sx={{ color: theme.palette.text.primary }}
                                />
                                <FormControlLabel
                                    value="escuro"
                                    control={<Radio sx={{ color: theme.palette.text.primary, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                    label="Escuro"
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
                        colorType="primary"
                        hoverColorType="primary"
                        paddingY={2}
                        paddingX={4}
                        marginTop={0.5}
                    />
                </Box>
            </Box>
        </Box >
    );
};

export default SettingsComponent;