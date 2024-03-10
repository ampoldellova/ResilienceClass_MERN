import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../Loader';

const MoveToArchive = ({ classId }) => {
    const [open, setOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(classId)

    const archiveClassroom = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/class/archive/${classId}`, config)

            setLoader(false)
            setIsDeleted(data.success)
            alert('Classroom Successfully Moved to Archive!')
            navigate("/archive/classrooms")
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    return (
        <React.Fragment>

            <Button variant='contained' onClick={handleClickOpen} fullWidth sx={{ mt: 1 }}>
                Move to Archive
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Loader open={loader} />
                <DialogTitle id="alert-dialog-title">
                    {"Move to Archive?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to move this classroom to your archive?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={archiveClassroom} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default MoveToArchive;
