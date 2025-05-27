import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StartScreen from './routes/startscreen/index.jsx';
import Play from './routes/play/index.jsx';
import HeroSelect from './routes/HeroSelect/index.jsx';
import LoadGames from './routes/loadgamescreen/index.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/play" element={<Play />} />
            <Route path="/heroselect" element={<HeroSelect />} />
            <Route path="/play" element={<div>This will take you to the gameplay.. eventually</div>} />
            <Route path="/menu" element={<LoadGames />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;