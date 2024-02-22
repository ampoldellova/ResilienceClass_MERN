import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Paper, Typography, Card, Button, CardContent, Divider, InputLabel, Menu, MenuItem, Badge } from '@mui/material';
import { Avatar, TextField, Box } from '@mui/material';
import { getToken, getUser } from '../../utils/helpers';
import { MDBCardFooter, MDBTypography } from "mdb-react-ui-kit";
import { MoreVert, Assignment } from '@mui/icons-material';
import { Document, Page } from 'react-pdf'
import axios from 'axios';
import EditPost from './EditPost';


const Posts = ({ posts, getClassPosts, classRoom, postId }) => {
    const [user, setUser] = useState('')
    const [comment, setComment] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false)

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const deletePostHandler = (id) => {
        deletePost(id)
    }

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

    const deletePost = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4003/api/v1/class/post/${postId}`, config)

            setIsDeleted(data.success)
            getClassPosts()
        } catch (error) {
            alert("Error occured")
        }
    }

    useEffect(() => {
        setUser(getUser())
    }, [])

    const getRole = (id) => {
        const user = classRoom?.joinedUsers?.find((joinedUser) => joinedUser.user === id)
        return user.role
    }

    return (
        <>
            <Card sx={{ marginTop: 2 }}>
                <CardContent>
                    <div className="d-flex flex-start">
                        <Avatar alt={posts.teacher.name} src={posts.teacher.avatar.url} />

                        <Box sx={{ marginLeft: 2, mr: 'auto' }}>
                            <MDBTypography tag="h6" className="fw-bold mb-1">
                                {posts.teacher.name}
                                <Badge
                                    sx={{ marginLeft: 4, mb: 0.5 }}
                                    badgeContent={getRole(posts.teacher._id)}
                                    color={getRole(posts.teacher._id) === 'student' ? 'primary' : 'secondary'}
                                />
                            </MDBTypography>

                            <div className="d-flex align-items-center mb-3">

                                <Typography variant='caption'>{new Date(posts.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>

                            </div>
                        </Box>
                        {classRoom?.joinedUsers?.find((joinedUser) => joinedUser.user === getUser()?._id).role === 'teacher' ||
                            posts.teacher._id === getUser()._id ?
                            <>
                                <IconButton
                                    onClick={handleMenuOpen}>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    id="postMenu"
                                    anchorEl={menuAnchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
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
                                    <EditPost postId={postId} getClassPosts={getClassPosts} />
                                    <MenuItem onClick={() => deletePostHandler()} >Delete</MenuItem>
                                </Menu>
                            </> : <></>
                        }
                    </div>
                    <Typography sx={{ marginTop: 2 }}>
                        {posts.contents}
                    </Typography>
                    {posts.attachments && posts.attachments.map(attachment => {
                        return <>
                            <div style={{ display: 'inline-block' }}>
                                <div style={{ margin: '10px' }}>
                                    <Card variant='outlined' sx={{ width: 'auto', height: 80 }} >
                                        <CardContent>
                                            <div className="d-flex flex-start">
                                                <Assignment color='primary' sx={{ width: 50, height: 50 }} />
                                                <Typography sx={{ my: 'auto' }}>
                                                    <a
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-block',
                                                            maxWidth: '18ch',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                        {attachment.url}
                                                    </a>
                                                </Typography>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div >
                        </>
                    })}
                </CardContent >

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
                            <Divider sx={{ marginBottom: 3 }} />
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