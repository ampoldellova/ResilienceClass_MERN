import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Box, Button, Typography, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MetaData from '../Layout/Metadata';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { Loader } from '../Loader';

const defaultTheme = createTheme();

const ClassroomList = () => {
    // const [loading, setLoading] = useState(true)
    const [classrooms, setClassrooms] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)
    const [loader, setLoader] = useState(true);

    const getAdminClassrooms = async () => {
        setLoader(true)
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { classrooms } } = await axios.get(`http://localhost:4003/api/v1/admin/classrooms`, config)


            // setLoading(false)
            setLoader(false)
            console.log(classrooms)
            setClassrooms(classrooms)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }

    useEffect(() => {
        getAdminClassrooms()
    }, [])

    // const deletebrand = async (id) => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/brand/${id}`, config)

    //         setIsDeleted(data.success)
    //     } catch (error) {
    //         setDeleteError(error.response.data.message)

    //     }
    // }

    const ClassroomList = () => {
        const data = {
            columns: [
                {
                    headerName: 'Classroom ID',
                    field: 'id',
                    width: 250,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Subject',
                    field: 'subject',
                    width: 250,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Classroom Code',
                    field: 'classCode',
                    width: 150,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Classroom Name',
                    field: 'className',
                    width: 150,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Section',
                    field: 'section',
                    width: 150,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Room Number',
                    field: 'roomNumber',
                    width: 150,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },

                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* <Link to={`/admin/brand/${value}`}>
                                <Button
                                    variant='contained'
                                    sx={{
                                        color: 'white'
                                    }}>
                                    <EditIcon />
                                </Button>
                            </Link>
                            <Button
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'red',
                                    marginLeft: 1
                                }}
                                onClick={() => deletebrandHandler(value)}
                            >
                                <DeleteIcon />
                            </Button> */}
                        </Container>
                    ),
                },
            ],
            rows: []
        }

        classrooms.forEach(classroom => {
            data.rows.push({
                id: classroom._id,
                className: classroom.className,
                classCode: classroom.classCode,
                section: classroom.section,
                subject: classroom.subject,
                roomNumber: classroom.roomNumber,
                // coverPhoto: classroom.coverPhoto.url,
                // actions: brand._id
            })
        })
        return data;
    }

    // const deletebrandHandler = (id) => {
    //     deletebrand(id)
    // }
    // console.log(classrooms)
    return (
        <ThemeProvider theme={defaultTheme}>
            {/* <MetaData title={'Brand List'} /> */}
            <Loader open={loader} />
            <Box sx={{ display: 'flex' }}>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Container>
                        <div style={{ height: 'auto', width: '100%', marginTop: 100 }}>
                            <Box textAlign="center" style={{ margin: 20 }}>
                                <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Classroom</Typography>
                                {/* <Link to="/admin/brand" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Button variant='contained' startIcon={<AddCircleIcon />}>Add brand</Button>
                                    </Link> */}
                            </Box>
                            <DataGrid
                                rows={ClassroomList().rows}
                                columns={ClassroomList().columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 20]}
                            />
                        </div>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ClassroomList;
