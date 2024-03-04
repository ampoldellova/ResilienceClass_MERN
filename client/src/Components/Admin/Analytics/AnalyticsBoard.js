import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CardMedia, CardContent, Button, Grid, Paper, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar, TextField } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Title } from '@mui/icons-material';
import MetaData from '../../Layout/Metadata';
// import { getToken, getUser, isUserTeacher, logout } from '../../utils/helpers';
import { getToken, getUser, logout } from '../../../utils/helpers';
import LogoutIcon from '@mui/icons-material/Logout';
import MainListItems from '../../listItems';

import { Loader } from '../../Loader';
import EditProfile from '../../User/EditProfile';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import axios from 'axios';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

const AnalyticsBoard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const menuId = 'primary-search-account-menu';
    const [open, setOpen] = React.useState(true);
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);

    const logoutUser = async () => {
        try {
            await axios.get(`http://localhost:4003/api/v1/logout`)
            setUser('')
            logout(() => navigate('/login'))
        } catch (error) {
            alert("Error Occured")
        }
    }

    const logoutHandler = () => {
        logoutUser();
        handleProfileMenuClose();
        alert("Successfully Logged out")
    }

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };



    useEffect(() => {
        setUser(getUser());
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:4003/api/v1/admin/userRegistrations');
                setData(res.data);
                setLoader(false);
            } catch (err) {
                console.error(err);
                setLoader(false);
            }
        };

        const fetchAttendance = async () => {
            try {
                const response = await axios.get('http://localhost:4003/api/v1/admin/classrooms/attendance-analysis');
                setAttendanceData(response.data.attendanceAnalysis);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        fetchData();
        fetchAttendance();
    }, [])

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <MetaData title={'Learning AnalyticsBoard'} />
                <Loader open={loader} />
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: '24px'
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                Resilience Class
                            </Typography>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit">
                                <Avatar alt={user && user.name} src={user.avatar && user.avatar.url} style={{ border: '2px solid white' }} />
                            </IconButton>
                            <Menu
                                id="profileMenu"
                                anchorEl={profileaAnchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(profileaAnchorEl)}
                                onClose={handleProfileMenuClose}
                            >
                                <EditProfile />
                                <MenuItem onClick={logoutHandler}><LogoutIcon style={{ marginRight: 10 }} /> Logout</MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            <MainListItems />
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                            textAlign: 'left'
                        }}
                    >
                        <Toolbar />
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8} lg={9}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Attendance Rate
                                    </Typography>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 240,
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={attendanceData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="className" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="attendanceRate" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>

                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4} lg={3}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Registration Count
                                    </Typography>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 240,
                                        }}
                                    >

                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Registration Count
                                    </Typography>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Container>
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default AnalyticsBoard;