// src/components/StartScreen.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartScreen.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';
import clickSFX from '../../assets/click.mp3';

function StartScreen() {
  const navigate = useNavigate();
  const { playSFX } = useContext(AudioContext);

  const handleNavClick = (path) => {
    playSFX(clickSFX);
    navigate(path);
  };

  return (
    <div
      className={styles.gameContainer}
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className={styles.gameStartScreen}>
        <h1 className={styles.gameTitle}>Dungeon Maze</h1>

        <div className={styles.gameButtons}>
          <button className={styles.gameButton} onClick={() => handleNavClick('/heroselect')}>
            NEW GAME
          </button>
          <button className={styles.gameButton} onClick={() => handleNavClick('/menu')}>
            LOAD GAME
          </button>
          <button className={styles.gameButton} onClick={() => handleNavClick('/options')}>
            OPTIONS
          </button>
        </div>

        <div className={styles.gameFooter}>
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
