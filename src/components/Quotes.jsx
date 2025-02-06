import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles"; // Import useTheme to access current theme

function Quotes() {
  const [quote, setQuote] = useState(null);
  const [displayedText, setDisplayedText] = useState(""); // To track the typewriter effect for the quote
  const [authorText, setAuthorText] = useState(""); // To track the typewriter effect for the author
  const [isTypingQuote, setIsTypingQuote] = useState(false); // To handle quote typing state
  const [isTypingAuthor, setIsTypingAuthor] = useState(false); // To handle author typing state

  const theme = useTheme(); // Access current theme

  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/random-quote");
        console.log('Fetched quote:', response.data); // Debugging log

        if (isMounted && response.data && response.data.text) {
          setQuote(response.data); 
          setDisplayedText(""); 
          setAuthorText(""); 
          setIsTypingQuote(true); 
        } else {
          console.error("Invalid quote data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchQuote();

    // Cleanup to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Fetch quote only once on component mount

  useEffect(() => {
    // Typewriter effect for the quote
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
      }, 60); 
      
      return () => clearInterval(interval);
    }
  }, [quote, isTypingQuote]);

  useEffect(() => {
    // Typewriter effect for the author
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
      <div className="quote" style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
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
    </div>
  );
}

export default Quotes;
