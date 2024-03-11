import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Grid, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import MainListItems from '../listItems';
import { toast } from 'react-toastify';
import MetaData from '../Layout/Metadata';
import axios from 'axios';
import { getToken, getUser, logout } from '../../utils/helpers';
import { Loader } from '../Loader';
import EditProfile from '../User/EditProfile';
import Archive from './Archive';

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

const ArchivedClass = () => {
    const [open, setOpen] = React.useState(true);
    const [user, setUser] = useState('')
    const navigate = useNavigate()
    const menuId = 'primary-search-account-menu';
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [loader, setLoader] = useState(true);
    const [archivedClassroom, setArchivedClassroom] = useState([]);

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const logoutUser = async () => {
        try {
            await axios.get(`http://localhost:4003/api/v1/logout`)
            setUser('')
            logout(() => navigate('/login'))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const logoutHandler = () => {
        logoutUser();
        handleProfileMenuClose();
        toast.success('log out', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    const getArchivedClassroom = async () => {
        setLoader(true)
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4003/api/v1/class/user/archives`, config)

            setLoader(false);
            setArchivedClassroom(data.archivedClassroom)
        } catch (error) {
            setLoader(false);
        }
    }

    useEffect(() => {
        setUser(getUser())
        getArchivedClassroom()
    }, [])

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Loader open={loader} />
            <MetaData title={'Dashboard'} />

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
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
                        {archivedClassroom && archivedClassroom.length === 0 ?
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img className="my-5 img-fluid d-block mx-auto" src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1710180927/ResilienceClass/Empty_Archive_p6b0gj.png" alt="No classroom yet" width="450" height="450" />
                                </div>
                                <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: 1 }}>Empty Classroom Archive.</Typography>
                            </> : <>
                                {archivedClassroom && archivedClassroom.map(classes => {
                                    console.log(classes)
                                    return <Archive key={classes._id} classes={classes} getArchivedClassroom={getArchivedClassroom} />
                                })}
                            </>
                        }
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
};

export default ArchivedClass;
