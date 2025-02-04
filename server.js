const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();


const app = express();
app.use(cors());
app.use(express.json());

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

// Register User
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

  db.run(query, [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Error registering user' });
    }
    res.status(201).json({ message: 'User registered' });
  });
});

// Login User
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
