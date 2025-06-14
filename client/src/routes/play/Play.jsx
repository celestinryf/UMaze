import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gameAPI, saveLoadAPI, hasUsername, getDisplayUsername } from '../../context/api.js';
import styles from './play.module.css';
import Sidebar from './components/sidebar/sidebar.jsx';
import BattleOverlay from './components/battle/battle.jsx';
import GameEndScreen from './components/screens/gameendscreen/gameendscreen.jsx';
import MazeGrid from './components/maze/mazegrid.jsx';
import MovementControls from './components/controls/movement.jsx';
import LoadingScreen from './components/screens/loadscreen/loadscreen.jsx';
import ErrorScreen from './components/screens//errorscreen/errorscreen.jsx';

import background from '../../assets/background.jpg';

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

  // Event handlers for child components
  const handleBattleEnd = (updatedGameData, message) => {
    setGameData(updatedGameData);
    setInBattle(false);
    setGMessage(message);
  };

  const handleBattleGameUpdate = (updatedGameData) => {
    setGameData(updatedGameData);
  };

  const handleSidebarGameUpdate = (updatedGameData) => {
    setGameData(updatedGameData);
  };

  const handleSidebarMessage = (message) => {
    setGMessage(message);
  };

  const handleMovementGameUpdate = (updatedGameData) => {
    setGameData(updatedGameData);
  };

  const handleMovementMessage = (message) => {
    setGMessage(message);
  };

  const handleBattleStart = () => {
    setInBattle(true);
  };

  const handlePitVisited = (coords) => {
    setVisitedPits(prev => new Set(prev).add(coords));
  };

  const handleExitVisited = (coords) => {
    setVisitedExits(prev => new Set(prev).add(coords));
  };

  // Loading and error states using components
  if (error) {
    return (
      <ErrorScreen
        error={error}
        onTitleClick={() => navigate('/')}
        onStartNewGame={() => navigate('/heroselect')}
        onBackToHome={() => navigate('/')}
        backgroundImage={background}
      />
    );
  }

  if (!gameData) {
    return (
      <LoadingScreen
        username={username}
        onTitleClick={() => navigate('/')}
        backgroundImage={background}
      />
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
          collectedPotions={collectedPotions}
          onBattleEnd={handleBattleEnd}
          gameAPI={gameAPI}
          onGameUpdate={handleBattleGameUpdate}
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
            Charlie The Unicorn
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

            <MovementControls 
              gameData={gameData}
              inBattle={inBattle}
              isTyping={isTyping}
              gameAPI={gameAPI}
              onGameUpdate={handleMovementGameUpdate}
              onMessage={handleMovementMessage}
              onBattleStart={handleBattleStart}
              onPitVisited={handlePitVisited}
              onExitVisited={handleExitVisited}
            />
          </div>

          {/* Sidebar */}
          <Sidebar 
            Hero={Hero}
            collectedPillars={collectedPillars}
            collectedPotions={collectedPotions}
            inBattle={inBattle}
            gameAPI={gameAPI}
            onGameUpdate={handleSidebarGameUpdate}
            onMessage={handleSidebarMessage}
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