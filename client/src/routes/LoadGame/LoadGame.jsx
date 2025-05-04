import React from 'react'
import GameCard from '../../components/GameCard/GameCard'

import "./index.css"

const LoadGame = () => {

    //games = api request

    let games = [
    {img: "placeholder",
     lastSave: "04-04-2024",
     hero: "Celestin",
     createdOn: "03-03-2025"
    },
    {img: "placeholder",
        lastSave: "04-04-2026",
        hero: "Nick",
        createdOn: "03-03-2025"
    },
    {img: "placeholder",
    lastSave: "04-04-2022",
    hero: "Primo",
    createdOn: "03-03-2025"
    },
    {img: "placeholder",
        lastSave: "04-04-2023",
        hero: "Matthew",
        createdOn: "03-03-2025"
    }]
    
  return (
    <div className='game-container-load'>
      <h1 className="game-title-load">Dungeon Maze</h1>
      <div className="load-game-container">
      {games.map(element => {
        return (
            <GameCard className="" key={element.lastSave} props={element} />
        )
      })}
      </div>
    </div>
  )
}

export default LoadGame
