import React, { useContext, useState } from 'react';
import { AudioContext } from '../../context/AudioContext';
import './VolumeMenu.css';

function VolumeMenu() {
  const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useContext(AudioContext);
  const [myOpen, setMyOpen] = useState(false);

  const handleMusicVolumeChange = (finalTheEvent) => {
    const theValue = Number(finalTheEvent.target.value);
    if (Number.isNaN(theValue) || theValue < 0 || theValue > 100) {
      throw new IllegalArgumentException('Invalid music volume: must be between 0 and 100');
    }
    setMusicVolume(theValue);
  };

  const handleSFXVolumeChange = (finalTheEvent) => {
    const theValue = Number(finalTheEvent.target.value);
    if (Number.isNaN(theValue) || theValue < 0 || theValue > 100) {
      throw new IllegalArgumentException('Invalid SFX volume: must be between 0 and 100');
    }
    setSfxVolume(theValue);
  };

  return (
    <div className="myVolumeWidget">
      <button
        className="myVolumeToggle"
        onClick={() => setMyOpen(!myOpen)}
      >
        ⚙️
      </button>

      {myOpen && (
        <div className="myVolumeMenu">
          <label>Music Volume: {musicVolume}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={handleMusicVolumeChange}
          />

          <label>Sound Effects Volume: {sfxVolume}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSFXVolumeChange}
          />
        </div>
      )}
    </div>
  );
}

export default VolumeMenu;
