import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function LoginPage() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  // useRef to track if the quote has been fetched
  const hasFetched = useRef(false);

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Check if the quote has already been fetched to avoid refetching
    if (hasFetched.current) return;

    const fetchQuote = async () => {
      try {
        // Make a request to the backend
        const response = await axios.get('http://localhost:8000/api/random-quote');
        setQuote(response.data); // Set the fetched quote
        hasFetched.current = true; // Mark as fetched to prevent future requests
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote({ text: 'Failed to load quote', author: 'Unknown' });
      }
    };

    fetchQuote(); // Call the fetch function

    // No dependencies, so this effect runs only once on mount
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div className="login-page">
      <div className="quote">
        {quote.text ? (
          <>
            <p>"{quote.text}"</p>
            <small>- {quote.author}</small>
          </>
        ) : (
          <p>Loading...</p> // Show loading until the quote is fetched
        )}
      </div>

      <div className="login-form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
