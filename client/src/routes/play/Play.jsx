import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gameAPI, saveLoadAPI, hasUsername, getDisplayUsername } from '../../context/api.js';
import styles from './play.module.css';
import Sidebar from './components/sidebar/sidebar.jsx';
import BattleOverlay from './components/battle/battle.jsx';
import GameEndScreen from './components/gameendscreen/gameendscreen.jsx';
import MazeGrid from './components/mazegrid/mazegrid.jsx';

import horse from '../../assets/sprites/horse.png';
import path from '../../assets/sprites/path.png';
import background from '../../assets/background.jpg';

// Constants
const ROOM_TYPES = {
  "Wall": 'Wall',
  "Entrance": 'Entrance',
  "Exit": 'Exit',
  "Path": 'Path',
  "Poop": 'Poop'
};

const POTION_TYPES = {
  "Health": 'Health Buzz Ball',
  "Attack": 'Attack Buzz Ball'
};

// Extended directions to include both arrow keys and WASD
const DIRECTIONS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  w: [-1, 0],
  W: [-1, 0],
  s: [1, 0],
  S: [1, 0],
  a: [0, -1],
  A: [0, -1],
  d: [0, 1],
  D: [0, 1]
};

// Utility functions
const getName = (type, mapping) => mapping[type] || 'Unknown';

// Reusable Components
const HealthBar = ({ current, total, label, showLabel = true, className = '' }) => (
  <div className={`${styles.statItem} ${className}`}>
    <div className={styles.healthBar}>
      <div
        className={styles.healthFill}
        style={{ width: `${(current / total) * 100}%` }}
      />
      <span className={styles.healthText}>
        {showLabel && `${label}: `}{current} / {total}
      </span>
    </div>
  </div>
);

