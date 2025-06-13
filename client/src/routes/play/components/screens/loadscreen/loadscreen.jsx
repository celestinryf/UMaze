import React from 'react';
import styles from './loadscreen.module.css';

const LoadingScreen = ({ 
  username, 
  onTitleClick, 
  backgroundImage,
  message = "Loading Maze...",
  title = "Maze Adventure"
}) => {
  return (
    <div 
      className={styles.loadingContainer}
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
      <h2>{message}</h2>
      {username && <p>Player: {username}</p>}
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default LoadingScreen;