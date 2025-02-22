import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook
import { Box, Typography, Button, Paper } from "@mui/material";
import { CircularProgress } from '@mui/material';
import { motion } from "framer-motion"; // Import Framer Motion
import axios from 'axios'; // Import axios for API calls
import './Workouts.css'; // Import the CSS file

const muscleImages = {
  chest: "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738940124/hdynqhfctg2kvcc9d3b1.png", // Replace with actual image URL for chest
  legs: "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738940107/zt1gkxlmvrqzcmn492xi.png",   // Replace with actual image URL for legs
  fullbody: "https://res.cloudinary.com/dnxyeqknh/image/upload/v1738940117/kplikf5iniuxepilbfjc.png",
};

const Workouts = () => {
  const theme = useTheme(); // Access current theme (dark/light mode)
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [sessions, setSessions] = useState({}); // Track session IDs for each workout
  const [welcomeText, setWelcomeText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const welcomeMessage = "Welcome Back! :D";


  useEffect(() => {
    if (isTyping) {
      let index = 0;
      setWelcomeText(welcomeMessage[0]); // Start with the first character immediately

      const interval = setInterval(() => {
        index += 1;
        setWelcomeText((prev) => prev + welcomeMessage[index]);

        if (index === welcomeMessage.length - 1) {
          clearInterval(interval); // Stop once the full message is typed
          setIsTyping(false);
        }
      }, 150); // Adjust typing speed

      return () => clearInterval(interval);
    }
  }, [isTyping]);


  // Fetch workouts from the backend
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/workouts')
    fetch('http://localhost:8000/workouts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
          throw new Error('Failed to fetch workouts');
        }
        return response.json();
      })
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Get all unique primary muscles
  const muscles = [...new Set(workouts.map((workout) => workout.primary_muscle))];

  // Filter workouts based on selected muscle
  const filteredWorkouts = selectedMuscle
    ? workouts.filter((workout) => workout.primary_muscle === selectedMuscle)
    : [];

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
  };


  const handleStartWorkout = async (workoutId) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage


    if (!token) {
      alert('Please log in to start a workout');
      return;
    }


    try {
      // Send a POST request to start the workout session
      const response = await axios.post(
        'http://localhost:8000/start-workout',
        { workoutId },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      // Save the session ID for this specific workout
      setSessions((prevSessions) => ({
        ...prevSessions,
        [workoutId]: { sessionId: response.data.sessionId, started: true, ended: false, burnedCalories: 0, duration: 0, isStopping: false },
      }));


      alert('Workout session started!');
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout');
    }
  };


  const handleEndWorkout = async (workoutId) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage


    if (!token) {
      alert('Please log in to stop a workout');
      return;
    }


    const sessionId = sessions[workoutId]?.sessionId;
    if (!sessionId) {
      alert('No active workout session found.');
      return;
    }


    // Prevent trying to stop the workout if it's already ended
    if (sessions[workoutId]?.ended) {
      alert('Workout session already ended.');
      return;
    }


    // Set the button to be in "stopping" mode to prevent double clicks
    setSessions((prevSessions) => ({
      ...prevSessions,
      [workoutId]: { ...prevSessions[workoutId], isStopping: true },
    }));


    try {
      // Send a POST request to stop the workout session
      const response = await axios.post(
        'http://localhost:8000/end-workout',
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      console.log("End Workout Response:", response.data); // Debugging the response


      if (response.data.success) {
        // Update the session state to reflect the workout has ended
        setSessions((prevSessions) => ({
          ...prevSessions,
          [workoutId]: {
            ...prevSessions[workoutId],
            ended: true,
            burnedCalories: response.data.burnedCalories, // Update burned calories
            duration: response.data.duration, // Store the duration
            isStopping: false, // Reset the isStopping state
          },
        }));


        alert('Workout session ended!'); // Alert when the session ends successfully
      } else {
        alert(response.data.message || 'Failed to end workout');
      }
    } catch (error) {
      console.error('Error ending workout:', error);
      alert('Failed to end workout');
      // Reset the isStopping flag in case of an error
      setSessions((prevSessions) => ({
        ...prevSessions,
        [workoutId]: { ...prevSessions[workoutId], isStopping: false },
      }));
    }
  };


  if (loading) {
    return (
      <Box
        sx={{
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
          zIndex: 2000,  // Ensure this is above the content
        }}
      >
        <CircularProgress sx={{ color: '#e0c2ff' }} />
      </Box>
    );
  }


  if (error) return <Typography color="error">Error: {error}</Typography>;


  return (
    <div>
<Box
  sx={{
    display: "flex",
    justifyContent: "center", // Horizontally center
    alignItems: "center",     // Vertically center
  }}
>
  <Typography
    variant="h3"
    sx={{
      display: "inline-block",
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "20px",
      overflow: "hidden",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
      backgroundColor: theme.palette.mode === "dark" ? "#333" : "#e0c2ff",
      width: `${(welcomeText.length / welcomeMessage.length) * 100}%`,
      border: `1px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,
      minWidth: "20px",
      maxWidth: "fit-content",
      transition: "width 0.1s ease-in-out",
      margin: "0 auto",
      borderRadius: "15px",
      whiteSpace: "nowrap",
      padding: "10px 20px",
    }}
  >
    {welcomeText}
  </Typography>
</Box>
      <Box sx={{ marginTop: "100px", transition: "background-color 0.8s ease-in-out" }}>
        {/* Muscle Selection Cards */}
        {selectedMuscle === null && (
          <Box
            sx={{
              display: "flex",
              gap: "50px",
              padding: "50px"
            }}
          >
            {muscles.map((muscle, index) => (

              <motion.div
                key={muscle}
                initial={{ opacity: 0, y: 20 }} // Start faded out and slightly below
                animate={{ opacity: 1, y: 0 }} // Fade in and move up
                transition={{ duration: 0.5, delay: index * 0.2 }} // Stagger effect
                style={{ animation: "subtleMove 5s ease-in-out infinite" }} // Apply CSS animation for smooth movement

              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#e0c2ff",
                    color: theme.palette.text.primary,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "background-color 0.8s ease-in-out, color 0.8s ease-in-out, transform 0.5s ease-in-out",
                    border: `1px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "#444" : "#d0b3ff",
                      transform: "scale(1.1)", // This scales up the card

                    },
                    height: "300px",

                  }}
                  onClick={() => handleMuscleSelect(muscle)}
                >
                  <img src={muscleImages[muscle.replace(/\s+/g, '').toLowerCase()]} alt={muscle} style={{ width: "180px", borderRadius: "8px", borderRadius: "8px", padding: "10px" }} />

                  <Typography variant="h6"
                    sx={{
                      marginTop: "45px",
                      textTransform: "uppercase"

                    }}>
                    {muscle}</Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}


        {/* Filtered Workouts List */}
        {selectedMuscle && filteredWorkouts.length === 0 && (
          <Typography variant="h6">No workouts available for this muscle.</Typography>
        )}


        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.workout_id}
              initial={{ opacity: 0, y: 20 }} // Start faded out and slightly below
              animate={{ opacity: 1, y: 0 }} // Fade in and move up
              transition={{ duration: 0.5, delay: index * 0.2 }} // Stagger effect
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#e0c2ff",
                  color: theme.palette.text.primary,
                  transition: "background-color 0.8s ease-in-out, color 0.8s ease-in-out",
                  border: `1px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,

                }}
              >
                <Typography variant="h5">{workout.workout_name}</Typography>
                <Typography variant="body1"><strong>Category:</strong> {workout.category}</Typography>
                <Typography variant="body1"><strong>Primary Muscle:</strong> {workout.primary_muscle}</Typography>
                <Typography variant="body1"><strong>Duration:</strong> {workout.duration} seconds</Typography>
                <Typography variant="body1"><strong>Calories:</strong> {workout.calories}</Typography>
                <Typography variant="body1"><strong>Difficulty:</strong> {workout.difficulty}</Typography>
                <Typography variant="body2"><strong>Tips:</strong> {workout.tips}</Typography>
                <Typography variant="body2"><strong>Description:</strong> {workout.description}</Typography>


                {/* Conditionally render the button based on the session state */}
                {sessions[workout.workout_id]?.ended ? (
                  <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold' }}>
                    Workout Completed - {sessions[workout.workout_id]?.burnedCalories} kcal burned
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "10px",
                      backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#333",
                      color: theme.palette.mode === "dark" ? "#333" : "#fff",
                      borderRadius: "15px",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#555",
                      },
                    }}
                    onClick={() => handleStartWorkout(workout.workout_id)}
                  >
                    Start Workout
                  </Button>
                )}


                {/* Stop Workout Button */}
                {sessions[workout.workout_id]?.started && !sessions[workout.workout_id]?.ended && (
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "10px",
                      backgroundColor: theme.palette.mode === "dark" ? "#f44336" : "#d32f2f",
                      color: "#fff",
                      borderRadius: "15px",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "#e57373" : "#b71c1c",
                      },
                    }}
                    disabled={sessions[workout.workout_id]?.isStopping}
                    onClick={() => handleEndWorkout(workout.workout_id)}
                  >
                    {sessions[workout.workout_id]?.isStopping ? 'Stopping...' : 'Stop Workout'}
                  </Button>
                )}
              </Paper>
            </motion.div>
          ))}
        </Box>


        {/* Back to Muscle Selection Button */}
        {selectedMuscle && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#333",
                color: theme.palette.mode === "dark" ? "#333" : "#fff",
                borderRadius: '15px',
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#555",
                },
                transition: "background-color 0.8s ease-in-out, color 0.8s ease-in-out",
              }}
              onClick={() => setSelectedMuscle(null)}
            >
              Back
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Workouts;
