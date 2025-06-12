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
  const [usernameTaken, setUsernameTaken] = useState(false); // NEW: Track if username is taken
  const [acknowledgedTaken, setAcknowledgedTaken] = useState(false); // NEW: Track if user acknowledged
  const [validationStatus, setValidationStatus] = useState({
    isChecking: false,
    message: '',
    isValid: false,
    type: 'idle' // 'idle', 'error', 'success', 'checking', 'warning'
  });

  useEffect(() => {
    // Check if user already has a username
    if (hasUsername()) {
      setCurrentUsername(getDisplayUsername());
      setShowButtons(true);
    }
  }, []);

  // Clear validation status when user types
  useEffect(() => {
    if (validationStatus.type !== 'idle') {
      setValidationStatus({
        isChecking: false,
        message: '',
        isValid: false,
        type: 'idle'
      });
    }
    // Reset taken states when user changes input
    setUsernameTaken(false);
    setAcknowledgedTaken(false);
  }, [usernameInput]);

  const validateUsername = async (username) => {
    if (!username.trim()) {
      setValidationStatus({ 
        isChecking: false, 
        message: 'Please enter a username', 
        isValid: false, 
        type: 'error' 
      });
      return { isValid: false, isTaken: false };
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
      return { isValid: false, isTaken: false };
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
        type: 'warning'
      });
      return { isValid: false, isTaken: true };
    } else {
      setValidationStatus({ 
        isChecking: false, 
        message: 'Username is available!', 
        isValid: true, 
        type: 'success' 
      });
      return { isValid: true, isTaken: false };
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    
    // If username is taken and user clicks button, they want to proceed
    if (usernameTaken) {
      // User is clicking "PROCEED ANYWAY" - skip all validation and proceed
      try {
        playSFX(clickSFX);
        const finalUsername = usernameInput.trim();
        
        setUsername(finalUsername);
        setCurrentUsername(finalUsername);
        setShowButtons(true);
        setValidationStatus({
          isChecking: false,
          message: '',
          isValid: false,
          type: 'idle'
        });
        return;
      } catch (error) {
        setValidationStatus({ 
          isChecking: false, 
          message: error.message || 'Error setting username', 
          isValid: false, 
          type: 'error' 
        });
        return;
      }
    }
    
    // Normal flow - validate username
    const validation = await validateUsername(usernameInput.trim());
    
    // Handle validation results
    if (!validation.isValid && !validation.isTaken) {
      // Format error - stay on form
      return;
    }
    
    if (validation.isTaken) {
      // Username taken - show warning and change button to "PROCEED ANYWAY"
      setUsernameTaken(true);
      setValidationStatus({
        isChecking: false,
        message: 'Username is already taken. Click "PROCEED ANYWAY" to continue with this name.',
        isValid: false,
        type: 'warning'
      });
      return;
    }

    // Username is available - proceed
    try {
      playSFX(clickSFX);
      const finalUsername = usernameInput.trim();
      
      setUsername(finalUsername);
      setCurrentUsername(finalUsername);
      setShowButtons(true);
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
    setUsernameTaken(false);
    setAcknowledgedTaken(false);
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
    if (validationStatus.type === 'warning') className += ` ${styles.inputWarning}`;
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

  const getButtonText = () => {
    if (validationStatus.isChecking) return 'CHECKING...';
    if (usernameTaken && !acknowledgedTaken) return 'PROCEED ANYWAY';
    return 'BEGIN QUEST';
  };

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
                {getButtonText()}
              </button>
            </form>
            
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