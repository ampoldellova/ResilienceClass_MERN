import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Loader } from '../Loader';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteClassModal = ({ classId, getArchivedClassroom }) => {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteClassroom = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/class/delete/${classId}`, config)

            setOpen(false)
            setLoader(false)
            getArchivedClassroom()
            alert('Classroom Permanently Deleted!')
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>
            <Button variant='contained' sx={{ borderRadius: 3 }} onClick={handleClickOpen} color='error' size="small">Delete</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Loader open={loader} />
                <DialogTitle>{"Delete Classroom"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you want to permanently delete this classroom?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={deleteClassroom}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DeleteClassModal;
