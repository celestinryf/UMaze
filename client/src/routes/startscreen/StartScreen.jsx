// src/components/StartScreen.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartScreen.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';
import { setUsername, hasUsername, getDisplayUsername } from '../../context/api';
import clickSFX from '../../assets/click.mp3';

function StartScreen() {
  const navigate = useNavigate();
  const { playSFX } = useContext(AudioContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Check if user already has a username
    if (hasUsername()) {
      setCurrentUsername(getDisplayUsername());
      setShowButtons(true);
    }
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    
    if (!usernameInput.trim()) {
      alert('Please enter a username');
      return;
    }

    if (usernameInput.trim().length < 2) {
      alert('Username must be at least 2 characters long');
      return;
    }

    try {
      playSFX(clickSFX);
      setUsername(usernameInput.trim());
      setCurrentUsername(usernameInput.trim());
      setShowButtons(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNavClick = (path) => {
    playSFX(clickSFX);
    navigate(path);
  };

  const handleChangeUsername = () => {
    playSFX(clickSFX);
    setShowButtons(false);
    setUsernameInput('');
    setCurrentUsername('');
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

        {!showButtons ? (
          <div className={styles.usernameSection}>
            <h2 className={styles.usernamePrompt}>Enter Your Name, Adventurer</h2>
            <form onSubmit={handleUsernameSubmit} className={styles.usernameForm}>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Your username..."
                className={styles.usernameInput}
                maxLength={20}
                autoFocus
              />
              <button type="submit" className={styles.usernameButton}>
                BEGIN QUEST
              </button>
            </form>
            <p className={styles.usernameHint}>
              Choose a name that will strike fear into the hearts of monsters!
            </p>
          </div>
        ) : (
          <>
            <div className={styles.welcomeSection}>
              <h2 className={styles.welcomeText}>Welcome, {currentUsername}!</h2>
              <button 
                onClick={handleChangeUsername}
                className={styles.changeUsernameButton}
              >
                Change Name
              </button>
            </div>

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
          </>
        )}

        <div className={styles.gameFooter}>
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;