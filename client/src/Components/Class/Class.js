import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const Classroom = ({ classes }) => {
    return (
        <div style={{ display: 'inline-block' }}>
            <div style={{ width: '345px', margin: '10px' }}>
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
                    <CardActions>
                        <Button component={Link} to={`/class/${classes._id}`} size="small">View Class</Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}

export default Classroom;
