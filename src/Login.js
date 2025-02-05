import React, { useState } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

const theme = createTheme({
    palette: {
        primary: {
            main: '#E0C2FF',
            // light: will be calculated from palette.primary.main,
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
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
                window.location.href = '/Dashboard'; // Redirect to another page, e.g., Dashboard
            } else {
                // If register, show success message and switch to login mode
                setError('Registration successful. Please log in.');
                setIsLogin(true); // Switch to login mode
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred'); // Show error message
        }
    };

    const loginStyle  ={
        border: '2px solid black',
        backgroundColor: 'rgba(211, 211, 211, 0.9)',
        borderRadius: '20px'

    }

    return (
        <ThemeProvider theme={theme}>
            <FormControl variant="standard">
                <div style={ loginStyle}>

                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    {error && <p style={{ color: 'green' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={{padding: '15px'}}>
                            <label style={{padding:5}}> Username: </label>
                            <TextField
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                variant="outlined"
                                sx=
                                {{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px', // Set border radius to 15px
                                        height: '40px',
                                        border: '1px solid lightgray ',
                                        color: 'black'
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                             // Remove hover background on input
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div style={{padding: '15px'}}>
                            <label style={{padding:5}}>Password: </label>
                            <TextField
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                variant="outlined"
                                sx=
                                {{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px', // Set border radius to 15px
                                        height: '40px',
                                        border: '1px solid lightgray',
                                        color: 'black'
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        '&:hover': {
                                            backgroundColor: 'transparent', // Remove hover background on input
                                        },
                                    },
                                }}
                            />
                        </div>
                        <Button sx={{ fontFamily: "MuseoModerno, serif" }} variant="contained" type="submit">{isLogin ? 'Login' : 'Register'}</Button>
                    </form>
                    <p>
                        {isLogin ? 'Need an account? ' : 'Already have an account? '}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ color: "#616161", cursor: 'pointer', textDecoration: "underline" }}
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
