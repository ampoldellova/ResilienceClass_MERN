import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { MenuItem } from '@mui/material';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const RemoveStudentModal = ({ userId, classId }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        console.log(getToken())
    };

    const handleClose = () => {
        setOpen(false);
    };

    const RemoveStudent = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.delete(`http://localhost:4003/api/v1/class/member/remove?userId=${userId}&classId=${classId}`, config)

            setOpen(false);
            alert('Student Removed Successfully')
        } catch (error) {
            console.log(error)
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>
            <MenuItem onClick={handleClickOpen}>Remove Student</MenuItem>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Remove Student"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you want to remove this student on this classroom?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={RemoveStudent}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default RemoveStudentModal;