const Play = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [bypassGameOver, setBypassGameOver] = useState(false);
  const [gName, setgName] = useState("");
  const [gMessage, setGMessage] = useState("");
  const [inBattle, setInBattle] = useState(false);
  const [battleMessage, setBattleMessage] = useState("");
  const [visitedPits, setVisitedPits] = useState(new Set());
  const [visitedExits, setVisitedExits] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);

  // Get username from API service
  const username = hasUsername() ? getDisplayUsername() : null;

  // Check for username and redirect if not found
  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  // Fetch game data on mount
  useEffect(() => {
    if (!username) return;
    
    gameAPI.getGame()
      .then(data => {
        setGameData(data);
        
        // Check if current room is an exit and mark it as visited
        const currentX = data.Maze.CurrCoords.X;
        const currentY = data.Maze.CurrCoords.Y;
        const currentRoom = data?.Maze?.Grid?.[currentX]?.[currentY];
        
        if (currentRoom?.RoomType === "Entrance") {
          setVisitedExits(prev => new Set(prev).add(`${currentX}-${currentY}`));
        }
        
        // Check if we should be in battle on load
        if (currentRoom?.RoomMonster) {
          setInBattle(true);
          setBattleMessage(`A wild ${currentRoom.RoomMonster.Name} appears!`);
        }
      })
      .catch(err => {
        if (err.message.includes('404')) {
          // No active game found, might need to start a new one
          setError('No active game found. Please start a new game.');
        } else {
          setError(`Failed to fetch game state: ${err.message}`);
        }
      });
  }, [username]);

  // Auto-save game every 30 seconds
  useEffect(() => {
    if (!gameData || !username) return;
    
    const autoSaveInterval = setInterval(() => {
      // Game is automatically saved to Redis on every action
      // This is just a reminder that the game is being saved
      console.log('Game auto-saved to cloud');
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [gameData, username]);

  // Game actions
  const saveGame = async () => {
    try {
      await saveLoadAPI.saveGame(gName);
      setgName("");
      setGMessage('Game saved successfully!');
    } catch (err) {
      setGMessage(`Error saving game: ${err.message}`);
    }
  };

  const attackMonster = async (isSpecial) => {
    try {
      const result = await gameAPI.attack(isSpecial);
      setGameData(result);
      
      const monster = result?.Maze?.Grid?.[result.Maze.CurrCoords.X]?.[result.Maze.CurrCoords.Y]?.RoomMonster;
      const attackType = isSpecial ? 'special attack' : 'attack';
      
      if (monster) {
        setBattleMessage(`You used ${attackType}! Monster HP: ${monster.CurrHealth}`);
      } else {
        setBattleMessage(`Your ${attackType} defeated the monster!`);
        // Automatically exit battle after a short delay when monster is defeated
        setTimeout(() => {
          setInBattle(false);
          setBattleMessage("");
          setGMessage("Monster defeated! You can now move freely.");
        }, 1500);
      }
    } catch (err) {
      setBattleMessage(`Attack failed: ${err.message}`);
    }
  };

  const continueBattle = async () => {
    try {
      // Fetch updated game state from backend after monster defeat
      const updatedData = await gameAPI.getGame();
      setGameData(updatedData);
      setInBattle(false);
      setBattleMessage("");
      setGMessage("Monster defeated! You can now move freely.");
    } catch (err) {
      setGMessage(`Error syncing game state: ${err.message}`);
      // Still exit battle even if sync fails
      setInBattle(false);
      setBattleMessage("");
    }
  };

  const usePotion = async (potionType) => {
    try {
      const result = await gameAPI.usePotion(potionType);
      console.log(potionType);
      setGameData(result);
      setGameData(result);
      setGMessage(`Used ${getName(potionType, POTION_TYPES)}!`);
    } catch (err) {
      setGMessage(`Buzz Ball use failed: ${err.message}`);
    }
  };

  const movePlayer = useCallback(async (newX, newY) => {
    if (!gameData || inBattle) return;
    
    const { Maze } = gameData;
    const { Grid, CurrCoords } = Maze;

    if (Grid[CurrCoords.X][CurrCoords.Y].RoomMonster) {
      setInBattle(true);
      setBattleMessage(`A wild ${Grid[CurrCoords.X][CurrCoords.Y].RoomMonster.Name} blocks your path!`);
      return;
    }

    if (
      newX < 0 || newX >= Grid.length ||
      newY < 0 || newY >= Grid[0].length ||
      Grid[newX][newY].RoomType === "Wall"
    ) {
      setGMessage("Invalid move: Wall or out of bounds.");
      return;
    }

    try {
      const updatedData = await gameAPI.move({ x: newX, y: newY });
      setGameData(updatedData);
      setGMessage(`Moved to row ${newX + 1}, col ${newY + 1}`);
      
      // Check if new room is a pit and mark it as visited
      const newRoom = updatedData.Maze.Grid[newX][newY];
      if (newRoom.RoomType === "Poop") { // Pit
        setVisitedPits(prev => new Set(prev).add(`${newX}-${newY}`));
      }
      
      // Check if new room is an exit and mark it as visited
      if (newRoom.RoomType === "Exit") { // Exit
        setVisitedExits(prev => new Set(prev).add(`${newX}-${newY}`));
      }
      
      // Check if new room has a monster
      if (newRoom.RoomMonster) {
        setInBattle(true);
        setBattleMessage(`A wild ${newRoom.RoomMonster.Name} appears!`);
      }
    } catch (err) {
      setGMessage(`Move failed: ${err.message}`);
    }
  }, [gameData, inBattle]);

  // Handle movement from buttons (relative movement)
  const handleButtonMove = useCallback((deltaX, deltaY) => {
    if (!gameData || inBattle) return;
    
    const { CurrCoords } = gameData.Maze;
    movePlayer(CurrCoords.X + deltaX, CurrCoords.Y + deltaY);
  }, [gameData, inBattle, movePlayer]);

  // Keyboard controls (now supports both arrow keys and WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameData || !DIRECTIONS[e.key] || inBattle || isTyping) return;
      
      const { CurrCoords } = gameData.Maze;
      const [dX, dY] = DIRECTIONS[e.key];
      movePlayer(CurrCoords.X + dX, CurrCoords.Y + dY);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData, movePlayer, inBattle, isTyping]);

  // Loading and error states
  if (error) {
    return (
      <div 
        className={styles.errorContainer}
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
        <h2>Error</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => navigate('/heroselect')} className={styles.retryButton}>
          Start New Game
        </button>
        <button onClick={() => navigate('/')} className={styles.retryButton}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div 
        className={styles.loadingContainer}
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
        <h2>Loading Maze...</h2>
        <p>Player: {username}</p>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Game end states
  if (gameData.Status === "Won") {
    return <GameEndScreen status="Won" message="Congratulations! You have collected all pillars and reached the exit." navigate={navigate} />;
  }

  if (gameData.Status === "Lost" && !bypassGameOver) {
    return <GameEndScreen status="Lost" message="You have perished in the maze. Better luck next time!" navigate={navigate} />;
  }

  // Game state
  const { Maze, Hero } = gameData;
  const { Grid, CurrCoords } = Maze;
  const currentRoom = Grid[CurrCoords.X][CurrCoords.Y];
  const collectedPillars = Hero.AquiredPillars || [];
  const collectedPotions = new Map(Object.entries(Hero.AquiredPotions || {}));

  return (
    <div 
      className={styles.gameContainer}
      style={{ '--background-image': `url(${background})` }}
    >
      {/* Battle Overlay - Renders on top when in battle */}
      {inBattle && currentRoom.RoomMonster && (
        <BattleOverlay
          hero={Hero}
          monster={currentRoom.RoomMonster}
          onAttack={() => attackMonster(false)}
          onSpecialAttack={() => attackMonster(true)}
          onContinue={continueBattle}
          onUsePotion={usePotion}
          battleMessage={battleMessage}
          collectedPotions={collectedPotions}
        />
      )}

      {/* Main Game Content */}
      <div className={`${styles.gameContent} ${inBattle ? styles.dimmedContent : ''}`}>
        {/* Game Header */}
        <div className={styles.gameHeader}>
          <h1 
            className={styles.gameTitle}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            title="Return to Home"
          >
            Maze Adventure
            {gameData.Status === "Lost" && bypassGameOver && (
              <span className={styles.debugStatus}> [DEBUG: Playing as Ghost]</span>
            )}
          </h1>
          
          {/* Save Game Section */}
          <div className={styles.saveGameSection}>
            <input
              type="text"
              placeholder="Enter save name..."
              value={gName}
              onChange={e => setgName(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              disabled={inBattle}
              className={styles.saveInput}
            />
            <button onClick={saveGame} disabled={inBattle} className={styles.saveButton}>
              💾 Save
            </button>
          </div>
        </div>

        {/* Main Game Layout */}
        <div className={styles.mainGameLayout}>
          {/* Maze Display */}
          <div className={styles.mazeContainer}>
            <MazeGrid 
              Grid={Grid}
              CurrCoords={CurrCoords}
              Hero={Hero}
              visitedPits={visitedPits}
              visitedExits={visitedExits}
            />

            {/* Controls Info */}
            <div className={styles.controlsInfo}>
              <p>Use WASD or Arrow Keys for keyboard control</p>
            </div>

            {/* Movement Controls */}
            <div className={styles.movementControls}>
              <div className={styles.controlsTitle}>Movement</div>
              <div className={styles.controlsGrid}>
                <div className={styles.controlRow}>
                  <div className={styles.controlSpacer}></div>
                  <button
                    className={styles.moveButton}
                    onClick={() => handleButtonMove(-1, 0)}
                    disabled={inBattle}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <div className={styles.controlSpacer}></div>
                </div>
                <div className={styles.controlRow}>
                  <button
                    className={styles.moveButton}
                    onClick={() => handleButtonMove(0, -1)}
                    disabled={inBattle}
                    title="Move Left"
                  >
                    ←
                  </button>
                  <button
                    className={styles.moveButton}
                    onClick={() => handleButtonMove(1, 0)}
                    disabled={inBattle}
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button
                    className={styles.moveButton}
                    onClick={() => handleButtonMove(0, 1)}
                    disabled={inBattle}
                    title="Move Right"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - REPLACED WITH COMPONENT */}
          <Sidebar 
            Hero={Hero}
            collectedPillars={collectedPillars}
            collectedPotions={collectedPotions}
            inBattle={inBattle}
            usePotion={usePotion}
          />
        </div>

        {/* Debug Controls */}
        <div className={styles.debugControls}>
          <button onClick={() => setShowDebug(!showDebug)} disabled={inBattle}>
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
          <button 
            onClick={() => setBypassGameOver(!bypassGameOver)} 
            disabled={inBattle}
            className={bypassGameOver ? styles.debugActiveButton : ''}
          >
            Game Over Bypass: {bypassGameOver ? "ON" : "OFF"}
          </button>
        </div>

        {showDebug && (
          <div className={styles.debugPanel}>
            <h3>Game State</h3>
            <pre>{JSON.stringify(gameData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;