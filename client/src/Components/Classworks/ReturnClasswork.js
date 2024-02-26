import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Box } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = Yup.object({
    grades: Yup.number().required('Classwork grade is required'),
});

const ReturnClasswork = ({ studentId, classwork, setClasswork }) => {
    const [open, setOpen] = useState(false);

    let { id } = useParams()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            grades: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // console.log(values)
            // const formData = new FormData();
            // formData.set('grades', values.grades);

            ReturnClasswork(studentId, { grades: values.grades })
        },
    });

    const ReturnClasswork = async (studentId, formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data: { classwork } } = await axios.put(`http://localhost:4003/api/v1/class/classwork/${id}/return?grades=${formData.grades}&studentId=${studentId}`, formData, config)

            console.log(classwork)
            setOpen(false)
            setClasswork(classwork)
            alert('Classwork graded sucessfully!')
        } catch (error) {
            alert('Error Ocurred')
        }
    }

    return (
        <React.Fragment>
            <Button variant="outlined" size='small' onClick={handleClickOpen}>
                Return Work
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Return {classwork.title}</DialogTitle>
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
                    <Close />
                </IconButton>

                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            type='number'
                            id="grades"
                            label="Grades"
                            name="grades"
                            value={formik.values.grades}
                            onChange={formik.handleChange}
                            error={formik.touched.grades && Boolean(formik.errors.grades)}
                            helperText={formik.touched.grades && formik.errors.grades}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Submit</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    );
};

export default ReturnClasswork;
