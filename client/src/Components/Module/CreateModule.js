import React, { useState } from 'react';
import { Box, Button, Dialog, CardMedia, Container, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Autocomplete, ListItemText, ListItemButton, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getToken } from '../../utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import Language from 'language-list';
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object({
    title: Yup.string().required('Learning module title is required'),
    description: Yup.string().required('Module description is required'),
    language: Yup.string().required('Module language is required'),
    contents: Yup.mixed().required('Module contents is required')
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateModule = ({ getModules }) => {
    const [open, setOpen] = useState(false);
    const [thumbnail, setThumbnail] = useState('')
    const [thumbnailPreview, setThumbnailPreview] = useState('')

    const languages = Language();

    const displayLanguages = languages.getData().map(language => {
        return language.language
    })

    const inputRef = React.useRef();

    const [source, setSource] = React.useState();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSource(url);
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    const formik = useFormik({
        initialValues: {
            coverImage: '',
            title: '',
            description: '',
            language: '',
            contents: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.append('coverImage', values.coverImage[0]);
            formData.set('title', values.title);
            formData.set('description', values.description);
            formData.set('language', values.language);
            formData.append('contents', values.contents[0]);

            // console.log(values.coverImage)
            NewModule(formData)
        },
    });

    const NewModule = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`http://localhost:4003/api/v1/module/new`, formData, config)

            setOpen(false);
            getModules();
            formik.resetForm();
            alert('Module successfully created!')
        } catch (error) {
            alert('Error Occurred')
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        formik.setFieldValue('coverImage', e.target.files);
        onChange(e);
    };

    const onChange = e => {
        if (e.target.name === 'coverImage') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setThumbnailPreview(reader.result)
                    setThumbnail(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

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
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Share your knowledge
                            </Typography>
                            <Button type="submit" autoFocus color="inherit">
                                Create
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent dividers sx={{ height: 'auto' }}>
                        <Container maxWidth="md">
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <CardMedia
                                        sx={{ height: '500', width: '500' }}
                                        image={thumbnailPreview}
                                        title="green iguana"
                                    />
                                    <InputLabel>Choose a thumbnail</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="coverImage"
                                        name='coverImage'
                                        accept="images/*"
                                        type='file'
                                        // value={formik.values.coverImage}
                                        onChange={handleInputChange}
                                        error={formik.touched.coverImage && Boolean(formik.errors.coverImage)}
                                        helperText={formik.touched.coverImage && formik.errors.coverImage}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        id="title"
                                        name='title'
                                        label='Title'
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                        sx={{ mb: 2 }}
                                    />
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
                                        sx={{ mb: 2 }}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={displayLanguages}
                                        fullWidth
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('language', newValue);
                                        }}
                                        onBlur={formik.handleBlur}
                                        renderInput={(params) => <TextField fullWidth {...params} label="Select language" size='small'
                                            name='language'
                                            error={formik.touched.language && formik.errors.language ? true : false}
                                            onChange={formik.handleChange}
                                            value={formik.values.language}
                                            helperText={formik.touched.language && formik.errors.language ? formik.errors.language : ""}
                                            sx={{ mb: 2 }}
                                        />}
                                    />

                                    <TextField
                                        fullWidth
                                        ref={inputRef}
                                        name="contents"
                                        type="file"
                                        id="contents"
                                        inputProps={{
                                            accept: '.pdf'
                                        }}
                                        onChange={(e) => {
                                            handleFileChange(e);
                                            formik.setFieldValue('contents', e.target.files);
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    {source && (
                                        <iframe
                                            title='contents'
                                            width="100%"
                                            height="1000"
                                            controls
                                            src={source}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Container>
                    </DialogContent>
                </Box>
            </Dialog>
        </React.Fragment >
    );
}

export default CreateModule;
