import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import VolumeMenu from './components/VolumeOptions/VolumeMenu';
import './App.css';

import StartScreen from './routes/startscreen/index.jsx';
import Play from './routes/play/index.jsx';
import HeroSelect from './routes/HeroSelect/index.jsx';
import LoadGames from './routes/loadgamescreen/index.jsx';
import Options from './routes/Options/index.jsx';

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
