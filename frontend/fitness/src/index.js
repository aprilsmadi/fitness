import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workouts from './components/Workouts';
import Stats from './components/Stats';
import Login from './Login';
import NavBar from './NavBar.jsx';

import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
import { WbSunny, Nightlight } from '@mui/icons-material';  // Import icons


const AppWithTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const lightModeBackground = 'https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853965/gbivfllw01exsnoixe1b.jpg';  // Light mode background
  const darkModeBackground = 'https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853862/swluloyfrhjpr2uciv0n.jpg';  // Dark mode background (replace with actual image URL)

  const lightTheme = createTheme({
    palette: {
      mode: 'light', // Default light mode, no color changes

      text: {
        primary: '#000', // Black text in light mode
        secondary: '#555', // Dark gray text for secondary
      },
    },
    typography: {
      fontFamily: '"MuseoModerno", serif', // Apply MuseoModerno font globally
      allVariants: {
        textDecoration: 'none', // Ensure no text decoration for all Typography components
      },
    },
    components: {
      MuiListItem: {
        styleOverrides: {
          root: {
            textDecoration: 'none', // Ensure no text decoration on ListItem at all times
            '&:hover': {
              border: '1px solid black', // Black border on hover in light mode
              backgroundColor: 'transparent', // Optional: removes background color on hover
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent', // Remove selected item background color
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            color: 'black', // No text decoration for ListItemText in light mode
          },
        },
      },
    },
  });

  // Define dark theme with color changes (for borders, text, etc.)
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#fff', // White color for primary elements in dark mode
      },
      background: {
        default: '#121212', // Dark background for dark mode
      },
      text: {
        primary: '#fff', // White text for main text in dark mode
        secondary: '#fff', // White text for secondary text in dark mode
      },
    },
    typography: {
      fontFamily: '"MuseoModerno", serif', // Ensure font family is applied globally
      allVariants: {
        textDecoration: 'none', // Ensure no text decoration for all Typography components
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            border: '1px solid #fff', // White border for buttons in dark mode
            color: '#fff', // Button text color in dark mode
            '&:hover': {
              borderColor: '#fff', // White hover border
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& .MuiOutlinedInput-input': {
                color: '#fff', // White text color inside the MuiOutlinedInput-root
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff', // White border when hovered in dark mode
              },
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            textDecoration: 'none', // Ensure no text decoration for typography in both modes
            color: '#fff', // White text for all Typography components in dark mode
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#212121', // Dark background for AppBar in dark mode
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#212121', // Set drawer background to match the toolbar in dark mode
            color: '#fff', // White text inside Drawer
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            textDecoration: 'none', // Ensure no text decoration on ListItem at all times
            '&:hover': {
              border: '1px solid white', // White border on hover in dark mode
              backgroundColor: 'transparent', // Optional: removes background color on hover
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent', // Remove selected item background color
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            textDecoration: 'none', // No text decoration for ListItemText in dark mode
            color: '#fff', // White text inside the drawer
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#fff', // Ensure that typography in the drawer is white in dark mode
          },
        },
      },
    },
  });


  // Toggle theme on Switch change
  const toggleTheme = () => setIsDarkMode((prev) => !prev);


  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => setIsFading(false), 300); // Remove fade effect after 500ms
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme} >
      <CssBaseline />

      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />



      <div className={`background-container ${isDarkMode ? 'dark' : 'light'}`}> 

        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Workouts" element={<Workouts />} />
          <Route path="Stats" element={<Stats />} />
        </Routes>
      </div>
    </ThemeProvider >
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <AppWithTheme />
  </Router>
);

reportWebVitals(); 
