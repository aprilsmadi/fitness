import React, { useEffect, useState } from 'react';
import './Workouts.css'; // Import the CSS file

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/workouts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
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

  // Function to handle the "start workout" button click
  const handleStartWorkout = (workoutId) => {
    console.log(`Starting workout with ID: ${workoutId}`);
    // You can call an API to track session start, or any other logic here.
    // Example: You could send a request to the server to start a workout session.
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Workouts</h1>
      <div className="workout-grid">
        {workouts.map((workout) => (
          <div key={workout.workout_id} className="workout-card">
            {/* Workout Name First */}
            <h3>{workout.workout_name}</h3>

            {/* Workout Details */}
            <div className="workout-details">
              <p><strong>Category:</strong> {workout.category}</p>
              <p><strong>Difficulty:</strong> {workout.difficulty}</p>
              <p><strong>Duration:</strong> {workout.duration} seconds</p>
              <p><strong>Calories:</strong> {workout.calories}</p>
              <p><strong>Primary Muscle:</strong> {workout.primary_muscle}</p>
              <p><strong>Tips:</strong> {workout.tips}</p>
              <p><strong>Description:</strong> {workout.description}</p>
            </div>

            {/* Button to start the workout */}
            <button 
              className="start-workout-btn" 
              onClick={() => handleStartWorkout(workout.workout_id)}
            >
              Start Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;

