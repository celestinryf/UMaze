import React from 'react'
import { Link } from 'react-router-dom'

const SelectGame = () => {
  return (
    <div>
      <div className="game-container">
      <div className="game-start-screen">
        <h1 className="game-title">Dungeon Maze</h1>
        
        <div className="game-buttons">
        {/* takes to new game */}
          <Link to="/" className="game-button">NEW GAME</Link>
          <Link to="/menu/load" className="game-button">LOAD GAME</Link> 
        </div>
    
        <div className="game-footer">
          <p>© 360 DEGREE RED</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SelectGame
