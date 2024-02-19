import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import { getToken, getUser } from '../../utils/helpers';
import { styled, Dialog, DialogTitle, DialogContent, IconButton, Typography, MenuItem, Box, Grid, TextField, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';

const validationSchema = Yup.object({
    contents: Yup.string().required('Post Content is required')
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditPost = ({ postId, getClassPosts }) => {
    const [user, setUser] = useState('')
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');
    const [post, setPost] = useState({});

    const handleClickOpen = () => {
        getSinglePost(postId)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            contents: '',
            attachments: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('contents', values.contents);
            for (let i = 0; i < values.attachments.length; i++) {
                formData.append('attachments', values.attachments[i]);
            }

            UpdatePost(postId, formData)
        },
    });

    const UpdatePost = async (postId, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.put(`http://localhost:4003/api/v1/class/post/update/${postId}`, formData, config)

            console.log(data)
            setSuccess(data.success)
            setPost(data.post)
            setOpen(false)
            getClassPosts()
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const getSinglePost = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { post } } = await axios.get(`http://localhost:4003/api/v1/class/post/details/${postId}`, config);

        // console.log(data)
        formik.setFieldValue('contents', post?.contents);
        formik.setFieldValue('attachments', post?.attachments);
        setPost(post)
    }

    useEffect(() => {
        setUser(getUser());
        // getSinglePost(id);
    }, [])

    return (
        <>
            <MenuItem onClick={handleClickOpen}>Edit Post</MenuItem>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Post
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="contents"
                                    name='contents'
                                    label="Content"
                                    multiline
                                    rows={5}
                                    value={formik.values.contents}
                                    onChange={formik.handleChange}
                                    error={formik.touched.contents && Boolean(formik.errors.contents)}
                                    helperText={formik.touched.contents && formik.errors.contents}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Attach a File </InputLabel>
                                <TextField
                                    fullWidth
                                    name="attachments"
                                    type="file"
                                    id="attachments"
                                    accept=".pdf"
                                    inputProps={{
                                        multiple: true
                                    }}
                                    onChange={(e) => {
                                        formik.setFieldValue('attachments', e.target.files)
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
                            Edit Post
                        </Button>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </>
    );
};

export default EditPost;
