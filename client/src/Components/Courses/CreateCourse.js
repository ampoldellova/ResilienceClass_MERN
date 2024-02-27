import React, { useState } from 'react';
import { Box, Button, Dialog, Autocomplete, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getToken } from '../../utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import Language from 'language-list'

const validationSchema = Yup.object({
    title: Yup.string().required('Course title is required'),
    description: Yup.string().required('Course description is required').max(100, 'Description must not exceed 100 characters'),
    language: Yup.string().required('Course language is required'),
    contents: Yup.mixed().required('Course contents is required')
});

const CreateCourse = ({ getCourses }) => {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);

    const languages = Language();

    const displayLanguages = languages.getData().map(language => {
        return language.language
    })

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            language: '',
            contents: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('title', values.title);
            formData.set('description', values.description);
            formData.set('language', values.language);
            for (let i = 0; i < values.contents.length; i++) {
                formData.append('contents', values.contents[i]);
            }

            NewCourse(formData)
        },
    });

    const NewCourse = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/course/new`, formData, config)

            setOpen(false);
            getCourses();
            formik.resetForm();
            alert('Course successfully created!')
        } catch (error) {
            alert('Error Occurred')
        }
    }
    console.log(displayLanguages)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    onClick={handleClickOpen}
                    variant='contained'
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 5, mb: 2 }}>
                    Create
                </Button>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Share your knowledge
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-description">
                        <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item sm={12} md={12} lg={12}>
                                    <TextField
                                        fullWidth
                                        id="title"
                                        name='title'
                                        label='Title'
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                </Grid>
                                <Grid item sm={12} md={12} lg={12}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        name='description'
                                        label="Description"
                                        multiline
                                        rows={4}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </Grid>
                                <Grid item sm={12} md={12} lg={12}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={displayLanguages}
                                        fullWidth
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('language', newValue);
                                        }}
                                        onBlur={formik.handleBlur}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Select course language" size='small'
                                            name='language'
                                            error={formik.touched.language && formik.errors.language ? true : false}
                                            onChange={formik.handleChange}
                                            value={formik.values.language}
                                            helperText={formik.touched.language && formik.errors.language ? formik.errors.language : ""}
                                        />}
                                    />
                                </Grid>
                                <Grid item sm={12} md={12} lg={12}>
                                    <TextField
                                        fullWidth
                                        name="contents"
                                        type="file"
                                        id="contents"
                                        inputProps={{
                                            accept: 'video/*',
                                            multiple: true
                                        }}
                                        onChange={(e) => {
                                            formik.setFieldValue('contents', e.target.files)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant='contained' sx={{ mt: 2 }}>
                                    Create
                                </Button>
                            </div>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateCourse;
