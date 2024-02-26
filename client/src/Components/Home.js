import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import HealingIcon from '@mui/icons-material/Healing';

const Home = () => {

    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <HealingIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography variant="h6">
                                ResilienceClass
                            </Typography>
                        </div>
                        <Button color="inherit" component={Link} to="/login">Sign in</Button>
                    </Toolbar>
                </AppBar>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={12} md={12} lg={6} sx={{ transition: 'opacity 1.5s', opacity: fadeIn ? 1 : 0 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100% - 64px)', mx: 10 }}>
                                <Typography sx={{ textAlign: 'justify', fontSize: 28, fontWeight: 1, mb: 1 }}>
                                    Welcome to ResilienceClass, your online learning lifeline during disasters. We're here to ensure education never stops, offering a diverse range of courses and resources to keep you engaged and growing, no matter the circumstances. Join us in staying resilient and empowered through continuous learning.
                                </Typography>
                                <Button variant='outlined' component={Link} to="/login">Sign in to ResilienceClass</Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6} sx={{ transition: 'opacity 1.5s', opacity: fadeIn ? 1 : 0 }}>
                        <Box sx={{ margin: 20 }}>
                            <img src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1708857881/ResilienceClass/3d-casual-life-group-of-young-people-discussing-something-while-working_e1pvol.png" alt="Home" width="500" height="450" />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>

    );
};

export default Home;
