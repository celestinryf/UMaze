import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './options.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';
import clickSFX from '../../assets/click.mp3';

function Options() {
  const navigate = useNavigate();
  const {
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    playSFX
  } = useContext(AudioContext);

  const handleBackClick = () => {
    playSFX(clickSFX);
    navigate('/');
  };

  return (
    <div
      className={styles.optionsContainer}
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >
      <h1 className={styles.title}>Game Settings</h1>

      <div className={styles.settingsCard}>
        <div className={styles.settingGroup}>
          <label htmlFor="musicVolume">Music Volume: {musicVolume}</label>
          <input
            id="musicVolume"
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.settingGroup}>
          <label htmlFor="sfxVolume">SFX Volume: {sfxVolume}</label>
          <input
            id="sfxVolume"
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.settingGroup}>
          <label>Difficulty</label>
          <select className={styles.dropdown}>
            <option>Easy</option>
            <option>Normal</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <button
        className={styles.backButton}
        onClick={handleBackClick}
      >
        ← Back to Main Menu
      </button>
    </div>
  );
}

export default Options;
