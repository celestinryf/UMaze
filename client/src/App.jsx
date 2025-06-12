import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import VolumeMenu from './components/VolumeOptions/VolumeMenu';
import './App.css';
import { Analytics } from "@vercel/analytics/react"

import StartScreen from './routes/startscreen/StartScreen.jsx';
import Play from './routes/play/Play.jsx';
import HeroSelect from './routes/HeroSelect/HeroSelect.jsx';
import LoadGames from './routes/loadgamescreen/LoadGameScreen.jsx';
import Options from './routes/Options/Options.jsx';

function AppContent() {
  const location = useLocation();

  // Hide gear menu on Start Screen and Options screen
  const hideVolumeMenuOn = ['/', '/options'];
  const showVolumeMenu = !hideVolumeMenuOn.includes(location.pathname);

  return (
    <>
      {showVolumeMenu && <VolumeMenu />}
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/play" element={<Play />} />
        <Route path="/heroselect" element={<HeroSelect />} />
        <Route path="/menu" element={<LoadGames />} />
        <Route path="/options" element={<Options />} />
      </Routes>
      <Analytics />
    </>
  );
}

function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;