import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="#">
            <ListItemIcon>
                <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Administration" />
        </ListItemButton>
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