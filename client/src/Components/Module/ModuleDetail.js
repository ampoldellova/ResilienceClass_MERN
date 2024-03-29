import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Button,
    Dialog,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    CardMedia,
    Box,
    Container
} from '@mui/material';
import { Watermark } from '@hirohe/react-watermark';
import CloseIcon from '@mui/icons-material/Close';
import { getToken } from '../../utils/helpers';
import PageviewIcon from '@mui/icons-material/Pageview';
import axios from 'axios';
import { Loader } from '../Loader';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModuleDetail = ({ moduleId }) => {
    const [open, setOpen] = useState(false);
    const [module, setModule] = useState({});
    const [loader, setLoader] = useState(true);
    const [docs, setDocs] = useState({})

    const handleClickOpen = () => {
        moduleDetails(moduleId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const moduleDetails = async (moduleId) => {
        setLoader(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data: { module } } = await axios.get(`http://localhost:4003/api/v1/module/${moduleId}`, config);

            const docs = [
                { uri: module?.contents?.url }
            ];

            setLoader(false)
            setModule(module)
            setDocs(docs)
        } catch (error) {
            setLoader(false)
            alert('Error Occurred')
        }
    }


    return (
        <React.Fragment>
            <Button color="primary" variant='contained' size="small" onClick={handleClickOpen} startIcon={<PageviewIcon />}>
                View Module
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {module.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="xl">
                    <Loader open={loader} />
                    <Grid container spacing={10}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CardMedia
                                sx={{ height: 500, width: 1000, my: 2 }}
                                image={module?.coverImage?.url}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h3' sx={{ mb: 2 }}>{module?.title}</Typography>
                            <div className="d-flex flex-start">
                                <Avatar alt={module?.creator?.name} src={module?.creator?.avatar.url} sx={{ width: 60, height: 60, mr: 2 }} />
                                <div>
                                    <Typography variant='body2' >Created By: {module?.creator?.name}</Typography>
                                    <Typography variant='body2' >Date Published: {new Date(module?.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                    <Typography variant='body2' >Language: {module?.language}</Typography>
                                    <Typography variant='body2' >Category: {module?.category}</Typography>
                                </div>
                            </div>
                            <Typography variant='subtitle1' sx={{ mt: 5 }}>{module?.description}</Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} sx={{ paddingLeft: 2, display: 'flex', alignItems: 'center', mb: 5 }}>
                            <Watermark text="ResilienceClass" wid opacity={0.4}>
                                <div style={{ width: 800, height: 1000, border: '1px solid #000' }}>
                                    <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
                                </div>
                            </Watermark>
                        </Grid>
                    </Grid>

                </Container>
            </Dialog>
        </React.Fragment>
    );
}

export default ModuleDetail;
