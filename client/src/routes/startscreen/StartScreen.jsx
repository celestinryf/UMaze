const handleInputChange = (e) => {
  const newValue = e.target.value;
  setUsernameInput(newValue);
  
  // Clear validation status when user changes input
  if (validationStatus.type !== 'idle') {
    setValidationStatus({ isChecking: false, message: '', isValid: false, type: 'idle' });
  }
};// src/components/StartScreen.jsx
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

// Simplified validation hook - only for button click validation
function useUsernameValidation() {
const [status, setStatus] = useState({
  isChecking: false,
  message: '',
  isValid: false,
  type: 'idle' // 'idle', 'error', 'success', 'checking'
});

// Direct status setter for button click validation
const setValidationStatus = (newStatus) => {
  setStatus(newStatus);
};

return { status, setValidationStatus };
}

function StartScreen() {
const navigate = useNavigate();
const { playSFX } = useContext(AudioContext);
const [usernameInput, setUsernameInput] = useState('');
const [currentUsername, setCurrentUsername] = useState('');
const [showButtons, setShowButtons] = useState(false);
const { status: validationStatus, setValidationStatus } = useUsernameValidation();

useEffect(() => {
  // Check if user already has a username
  if (hasUsername()) {
    setCurrentUsername(getDisplayUsername());
    setShowButtons(true);
  }
  
  // Test if API function exists
  console.log('🔧 API function test:', {
    checkUsernameAvailability: typeof checkUsernameAvailability,
    hasUsername: typeof hasUsername,
    setUsername: typeof setUsername
  });
}, []);

// No automatic validation - only on button click
// (Removed the useEffect that was calling validateUsername on every keystroke)

const handleUsernameSubmit = async (e) => {
  e.preventDefault();
  console.log('🔥 BUTTON CLICKED! Username:', usernameInput.trim());
  
  if (!usernameInput.trim()) {
    console.log('❌ No username entered');
    alert('Please enter a username');
    return;
  }

  // Format validation first (synchronous)
  console.log('🔍 Checking format...');
  const formatError = UsernameValidator.validateFormat(usernameInput.trim());
  if (formatError) {
    console.log('❌ Format error:', formatError);
    setValidationStatus({ isChecking: false, message: formatError, isValid: false, type: 'error' });
    return;
  }

  // If already validated and valid, proceed
  if (validationStatus.isValid && validationStatus.type === 'success') {
    console.log('✅ Already valid, proceeding to game...');
    try {
      playSFX(clickSFX);
      setUsername(usernameInput.trim());
      setCurrentUsername(usernameInput.trim());
      setShowButtons(true);
    } catch (error) {
      alert(error.message);
    }
    return;
  }

  // Need to check availability - do it here synchronously
  console.log('🌐 Starting availability check...');
  setValidationStatus({ isChecking: true, message: 'Checking availability...', isValid: false, type: 'checking' });
  
  console.log('🌐 Set status to checking, now calling API...');
  
  try {
    console.log('🌐 About to call checkUsernameAvailability...');
    const availabilityError = await UsernameValidator.checkAvailability(usernameInput.trim());
    console.log('🌐 API call completed. Result:', { availabilityError });
    
    if (availabilityError) {
      // Set error state and stop here
      console.log('❌ Username taken, setting error state...');
      setValidationStatus({ isChecking: false, message: availabilityError, isValid: false, type: 'error' });
      console.log('❌ Error state set');
      return;
    } else {
      // Username is available
      console.log('✅ Username available, setting success state...');
      setValidationStatus({ isChecking: false, message: '✓ Username is available!', isValid: true, type: 'success' });
      console.log('✅ Success state set');
      return;
    }
  } catch (error) {
    console.error('💥 ERROR during validation:', error);
    setValidationStatus({ isChecking: false, message: 'Error checking username. Please try again.', isValid: false, type: 'error' });
    return;
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

const getInputClassName = () => {
  let className = styles.usernameInput;
  
  // Only show visual feedback based on current validation status
  // Don't do any validation here - just display the current state
  if (validationStatus.type === 'error') className += ` ${styles.inputError}`;
  if (validationStatus.type === 'success') className += ` ${styles.inputSuccess}`;
  
  return className;
};

const getStatusMessage = () => {
  if (!validationStatus.message) return null;
  
  return (
    <div className={`${styles.statusMessage} ${styles[validationStatus.type]}`}>
      {validationStatus.isChecking && <span className={styles.spinner}></span>}
      <span>{validationStatus.message}</span>
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
              onChange={handleInputChange}
              placeholder="Your username..."
              className={getInputClassName()}
              maxLength={UsernameValidator.MAX_LENGTH}
              autoFocus
            />
            
            {getStatusMessage()}
            
            <button 
              type="submit" 
              className={styles.usernameButton}
              disabled={!usernameInput.trim() || validationStatus.type === 'error' || validationStatus.isChecking}
            >
              {validationStatus.isValid ? 'BEGIN QUEST' : 
               validationStatus.type === 'checking' ? 'CHECKING...' :
               validationStatus.type === 'error' ? 'FIX USERNAME FIRST' :
               'CHECK & START'}
            </button>
          </form>
          
          {getUsernameGuidelines()}
          
          <p className={styles.usernameHint}>
            Choose a name that will strike fear into the hearts of monsters!<br/>
            <small style={{opacity: 0.8}}>Click the button to check if your username is available</small>
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