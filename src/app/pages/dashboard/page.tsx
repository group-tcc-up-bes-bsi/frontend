"use client"
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { Settings, Star, Folder, Groups, Home, Leaderboard } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
import CustomTypography from '@/app/components/CustomTypography';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Dashboard = () => {
    const [open, setOpen] = React.useState(false);
    const { theme, toggleTheme, isDarkMode } = useTheme();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box className="flex h-screen"
            sx={{ backgroundColor: theme.palette.background.paper }}>
            <Box
                className="fixed top-0 left-0 right-0 z-10 h-16 flex items-center"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    transition: 'all 0.3s ease',
                }}
            >
                <Box className="flex items-center justify-end w-full gap-8 p-8">
                    <NotificationsIcon sx={{ color: theme.palette.text.primary }} />
                    {isDarkMode ? (
                        <LightModeIcon onClick={toggleTheme} sx={{ color: theme.palette.text.primary }} />
                    ) : (
                        <DarkModeIcon onClick={toggleTheme} sx={{ color: theme.palette.text.primary }} />
                    )}

                    <LogoutIcon sx={{ color: theme.palette.text.primary }} />
                </Box>
            </Box>
            <Drawer
                variant="permanent"
                sx={{
                    width: open ? 240 : 56,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? 240 : 56,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                        position: 'fixed',
                        height: '100vh',
                        top: 0,
                        left: 0,
                        backgroundColor: theme.palette.background.default,
                    },
                }}
            >
                <Box onClick={toggleDrawer}
                    sx={{
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    {open ? (
                        <CustomTypography
                            text='DocDash'
                            component="h5"
                            variant='h5'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary }}
                        />
                    ) : (
                        <CustomTypography
                            text='DD'
                            component="h5"
                            variant='h5'
                            align="center"
                            className="font-bold"
                            sx={{ color: theme.palette.text.primary }}
                        />
                    )}
                </Box>
                <Divider sx={{ backgroundColor: theme.palette.divider }} />
                <List >
                    {[
                        { text: 'Inicio', icon: <Home sx={{ color: theme.palette.text.primary }} /> },
                        { text: 'Meus Arquivos', icon: <Folder sx={{ color: theme.palette.text.primary }} /> },
                        { text: 'Organizações', icon: <Groups sx={{ color: theme.palette.text.primary }} /> },
                        { text: 'Favoritos', icon: <Star sx={{ color: theme.palette.text.primary }} /> },
                        { text: 'Lixeira', icon: <Leaderboard sx={{ color: theme.palette.text.primary }} /> },
                    ].map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={toggleDrawer}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                        '& .MuiListItemIcon-root': {
                                            color: theme.palette.text.primary,
                                        },
                                        '& .MuiListItemText-root': {
                                            color: theme.palette.text.primary,
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                                    {item.icon}
                                </ListItemIcon>
                                {open && (
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ color: theme.palette.text.primary }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ backgroundColor: theme.palette.divider }} />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleDrawer}
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.text.primary,
                                    },
                                    '& .MuiListItemText-root': {
                                        color: theme.palette.text.primary,
                                    }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Settings sx={{ color: theme.palette.text.primary }} />
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary="Configurações"
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            <main
                className="flex-1 p-4"
                style={{
                    marginLeft: open ? '240px' : '56px',
                    transition: 'margin-left 0.3s ease',
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                    }}
                >
                    <CustomTypography
                        text='DocDash'
                        component="h1"
                        variant='h3'
                        sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontWeight: 'bold',
                        }}
                    />
                    <CustomTypography
                        text='Esta é a área de conteúdo principal que se expande quando o menu é recolhido.'
                        component="p"
                        variant='body1'
                        sx={{ color: theme.palette.text.secondary }}
                    />
                </Box>
            </main>
        </Box>
    );
};

export default Dashboard;