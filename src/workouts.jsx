import React, { useEffect, useState } from 'react';
import './Workouts.css'; // Import the CSS file
import axios from 'axios'; // Import axios for API calls

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState({}); // Track session IDs for each workout

  // Fetch workouts from the backend
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

  // Function to handle the "stop workout" button click
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
            {/* Workout Name */}
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

            {/* Button to start or stop the workout */}
            {!sessions[workout.workout_id]?.started ? (
              <button
                className="start-workout-btn"
                onClick={() => handleStartWorkout(workout.workout_id)}
              >
                Start Workout
              </button>
            ) : sessions[workout.workout_id]?.ended ? (
              // Change button text when workout has finished
              <button className="workout-finished-btn" disabled>
                Workout Finished
              </button>
            ) : (
              // Button to stop the workout if it has started and not ended
              <button
                className="end-workout-btn"
                onClick={() => handleEndWorkout(workout.workout_id)}
                disabled={sessions[workout.workout_id]?.isStopping} // Disable if "isStopping" is true
              >
                Stop Workout
              </button>
            )}

            {/* Show session ID and burned calories if workout ended */}
            {sessions[workout.workout_id]?.ended && (
              <div className="workout-summary">
                <p>
                  <strong>Workout Ended</strong><br />
                  Session ID: {sessions[workout.workout_id].sessionId}<br />
                  Duration: {sessions[workout.workout_id].duration} seconds<br />
                  Calories Burned: {sessions[workout.workout_id].burnedCalories}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
