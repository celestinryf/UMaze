// src/components/StartScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartScreen.module.css';

function StartScreen() {
  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameStartScreen}>
        <h1 className={styles.gameTitle}>Dungeon Maze</h1>
        
        <div className={styles.gameButtons}>
          <Link to="/heroselect" className={styles.gameButton}>NEW GAME</Link>
          <Link to="/menu" className={styles.gameButton}>LOAD GAME</Link>
          <button className={styles.gameButton}>OPTIONS</button>
        </div>
        
        <div className={styles.gameFooter}>
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;