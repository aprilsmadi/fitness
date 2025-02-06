import React from 'react';
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
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from "react-router-dom";
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import FitnessCenterTwoToneIcon from '@mui/icons-material/FitnessCenterTwoTone';
import SignalCellularAltTwoToneIcon from '@mui/icons-material/SignalCellularAltTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import { useState, useEffect } from 'react';

import DarkMode from './DarkMode';


const drawerWidth = 250;

// Styled AppBar to match the requested color palette
const MyAppBar = styled(AppBar)(() => ({
  backgroundColor: '#D3D3D3',
}));

const MyDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#e0c2ff',
    color: '#333',
    borderRight: 'none',
  },
}));

const MyLogo = styled('img')({
  width: '160px', // Adjust the logo size as necessary
  marginLeft: '30px',
  justifyContent: 'center',
});

const MyLogo2 = styled('img')({
  width: '200px', // Adjust the logo size as necessary
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
  backgroundColor: '#e0c2ff',
});

const NavBar = () => {
  const [open, setOpen] = React.useState(false); // Default state is closed
  const navigate = useNavigate(); // useNavigate hook for redirecting
  const isLoggedIn = localStorage.getItem('token'); // Check if the token is present
  const [isMounted, setIsMounted] = useState(false);

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
      <MyAppBar className={`swipe-right ${isMounted ? '' : 'hidden'}`} position="fixed" fontFamily="MuseoModerno, serif">
        <Toolbar >
          {/* Menu Button to Open the Drawer */}
          <IconButton edge="start" color="black" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <MyLogo
            src="https://res.cloudinary.com/dnxyeqknh/image/upload/c_pad,ar_4:3/v1738751387/fitness-high-resolution-logo-transparent_2_n4rnti.png"
            alt="logo"
          /> {/* Your logo here */}
          <Box sx={{display: 'flex', paddingLeft: "1550px"}}>

          
          </Box>
        </Toolbar>
      </MyAppBar>

      {/* Drawer */}
      <MyDrawer variant="persistent" anchor="left" open={open} onClose={handleDrawerToggle}>
        <MyDrawerContent>
          {/* Arrow to Close the Drawer */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              marginLeft: 'auto',
              marginTop: '10px',
              marginRight: '10px',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Drawer content */}
          <MyLogoAndTitle>
            <Link to="/">
              <MyLogo2
                src="https://res.cloudinary.com/dnxyeqknh/image/upload/c_pad,ar_16:9/v1738751387/fitness-high-resolution-logo-transparent_2_n4rnti.png"
                alt="logo"
              />
            </Link>
          </MyLogoAndTitle>
          

          {/* Main Drawer Content (Navigation Items) */}
          {isLoggedIn && (
            <List id="nav">
              <ListItem button sx={{ '&:hover': { backgroundColor: '#d3d3d3' } }}>
                <Link to="/Dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <ListItemIcon>
                    <GridViewTwoToneIcon /> {/* Icon */}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontFamily: 'MuseoModerno, serif', color: 'black' }}>
                        Dashboard
                      </Typography>
                    }
                  />
                </Link>
              </ListItem>

              <ListItem button sx={{ '&:hover': { backgroundColor: '#d3d3d3' } }}>
                <Link to="/Workouts" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <ListItemIcon>
                    <FitnessCenterTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontFamily: 'MuseoModerno, serif', color: 'black' }}>
                        Workouts
                      </Typography>
                    }
                  />
                </Link>
              </ListItem>

              <ListItem button sx={{ '&:hover': { backgroundColor: '#d3d3d3' } }}>
                <Link to="/Stats" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <ListItemIcon>
                    <SignalCellularAltTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontFamily: 'MuseoModerno, serif', color: 'black' }}>
                        Stats
                      </Typography>
                    }
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
                <ListItem button sx={{ '&:hover': { backgroundColor: '#d3d3d3' }, cursor: 'pointer' }} onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontFamily: 'MuseoModerno, serif', color: 'black' }}>
                        Logout
                      </Typography>
                    }
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