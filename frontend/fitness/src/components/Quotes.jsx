import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles"; // Import useTheme to access current theme
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the refresh icon

function Quotes() {
  const [quote, setQuote] = useState(null);
  const [displayedText, setDisplayedText] = useState(""); // To track the typewriter effect for the quote
  const [authorText, setAuthorText] = useState(""); // To track the typewriter effect for the author
  const [isTypingQuote, setIsTypingQuote] = useState(false); // To handle quote typing state
  const [isTypingAuthor, setIsTypingAuthor] = useState(false); // To handle author typing state

  const theme = useTheme(); // Access current theme

  // Function to fetch a new quote and reset the typewriter effects
  const fetchQuote = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/random-quote");
      console.log('Fetched quote:', response.data); // Debugging log

      if (response.data && response.data.text) {
        setQuote(response.data); 
        setDisplayedText(""); 
        setAuthorText(""); 
        setIsTypingQuote(true); 
        setIsTypingAuthor(false); // Reset author typing state
      } else {
        console.error("Invalid quote data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  // Fetch a quote on component mount
  useEffect(() => {
    fetchQuote();
  }, []);

  // Typewriter effect for the quote
  useEffect(() => {
    if (quote && quote.text && isTypingQuote) {
      let index = 0;
      setDisplayedText(quote.text[0]); // Start with the first character immediately

      const interval = setInterval(() => {
        index += 1;
        setDisplayedText((prev) => prev + quote.text[index]);

        if (index === quote.text.length - 1) {
          clearInterval(interval); // Stop once the entire quote is typed
          setIsTypingQuote(false); // Stop quote typing effect
          if (quote.author) {
            setIsTypingAuthor(true); // Start typing effect for author after quote
          }
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [quote, isTypingQuote]);

  // Typewriter effect for the author
  useEffect(() => {
    if (quote && quote.author && isTypingAuthor) {
      let index = 0;
      setAuthorText(quote.author[0]); // Start with the first letter of the author

      const interval = setInterval(() => {
        index += 1;
        setAuthorText((prev) => prev + quote.author[index]);

        if (index === quote.author.length - 1) {
          clearInterval(interval); // Stop once the entire author's name is typed
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [quote, isTypingAuthor]);

  return (
    <div className="login-page">
      <div className="quote-container" style={{ 
        display: 'flex', // Apply flexbox layout
        alignItems: 'center', // Align items vertically
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
        justifyContent: 'space-between' // Ensure space between the quote text and refresh icon
      }}>
        <div className="quote" style={{ flexGrow: 1 }}>
          {quote ? (
            <>
              <span>{displayedText}</span>
              <br />
              {authorText && (
                <div className="author" style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                  - {authorText}
                </div>
              )}
            </>
          ) : (
            <div>Loading quote...</div>
          )}
        </div>
        
        {/* Refresh Icon positioned to the right of the quote */}
        <RefreshIcon
          style={{
            cursor: 'pointer',
            marginLeft: '10px', // Small space between text and icon
            alignSelf: 'center' // Ensure the icon is vertically centered
          }}
          onClick={fetchQuote} // Fetch a new quote when clicked
        />
      </div>
    </div>
  );
}

export default Quotes;
