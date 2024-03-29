import React, { useState } from 'react';
import { Badge, Box, Avatar, Button, Dialog, ListItemText, ListItemButton, List, Divider, AppBar, Toolbar, IconButton, Typography, Container, Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { getToken, isUserTeacher } from '../../utils/helpers';
import axios from 'axios';
import { Loader } from '../Loader';
import { MoreVert } from '@mui/icons-material';
import PromoteStudentModal from './PromoteStudentModal';
import RemoveStudentModal from './RemoveStudentModal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ClassMembers = ({ classroom }) => {
    const [open, setOpen] = useState(false);
    const [classMembers, setClassMembers] = useState([]);
    const [loader, setLoader] = useState(true);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [userId, setUserId] = useState();

    const handleMenuOpen = (event, userId) => {
        setMenuAnchorEl(event.currentTarget);
        setUserId(userId)
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const getClassMembers = async (id) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classMembers } } = await axios.get(`http://localhost:4003/api/v1/class/members/${id}`, config);

            setLoader(false)
            setClassMembers(classMembers)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    const handleClickOpen = () => {
        getClassMembers(classroom._id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    console.log(classMembers)
    return (
        <>
            <Button variant='contained' onClick={handleClickOpen} fullWidth>
                Class Members
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
                            Members of {classroom.subject}
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

                                {isUserTeacher(classroom) && member.role === 'student' ?
                                    <>
                                        <IconButton
                                            sx={{ ml: 'auto' }}
                                            onClick={(e) => handleMenuOpen(e, member.user._id)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </> : <>
                                    </>
                                }

                            </Box>
                            <Divider fullWidth />
                        </>
                    })}
                </Container >
                <Menu
                    id="menu"
                    anchorEl={menuAnchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                >
                    <PromoteStudentModal key={userId} userId={userId} classId={classroom._id} />
                    <RemoveStudentModal userId={userId} classId={classroom._id} />
                </Menu>
            </Dialog>
        </>
    );
};

export default ClassMembers;
