const express = require("express")
const app = express ()
const port = 8000
const cors = require("cors")
const axios = require("axios")
const bodyParser = require('body-parser'); 

const My_APIkey ="avw1EWKRNMTf6rfZaenENLPB0JrjCbrMm6peowyM"
// const API_url = `https://api.api-ninjas.com/exercises?difficulty=${difficulty}`
 
app.use(express.json())
 app.use(cors())
 app.use(bodyParser.json());  // To parse JSON


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


 app.listen(port,()=>{
    console.log(`SERVER is up in ${port}`)
 })