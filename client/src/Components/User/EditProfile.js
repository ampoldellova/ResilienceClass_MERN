import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Avatar, MenuItem, InputLabel, TextField, Box, Grid } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getToken, getUser } from '../../utils/helpers';
import { styled } from '@mui/material/styles';
import axios from 'axios'

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

const EditProfile = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)
    const fileInputRef = useRef(null);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`http://localhost:4003/api/v1/me`, config)
            console.log(data)
            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
        } catch (error) {
            alert('Error Occurred')
        }
    }

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`http://localhost:4003/api/v1/me/update`, userData, config)

            setIsUpdated(data.success)
            alert('Successfully Edited')
        } catch (error) {
            console.log(error)
            alert('Error Occurred')
        }
    }

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }

    const onClick = e => {
        fileInputRef.current.click()
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
        updateProfile(formData)
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <React.Fragment>
            <MenuItem onClick={handleClickOpen}><AccountCircleIcon sx={{ mr: 2 }} />Profile</MenuItem>
            <Dialog
                fullWidth='md'
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"User Profile"}</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 1 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar alt="?" src={avatarPreview} sx={{ width: 120, height: 120, mr: 2 }} />
                                <input
                                    style={{ display: 'none' }}
                                    required
                                    name="avatar"
                                    type="file"
                                    id="customFile"
                                    accept="images/*"
                                    value={avatar.url}
                                    onChange={onChange}
                                    ref={fileInputRef}
                                />
                                <Button
                                    component="label"
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<EditIcon />}
                                    sx={{ mt: 2 }}
                                    onClick={onClick}
                                >
                                    Edit Avatar
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <InputLabel>User Name</InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <InputLabel sx={{ mt: 2 }}>User Email</InputLabel>
                                <TextField
                                    required
                                    name="email"
                                    fullWidth
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default EditProfile;
