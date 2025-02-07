import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Changed to Pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register necessary components for Chart.js (for Pie chart)
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UserProgressChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch user progress from backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user-progress', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token if needed
          },
        });
        setData(response.data.progress); // Set response data to state
      } catch (error) {
        console.error('Error fetching user progress data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data from the API response
  const chartData = {
    labels: data.map(workout => workout.workout_name), // Workout names on X-axis
    datasets: [
      {
        label: 'Total Sessions',
        data: data.map(workout => workout.total_sessions), // Total sessions per workout
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)', // Teal color (for example)
          'rgba(153, 102, 255, 0.2)', // Purple color
          'rgba(255, 159, 64, 0.2)', // Orange color
          'rgba(255, 99, 132, 0.2)', // Red color
          'rgba(54, 162, 235, 0.2)', // Blue color
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Teal color border
          'rgba(153, 102, 255, 1)', // Purple color border
          'rgba(255, 159, 64, 1)', // Orange color border
          'rgba(255, 99, 132, 1)', // Red color border
          'rgba(54, 162, 235, 1)', // Blue color border
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for chart styling
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User Progress: Total Sessions per Workout',
      },
      tooltip: {
        enabled: true,
      },
    },
    legend: {
      position: 'top',
    },
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">User Progress: Total Sessions per Workout</h2>
      {data.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p className="loading-text">Loading data...</p>
      )}
    </div>
  );
};

export default UserProgressChart;
