import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import './App.css';

import StartScreen from './routes/startscreen/index.jsx';
import Play from './routes/play/index.jsx';
import HeroSelect from './routes/HeroSelect/index.jsx';
import LoadGames from './routes/loadgamescreen/index.jsx';
import Options from './routes/Options/Options.jsx';

function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/play" element={<Play />} />
            <Route path="/heroselect" element={<HeroSelect />} />
            <Route path="/menu" element={<LoadGames />} />
            <Route path="/options" element={<Options />} />
          </Routes>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
