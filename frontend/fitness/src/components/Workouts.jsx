import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook
import { Box, Typography, Button, Paper } from "@mui/material";
import { CircularProgress } from '@mui/material';
import { motion } from "framer-motion"; // Import Framer Motion


const Workouts = () => {
  const theme = useTheme(); // Access current theme (dark/light mode)
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/workouts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        return response.json();
      })
      .then((data) => {
        setWorkouts(data);
        
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
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

  const handleStartWorkout = (workoutId) => {
    console.log(`Starting workout with ID: ${workoutId}`);
  };

  
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    
    <div>
            {loading && (
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
                <CircularProgress sx={{color: '#e0c2ff'}} />
              </Box>
            )}
    <Box sx={{ marginTop: "100px", transition: "background-color 0.8s ease-in-out" }}>
      {/* Muscle Selection Cards */}
      {selectedMuscle === null && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {muscles.map((muscle,index) => (
                <motion.div
                key={muscle}
                initial={{ opacity: 0, y: 20 }} // Start faded out and slightly below
                animate={{ opacity: 1, y: 0 }} // Fade in and move up
                transition={{ duration: 0.5, delay: index * 0.2 }} // Stagger effect
              >
            <Paper
              key={muscle}
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: theme.palette.mode === "dark" ? "#333" : "#e0c2ff",
                color: theme.palette.text.primary,
                cursor: "pointer",
                textAlign: "center",
                transition: "background-color 0.8s ease-in-out, color 0.8s ease-in-out",
                border: `1px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#444" : "#d0b3ff",
                },
              }}
              onClick={() => handleMuscleSelect(muscle)}
            >
              <Typography variant="h6">{muscle}</Typography>
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
          key={workout}
          initial={{ opacity: 0, y: 20 }} // Start faded out and slightly below
          animate={{ opacity: 1, y: 0 }} // Fade in and move up
          transition={{ duration: 0.5, delay: index * 0.2 }} // Stagger effect
        >
          <Paper
            key={workout.workout_id}
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
