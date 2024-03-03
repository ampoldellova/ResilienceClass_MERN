import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { Box, Grid, MenuItem, TextField } from '@mui/material';
import { Loader } from '../../Loader';
import { getToken } from '../../../utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';

const validationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    section: Yup.string().required('Class Section is required'),
    subject: Yup.string().required('Class Subject is required'),
    roomNumber: Yup.string().required('Class Room Number is required'),
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateClassroom = ({ getAdminClassrooms }) => {
    const [open, setOpen] = useState(false);
    // const [teacher, setTeacher] = useState([]);
    const [classroom, setClassroom] = useState([]);
    const [loader, setLoader] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

            NewAdminClassroom(formData)
        },
    });

    const NewAdminClassroom = async (formData) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classroom } } = await axios.post(`http://localhost:4003/api/v1/class/new`, formData, config)

            setLoader(false);
            setOpen(false);
            formik.resetForm();
            setClassroom(classroom)
            getAdminClassrooms()
            alert('Class created successfully')
        } catch (error) {
            setLoader(false);
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>
            {/* <Loader open={loader} /> */}
            <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddIcon />}>
                Create a Classroom
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Create a Classroom</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
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
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateClassroom;
