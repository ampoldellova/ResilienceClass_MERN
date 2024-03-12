import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Paper, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Download, Radar } from '@mui/icons-material';
import MetaData from '../../Layout/Metadata';
import { getUser, logout } from '../../../utils/helpers';
import LogoutIcon from '@mui/icons-material/Logout';
import MainListItems from '../../listItems';
import jsPDF from 'jspdf';
import { Loader } from '../../Loader';
import EditProfile from '../../User/EditProfile';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList } from 'recharts';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { borderRadius } from '@mui/system';

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
    const [activityData, setActivityData] = useState([]);
    const [categoryDistribution, setCategoryDistribution] = useState([]);
    const chartContainerRef = useRef(null);
    // console.log(categoryDistribution)

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

    const fetchLoginActivity = async () => {
        try {
            const response = await axios.get('http://localhost:4003/api/v1/admin/user-activity');
            setActivityData(response.data.activity);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchModules = async () => {
        try {
            const { data } = await axios.get('http://localhost:4003/api/v1/admin/module-categories');
            console.log(data)
            setCategoryDistribution(data.categories);

        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleDownload = () => {
        const pdf = new jsPDF();
        if (chartContainerRef.current) {
            const chartElement = chartContainerRef.current;
            html2canvas(chartElement).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 190; // Adjusted width of the image in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const marginLeft = 10; // Adjusted left margin in mm
                const marginTop = 10; // Adjusted top margin in mm
                pdf.addImage(imgData, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
                pdf.save('Analytical Data.pdf');
            });
        } else {
            console.error('chartContainerRef.current is not defined or null');
        }
    };


    useEffect(() => {
        setUser(getUser());
        fetchData();
        fetchAttendance();
        fetchLoginActivity();
        fetchModules();
    }, [])

    const COLORS = ['#27374D', '#526D82', '#9BABB8', '#967E76'];

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
                        <Container ref={chartContainerRef} maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6} lg={6}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Attendance Rate
                                    </Typography>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 340,
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={320}>
                                            <BarChart data={attendanceData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="className" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="attendanceRate" fill="#27374D" >
                                                    {attendanceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>

                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6} lg={6}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Modules Count Per Category
                                    </Typography>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 340,
                                        }}
                                    >
                                        <PieChart width={500} height={300}>
                                            <Tooltip formatter={(value, _id, props) => [`${value}`, _id]} />
                                            <Pie
                                                data={categoryDistribution}
                                                dataKey="count"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                fill="#8884d8"
                                            >
                                                {categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                                <LabelList position="inside" fill="#fff" stroke="none" dataKey="count" fontSize={18} />
                                            </Pie>
                                            <Legend iconSize={10} layout='vertical' verticalAlign='middle' align="right" />
                                        </PieChart>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Registration and Login Count
                                    </Typography>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line data={data} type="monotone" dataKey="registry" stroke="#27374D" strokeWidth={3} />
                                                <Line data={activityData} type="monotone" dataKey="logins" stroke="#967E76" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    onClick={handleDownload}
                                    sx={{ borderRadius: '5px', mt: 2 }}
                                    size='small'
                                    startIcon={<Download />}
                                >
                                    Download Data
                                </Button>
                            </div>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default AnalyticsBoard;