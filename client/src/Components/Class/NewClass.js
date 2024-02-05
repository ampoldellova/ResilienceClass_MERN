import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import * as Yup from 'yup';
import { IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    section: Yup.string().required('Class Section is required'),
    subject: Yup.string().required('Class Subject is required'),
    roomNumber: Yup.string().required('Class Room Number is required'),
});

const defaultTheme = createTheme();

const NewClass = () => {
    const [success, setSuccess] = useState('')
    const [Class, setClass] = useState({})
    const [error, setError] = useState('')
    const [isVisible, setIsVisible] = useState(true);
    let navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            className: '',
            section: '',
            subject: '',
            roomNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('className', values.className);
            formData.set('section', values.section);
            formData.set('subject', values.subject);
            formData.set('roomNumber', values.roomNumber);

            NewClassRoom(formData)
        },
    });

    const NewClassRoom = async (formData) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/class/new`, formData, config)
            setSuccess(data.success)
            setClass(data.class)

            setIsVisible(false);
        } catch (error) {
            setError(error.response.data.message)

        }
    }

    useEffect(() => {
        if (error) {
            console.log(error)
        }

        if (success) {
            console.log('Class created successfully')
        }

    }, [error, success])

    if (!isVisible) {
        return null;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        // marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Create a New Class
                    </Typography>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="className"
                                    required
                                    fullWidth
                                    id="className"
                                    label="Class Name"
                                    autoFocus
                                    value={formik.values.className}
                                    onChange={formik.handleChange}
                                    error={formik.touched.className && Boolean(formik.errors.className)}
                                    helperText={formik.touched.className && formik.errors.className}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="section"
                                    label="Section"
                                    name="section"
                                    value={formik.values.section}
                                    onChange={formik.handleChange}
                                    error={formik.touched.section && Boolean(formik.errors.section)}
                                    helperText={formik.touched.section && formik.errors.section}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="subject"
                                    label="Subject"
                                    name="subject"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                                    helperText={formik.touched.subject && formik.errors.subject}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="roomNumber"
                                    label="Room Number"
                                    id="roomNumber"
                                    value={formik.values.roomNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                                    helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Class
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default NewClass;