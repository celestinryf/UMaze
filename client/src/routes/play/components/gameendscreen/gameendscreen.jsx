import React from 'react';
import styles from './gameendscreen.module.css';
import horse from '../../../../assets/sprites/horse.png';
import background from '../../../../assets/background.jpg';

const GameEndScreen = ({ status, message, navigate }) => {
  if (status === 'Won') {
    return (
      <div 
        className={styles.endgameContainer}
        style={{ '--background-image': `url(${background})` }}
      >
        {/* Main content area with horse and message */}
        <div className={styles.wonContentArea}>
          
          <div className={styles.horseContainer}>
            <img 
              src={horse} 
              alt="Victory Horse" 
              className={styles.victoryHorse}
            />
          </div>
          
          <div className={styles.victoryMessage}>
            <p>Thank you, brave adventurer.</p>
            <p>You have successfully collected everything I need to escape the treacherous forest!</p>
          </div>
        </div>

        {/* Buttons at very bottom */}
        <div className={styles.endgameButtons}>
          <button onClick={() => navigate('/heroselect')} className={styles.retryButton}>
            Start New Game
          </button>
          <button onClick={() => navigate('/')} className={styles.retryButton}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Original layout for Lost status
  return (
    <div 
      className={styles.endgameContainer}
      style={{ '--background-image': `url(${background})` }}
    >
      <h1 
        className={styles.gameTitle}
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
        title="Return to Home"
      >
        Maze Adventure
      </h1>
      <h2 className={styles.lostMessage}>
        💀 Game Over 💀
      </h2>
      <p>{message}</p>
      <div className={styles.endgameButtons}>
        <button onClick={() => navigate('/heroselect')} className={styles.retryButton}>
          Start New Game
        </button>
        <button onClick={() => navigate('/')} className={styles.retryButton}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default GameEndScreen;