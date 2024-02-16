import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom'
import { InputLabel, TextField, Button, Grid, Paper, CardMedia, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { mainListItems } from '../listItems';
import { getUser, logout } from '../../utils/helpers';
import { toast } from 'react-toastify';
import MetaData from '../Layout/Metadata';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import Posts from './Posts';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = Yup.object({
    contents: Yup.string().required('Content is required'),
    attachments: Yup.mixed(),
    deadline: Yup.date()
});

const classUpdateValidationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    section: Yup.string().required('Class Section is required'),
    subject: Yup.string().required('Class Subject is required'),
    roomNumber: Yup.string().required('Class Room Number is required'),
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

const ClassDetails = () => {
    const [open, setOpen] = React.useState(true);
    const [user, setUser] = useState('')
    const navigate = useNavigate()
    const menuId = 'primary-search-account-menu';
    const [error, setError] = useState('');
    const [classRoom, setClass] = useState({});
    const [success, setSuccess] = useState('')
    const [modal, setModal] = useState(false);
    const [updateClassModal, setUpdateClassModal] = useState(false);
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [classPosts, setClassPosts] = useState([])
    // const [classPosts, setClassPosts] = useState([])

    const toggle = () => {
        setModal(!modal);
        setUpdateClassModal(false);
    };

    const updateClassToggle = () => {
        setUpdateClassModal(!updateClassModal);
        setModal(false)
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

    let { id } = useParams()

    const classDetails = async (id) => {
        // let link = `http://localhost:4003/api/v1/class/${id}`

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classRoom } } = await axios.get(`http://localhost:4003/api/v1/class/${id}`, config);

        // let res = await axios.get(link, config)
        // console.log(res)
        // if (!res)
        //     setError('Class not found')
        updateClassFormik.setFieldValue('className', classRoom.className);
        updateClassFormik.setFieldValue('section', classRoom.section);
        updateClassFormik.setFieldValue('subject', classRoom.subject);
        updateClassFormik.setFieldValue('roomNumber', classRoom.roomNumber);
        setClass(classRoom)
    }

    const formik = useFormik({
        initialValues: {
            contents: '',
            attachments: [],
            deadline: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.set('class', id);
            formData.set('contents', values.contents);
            for (let i = 0; i < values.attachments.length; i++) {
                formData.append('attachments', values.attachments[i]);
            }
            formData.set('deadline', values.deadline);
            console.log(values)
            NewPost(formData)
        },
    });

    const updateClassFormik = useFormik({
        initialValues: {
            className: '',
            section: '',
            subject: '',
            roomNumber: '',
            coverPhoto: ''
        },
        validationSchema: classUpdateValidationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('className', values.className);
            formData.set('section', values.section);
            formData.set('subject', values.subject);
            formData.set('roomNumber', values.roomNumber);
            formData.set('coverPhoto', values.coverPhoto[0]);

            UpdateClassRoom(id, formData)
        },
    });

    const NewPost = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/class/post/new`, formData, config)
            toggle();
            formik.resetForm();
            window.location.reload();
            setSuccess(data.success);
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const getClassPosts = async (id) => {
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4003/api/v1/class/post/${id}`, config)
            console.log(data.post)
            setClassPosts(data.post)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const UpdateClassRoom = async (id, formData) => {

        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.put(`http://localhost:4003/api/v1/class/update/${id}`, formData, config)
            toggle();
            updateClassFormik.resetForm();
            window.location.reload();
            setSuccess(data.success)
            setClass(data.class)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        setUser(getUser());
        classDetails(id);
        getClassPosts(id);
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
                        <Box position="relative" sx={{ mb: 3 }}>
                            <CardMedia
                                sx={{ height: 300, borderRadius: 2 }}
                                image={classRoom?.coverPhoto?.url}
                            />
                            <Typography
                                variant="h3"
                                sx={{
                                    position: 'absolute',
                                    bottom: 30,
                                    left: 10,
                                    color: '#fff',
                                    padding: '8px',
                                }}
                            >
                                {classRoom?.subject}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 10,
                                    color: '#fff',
                                    padding: '8px',
                                }}
                            >
                                Room: {classRoom?.roomNumber}
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 'auto',
                                    }}
                                >

                                    <Avatar alt={user && user.name} src={user.avatar && user.avatar.url} style={{ border: '2px solid white' }} />
                                    <Button variant="text" onClick={toggle} sx={{ marginLeft: 2 }}>Announce Something to your class</Button>
                                </Paper>

                                {classPosts && classPosts.map(posts => {
                                    console.log(posts)
                                    return <Posts key={posts._id} posts={posts} />
                                })}
                                <Modal isOpen={modal} toggle={() => toggle()} centered>
                                    <ModalHeader toggle={toggle}>Create a Post</ModalHeader>
                                    <ModalBody>
                                        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        id="contents"
                                                        label="Content"
                                                        multiline
                                                        rows={5}
                                                        variant="filled"
                                                        value={formik.values.contents}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.contents && Boolean(formik.errors.contents)}
                                                        helperText={formik.touched.contents && formik.errors.contents}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <InputLabel>Attach a File </InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="attachments"
                                                        type="file"
                                                        id="attachments"
                                                        accept=".pdf"
                                                        inputProps={{
                                                            multiple: true
                                                        }}
                                                        onChange={(e) => {
                                                            formik.setFieldValue('attachments', e.target.files)
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DateTimePicker ']}>
                                                            <DateTimePicker
                                                                fullWidth
                                                                disablePast={true}
                                                                label="Set a Deadline"
                                                                onChange={(value) => {
                                                                    formik.setFieldValue('deadline', value)
                                                                }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                Create Post
                                            </Button>
                                        </Box>
                                    </ModalBody>
                                </Modal>
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 105,
                                        marginBottom: 2
                                    }}
                                >
                                    <Typography variant='subtitle1'>Class Code: </Typography>
                                    <Typography variant='h4' sx={{ textAlign: 'center' }}>{classRoom?.classCode}</Typography>
                                </Paper>

                                <Button variant='contained' onClick={updateClassToggle} fullWidth>
                                    Edit Class
                                </Button>

                                <Modal isOpen={updateClassModal} toggle={() => updateClassToggle()} centered>
                                    <ModalHeader toggle={updateClassToggle}>Update Class</ModalHeader>
                                    <ModalBody>
                                        <Box component="form" noValidate onSubmit={updateClassFormik.handleSubmit} sx={{ mt: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        name="className"
                                                        required
                                                        fullWidth
                                                        id="className"
                                                        label="Class Name"
                                                        autoFocus
                                                        value={updateClassFormik.values.className}
                                                        onChange={updateClassFormik.handleChange}
                                                        error={updateClassFormik.touched.className && Boolean(updateClassFormik.errors.className)}
                                                        helperText={updateClassFormik.touched.className && updateClassFormik.errors.className}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="section"
                                                        label="Section"
                                                        name="section"
                                                        value={updateClassFormik.values.section}
                                                        onChange={updateClassFormik.handleChange}
                                                        error={updateClassFormik.touched.section && Boolean(updateClassFormik.errors.section)}
                                                        helperText={updateClassFormik.touched.section && updateClassFormik.errors.section}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="subject"
                                                        label="Subject"
                                                        name="subject"
                                                        value={updateClassFormik.values.subject}
                                                        onChange={updateClassFormik.handleChange}
                                                        error={updateClassFormik.touched.subject && Boolean(updateClassFormik.errors.subject)}
                                                        helperText={updateClassFormik.touched.subject && updateClassFormik.errors.subject}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="roomNumber"
                                                        label="Room Number"
                                                        id="roomNumber"
                                                        value={updateClassFormik.values.roomNumber}
                                                        onChange={updateClassFormik.handleChange}
                                                        error={updateClassFormik.touched.roomNumber && Boolean(updateClassFormik.errors.roomNumber)}
                                                        helperText={updateClassFormik.touched.roomNumber && updateClassFormik.errors.roomNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <InputLabel>Select Class Cover Photo</InputLabel>
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="coverPhoto"
                                                        id="coverPhoto"
                                                        type="file"
                                                        accept="images/*"
                                                        onChange={(e) => {
                                                            updateClassFormik.setFieldValue('coverPhoto', e.target.files)
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                Edit Class
                                            </Button>
                                        </Box>
                                    </ModalBody>
                                </Modal>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
};

export default ClassDetails;