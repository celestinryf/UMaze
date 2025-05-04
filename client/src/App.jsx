import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './routes/menu/menu.jsx'
import HeroSelect from './routes/HeroSelect/HeroSelect.jsx';
import StartScreen from './StartScreen';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/select" element={<HeroSelect />} />
            <Route path="/play" element={<div>This will take you to the gameplay.. eventually</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;