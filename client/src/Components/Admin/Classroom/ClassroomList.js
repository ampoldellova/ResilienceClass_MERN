import React, { useState, useEffect, Fragment } from 'react';
import { styled, createTheme, ThemeProvider, Box, Button, Typography, Container, CssBaseline, Toolbar, IconButton, Avatar, AppBar as MuiAppBar, Drawer as MuiDrawer, Menu, MenuItem, Divider, List } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../../Layout/Metadata';
import 'react-toastify/dist/ReactToastify.css';
import { getToken, logout, getUser } from '../../../utils/helpers';
import axios from 'axios';
import { Loader } from '../../Loader';
import EditProfile from '../../User/EditProfile';
import LogoutIcon from '@mui/icons-material/Logout';
import MainListItems from '../../listItems';
import { profileHead } from '../../../utils/userAvatar';
import { width } from '@mui/system';

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

const ClassroomList = () => {
    const [open, setOpen] = React.useState(true);
    const [user, setUser] = useState('')
    const [classrooms, setClassrooms] = useState([])
    const [loader, setLoader] = useState(true);
    const menuId = 'primary-search-account-menu';
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [isDeleted, setIsDeleted] = useState(false)
    const navigate = useNavigate()


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

    const deleteClassroomHandler = (id) => {
        deleteClassroom(id)
    }

    const getAdminClassrooms = async () => {
        setLoader(true)
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classrooms } } = await axios.get(`http://localhost:4003/api/v1/admin/classrooms`, config)

            setLoader(false)
            console.log(classrooms)
            setClassrooms(classrooms)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    const deleteClassroom = async (id) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/admin/classroom/delete/${id}`, config)

            setLoader(false)
            setIsDeleted(data.success)
            getAdminClassrooms()
            alert('Classroom Successfully Deleted!')
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    useEffect(() => {
        setUser(getUser());
        getAdminClassrooms()
    }, [])

    const ClassroomList = () => {
        const data = {
            columns: [
                {
                    headerName: '',
                    field: 'teacherImage',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* <Avatar src={value} sx={{ height: 100, width: 100 }} /> */}
                            {profileHead(value, '100px', '100px')}
                        </Container>
                    ),
                },
                {
                    headerName: 'Teacher',
                    field: 'classTeacher',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Subject',
                    field: 'subject',
                    width: 250,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Classroom Code',
                    field: 'classCode',
                    width: 150,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Classroom Name',
                    field: 'className',
                    width: 150,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Section',
                    field: 'section',
                    width: 150,
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Room Number',
                    field: 'roomNumber',
                    width: 150,
                    align: 'center',
                    headerAlign: 'center'
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
                                onClick={() => deleteClassroomHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Container>
                    ),
                },
            ],
            rows: []
        }

        classrooms.forEach(classroom => {
            data.rows.push({
                id: classroom._id,
                teacherImage: classroom.joinedUsers.find(user => user.role === "teacher").user,
                classTeacher: classroom.joinedUsers.find(user => user.role === "teacher").user.name,
                className: classroom.className,
                classCode: classroom.classCode,
                section: classroom.section,
                subject: classroom.subject,
                roomNumber: classroom.roomNumber,
                actions: classroom._id
            })
        })
        return data;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Classroom List'} />
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
                        <Loader open={loader} />
                        <Box sx={{ display: 'flex' }}>
                            <Box
                                component="main"
                                sx={{
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'light'
                                            ? theme.palette.grey[100]
                                            : theme.palette.grey[900],
                                    flexGrow: 1,
                                    overflow: 'auto',
                                }}
                            >
                                <Container>
                                    <div style={{ width: '100%' }}>
                                        <Box textAlign="center" style={{ margin: 20 }}>
                                            <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Classroom</Typography>
                                        </Box>
                                        <DataGrid
                                            rows={ClassroomList().rows}
                                            columns={ClassroomList().columns}
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
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
};

export default ClassroomList;
