import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom'
import { InputLabel, TextField, Button, Grid, Paper, CardMedia, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { mainListItems } from '../listItems';
import { getUser, logout } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import Posts from '../Posts/Posts';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CreateClasswork from '../Classworks/CreateClasswork';
import EditClassDetails from './EditClassDetails';
import ClassworkList from '../Classworks/ClassworkList';

const validationSchema = Yup.object({
    contents: Yup.string().required('Content is required'),
    attachments: Yup.mixed(),
    deadline: Yup.date()
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
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [classPosts, setClassPosts] = useState([])

    const toggle = () => {
        setModal(!modal);
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
            alert("Error occured")
        }
    }

    const logoutHandler = () => {
        logoutUser();
        handleProfileMenuClose();
        alert("Logged out")
    }

    let { id } = useParams()

    const classDetails = async (id) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classRoom } } = await axios.get(`http://localhost:4003/api/v1/class/${id}`, config);

        setClass(classRoom)
    }

    const formik = useFormik({
        initialValues: {
            contents: '',
            attachments: [],
            // deadline: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.set('class', id);
            formData.set('contents', values.contents);
            for (let i = 0; i < values.attachments.length; i++) {
                formData.append('attachments', values.attachments[i]);
            }
            // formData.set('deadline', values.deadline);
            // console.log(values)
            NewPost(formData)
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

            setModal(false);
            formik.resetForm();
            getClassPosts();
            setSuccess(data.success);
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const getClassPosts = async () => {
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4003/api/v1/class/post/${id}`, config)
            setClassPosts(data.post)
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

    const isUserTeacher = () => {
        return classRoom?.joinedUsers?.find((joinedUser) => joinedUser.user === getUser()?._id).role === 'teacher';
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                                    color: 'white',
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
                                    color: 'white',
                                    padding: '8px',
                                }}
                            >
                                Room: {classRoom?.roomNumber}
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
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

                                    < Avatar alt={user && user.name} src={user.avatar && user.avatar.url} />
                                    <Button variant="text" onClick={toggle} sx={{ marginLeft: 2 }}>Announce Something to your class</Button>
                                </Paper>

                                {classPosts && classPosts.map(posts => {
                                    return <Posts key={posts._id} posts={posts} getClassPosts={getClassPosts} classRoom={classRoom} postId={posts._id} />
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
                                {isUserTeacher() ?
                                    <>
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

                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 'auto',
                                                marginBottom: 2
                                            }}
                                        >
                                            <Typography variant='subtitle1'>Classworks: </Typography>
                                            <ClassworkList />
                                        </Paper>

                                        <CreateClasswork />
                                        <EditClassDetails />
                                    </>
                                    : <>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 'auto',
                                                marginBottom: 2
                                            }}
                                        >
                                            <Typography variant='subtitle1'>Classworks: </Typography>
                                            <ClassworkList />
                                        </Paper>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
};

export default ClassDetails;