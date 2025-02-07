import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook
import { Box, Typography, Button, Paper } from "@mui/material";

const Workouts = () => {
  const theme = useTheme(); // Access current theme (dark/light mode)
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/workouts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        return response.json();
      })
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStartWorkout = (workoutId) => {
    console.log(`Starting workout with ID: ${workoutId}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box
      sx={{
        
        marginTop: "100px",
        transition: "background-color 0.8s ease-in-out",
      }}
    >


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {workouts.map((workout) => (
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
              borderRadius: '20px',
            }}
          >
            <Typography variant="h5">{workout.workout_name}</Typography>

            <Typography variant="body1">
              <strong>Category:</strong> {workout.category}
            </Typography>
            <Typography variant="body1">
              <strong>Difficulty:</strong> {workout.difficulty}
            </Typography>
            <Typography variant="body1">
              <strong>Duration:</strong> {workout.duration} seconds
            </Typography>
            <Typography variant="body1">
              <strong>Calories:</strong> {workout.calories}
            </Typography>
            <Typography variant="body1">
              <strong>Primary Muscle:</strong> {workout.primary_muscle}
            </Typography>
            <Typography variant="body2">
              <strong>Tips:</strong> {workout.tips}
            </Typography>
            <Typography variant="body2">
              <strong>Description:</strong> {workout.description}
            </Typography>

            <Button
              variant="contained"
              sx={{
                marginTop: "10px",
                backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#333",
                color: theme.palette.mode === "dark" ? "#333" : "#fff",
                borderRadius: '15px',
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#ddd" : "#555",
                },
                transition: "background-color 0.8s ease-in-out, color 0.8s ease-in-out",
              }}
              onClick={() => handleStartWorkout(workout.workout_id)}
            >
              Start Workout
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Workouts;
