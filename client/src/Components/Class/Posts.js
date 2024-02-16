import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom'
import { Avatar, TextField } from '@mui/material';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const Posts = ({ posts }) => {

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
                <Typography variant='subtitle1'>
                    {posts.contents}
                </Typography>

            </Paper>
        </>
    )
}

export default Posts;