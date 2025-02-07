import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { CircularProgress } from '@mui/material';  // Import CircularProgress for loading spinner
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

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
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to track visibility


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword); // Toggle visibility
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value); // Update password value
    };



    // Handle form submission (for login or registration)
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);  // Start loading state

        const url = isLogin
            ? 'http://localhost:8000/login'  // POST to /login if login mode
            : 'http://localhost:8000/register'; // POST to /register if register mode

        // Simulate a delay of 1.5 seconds
        setTimeout(async () => {
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
            } finally {
                setLoading(false); // Stop loading state after the delay and response
            }
        }, 1500);  // 1.5 seconds delay
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'relative' }}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
                        backdropFilter: 'blur(5px)',  // Blur effect for the content underneath
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000  // Ensure this is above the form
                    }}>
                        <CircularProgress />
                    </div>
                )}
                <FormControl variant="standard" style={{ zIndex: 1 }}>
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
                                        width: '250px',
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

                                        '& input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 30px transparent inset', // Prevent autofill background color
                                            WebkitTextFillColor: currentTheme.palette.mode === 'dark' ? '#fff' : 'black', // Set autofill text color to match input text
                                            padding: '8px 10px', // Adjust padding to control the height of the autofill highlight
                                          },
                                        '& input:-webkit-autofill::first-line': {
                                            padding: '8px 10px', // Adjust the padding to match the textfield border
                                        },
                                        '& input:-webkit-autofill::after': {
                                            borderRadius: '15px', // Ensure the highlight has the same radius as the text field
                                            border: '1px solid lightgray', // Prevent the autofill highlight from expanding beyond the border
                                        },
                                    }}
                                />
                            </div>
                            <div style={{ padding: '15px' }}>
                                <label style={{ padding: 5 }}>Password: </label>
                                <TextField
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />} {/* Toggle icons */}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: '250px',
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
                                        '& input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 30px transparent inset', // Prevent autofill background color
                                            WebkitTextFillColor: currentTheme.palette.mode === 'dark' ? '#fff' : 'black', // Set autofill text color to match input text
                                            padding: '8px 10px', // Adjust padding to control the height of the autofill highlight
                                          },
                                        '& input:-webkit-autofill::first-line': {
                                            padding: '8px 10px', // Adjust the padding to match the textfield border
                                        },
                                        '& input:-webkit-autofill::after': {
                                            borderRadius: '15px', // Ensure the highlight has the same radius as the text field
                                            border: '1px solid lightgray', // Prevent the autofill highlight from expanding beyond the border
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
            </div>
        </ThemeProvider>
    );
};

export default Login;
