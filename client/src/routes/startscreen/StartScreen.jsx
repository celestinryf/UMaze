// src/components/StartScreen.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartScreen.module.css';
import backgroundImg from '../../assets/background.jpg';
import { AudioContext } from '../../context/AudioContext';
import { setUsername, hasUsername, getDisplayUsername, checkUsernameAvailability } from '../../context/api';
import clickSFX from '../../assets/click.mp3';

// Username validation utility class
class UsernameValidator {
  static MIN_LENGTH = 3;
  static MAX_LENGTH = 20;

  static validateFormat(username) {
    if (!username || username.length < this.MIN_LENGTH) {
      return `Username must be at least ${this.MIN_LENGTH} characters`;
    }
    if (username.length > this.MAX_LENGTH) {
      return `Username must be ${this.MAX_LENGTH} characters or less`;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    if (/^[_-]/.test(username) || /[_-]$/.test(username)) {
      return 'Username cannot start or end with underscore or hyphen';
    }
    return null;
  }

  static async checkAvailability(username) {
    try {
      const result = await checkUsernameAvailability(username);
      return result.available ? null : 'Username is already taken';
    } catch (error) {
      console.error('Error checking username availability:', error);
      return 'Error checking username. Please try again.';
    }
  }
}

function StartScreen() {
  const navigate = useNavigate();
  const { playSFX } = useContext(AudioContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    isChecking: false,
    message: '',
    isValid: false,
    type: 'idle' // 'idle', 'error', 'success', 'checking'
  });

  useEffect(() => {
    // Check if user already has a username
    if (hasUsername()) {
      setCurrentUsername(getDisplayUsername());
      setShowButtons(true);
    }
  }, []);

  // Clear validation status when user types (optional - keeps UI clean)
  useEffect(() => {
    if (validationStatus.type !== 'idle') {
      setValidationStatus({
        isChecking: false,
        message: '',
        isValid: false,
        type: 'idle'
      });
    }
  }, [usernameInput]);

  const validateUsername = async (username) => {
    if (!username.trim()) {
      setValidationStatus({ 
        isChecking: false, 
        message: 'Please enter a username', 
        isValid: false, 
        type: 'error' 
      });
      return false;
    }

    // Format validation first
    const formatError = UsernameValidator.validateFormat(username);
    if (formatError) {
      setValidationStatus({ 
        isChecking: false, 
        message: formatError, 
        isValid: false, 
        type: 'error' 
      });
      return false;
    }

    // Availability check
    setValidationStatus({ 
      isChecking: true, 
      message: 'Checking availability...', 
      isValid: false, 
      type: 'checking' 
    });
    
    const availabilityError = await UsernameValidator.checkAvailability(username);
    if (availabilityError) {
      setValidationStatus({ 
        isChecking: false, 
        message: availabilityError, 
        isValid: false, 
        type: 'error' 
      });
      return false;
    } else {
      setValidationStatus({ 
        isChecking: false, 
        message: '✓ Username is available!', 
        isValid: true, 
        type: 'success' 
      });
      return true;
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    
    // Validate username
    const isValid = await validateUsername(usernameInput.trim());
    
    if (!isValid) {
      // Error message is already set by validateUsername
      return;
    }

    try {
      playSFX(clickSFX);
      setUsername(usernameInput.trim());
      setCurrentUsername(usernameInput.trim());
      setShowButtons(true);
      // Clear the validation status when successful
      setValidationStatus({
        isChecking: false,
        message: '',
        isValid: false,
        type: 'idle'
      });
    } catch (error) {
      setValidationStatus({ 
        isChecking: false, 
        message: error.message || 'Error setting username', 
        isValid: false, 
        type: 'error' 
      });
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
    setValidationStatus({
      isChecking: false,
      message: '',
      isValid: false,
      type: 'idle'
    });
  };

  const getInputClassName = () => {
    let className = styles.usernameInput;
    if (validationStatus.type === 'error') className += ` ${styles.inputError}`;
    if (validationStatus.type === 'success') className += ` ${styles.inputSuccess}`;
    return className;
  };

  const getStatusMessage = () => {
    if (!validationStatus.message) return null;
    
    return (
      <div className={`${styles.statusMessage} ${styles[validationStatus.type]}`}>
        {validationStatus.isChecking && <span className={styles.spinner}></span>}
        {validationStatus.message}
      </div>
    );
  };

  const getUsernameGuidelines = () => (
    <div className={styles.usernameGuidelines}>
      <strong>Username Requirements:</strong>
      <ul>
        <li>{UsernameValidator.MIN_LENGTH}-{UsernameValidator.MAX_LENGTH} characters long</li>
        <li>Letters, numbers, hyphens (-), and underscores (_) only</li>
        <li>Cannot start or end with hyphen or underscore</li>
        <li>Must be unique</li>
      </ul>
    </div>
  );

  return (
    <div
      className={styles.gameContainer}
      style={{ '--background-image': `url(${backgroundImg})` }}
    >
      <div className={styles.gameStartScreen}>
        <h1 className={styles.gameTitle}>CHARLIE THE UNICORN</h1>
        <div className={styles.titleUnderline}></div>

        {!showButtons ? (
          <div className={styles.usernameSection}>
            <h2 className={styles.usernamePrompt}>Enter Your Name, Adventurer</h2>
            <form onSubmit={handleUsernameSubmit} className={styles.usernameForm}>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Your username..."
                className={getInputClassName()}
                maxLength={UsernameValidator.MAX_LENGTH}
                autoFocus
              />
              
              {getStatusMessage()}
              
              <button 
                type="submit" 
                className={styles.usernameButton}
                disabled={validationStatus.isChecking}
              >
                {validationStatus.isChecking ? 'CHECKING...' : 'BEGIN QUEST'}
              </button>
            </form>
            
            {getUsernameGuidelines()}
            
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