const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 

const app = express();
app.use(cors());
app.use(express.json());

const My_APIkey ="avw1EWKRNMTf6rfZaenENLPB0JrjCbrMm6peowyM"


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




//API for exercises  WE MUST USE ANOTHER API  :
app.post("/exercises", async(req,res)=>{
    const { difficulty } = req.body; 
    console.log(`Requested difficulty: ${difficulty}`);
    const response = await axios.get(`https://api.api-ninjas.com/exercises?difficulty=${difficulty}`, {
        headers: {
          'X-Api-Key': "avw1EWKRNMTf6rfZaenENLPB0JrjCbrMm6peowyM",
        }})

        
  
    try {
      // Log the response for debugging purposes
      console.log('API Response Data:', response.data);
  
      // Send the response data to the client
      res.send(JSON.stringify(response.data));
      }
  
      
     catch (error) {
      // Handle errors
      if (error.response) {
        // If the error is from the API call (like a 400 or 500 status)
        console.error('API Error:', error.response.data);
        res.status(error.response.status).json({ error: error.response.data });
      } else {
        // Handle other errors (network error, etc.)
        console.error('General Error:', error.message);
        res.status(500).json({ error: error.message });
      }
    }
  });


// Connect to SQLite Database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Database opening error: ' + err.message);
  }
});

// Create Users Table (if it doesn't exist)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

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


// Start the server
app.listen(8000, () => {
  console.log('Server running on port 8000');
});
