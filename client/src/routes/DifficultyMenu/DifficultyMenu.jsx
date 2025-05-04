import React from 'react'
import { Link } from 'react-router-dom'

const DifficultyMenu = () => {
  return (
    <div>
      <div className="game-container">
      <div className="game-start-screen">
        <h1 className="game-title">Dungeon Maze</h1>
        
        <div className="game-buttons">
          <button className="game-button">EASY</button>
          <button className="game-button">MEDIUM</button>
          <button className="game-button">HARD</button>
          <button className="game-button">EXTREME</button>
          <Link to="/"className="game-button">BACK</Link>
        </div>
    
        <div className="game-footer">
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default DifficultyMenu
