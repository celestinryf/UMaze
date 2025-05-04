// src/components/StartScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './StartScreen.css';

function HomePage() {
  return (
    <div className="game-container">
      <div className="game-start-screen">
        <h1 className="game-title">Dungeon Maze</h1>
        
        <div className="game-buttons">
          <Link to="/play" className="game-button">PLAY GAME</Link>
          <Link to="/menu" className="game-button">MENU</Link>
          <Link to="/menu/options" className="game-button">OPTIONS</Link>
        </div>
        
        <div className="game-footer">
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;