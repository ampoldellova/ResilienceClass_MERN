import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../Loader';
import { getToken, isUserTeacher } from '../../utils/helpers';
import axios from 'axios';

const Archive = ({ classes, getArchivedClassroom }) => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false);

    const restoreClassroom = async () => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`http://localhost:4003/api/v1/class/archive/${classes._id}/restore`, {}, config)

            setLoader(false)
            getArchivedClassroom();
            alert('Classroom Successfully Restored!')
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    return (
        <div style={{ display: 'inline-block' }}>
            <div style={{ width: '345px', margin: '10px' }}>
                <Loader open={loader} />
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={classes.coverPhoto.url}
                    />

                    <CardContent style={{ textAlign: 'left' }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {classes.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" >
                            Class Name: {classes.className}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Section: {classes.section}
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        {isUserTeacher(classes) ?
                            <>
                                <Button variant='contained' sx={{ borderRadius: 3 }} onClick={restoreClassroom} size="small">Unarchive</Button>
                                <Button variant='contained' sx={{ borderRadius: 3 }} onClick={() => navigate(`/class/detail/archive/${classes._id}`)} size="small">View Class</Button>
                            </>
                            : <>
                                <Button variant='contained' sx={{ borderRadius: 3 }} onClick={() => navigate(`/class/detail/archive/${classes._id}`)} size="small">View Class</Button>
                            </>
                        }
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}

export default Archive;
