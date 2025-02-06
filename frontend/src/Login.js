import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import zIndex from '@mui/material/styles/zIndex';

const theme = createTheme({
    palette: {
        primary: {
            main: '#E0C2FF',
        },
        secondary: {
            main: '#D3D3D3',
        },
    },
});

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register mode
    const [isMounted, setIsMounted] = useState(false);
    const currentTheme = useTheme(); // Access the current theme

    // Handle form submission (for login or registration)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin
            ? 'http://localhost:8000/login'  // POST to /login if login mode
            : 'http://localhost:8000/register'; // POST to /register if register mode

        try {
            const response = await axios.post(url, { username, password });
            if (isLogin) {
                // If login, save the token and redirect to the dashboard
                localStorage.setItem('token', response.data.token);
                window.location.href = '/Workouts'; // Redirect to another page, e.g., Dashboard
            } else {
                // If register, show success message and switch to login mode
                setError('Registration successful. Please log in.');
                setIsLogin(true); // Switch to login mode
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred'); // Show error message
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Define login form styles based on the theme mode, with boxShadow removed
    const loginStyle = {
        border: `2px solid ${currentTheme.palette.mode === 'dark' ? 'white' : 'black'}`,
        backgroundColor: currentTheme.palette.mode === 'dark' ? '#333' : 'rgba(211, 211, 211, 0.94)',
        borderRadius: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        margin: 'auto' // Centers horizontally
    };


    const linkStyle = {
        color: currentTheme.palette.mode === 'dark' ? 'white' : '#616161', // Change link color to white in dark mode
        cursor: 'pointer',
        textDecoration: 'underline',
    };

    return (
        <ThemeProvider theme={theme}>
            <FormControl variant="standard">
                <div className={`fade-in ${isMounted ? '' : 'hidden'}`} style={loginStyle}>
                    <h2 style={{ alignItems: 'center' }}>{isLogin ? 'Login' : 'Register'}</h2>
                    {error && <p style={{ color: 'green' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '15px' }}>
                            <label style={{ padding: 5 }}> Username: </label>
                            <TextField
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px', // Set border radius to 15px
                                        height: '40px',
                                        border: '1px solid lightgray',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: currentTheme.palette.mode === 'dark' ? '#fff' : 'black', // Set text color based on theme
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Remove hover background on input
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div style={{ padding: '15px' }}>
                            <label style={{ padding: 5 }}>Password: </label>
                            <TextField
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px', // Set border radius to 15px
                                        height: '40px',
                                        border: '1px solid lightgray',
                                        color: 'black',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: currentTheme.palette.mode === 'dark' ? '#fff' : 'black',
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Remove hover background on input
                                        },
                                    },
                                }}
                            />
                        </div>
                        {/* The button stays the same */}
                        <Button sx={{
                            fontFamily: "MuseoModerno, serif",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 'auto'
                        }}
                            variant="contained" type="submit">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </form>
                    <p>
                        {isLogin ? 'Need an account? ' : 'Already have an account? '}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            style={linkStyle}
                        >
                            {isLogin ? 'Register here' : 'Login here'}
                        </span>
                    </p>
                </div>
            </FormControl>
        </ThemeProvider>
    );
};

export default Login;
