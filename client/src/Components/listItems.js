import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/modules">
            <ListItemIcon>
                <ViewModuleIcon />
            </ListItemIcon>
            <ListItemText primary="Learning Modules" />
        </ListItemButton>
    </React.Fragment>
);