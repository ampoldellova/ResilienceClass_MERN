import React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import HealingIcon from '@mui/icons-material/Healing';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const Home = () => (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar position="relative">
            <Toolbar>
                <HealingIcon sx={{ mr: 2 }} />
                <Typography variant="h6" color="inherit" noWrap>
                    ResilienceClass
                </Typography>
            </Toolbar>
        </AppBar>
        <main>
            {/* Hero unit */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                }}
            >
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Home layout
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Something short and leading about the collection below—its contents,
                        the creator, etc. Make it short and sweet, but not too short so folks
                        don&apos;t simply skip over it entirely.
                    </Typography>
                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button variant="contained" component={Link} to="/login">Sign In</Button>
                        {/* <Button variant="outlined">Create an Account</Button> */}
                    </Stack>
                </Container>
            </Box>
        </main>
    </ThemeProvider>
);

export default Home;
