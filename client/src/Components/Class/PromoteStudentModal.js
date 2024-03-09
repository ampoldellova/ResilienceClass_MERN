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

const PromoteStudentModal = ({ userId, classId }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const UpdateStudentRole = async () => {
        const formData = {
            userId: userId,
            classId: classId
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`http://localhost:4003/api/v1/class/member/promote?userId=${userId}&classId=${classId}`, formData, config)

            setOpen(false);
            alert('Role Changed Successfully')
        } catch (error) {
            console.log(error)
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>
            <MenuItem onClick={handleClickOpen}>Promote to Teacher</MenuItem>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Change Student Role"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Do you want to promote this student as a teacher of this classroom?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={UpdateStudentRole}>Agree</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default PromoteStudentModal;
