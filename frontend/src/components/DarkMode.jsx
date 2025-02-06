import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Button, Switch } from '@mui/material';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // Blue color
      },
      background: {
        default: '#fff', // White background for light mode
        paper: '#f4f4f4', // Light gray for paper background
      },
      text: {
        primary: '#000', // Black text
        secondary: '#555', // Dark gray text
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            border: '1px solid #1976d2', // Light blue border
            color: '#1976d2', // Button text color
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderColor: '#1976d2', // Light blue input border
            },
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#fff', // Light blue color for dark mode
      },
      background: {
        default: '#000', // Dark background
        paper: '#000', // Dark paper background
      },
      text: {
        primary: '#fff', // White text
        secondary: '#fff', // Light gray text
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            border: '1px solid #fff', // Light blue border for dark mode
            color: '#fff', // Button text color for dark mode
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderColor: '#fff', // Light blue input border for dark mode
            },
          },
        },
      },
    },
  });

  // Toggle theme
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* This ensures that the baseline styles are applied (helps with consistent styling) */}
      <div style={{ padding: '20px', minHeight: '100vh', background: isDarkMode ? '#000' : '#fff' }}>
        <h1 style={{ color: isDarkMode ? '#fff' : '#000' }}>Theme Toggle Example</h1>
        
        {/* Button */}
        <Button variant="outlined">My Button</Button>

        {/* Text Field */}
        <TextField label="Example Input" variant="outlined" style={{ marginTop: '20px' }} />
        
        {/* Switch to toggle between light/dark mode */}
        <div style={{ marginTop: '20px' }}>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
          <span style={{ color: isDarkMode ? '#fff' : '#000' }}>Toggle Dark/Light Mode</span>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
