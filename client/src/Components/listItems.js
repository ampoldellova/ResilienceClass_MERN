import * as React from 'react';
import { useEffect, useState } from 'react';
import { getUser } from '../utils/helpers';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const MainListItems = () => {
    const [open, setOpen] = React.useState(true);
    const [user, setUser] = useState('')

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setUser(getUser())
    }, [])

    return (
        <React.Fragment>
            {user && user.role === 'admin' && (
                <>
                    <ListItemButton component={Link} to="#" onClick={handleClick}>
                        <ListItemIcon>
                            <AdminPanelSettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Administration" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/dashboard">
                                <ListItemIcon>
                                    <AnalyticsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Analytics" />
                            </ListItemButton>
                        </List>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/classrooms">
                                <ListItemIcon>
                                    <ClassIcon />
                                </ListItemIcon>
                                <ListItemText primary="Classrooms" />
                            </ListItemButton>
                        </List>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/classworks">
                                <ListItemIcon>
                                    <AssignmentIcon />
                                </ListItemIcon>
                                <ListItemText primary="Classworks" />
                            </ListItemButton>
                        </List>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/modules">
                                <ListItemIcon>
                                    <ViewModuleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Modules" />
                            </ListItemButton>
                        </List>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/users">
                                <ListItemIcon>
                                    <GroupIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </>
            )}
            <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Classrooms" />
            </ListItemButton>
            <ListItemButton component={Link} to="/modules">
                <ListItemIcon>
                    <ViewModuleIcon />
                </ListItemIcon>
                <ListItemText primary="Learning Modules" />
            </ListItemButton>
        </React.Fragment>
    );
};

export default MainListItems;
