import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, Button, Grid, Paper, Menu, MenuItem, CssBaseline, Drawer as MuiDrawer, Box, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Avatar } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import axios from 'axios';
import { getToken, getUser, isUserTeacher, logout } from '../../utils/helpers';
import { useParams } from 'react-router';
import MetaData from '../Layout/Metadata';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems } from '../listItems';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Assignment from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import { green } from '@mui/material/colors';

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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const defaultTheme = createTheme();

const ClassworkDetails = () => {
    const [open, setOpen] = React.useState(true);
    const [files, setFiles] = useState([]);
    const [attach, setAttach] = useState('');
    const [filesPreview, setFilesPreview] = useState([])
    const [user, setUser] = useState('')
    const menuId = 'primary-search-account-menu';
    const [profileaAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [classwork, setClasswork] = useState({});
    const [submission, setSubmission] = useState({});
    const navigate = useNavigate()

    let { id } = useParams()

    const toggleDrawer = () => {
        setOpen(!open);
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
            alert("Error Occured")
        }
    }

    const logoutHandler = () => {
        logoutUser();
        handleProfileMenuClose();
        alert("Successfully Logged out")
    }

    const getSingleClasswork = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classwork, submission } } = await axios.get(`http://localhost:4003/api/v1/class/classwork/${id}`, config);

        setFilesPreview(submission?.attachments || [])
        setClasswork(classwork)
        setSubmission(submission)
    }

    const removeFile = async (publicId) => {
        console.log(publicId);
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data } = await axios.delete(`http://localhost:4003/api/v1/class/classwork/file/remove/${id}?publicId=${publicId}`, config);

        getSingleClasswork()
    }

    const attachFile = async () => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('attachments', files[i]);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {
            const { data } = await axios.post(`http://localhost:4003/api/v1/class/classwork/${id}/attach`, formData, config);
            console.log(data);
            getSingleClasswork()
        } catch (err) {
            alert("Error occured")
            console.log(err)
        }
    }

    const submitClasswork = async (id) => {
        console.log(getToken())

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classwork } } = await axios.get(`http://localhost:4003/api/v1/class/classwork/${id}/submit`, config);

        getSingleClasswork(classwork)
        alert('Classwork submitted successfully')
    };

    const unsubmitClasswork = async (id) => {
        console.log(getToken())

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classwork } } = await axios.get(`http://localhost:4003/api/v1/class/classwork/${id}/unsubmit`, config);

        getSingleClasswork(classwork)
        alert('Classwork unsubmitted')
    };

    const onChange = e => {
        const files = Array.from(e.target.files)

        setFilesPreview([]);
        setFiles([]);
        setFiles(e.target.files)

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFilesPreview(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    const isSubmitted = () => {
        return classwork?.submissions?.find(obj => obj.user._id === getUser()._id)?.submittedAt ? true : false;
    }
    // console.log(classwork);
    useEffect(() => {
        if (files.length > 0) {
            attachFile()
        }
    }, [files])

    useEffect(() => {
        setUser(getUser())
        getSingleClasswork(id)
    }, [])

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <MetaData title={classwork.title} />
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
                                        <div className="d-flex flex-start">
                                            <AssignmentIcon color='secondary' sx={{ width: 60, height: 60, mr: 1 }} />
                                            <div>
                                                <Typography variant='h5' color='secondary'>
                                                    {classwork.title}
                                                </Typography>
                                                <Typography variant='caption'>
                                                    {classwork?.teacher?.name} • {new Date(classwork.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}
                                                </Typography>

                                                <Divider sx={{ my: 3 }} />
                                                <Typography variant='body2'>
                                                    {classwork.instructions}
                                                </Typography>

                                                {classwork.attachments && classwork.attachments.map(attachment => {
                                                    return <>
                                                        <div style={{ display: 'inline-block' }}>
                                                            <Card variant='outlined' sx={{ width: 'auto', height: 80, ml: 0, mt: 1, mr: 1 }} >
                                                                <CardContent>
                                                                    <div className="d-flex flex-start">
                                                                        <Assignment color='primary' sx={{ width: 50, height: 50 }} />
                                                                        <Typography sx={{ my: 'auto' }}>
                                                                            <a
                                                                                href={attachment.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                style={{
                                                                                    display: 'inline-block',
                                                                                    maxWidth: '17ch',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap',
                                                                                }}>
                                                                                {attachment.url}
                                                                            </a>
                                                                        </Typography>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div >
                                                    </>
                                                })}
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>

                                {isUserTeacher(classwork.class) ?
                                    <>
                                    </> : <>
                                        <Grid item xs={12} md={4} lg={3}>
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    height: 'auto',
                                                }}
                                            >
                                                <Box>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant='subtitle1'>Your Work </Typography>
                                                        {isSubmitted() ?
                                                            <Typography variant='subtitle1' style={{ color: green[500] }}>submitted</Typography> :
                                                            <></>
                                                        }
                                                    </div>

                                                    {filesPreview.map(attachment => (
                                                        <Card variant='outlined' sx={{ width: 'auto', height: 80, my: 1 }} >
                                                            <CardContent>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <Assignment color='primary' sx={{ width: 50, height: 50 }} />
                                                                    <Typography sx={{ my: 'auto', mr: 'auto', maxWidth: '18ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                                            {attachment.public_id}
                                                                        </a>
                                                                    </Typography>
                                                                    <IconButton onClick={() => {
                                                                        removeFile(attachment.public_id)
                                                                    }}>
                                                                        <CloseIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                    <Button
                                                        fullWidth
                                                        sx={{ mt: 1 }}
                                                        component="label"
                                                        role={undefined}
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                    >
                                                        Upload file
                                                        <VisuallyHiddenInput
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => {
                                                                onChange(e)
                                                            }} />
                                                    </Button>

                                                    {!isSubmitted() ?
                                                        <Button
                                                            sx={{ mt: 1 }}
                                                            fullWidth
                                                            variant='contained'
                                                            onClick={() => submitClasswork(id)}
                                                        >
                                                            Submit work
                                                        </Button> : <Button
                                                            sx={{ mt: 1 }}
                                                            fullWidth
                                                            variant='contained'
                                                            onClick={() => unsubmitClasswork(id)}
                                                        >
                                                            Unsubmit
                                                        </Button>
                                                    }
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </>
                                }

                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider >
        </>
    )
}

export default ClassworkDetails;