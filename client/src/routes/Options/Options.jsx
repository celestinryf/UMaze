import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Options.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';

function Options() {
  const navigate = useNavigate();
  const { volume, setVolume } = useContext(AudioContext);

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
          <label htmlFor="volume">Volume: {volume}</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
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
        onClick={() => navigate('/')}
      >
        ← Back to Main Menu
      </button>
    </div>
  );
}

export default Options;
