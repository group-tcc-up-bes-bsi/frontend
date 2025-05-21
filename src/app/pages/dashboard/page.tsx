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
import Notification from '@/app/components/notification/notification';
import { useNotificationStore } from '@/app/state/notificationState';
import Organization from '@/app/components/organization/Organization';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';
import HomeComponent from '@/app/components/home/HomeComponent';
import DocumentsComponent from '@/app/components/Documents/DocumentsComponent';

const Dashboard = () => {
    const [open, setOpen] = React.useState(false);
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const openNotification = useNotificationStore((state) => state.openNotification);
    const alterNotification = useNotificationStore((state) => state.alter);
    const option = useOptionsDashboardStore((state) => state.option);
    const alterOption = useOptionsDashboardStore((state) => state.alter);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const toggleDrawerMain = () => {
        if (open) {
            setOpen(!open);
        }
    };

    const toggleOption = (optionText: string) => {
        alterOption(optionText)
    };

    const toggleNotification = () => {
        alterNotification(!openNotification);
    }

    const logoutUser = () => {
        localStorage.removeItem('jwtToken');
        window.location.href = "/";
    }

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
                    <NotificationsIcon onClick={toggleNotification} sx={{ color: theme.palette.text.primary }} />

                    {isDarkMode ? (
                        <LightModeIcon onClick={toggleTheme} sx={{ color: theme.palette.text.primary }} />
                    ) : (
                        <DarkModeIcon onClick={toggleTheme} sx={{ color: theme.palette.text.primary }} />
                    )}

                    <LogoutIcon onClick={logoutUser} sx={{ color: theme.palette.text.primary }} />
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
                        zIndex: 1200,
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
                        { optionText: 'Home', text: 'Inicio', icon: <Home sx={{ color: theme.palette.text.primary }} /> },
                        { optionText: 'Documents', text: 'Meus Documentos', icon: <Folder sx={{ color: theme.palette.text.primary }} /> },
                        { optionText: 'Organizations', text: 'Organizações', icon: <Groups sx={{ color: theme.palette.text.primary }} /> },
                        { optionText: 'Favorites', text: 'Favoritos', icon: <Star sx={{ color: theme.palette.text.primary }} /> },
                        { optionText: 'Recycle Bin', text: 'Lixeira', icon: <Leaderboard sx={{ color: theme.palette.text.primary }} /> },
                    ].map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    toggleDrawer();
                                    toggleOption(item.optionText);
                                }
                                }

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
                        <ListItemButton onClick={() => {
                            toggleDrawer();
                            toggleOption('Settings');
                        }}
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
                onClick={toggleDrawerMain}
                className="flex-1 p-4 overflow-hidden"
                style={{
                    marginTop: '70px',
                    transition: 'margin-left 0.3s ease',
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                {option == 'Home' && (<HomeComponent />)}
                {option == 'Documents' && (<DocumentsComponent />)}
                {option == 'Organizations' && (<Organization />)}
                {/*{option == 'Favorites' && ()}*/}
                {/*{option == 'Recycle Bin' && ()}*/}
                {/*{option == 'Settings' && ()}*/}

            </main>
            {openNotification && (
                <Notification />
            )
            }
        </Box>
    );
};

export default Dashboard;