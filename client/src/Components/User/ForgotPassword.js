import React, { Fragment, useState, } from 'react';
import { Avatar, Button, TextField, Box, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata'
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState('')
    const defaultTheme = createTheme();

    const navigate = useNavigate()

    const forgotPassword = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const { data } = await axios.post(`http://localhost:4003/api/v1/password/forgot`, formData, config)
            console.log(data.message)

            setLoading(false)
            toast.success(data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            navigate('/login')
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }


    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email);
        forgotPassword(formData)
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '50%'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Forgot Password
                        </Typography>
                        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading ? true : false}
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: 'black' }}
                            >
                                Send Email
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    )
}

export default ForgotPassword