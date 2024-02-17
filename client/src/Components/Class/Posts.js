import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Paper, Typography, Card, Button, CardContent, CardActions } from '@mui/material';
import { Avatar, TextField } from '@mui/material';
import { getToken, getUser } from '../../utils/helpers';
import {
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardImage,
    MDBIcon,
    MDBTypography,
    MDBTextArea,
} from "mdb-react-ui-kit";
import { Box } from '@mui/system';
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';

const Posts = ({ posts, getClassPosts }) => {

    const [user, setUser] = useState('')
    const [comment, setComment] = useState('');

    const createComment = async (id) => {

        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {
            const { data } = await axios.post(`http://localhost:4003/api/v1/class/post/${id}/comment`, { comment }, config);
            setComment('')
            document.querySelector('#outlined-multiline-static').value = ''
            console.log(data);
            getClassPosts()
        } catch (err) {
            alert("Error occured")
            console.log(err)
        }
    }

    useEffect(() => {
        setUser(getUser())
    }, [])

    return (
        <>
            <Card sx={{ marginTop: 2 }}>
                <CardContent>
                    <div className="d-flex flex-start">
                        <Avatar alt={posts.teacher.name} src={posts.teacher.avatar.url} />
                        <Box sx={{ marginLeft: 2, mr: 'auto' }}>
                            <MDBTypography tag="h6" className="fw-bold mb-1">
                                {posts.teacher.name}
                            </MDBTypography>
                            <div className="d-flex align-items-center mb-3">
                                <Typography variant='caption'>{new Date(posts.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                            </div>
                        </Box>
                        <IconButton>
                            <MoreVert />
                        </IconButton>

                    </div>
                    <Typography sx={{ marginTop: 2 }}>
                        {posts.contents}
                    </Typography>
                </CardContent>

                <MDBCardFooter
                    className="py-3 border-0"
                    style={{ backgroundColor: "#f8f9fa" }}
                >

                    {posts.comments && posts.comments.map(comment => {
                        return <>
                            <div className="d-flex flex-start">
                                <Avatar alt={comment.user.name} src={comment.user.avatar.url} sx={{ width: 30, height: 30, marginRight: 2 }} />
                                <div>
                                    <MDBTypography tag="h6" className="fw-bold mb-1">
                                        {comment.user.name}
                                    </MDBTypography>
                                    <div className="d-flex align-items-center mb-3">
                                        <Typography variant='caption'>{new Date(comment.commentCreated).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                    </div>
                                    <Typography sx={{ marginBottom: 3 }}>{comment.body}</Typography>
                                </div>
                            </div >
                        </>
                    })}
                    <div className="d-flex flex-start w-100">
                        <Avatar alt={user && user.name} src={user.avatar && user.avatar.url} sx={{ width: 30, height: 30 }} />
                        <TextField
                            onChange={e => setComment(e.target.value)}
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            placeholder='Comment'
                            fullWidth
                            sx={{ marginLeft: 2 }}
                        />
                    </div>
                    <div className="float-end mt-2 pt-1" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant='contained' size='small' onClick={() => createComment(posts._id)}>
                            Post Comment
                        </Button>
                    </div>
                </MDBCardFooter>
            </Card >
        </>
    )
}

export default Posts;