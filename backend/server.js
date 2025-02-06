const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db');
app.use(express.json())
 app.use(cors())
 app.use(bodyParser.json());  


app.get('/api/random-quote', async (req, res) => {
  try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      const quote = response.data;
      res.json({ text: quote.quote, author: quote.author });
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


 app.listen(port,()=>{
    console.log(`SERVER is up in ${port}`)
 })