import React, { useState } from 'react';
import { Badge, Box, Avatar, Button, Dialog, Divider, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { getToken } from '../../../utils/helpers';
import axios from 'axios';
import { Loader } from '../../Loader';
import { Visibility } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ViewMembers = ({ classId }) => {
    const [open, setOpen] = useState(false);
    const [classMembers, setClassMembers] = useState([]);
    const [classdetails, setClassdetails] = useState({});
    const [loader, setLoader] = useState(true);

    const getClassMembers = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classMembers } } = await axios.get(`http://localhost:4003/api/v1/class/members/${classId}`, config);

            setLoader(false)
            setClassMembers(classMembers)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    const classDetails = async (classId) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classRoom } } = await axios.get(`http://localhost:4003/api/v1/class/${classId}`, config);

            setClassdetails(classRoom)
        } catch (error) {
            alert('Error Occurred')
        }
    }

    const handleClickOpen = () => {
        classDetails(classId)
        getClassMembers()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                variant='contained'
                sx={{
                    color: 'white'
                }}
                startIcon={<Visibility />}
                onClick={handleClickOpen}
            >
                View
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Loader open={loader} />
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Members of {classdetails.subject}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    {classMembers && classMembers?.map(member => {
                        return <>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                                <Avatar src={member?.user?.avatar?.url} sx={{ height: 50, width: 50 }} />
                                <div style={{ marginLeft: '10px' }}>
                                    <Typography variant='h6' sx={{ fontWeight: 1 }}>
                                        {member?.user?.name}
                                        <Badge
                                            sx={{ marginLeft: 4 }}

                                            badgeContent={member.role}
                                            color={member?.role === 'student' ? 'primary' : 'secondary'}
                                        />
                                    </Typography>
                                </div>

                            </Box>
                            <Divider fullWidth />
                        </>
                    })}
                </Container >
            </Dialog>
        </>
    );
};

export default ViewMembers;
