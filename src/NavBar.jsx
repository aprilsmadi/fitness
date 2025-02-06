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


import Quotes from './components/Quotes';


const drawerWidth = 250;

// Styled AppBar to match the requested color palette
const MyAppBar = styled(AppBar)(() => ({
  
}));

const MyDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#e0c2ff',
    color: '#333',
    borderRight: 'none',
    border: '2px solid black',
    borderRadius: '20px',
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
      <MyAppBar position="fixed" fontFamily="MuseoModerno, serif" sx={{backgroundColor:'rgba(211, 211, 211, 0.94)', borderRadius: '40px', marginTop:'5px'}}>

        <Toolbar
          sx={{
            display: 'flex', justifyContent: 'space-between',
            boxShadow: 'inset 20px 20px 60px #b3b3b3, inset -20px -20px 60px #f3f3f3',
            border: '1px solid black',
            borderRadius: '30px',
            
            marginRight:'10px',
            
          }}>


          {/* Menu Button to Open the Drawer */}
          <IconButton edge="start" color="black" aria-label="menu" onClick={handleDrawerToggle} sx={{ '&:hover': { border: '1px solid black' } }}>
            <MenuIcon />
          </IconButton>
          <MyLogo
            src="https://res.cloudinary.com/dnxyeqknh/image/upload/c_pad,ar_4:3/v1738751387/fitness-high-resolution-logo-transparent_2_n4rnti.png"
            alt="logo"
          /> {/* Your logo here */}
          <Box className={`fade-in ${isMounted ? '' : 'hidden'}`}
            sx={{
              color: 'black',
              marginRight: '50px',
              paddingRight: '50px',
              paddingLeft: '20px',
              textAlign: 'right',
              marginLeft: 'auto', // Push to the right side
              
              
              borderRadius: '20px',
              
                // Right-to-left text direction
            }}>

            <Quotes />

          </Box>
        </Toolbar>
      </MyAppBar>

      {/* Drawer */}
      <MyDrawer variant="persistent" anchor="left" open={open} onClose={handleDrawerToggle} >
        <MyDrawerContent sx={{ boxShadow: 'inset 20px 20px 60px #e0c2ff, inset -20px -20px 60px #f3f3f3' }}>
          {/* Arrow to Close the Drawer */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': { border: '1px solid black' },
              marginLeft: 'auto',
              marginTop: '10px',
              marginRight: '10px',
              color: 'black'
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Drawer content */}
          <MyLogoAndTitle>
            <Link to="/Workouts">
              <MyLogo2
                src="https://res.cloudinary.com/dnxyeqknh/image/upload/c_pad,ar_4:3/v1738751387/fitness-high-resolution-logo-transparent_2_n4rnti.png"
                alt="logo"

              />
            </Link>
          </MyLogoAndTitle>


          {/* Main Drawer Content (Navigation Items) */}
          {isLoggedIn && (
            <List id="nav">


              <ListItem button sx={{ '&:hover': { border: '2px solid black', borderRadius: '20px' } }}>
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

              <ListItem button sx={{ '&:hover': { border: '2px solid black', borderRadius: '20px' } }}>
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
                <ListItem button sx={{ '&:hover': { border: '2px solid black', borderRadius: '20px' }, cursor: 'pointer' }} onClick={handleLogout}>
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