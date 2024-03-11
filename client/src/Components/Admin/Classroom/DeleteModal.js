import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Delete } from '@mui/icons-material';
import { getToken } from '../../../utils/helpers';
import { Loader } from '../../Loader';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteModal = ({ getDeletedClassrooms, classId }) => {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteClassPermanently = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/admin/classroom/delete/${classId}`, config)

            setOpen(false)
            setLoader(false)
            getDeletedClassrooms()
            alert('Classroom Permanently Deleted!')
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>
            <Button
                variant='contained'
                color='error'
                onClick={handleClickOpen}
            >
                <Delete />
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Loader open={loader} />
                <DialogTitle>{"Delete to database"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you want to permanently delete this classroom on the database?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={deleteClassPermanently}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DeleteModal;
