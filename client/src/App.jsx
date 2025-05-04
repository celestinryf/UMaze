import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './routes/menu/menu.jsx'
import HeroSelect from './routes/HeroSelect/HeroSelect.jsx';
import StartScreen from './components/StartScreen/StartScreen.jsx';
import DifficultyMenu from './routes/DifficultyMenu/DifficultyMenu.jsx';
import LoadGame from './routes/LoadGame/LoadGame.jsx';
import SelectGame from './routes/SelectGame/SelectGame.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/select" element={<HeroSelect />} />
            <Route path="/menu/options" element={<DifficultyMenu />} />
            <Route path="/menu/load" element={<LoadGame />} />
            <Route path="/play" element={<SelectGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;