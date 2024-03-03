import React, { Fragment, useState, useEffect } from 'react';
import { CssBaseline, Typography, TextField, Container, Avatar, Button, InputLabel, Grid, Dialog, Slide, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box } from '@mui/system';
import { Loader } from '../../Loader';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const defaultTheme = createTheme();

const CreateUser = ({ getAllUsers }) => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [open, setOpen] = React.useState(false);
    const [loader, setLoader] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            avatar: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values)
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('email', values.email);
            formData.set('password', values.password);
            formData.set('avatar', avatar);

            register(formData);
        },
    });

    const onChange = e => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const register = async (userData) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/register`, userData, config)

            setLoader(false)
            setOpen(false)
            formik.resetForm()
            setIsAuthenticated(true)
            setUser(data.user)
            getAllUsers()
            alert('Successfully Added a User!')
        } catch (error) {
            setLoader(false)
            setIsAuthenticated(false)
            setUser(null)
            alert('Error Occurred')
        }
    }

    return (
        <Fragment>
            <ThemeProvider theme={defaultTheme}>
                <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddIcon />}>
                    Add a user
                </Button>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>Create a User</DialogTitle>
                    <DialogContent>
                        <Loader open={loader} />
                        <DialogContentText id="alert-dialog-slide-description">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar alt="?" src={avatarPreview} sx={{ width: 60, height: 60, marginBottom: 1 }} />
                                <Typography component="h1" variant="h5">
                                    Register
                                </Typography>
                                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        autoFocus
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        type="email"
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                    <Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Upload an image</InputLabel>
                                            <TextField
                                                fullWidth
                                                name="avatar"
                                                type="file"
                                                id="avatar"
                                                accept="images/*"
                                                onChange={onChange}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3 }}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            </Box>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </Fragment>
    );
}

export default CreateUser