import * as React from 'react';
import { useEffect, useState } from 'react';
import { getUser } from '../utils/helpers';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ClassIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Divider } from '@mui/material';

const MainListItems = () => {
    const [open, setOpen] = React.useState(true);
    const [openArchive, setOpenArchive] = React.useState(false);
    const [user, setUser] = useState('')

    const handleClick = () => {
        setOpen(!open);
    };

    const handleClickArchives = () => {
        setOpenArchive(!openArchive);
    };

    useEffect(() => {
        setUser(getUser())
    }, [])

    return (
        <React.Fragment>
            {user && user.role === 'admin' && (
                <>
                    <ListItemButton onClick={handleClick}>
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
                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickArchives}>
                            <ListItemIcon>
                                <ArchiveIcon />
                            </ListItemIcon>
                            <ListItemText primary="Archives" />
                            {openArchive ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openArchive} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 8 }} component={Link} to="/admin/deleted/classrooms">
                                    <ListItemIcon>
                                        <ClassIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Classes" />
                                </ListItemButton>
                            </List>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 8 }} component={Link} to="/admin/archive/modules">
                                    <ListItemIcon>
                                        <ViewModuleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Modules" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </Collapse>
                    <Divider fullwidth />
                </>
            )}
            <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                    <ClassIcon />
                </ListItemIcon>
                <ListItemText primary="Classrooms" />
            </ListItemButton>
            <ListItemButton component={Link} to="/modules">
                <ListItemIcon>
                    <ViewModuleIcon />
                </ListItemIcon>
                <ListItemText primary="Learning Modules" />
            </ListItemButton>
            <Divider fullwidth sx={{ mt: 2 }} />
            <ListItemButton component={Link} to="/archive/classrooms">
                <ListItemIcon>
                    <ArchiveIcon />
                </ListItemIcon>
                <ListItemText primary="Archived Classes" />
            </ListItemButton>
        </React.Fragment>
    );
};

export default MainListItems;
