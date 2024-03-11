import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Delete } from '@mui/icons-material';
import { Loader } from '../../Loader';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteModal = ({ moduleId, getArchivedModules }) => {
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteModule = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/admin/module/delete/force/${moduleId}`, config)

            setLoader(false)
            setOpen(false)
            getArchivedModules()
            alert('Learning Module Successfully Permanently Deleted!')
        } catch (error) {
            setLoader(false)
            alert('Learning Module not deleted')
        }
    }

    return (
        <React.Fragment>
            <Button
                variant='contained'
                color='error'
                sx={{ ml: 1 }}
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
                <DialogTitle>{"Delete Permanently"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you want to permanently delete this learning module?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={deleteModule}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DeleteModal;
