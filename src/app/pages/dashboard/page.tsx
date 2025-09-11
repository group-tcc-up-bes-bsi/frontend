"use client"
import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Backdrop, Badge } from '@mui/material';
import { Settings, Star, Folder, Groups, Home, Delete } from '@mui/icons-material';
import { useTheme } from '@/app/theme/ThemeContext';
import CustomTypography from '@/app/components/customTypography';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Notification from '@/app/components/notification/notification';
import { useNotificationStore } from '@/app/state/notificationState';
import Organization from '@/app/components/organization/organization';
import { useOptionsDashboardStore } from '@/app/state/optionsDashboard';
import HomeComponent from '@/app/components/home/homeComponent';
import DocumentsComponent from '@/app/components/documents/documentsComponent';
import Favorites from '@/app/components/favorites/favorites';
import Trash from '@/app/components/trash/trash';
import SettingsComponent from '@/app/components/settings/settingsComponent';
import StatsDocument from '@/app/components/statsDocument';
import { useFilterStore } from '@/app/state/filterState';
import { logoutUser } from '@/app/services/User/logoutUser';
import { useAuth } from '@/app/components/useAuth';
import { getMeAuth } from '@/app/services/User/GetAuthToken';
import { useUserStore } from '@/app/state/userState';
import StatsOrganization from '@/app/components/statsOrganization';
import { useOrganizationStore } from '@/app/state/organizationState';
import { getInvitesCount } from '@/app/services/Organizations/getInvites';

const Dashboard = () => {
    useAuth();
    const [open, setOpen] = React.useState(false);
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const openNotification = useNotificationStore((state) => state.openNotification);
    const alterNotification = useNotificationStore((state) => state.alter);
    const option = useOptionsDashboardStore((state) => state.option);
    const alterOption = useOptionsDashboardStore((state) => state.alter);
    const [optionMenu, setOptionMenu] = React.useState('');
    const { setFilter } = useFilterStore();
    const alterUserCurrent = useUserStore((state) => state.alter);
    const organization = useOrganizationStore((state) => state.organization);
    const userCurrent = useUserStore((state) => state.userCurrent);
    const [invites, setInvites] = useState(0);

    useEffect(() => {
        async function fetchUserData() {
            const userCurrent = await getMeAuth();
            if (userCurrent) {
                alterUserCurrent(userCurrent);
            } else {
                logoutUser();
            }
        }
        fetchUserData();
    }, []);


    const loadInvitesCount = async () => {
        if (!userCurrent) return;
        try {
            const result = await getInvitesCount(userCurrent, theme);
            setInvites(result.count);
        } catch (error) {
            console.error("Erro ao carregar convites:", error);
            setInvites(0);
        }
    };

    useEffect(() => {
        loadInvitesCount();
    }, [userCurrent, theme, openNotification]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const toggleDrawerMain = () => {
        if (open) {
            setOpen(!open);
        }
    };

    const optionMenuChoice = () => {
        switch (option) {
            case 'Home':
                setOptionMenu("Inicio");
                break;
            case 'Documents':
                setOptionMenu("Meus Documentos");
                break;
            case 'Organizations':
                setOptionMenu("Organizações");
                break;
            case 'Favorites':
                setOptionMenu("Favoritos");
                break;
            case 'Recycle Bin':
                setOptionMenu("Lixeira");
                break;
            case 'Settings':
                setOptionMenu("Configurações");
                break;
            case 'StatsDocument':
                setOptionMenu("Estatisticas do Documento");
                break;
            case 'StatsOrganization':
                setOptionMenu("Estatisticas " + organization?.name);
                break;
            default:
                setOptionMenu("");
        }
    };

    React.useEffect(() => {
        optionMenuChoice();
    },);

    const toggleOption = (optionText: string) => {
        alterOption(optionText)
        optionMenuChoice();
        setFilter('');
    };

    const toggleNotification = () => {
        alterNotification(!openNotification);
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
                <Box className="flex items-center justify-between w-full px-4">
                    <CustomTypography
                        text={optionMenu}
                        component="h5"
                        variant='h5'
                        align="center"
                        className="font-bold"
                        sx={{ color: theme.palette.text.primary, ml: open ? 30 : 10 }}
                    />
                </Box>
                <Box className="flex items-center justify-end w-full gap-8 p-8">
                    <Box className="relative flex flex-col items-center">
                        <Badge
                            badgeContent={invites > 0 ? invites : null}
                            color="info"
                            overlap="circular"
                        >
                            <NotificationsIcon
                                onClick={toggleNotification}
                                sx={{ color: theme.palette.text.primary, cursor: 'pointer' }}
                            />
                        </Badge>
                    </Box>

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
                        { optionText: 'Recycle Bin', text: 'Lixeira', icon: <Delete sx={{ color: theme.palette.text.primary }} /> },
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
                className="flex-1 p-4 overflow-hidden"
                style={{
                    marginTop: "70px",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                {option === "Home" && <HomeComponent />}
                {option === "Documents" && <DocumentsComponent />}
                {option === "Organizations" && <Organization />}
                {option === "Favorites" && <Favorites />}
                {option === "Recycle Bin" && <Trash />}
                {option === "Settings" && <SettingsComponent />}
                {option === "StatsDocument" && <StatsDocument />}
                {option === "StatsOrganization" && <StatsOrganization />}
            </main>

            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: theme.zIndex.drawer - 1,
                }}
                open={open}
                onClick={toggleDrawerMain}
            />
            {openNotification && (
                <Notification />
            )
            }
        </Box>
    );
};

export default Dashboard;