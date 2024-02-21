import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useParams } from 'react-router-dom'
import { getUser } from '../../utils/helpers';
import { Button, Box, Grid, TextField, InputLabel } from '@mui/material';
import { getToken } from '../../utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { WindowSharp } from '@mui/icons-material';

const classUpdateValidationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    section: Yup.string().required('Class Section is required'),
    subject: Yup.string().required('Class Subject is required'),
    roomNumber: Yup.string().required('Class Room Number is required'),
});

const EditClassDetails = () => {
    const [modal, setModal] = useState(false);
    const [classRoom, setClass] = useState({});
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');
    const [user, setUser] = useState('')

    const toggle = () => setModal(!modal);

    const updateClassFormik = useFormik({
        initialValues: {
            className: '',
            section: '',
            subject: '',
            roomNumber: '',
            coverPhoto: ''
        },
        validationSchema: classUpdateValidationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('className', values.className);
            formData.set('section', values.section);
            formData.set('subject', values.subject);
            formData.set('roomNumber', values.roomNumber);
            formData.set('coverPhoto', values.coverPhoto[0]);

            UpdateClassRoom(id, formData)
        },
    });

    let { id } = useParams()

    const UpdateClassRoom = async (id, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.put(`http://localhost:4003/api/v1/class/update/${id}`, formData, config)

            toggle();
            updateClassFormik.resetForm();
            window.location.reload();
            setSuccess(data.success)
            setClass(data.class)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const classDetails = async (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { classRoom } } = await axios.get(`http://localhost:4003/api/v1/class/${id}`, config);


        updateClassFormik.setFieldValue('className', classRoom.className);
        updateClassFormik.setFieldValue('section', classRoom.section);
        updateClassFormik.setFieldValue('subject', classRoom.subject);
        updateClassFormik.setFieldValue('roomNumber', classRoom.roomNumber);
        setClass(classRoom)
    }

    useEffect(() => {
        setUser(getUser());
        classDetails(id);
    }, [])

    return (
        <div>
            <Button variant='contained' onClick={toggle} fullWidth>
                Edit Class
            </Button>

            <Modal isOpen={modal} toggle={() => toggle()} centered>
                <ModalHeader toggle={modal}>Update Class</ModalHeader>
                <ModalBody>
                    <Box component="form" noValidate onSubmit={updateClassFormik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="className"
                                    required
                                    fullWidth
                                    id="className"
                                    label="Class Name"
                                    autoFocus
                                    value={updateClassFormik.values.className}
                                    onChange={updateClassFormik.handleChange}
                                    error={updateClassFormik.touched.className && Boolean(updateClassFormik.errors.className)}
                                    helperText={updateClassFormik.touched.className && updateClassFormik.errors.className}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="section"
                                    label="Section"
                                    name="section"
                                    value={updateClassFormik.values.section}
                                    onChange={updateClassFormik.handleChange}
                                    error={updateClassFormik.touched.section && Boolean(updateClassFormik.errors.section)}
                                    helperText={updateClassFormik.touched.section && updateClassFormik.errors.section}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="subject"
                                    label="Subject"
                                    name="subject"
                                    value={updateClassFormik.values.subject}
                                    onChange={updateClassFormik.handleChange}
                                    error={updateClassFormik.touched.subject && Boolean(updateClassFormik.errors.subject)}
                                    helperText={updateClassFormik.touched.subject && updateClassFormik.errors.subject}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="roomNumber"
                                    label="Room Number"
                                    id="roomNumber"
                                    value={updateClassFormik.values.roomNumber}
                                    onChange={updateClassFormik.handleChange}
                                    error={updateClassFormik.touched.roomNumber && Boolean(updateClassFormik.errors.roomNumber)}
                                    helperText={updateClassFormik.touched.roomNumber && updateClassFormik.errors.roomNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Select Class Cover Photo</InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    name="coverPhoto"
                                    id="coverPhoto"
                                    type="file"
                                    accept="images/*"
                                    onChange={(e) => {
                                        updateClassFormik.setFieldValue('coverPhoto', e.target.files)
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Edit Class
                        </Button>

                    </Box>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default EditClassDetails;