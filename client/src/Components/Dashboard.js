import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Grid, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { mainListItems } from './listItems';
import { getUser, logout } from '../utils/helpers';
import { toast } from 'react-toastify';
import MetaData from './Layout/Metadata';
import axios from 'axios';
import Classroom from './Class/Class';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getToken } from '../utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    section: Yup.string().required('Class Section is required'),
    subject: Yup.string().required('Class Subject is required'),
    roomNumber: Yup.string().required('Class Room Number is required'),
});

const joinClassValidation = Yup.object({
    enteredCode: Yup.string().required('Class Code is required'),
});

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

const Dashboard = () => {
    const [open, setOpen] = React.useState(true);
    const [user, setUser] = useState('')
    const navigate = useNavigate()
    const menuId = 'primary-search-account-menu';
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [classMenuAnchorEl, setClassMenuAnchorEl] = useState(null);
    const [success, setSuccess] = useState('')
    const [Class, setClass] = useState({})
    const [joinClass, setJoinClass] = useState({})
    const [error, setError] = useState('')
    const [modal, setModal] = useState(false);
    const [joinModal, setJoinModal] = useState(false);
    const [classroom, setClassroom] = useState([])

    const toggle = () => {
        setModal(!modal);
        setJoinModal(false);
    };

    const joinToggle = () => {
        setJoinModal(!joinModal);
        setModal(false)
    };

    const handleClassMenuOpen = (event) => {
        setClassMenuAnchorEl(event.currentTarget);
    };

    const handleClassMenuClose = () => {
        setClassMenuAnchorEl(null);
    };

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

    const formik = useFormik({
        initialValues: {
            className: '',
            section: '',
            subject: '',
            roomNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('className', values.className);
            formData.set('section', values.section);
            formData.set('subject', values.subject);
            formData.set('roomNumber', values.roomNumber);

            NewClassRoom(formData)
        },
    });

    const joinClassFormik = useFormik({
        initialValues: {
            enteredCode: ''
        },
        validationSchema: joinClassValidation,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('enteredCode', values.enteredCode);

            joinClassRoom(formData)
        },
    })

    const NewClassRoom = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/class/new`, formData, config)
            toggle();
            formik.resetForm();
            window.location.reload();
            setSuccess(data.success)
            setClass(data.class)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const joinClassRoom = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/class/join`, formData, config)
            toggle();
            formik.resetForm();
            window.location.reload();
            setSuccess(data.success)
            setJoinClass(data.class)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const getClassroom = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4003/api/v1/class/user`, config)
            console.log(data)
            setClassroom(data.classRoom)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        setUser(getUser())
        getClassroom()
    }, [])

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Dashboard'} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
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
                            variant="text"
                            style={{ color: 'white', marginRight: 10 }}
                            size="large"
                            edge="end"
                            aria-controls="classMenu"
                            aria-haspopup="true"
                            onClick={handleClassMenuOpen}
                            color="inherit"
                        >
                            <AddIcon />
                        </IconButton>
                        <Menu
                            id="classMenu"
                            anchorEl={classMenuAnchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(classMenuAnchorEl)}
                            onClose={handleClassMenuClose}
                        >
                            <MenuItem onClick={toggle} >Create Class</MenuItem>
                            <MenuItem onClick={joinToggle} >Join Class</MenuItem>
                        </Menu>
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
                        {mainListItems}
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
                        {classroom && classroom.map(classes => {
                            console.log(classes)
                            return <Classroom key={classes._id} classes={classes} />

                        })}
                    </Container>
                </Box>
            </Box>
            <Modal isOpen={modal} toggle={() => toggle()} centered>
                <ModalHeader toggle={toggle}>Create Class</ModalHeader>
                <ModalBody>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="className"
                                    required
                                    fullWidth
                                    id="className"
                                    label="Class Name"
                                    autoFocus
                                    value={formik.values.className}
                                    onChange={formik.handleChange}
                                    error={formik.touched.className && Boolean(formik.errors.className)}
                                    helperText={formik.touched.className && formik.errors.className}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="section"
                                    label="Section"
                                    name="section"
                                    value={formik.values.section}
                                    onChange={formik.handleChange}
                                    error={formik.touched.section && Boolean(formik.errors.section)}
                                    helperText={formik.touched.section && formik.errors.section}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="subject"
                                    label="Subject"
                                    name="subject"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                                    helperText={formik.touched.subject && formik.errors.subject}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="roomNumber"
                                    label="Room Number"
                                    id="roomNumber"
                                    value={formik.values.roomNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                                    helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Class
                        </Button>
                    </Box>
                </ModalBody>
            </Modal>
            <Modal isOpen={joinModal} toggle={() => joinToggle()} centered>
                <ModalHeader toggle={joinToggle}>Join Class</ModalHeader>
                <ModalBody>
                    <Box component="form" noValidate onSubmit={joinClassFormik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="enteredCode"
                                    label="Class Code"
                                    id="enteredCode"
                                    value={joinClassFormik.values.enteredCode}
                                    onChange={joinClassFormik.handleChange}
                                    error={joinClassFormik.touched.enteredCode && Boolean(joinClassFormik.errors.enteredCode)}
                                    helperText={joinClassFormik.touched.enteredCode && joinClassFormik.errors.enteredCode}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Join Class
                        </Button>
                    </Box>
                </ModalBody>
            </Modal>
        </ThemeProvider >
    );
};

export default Dashboard;
