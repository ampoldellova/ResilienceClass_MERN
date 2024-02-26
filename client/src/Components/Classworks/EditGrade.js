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
import { Loader } from '../Loader';

const validationSchema = Yup.object({
    grades: Yup.number().required('Classwork grade is required'),
});

const EditGrade = ({ studentId, classwork, getClasswork }) => {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);

    return (
        <React.Fragment>
            {/* <Loader open={loader} /> */}
            <Button variant="outlined" size='small'>
                Edit Grade
            </Button>
        </React.Fragment>
    );
};

export default EditGrade;
