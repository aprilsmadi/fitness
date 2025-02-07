const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
 
const db = require('./db.js');

// API to get random quote
app.get('/api/random-quote', async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/quotes/random');
    const quote = response.data;
    res.json({ text: quote.quote, author: quote.author });
    console.log(`This is the response in backend: ${quote}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ message: 'Failed to fetch quote' });
  }
});

// API to get data from the DATABASE
app.get('/workouts', (req, res) => {
  const query = 'SELECT * FROM workouts';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Register User (POST /register)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
    db.get(checkUserQuery, [username], async (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

      db.run(query, [username, hashedPassword], function (err) {
        if (err) {
          return res.status(400).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login User (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;

  db.get(query, [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  });
});
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  console.log('Authorization Header:', token); 
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  console.log('Authorization Header:', token);

  jwt.verify(bearerToken, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    console.log('Decoded Token:', decoded);
    req.user = decoded; 
    next();
  });
}


// Start Workout (POST)
app.post('/start-workout', authenticateToken, (req, res) => {
  const { workoutId } = req.body;
  const userId = req.user.id;
  console.log(userId)
  console.log(workoutId)
  const startTime = new Date().toISOString();
  console.log(`Starting workout: User ID = ${userId}, Workout ID = ${workoutId}, Start Time = ${startTime}`);
  db.run('INSERT INTO workout_sessions (user_id, workout_id, start_time) VALUES (?, ?, ?)',
    [userId, workoutId, startTime], function (err) {
      if (err) {
        return res.status(400).json({ message: 'Error starting workout' });
      }
      res.json({ sessionId: this.lastID });
    });
});




app.post("/end-workout", authenticateToken, async (req, res) => {
  const { sessionId } = req.body;

  console.log("Received Session ID:", sessionId);  // Check the received session ID

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "Session ID is required" });
  }

  try {
    const endTime = new Date().toISOString();
    console.log("End Time:", endTime);  // Log the end time

    // Update the workout session with the end time
    await db.run("UPDATE workout_sessions SET end_time = ? WHERE session_id = ?", [endTime, sessionId]);
   } catch (error) {
    console.error("Error during session update:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Most Frequent Workouts API - Using authenticateToken middleware
app.get('/most-frequent-workouts', authenticateToken, (req, res) => {
  const userId = req.user.id; // Get the user id from the decoded token

  const query = `
    SELECT workouts.workout_name, COUNT(workout_sessions.workout_id) AS workout_count
    FROM workout_sessions
    JOIN workouts ON workout_sessions.workout_id = workouts.workout_id
    WHERE workout_sessions.user_id = ?
    GROUP BY workout_sessions.workout_id
    ORDER BY workout_count DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving workouts' });
    }
    res.json(rows);
  });
  
});



// // User Progress (GET)
// app.get('/user-progress', authenticateToken, (req, res) => {
//   const userId = req.user.id;

//   db.all(`
//     SELECT w.workout_name, COUNT(ws.session_id) AS total_sessions,
//            AVG(STRFTIME('%s', ws.end_time) - STRFTIME('%s', ws.start_time)) AS avg_duration,
//            SUM(ws.calories_burned) AS total_calories
//     FROM workout_sessions ws
//     JOIN workouts w ON ws.workout_id = w.workout_id
//     WHERE ws.user_id = ?
//     GROUP BY ws.workout_id`, [userId], (err, rows) => {
//     if (err) return res.status(500).json({ message: 'Error retrieving progress' });
//     res.json({ progress: rows });
//   });
// });

// Start the server
app.listen(8000, () => {
  console.log('Server running on port 8000');
});
