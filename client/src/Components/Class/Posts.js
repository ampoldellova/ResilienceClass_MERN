import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom'
import { Avatar, TextField } from '@mui/material';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const Posts = ({posts}) => {

    return (
        <>
            <Paper
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 'auto',
                    marginTop: 2
                }}
            >
                <TextField
                    fullWidth
                    disabled
                    multiline
                    rows={4}
                    defaultValue="Default Value"
                    variant="filled"
                    sx={{ marginLeft: 2 }}
                />
            </Paper>
        </>
    )
}

export default Posts;