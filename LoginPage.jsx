// API call for quotes in react 
import React, { useState, useEffect } from "react";
import axios from "axios";

function LoginPage() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuote = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/random-quote");
        if (isMounted) {
          setQuote(response.data);
          console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchQuote();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="login-page">
      <div className="quote">
        {quote && (
          <>
            <p>"{quote.text}"</p>
            {quote.author && <small>- {quote.author}</small>}
          </>
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