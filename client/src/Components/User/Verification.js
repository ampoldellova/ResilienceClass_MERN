import React, { Fragment, useState, useEffect } from 'react';
import { CssBaseline, Typography, TextField, Container, Avatar, Button, InputLabel, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { authenticate, getToken } from '../../utils/helpers';
import Metadata from '../Layout/Metadata';
import Box from '@mui/material/Box';
import axios from 'axios'
import { Loader } from '../Loader';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    emailCodeVerification: Yup.string().min(6, 'Email code must be exactly 6 characters').max(6, 'Email code must be exactly 6 characters').required('Email code is required'),
});

const defaultTheme = createTheme();

const Verification = () => {
    const [loader, setLoader] = useState(false);
    let navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            emailCodeVerification: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values)
            const formData = new FormData();
            formData.set('emailCodeVerification', values.emailCodeVerification);

            verifyCode(formData);
        },
    });

    const verifyCode = async (formData) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/verification`, formData, config);

            setLoader(false)
            authenticate(data, () => {
                navigate("/dashboard")
            });
        } catch ({ response }) {
            setLoader(false)
            return response
        }
    }

    return (
        <Fragment>
            <Metadata title={'Register'} />
            <ThemeProvider theme={defaultTheme}>
                <Loader open={loader} />
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '50%'
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Verify Email
                        </Typography>
                        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="emailCodeVerification"
                                label="Email Code Verification"
                                type="emailCodeVerification"
                                id="emailCodeVerification"
                                value={formik.values.emailCodeVerification}
                                onChange={formik.handleChange}
                                error={formik.touched.emailCodeVerification && Boolean(formik.errors.emailCodeVerification)}
                                helperText={formik.touched.emailCodeVerification && formik.errors.emailCodeVerification}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Verify
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    );
}

export default Verification