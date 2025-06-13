import React from 'react';
import styles from './errorscreen.module.css';

const ErrorScreen = ({ 
  error, 
  onTitleClick, 
  onStartNewGame, 
  onBackToHome, 
  backgroundImage,
  title = "Maze Adventure" 
}) => {
  return (
    <div 
      className={styles.errorContainer}
      style={{ '--background-image': `url(${backgroundImage})` }}
    >
      <h1 
        className={styles.gameTitle}
        onClick={onTitleClick}
        style={{ cursor: 'pointer' }}
        title="Return to Home"
      >
        {title}
      </h1>
      <h2>Error</h2>
      <p className={styles.errorMessage}>{error}</p>
      <div className={styles.buttonGroup}>
        <button onClick={onStartNewGame} className={styles.retryButton}>
          Start New Game
        </button>
        <button onClick={onBackToHome} className={styles.retryButton}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;