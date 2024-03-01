import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Box, TextField, Grid, InputLabel } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useParams } from 'react-router';

const validationSchema = Yup.object({
    title: Yup.string().required('title is required'),
    instructions: Yup.string().required('instructions is required'),
    points: Yup.number().required('Points are required'),
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const CustomizedDialogs = () => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');

    let { id } = useParams()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            instructions: '',
            attachments: [],
            points: '',
            deadline: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            formData.set('class', id);
            formData.set('title', values.title);
            formData.set('instructions', values.instructions);
            for (let i = 0; i < values.attachments.length; i++) {
                formData.append('attachments', values.attachments[i]);
            }
            formData.set('points', values.points);
            formData.set('deadline', values.deadline);

            NewClasswork(formData)
        },
    });

    const NewClasswork = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.post(`http://localhost:4003/api/v1/class/classwork/new`, formData, config)

            setOpen(false)
            setSuccess(data.success);
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <React.Fragment>
            <Button variant="contained" fullWidth onClick={handleClickOpen} sx={{ mt: 1 }}>
                Create Classworks
            </Button>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Create Classwork
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
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            autoComplete="title"
                            autoFocus
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="instructions"
                            label="Instructions"
                            type="instructions"
                            id="instructions"
                            multiline
                            rows={5}
                            value={formik.values.instructions}
                            onChange={formik.handleChange}
                            error={formik.touched.instructions && Boolean(formik.errors.instructions)}
                            helperText={formik.touched.instructions && formik.errors.instructions}
                        />

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

                        <Box style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                            <TextField
                                type='number'
                                id="points"
                                label="Points"
                                name="points"
                                sx={{ marginTop: 1 }}
                                value={formik.values.points}
                                onChange={formik.handleChange}
                                error={formik.touched.points && Boolean(formik.errors.points)}
                                helperText={formik.touched.points && formik.errors.points}
                            />

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker ']}>
                                    <DateTimePicker
                                        disablePast={true}
                                        label="Set a Deadline"
                                        onChange={(value) => {
                                            formik.setFieldValue('deadline', value)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Classwork
                        </Button>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment >
    );
};

export default CustomizedDialogs;
