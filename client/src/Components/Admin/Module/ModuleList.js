import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CardMedia, CardContent, Button, Grid, Paper, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar, TextField, Card } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Assignment } from '@mui/icons-material';
import MetaData from '../../Layout/Metadata';
import { getToken, getUser, isUserTeacher, logout } from '../../../utils/helpers';
import LogoutIcon from '@mui/icons-material/Logout';
import MainListItems from '../../listItems';
import axios from 'axios';
import { Loader } from '../../Loader';
import EditProfile from '../../User/EditProfile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { profileHead } from '../../../utils/userAvatar';

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

const ModuleList = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [modules, setModules] = useState([]);
    const menuId = 'primary-search-account-menu';
    const [open, setOpen] = React.useState(true);
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [loader, setLoader] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false)

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

    const deleteModuleHandler = (id) => {
        deleteModule(id)
    }

    const getAdminModules = async () => {
        setLoader(true)
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { modules } } = await axios.get(`http://localhost:4003/api/v1/admin/modules`, config)

            setLoader(false)
            console.log(modules)
            setModules(modules)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    const deleteModule = async (id) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/admin/module/delete/${id}`, config)

            setLoader(false)
            setIsDeleted(data.success)
            getAdminModules();
            alert('Learning Module Successfully Deleted!')
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    useEffect(() => {
        setUser(getUser());
        getAdminModules();
    }, [])

    const ModuleList = () => {
        const data = {
            columns: [
                {
                    headerName: '',
                    field: 'creatorImage',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Avatar src={value} sx={{ height: 100, width: 100 }} />
                        </Container>
                    ),
                },
                {
                    headerName: 'Creator',
                    field: 'creator',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Content Title',
                    field: 'title',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Language',
                    field: 'language',
                    width: 150,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Attachment',
                    field: 'contents',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <div className="d-flex flex-start">
                                <Assignment color='primary' sx={{ width: 30, height: 30 }} />
                                <Typography sx={{ my: 'auto' }}>
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            maxWidth: '18ch',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                        content
                                    </a>
                                </Typography>
                            </div>
                        </Container>
                    ),
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* <Link to={`/admin/brand/${value}`}> */}
                            <Button
                                variant='contained'
                                sx={{
                                    color: 'white'
                                }}>
                                <EditIcon />
                            </Button>
                            {/* </Link> */}
                            <Button
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'red',
                                    marginLeft: 1
                                }}
                                onClick={() => deleteModuleHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Container>
                    ),
                },
            ],
            rows: []
        }

        modules.forEach(module => {
            data.rows.push({
                id: module._id,
                creatorImage: module.creator.avatar.url,
                creator: module.creator.name,
                title: module.title,
                language: module.language,
                contents: module.contents.url,
                actions: module._id
            })
        })
        return data;
    }


    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <MetaData title={'Module List'} />
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
                            <div style={{ height: 'auto', width: '100%', marginTop: 100 }}>
                                <Box textAlign="center" style={{ margin: 20 }}>
                                    <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Learning Modules</Typography>
                                </Box>
                                <DataGrid
                                    rows={ModuleList().rows}
                                    columns={ModuleList().columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10, 20]}
                                />
                            </div>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default ModuleList;