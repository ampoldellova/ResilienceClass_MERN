import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';


export const mainListItems = (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
    </React.Fragment>
);