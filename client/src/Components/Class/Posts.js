import React, { useState, useEffect } from 'react';
import { getUser } from '../../utils/helpers';
import { Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom'
import { Avatar, TextField } from '@mui/material';
// import { trusted } from 'mongoose';

const Posts = () => {
    const [user, setUser] = useState('');
    let { id } = useParams()

    useEffect(() => {
        setUser(getUser());
    }, [id])
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
                <Grid>

                </Grid>
                <Avatar alt={user && user.name} src={user.avatar && user.avatar.url} style={{ border: '2px solid white' }} />
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