import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' for React 18+
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import Stats from './components/Stats'
import App from './App';
import NavBar from './NavBar.jsx'
import reportWebVitals from './reportWebVitals';





const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router> {/* Wrap the app with BrowserRouter */}
    
    < NavBar />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="Workouts" element={<Workouts />} />
      <Route path="Stats" element={<Stats />} />
    </Routes>

  </Router>
);

reportWebVitals();

