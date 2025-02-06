const express = require("express")
const app = express ()
const port = 8000
const cors = require("cors")
const axios = require("axios")
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db.js');
app.use(express.json())
 app.use(cors())
 app.use(bodyParser.json());  


 // API for Quotes :
 app.get('/api/random-quote', async (req, res) => {
    try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      const quote = response.data; 
      res.json({ text: quote.quote , author: quote.author }); 
      console.log(` this is res in backend ${quote}`)
      console.log(quote)
    } catch (error) {
      console.error('Error fetching quote:', error);
      res.status(500).json({ message: 'Failed to fetch quote' });
    }
  });

// API to get data from DATABASE :
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
    // Check if the user already exists
    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
    db.get(checkUserQuery, [username], async (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'Username already exists' });
      }
 
      // Hash the password before saving
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
  }})

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

app.get('/verify', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // User is authenticated
    return res.json({ message: 'Authenticated', userId: decoded.id });
  });
});



 app.listen(port,()=>{
    console.log(`SERVER is up in ${port}`)
 })