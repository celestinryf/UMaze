// src/components/StartScreen.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartScreen.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';
import clickSFX from '../../assets/click.mp3';

function StartScreen() {
  const navigate = useNavigate();
  const { playSFX } = useContext(AudioContext);
  const [username, setUsername] = useState('');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [targetPath, setTargetPath] = useState('');

  useEffect(() => {
    // Check if username exists in sessionStorage
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleNavClick = (path) => {
    playSFX(clickSFX);
    
    // Check if username exists
    if (!username) {
      setShowUsernamePrompt(true);
      setTargetPath(path);
    } else {
      navigate(path);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      sessionStorage.setItem('username', username.trim());
      setShowUsernamePrompt(false);
      navigate(targetPath);
    }
  };

  const handleChangeUser = () => {
    playSFX(clickSFX);
    sessionStorage.removeItem('username');
    setUsername('');
    setShowUsernamePrompt(true);
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

        {username && !showUsernamePrompt && (
          <div className={styles.welcomeMessage}>
            <p>Welcome back, <span className={styles.username}>{username}</span>!</p>
            <button 
              className={styles.changeUserBtn} 
              onClick={handleChangeUser}
            >
              Change User
            </button>
          </div>
        )}

        {showUsernamePrompt ? (
          <form onSubmit={handleUsernameSubmit} className={styles.usernameForm}>
            <h2>Enter Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className={styles.usernameInput}
              autoFocus
              maxLength={20}
            />
            <div className={styles.formButtons}>
              <button type="submit" className={styles.gameButton}>
                Continue
              </button>
              {sessionStorage.getItem('username') && (
                <button 
                  type="button" 
                  className={styles.gameButton}
                  onClick={() => {
                    setUsername(sessionStorage.getItem('username'));
                    setShowUsernamePrompt(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
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
        )}

        <div className={styles.gameFooter}>
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;