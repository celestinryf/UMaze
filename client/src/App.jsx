import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StartScreen from './routes/startscreen/StartScreen.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/game" element={<div>This will take you to the gameplay.. eventually</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;