import React, { useState, useEffect } from 'react';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles'; // useTheme to access the current theme
import { Link, useNavigate } from "react-router-dom";
import FitnessCenterTwoToneIcon from '@mui/icons-material/FitnessCenterTwoTone';
import SignalCellularAltTwoToneIcon from '@mui/icons-material/SignalCellularAltTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import Quotes from './components/Quotes';
import { WbSunny, Nightlight } from '@mui/icons-material';  // Import icons


const drawerWidth = 250;

// Styled AppBar to match the requested color palette
const MyAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'rgba(211, 211, 211, 0.94)',
  borderRadius: '40px',
  marginTop: '5px',
  boxShadow: theme.palette.mode === 'dark' ? 'inset 20px 20px 60px #333' : 'inset 20px 20px 60px #b3b3b3',
  border: theme.palette.mode === 'dark' ? '2px solid #fff' : '2px solid black',
}));

const MyDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#e0c2ff', // Match the toolbar background color
    color: theme.palette.mode === 'dark' ? '#fff' : '#333',
    borderRight: 'none',
    border: theme.palette.mode === 'dark' ? '2px solid #fff' : '2px solid black',
    borderRadius: '20px',
  },
}));

const MyLogo = styled('img')({
  width: '150px',
  margin: '20px',
  justifyContent: 'center',
});

const MyLogo2 = styled('img')({
  width: '200px',
  marginBottom: '20px',
  marginTop: 'none'
});

const MyDrawerContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
});

const MyLogoAndTitle = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
});

const NavBar = ({ isDarkMode, toggleTheme }) => {
  const [open, setOpen] = useState(false); // Default state is closed
  const isLoggedIn = localStorage.getItem('token'); // Check if the token is present
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme(); // Use the current theme to determine dark/light mode

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage to log out
    navigate('/'); // Redirect to the main (home) page (or login page)
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <MyAppBar position="fixed" fontFamily="MuseoModerno, serif">
        <Toolbar sx={{
           display: 'flex', 
           justifyContent: 'space-between',
            borderRadius: '30px', 
            marginRight: '10px',
            
             }}>

          {/* Menu Button to Open the Drawer */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <MyLogo
            src={theme.palette.mode === 'dark'
              ? "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853336/fered16qk2accskhgn43.png"
              : "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853546/k753hgrtzzlc4iqepvmn.png"}
            alt="logo"
          />






          <Box className={`fade-in ${isMounted ? '' : 'hidden'}`}
            sx={{
              color: 'black',
              marginRight: '50px',
              paddingRight: '50px',
              paddingLeft: '20px',
              textAlign: 'right',
              marginLeft: 'auto',
            }}>
            <Quotes />
          </Box>
        </Toolbar>
      </MyAppBar>

      {/* Drawer */}
      
      <MyDrawer  variant="persistent" anchor="left" open={open} onClose={handleDrawerToggle} className={`fade-in ${isMounted ? '' : 'hidden'}`} >
        
        <MyDrawerContent >

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            paddingTop: '50px',  // Adjust padding for top space
            paddingLeft: '10px', // Add left padding for better alignment
            paddingRight: '10px',  // Add right padding for the close icon
            width: '100%',
            
          }}>

            <IconButton sx={{ color: 'inherit' }} onClick={toggleTheme}>
              {isDarkMode ? <Nightlight /> : <WbSunny />} {/* Moon icon for dark, Sun for light */}
            </IconButton>

            {/* Arrow to Close the Drawer */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                marginLeft: 'auto',  // Push this icon to the right side
                color: 'inherit',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          {/* Drawer content */}
          <MyLogoAndTitle>
            <Link to="/Workouts">
              <MyLogo2
                src={theme.palette.mode === 'dark'
                  ? "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853336/fered16qk2accskhgn43.png"
                  : "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738853546/k753hgrtzzlc4iqepvmn.png"}
                alt="logo"
              />
            </Link>
          </MyLogoAndTitle>

          {/* Main Drawer Content (Navigation Items) */}
          {isLoggedIn && (
            <List id="nav">
              <ListItem button sx={{
                '&:hover': { border: `2px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`, borderRadius: '20px' }
              }}>
                <Link to="/Workouts" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <ListItemIcon>
                    <FitnessCenterTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontFamily: 'MuseoModerno, serif', textDecoration: 'none' }}>Workouts</Typography>}
                  />
                </Link>
              </ListItem>

              <ListItem button sx={{
                '&:hover': { border: `2px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`, borderRadius: '20px' },
              }}>
                <Link to="/Stats" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <ListItemIcon>
                    <SignalCellularAltTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontFamily: 'MuseoModerno, serif', textDecoration: 'none' }}>Stats</Typography>}
                  />
                </Link>
              </ListItem>
            </List>
          )}

          {/* Spacer to push the logout button to the bottom */}
          <Box sx={{ marginTop: 'auto' }}>
            {/* Logout Button (only show if logged in) */}
            {isLoggedIn && (
              <List id="nav">
                <ListItem button sx={{
                  '&:hover': { border: `2px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'}`, borderRadius: '20px' },
                  cursor: 'pointer'
                }} onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontFamily: 'MuseoModerno, serif', textDecoration: 'none' }}>Logout</Typography>}
                  />
                </ListItem>
              </List>
            )}
          </Box>
        </MyDrawerContent>
      </MyDrawer>
      
    </>
  );
};

export default NavBar;
