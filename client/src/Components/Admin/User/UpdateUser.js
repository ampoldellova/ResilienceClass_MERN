import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Grid, InputLabel, TextField, Typography, Box, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import { Loader } from '../../Loader';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const UpdateUser = ({ userId, getAllUsers }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loader, setLoader] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getUserDetails = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`http://localhost:4003/api/v1/admin/user/${userId}`, config)

            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
            setRole(data.user.role)
        } catch (error) {
            alert('Error Occurred')
        }
    }

    const UpdateUserDetails = async (userId, userData) => {
        setLoader(true)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {
            const { data } = await axios.put(`http://localhost:4003/api/v1/admin/user/${userId}`, userData, config)

            setOpen(false);
            setLoader(false)
            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
            setRole(data.user.role)
            getAllUsers()
        } catch (error) {
            setLoader(false)
            console.log(error)
            alert('Error Occurred')
        }
    }

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
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
        formData.set('role', role);
        UpdateUserDetails(userId, formData)
    }

    const handleAvatarChange = (e) => {
        setAvatar(e.target.value);
        onChange(e);
    };

    useEffect(() => {
        getUserDetails(userId)
    }, [])

    return (
        <React.Fragment>
            <Button
                variant='contained'
                onClick={handleClickOpen}
            >
                <EditIcon />
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar alt="?" src={avatarPreview} sx={{ width: 60, height: 60, marginBottom: 1 }} />
                        <Typography component="h1" variant="h5">
                            Update User
                        </Typography>
                        <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <InputLabel>User Name</InputLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InputLabel>User Role</InputLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="role"
                                        type="role"
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        select
                                    >
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel>User Email</InputLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        name="email"
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <InputLabel sx={{ mt: 2 }}>Upload an image</InputLabel>
                                    <TextField
                                        fullWidth
                                        name="avatar"
                                        type="file"
                                        id="avatar"
                                        accept="images/*"
                                        // value={avatar}
                                        onChange={handleAvatarChange}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                Update User
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default UpdateUser;
