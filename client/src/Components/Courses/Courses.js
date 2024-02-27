import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CardContent, Button, Grid, Paper, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, MoreVert } from '@mui/icons-material';
import MetaData from '../Layout/Metadata';
import { getToken, getUser, isUserTeacher, logout } from '../../utils/helpers';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../listItems';
import axios from 'axios';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBIcon,
    MDBRipple,
    MDBBtn,
} from "mdb-react-ui-kit";
import CreateCourse from './CreateCourse';
import { Loader } from '../Loader';
import CourseDetail from './CourseDetail';

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

const Courses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [user, setUser] = useState('')
    const menuId = 'primary-search-account-menu';
    const [open, setOpen] = React.useState(true);
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [loader, setLoader] = useState(true);

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

    const getCourses = async () => {
        setLoader(true)
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { courses } } = await axios.get(`http://localhost:4003/api/v1/courses`, config)

            setLoader(false)
            console.log(courses)
            setCourses(courses)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    useEffect(() => {
        setUser(getUser());
        getCourses();
    }, [])

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <MetaData title={'Courses'} />
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
                            <CreateCourse getCourses={getCourses} />
                            {courses && courses.map(course => {
                                return <MDBContainer fluid>
                                    <MDBRow className="justify-content-center mb-0">
                                        <MDBCol md="12" xl="10">
                                            <MDBCard className="shadow-0 border rounded-3 mt-2 mb-2">
                                                <MDBCardBody>
                                                    <MDBRow>
                                                        <MDBCol md="12" lg="3" className="mb-4 mb-lg-0">
                                                            <MDBRipple
                                                                rippleColor="light"
                                                                rippleTag="div"
                                                                className="bg-image rounded hover-zoom hover-overlay"
                                                            >
                                                                <MDBCardImage
                                                                    src={course.coverImage.url}
                                                                    fluid
                                                                    className="w-100"
                                                                />
                                                                <a href="#!">
                                                                    <div
                                                                        className="mask"
                                                                        style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                                                                    ></div>
                                                                </a>
                                                            </MDBRipple>
                                                        </MDBCol>
                                                        <MDBCol md="6">
                                                            <h5>{course.title}</h5>
                                                            <div className="mt-1 mb-0 text-muted small">
                                                                <span>Created By: {course.creator.name}</span>
                                                            </div>
                                                            <div className="text-muted small">
                                                                <span>Date Published: {new Date(course.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</span>
                                                            </div>
                                                            <div className="mb-2 text-muted small">
                                                                <span>Language: {course.language}</span>
                                                            </div>
                                                            <hr />
                                                            <Typography variant='body2'>
                                                                {course.description}
                                                            </Typography>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="6"
                                                            lg="3"
                                                            className="border-sm-start-none border-start"
                                                        >
                                                            <div className="d-flex flex-column mt-4">
                                                                {/* <Button color="primary" variant='contained' size="small">
                                                                    Details
                                                                </Button> */}
                                                                <CourseDetail />
                                                                <Button variant='outlined' color="primary" size="small" sx={{ mt: 1 }}>
                                                                    Apply Course
                                                                </Button>
                                                            </div>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>
                            })}
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default Courses;