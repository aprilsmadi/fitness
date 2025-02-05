import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import NightlightIcon from '@mui/icons-material/Nightlight';
import Button from '@mui/material/Button';

// Define the Light theme with custom fonts
const themeLight = createTheme({
  palette: {
    mode: 'light', // Correct key for theme mode is `mode` instead of `type`
    primary: {
      main: '#000',
    },
  },
  typography: {
    fontFamily: '"MuseoModerno", serif', // Set a different font for dark theme
    h1: {
      fontFamily: '"MuseoModerno", serif',
    },
    h2: {
      fontFamily: '"MuseoModerno", serif',
    },
    body1: {
      fontFamily: '"MuseoModerno", serif', // Different font for body text
    }
  }
});

// Define the Dark theme with custom fonts
const themeDark = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#fff',
    },
    text: {
      primary: '#fff',
    },
  },
  typography: {
    fontFamily: '"MuseoModerno", serif', // Set a different font for dark theme
    h1: {
      fontFamily: '"MuseoModerno", serif',
    },
    h2: {
      fontFamily: '"MuseoModerno", serif',
    },
    body1: {
      fontFamily: '"MuseoModerno", serif', // Different font for body text
    }
  }
});

export default function DarkMode() {
  const [light, setLight] = useState(true);

  useEffect(() => {
    if (!light) {
      document.body.classList.add('dark-mode');
      document.getElementById('nav')?.classList.add('nav');
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('nav')?.classList.remove('nav');
    }
  }, [light]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <Button
          id="btn"
          variant="outlined"
          sx={{ border: "2px solid transparent", borderRadius: "20px" }}
          onClick={() => setLight((prev) => !prev)}
        >
          <NightlightIcon />
        </Button>
      </ThemeProvider>
    </div>
  );
};
