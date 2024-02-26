import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import { useParams } from 'react-router';
import { Typography, Button } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ClassworkList = () => {
    const [classworks, setClassworks] = useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');

    let { id } = useParams()

    const getClassworks = async () => {
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4003/api/v1/class/classworks/${id}`, config)
            console.log(data)
            setClassworks(data.classwork)
            setSuccess(data.classwork)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getClassworks(id);
    }, [])

    return (
        <>
            {classworks && classworks.length === 0 ?
                <>
                    <Typography variant='subtitle2' sx={{ margin: 5, textAlign: 'center' }}>No Classworks yet.</Typography>
                </> : <>
                    {classworks && classworks.map(classwork => {
                        return <>
                            <Button component={Link} to={`/class/classwork/${classwork._id}`} startIcon={<Assignment />} color='secondary'>{classwork.title}</Button>
                        </>
                    })}
                </>
            }
        </>
    );
}

export default ClassworkList;
