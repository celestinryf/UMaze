import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Play.module.css';
import Maze from './Maze'; // Import the Maze component

const Play = () => {
  const location = useLocation();
  const selectedHero = location.state?.hero;
  
  // State to hold game data and debug information
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    apiCallAttempted: false,
    apiResponse: null,
    responseStatus: null,
    parsedData: null,
    error: null
  });
  const [playerPosition, setPlayerPosition] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('Navigate through the maze to find all 4 pillars before reaching the exit!');
  const [collectedPillars, setCollectedPillars] = useState([]);
  const [collectedPotions, setCollectedPotions] = useState({
    1: 0, // Health potions
    2: 0, // Vision potions
    3: 0  // Strength potions
  });
  const [skipMonsters, setSkipMonsters] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [gName, setgName] = useState("")
  const [gMessage, setGMessage] = useState("");

  // Use the exact fetch approach from the working solution with more debug info
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setDebugInfo(prev => ({ ...prev, apiCallAttempted: true }));
        console.log("Attempting API call to /api/game");
        
        const res = await fetch('/api/game', { method: 'POST' });
        console.log("API response received:", res);
        
        setDebugInfo(prev => ({ 
          ...prev, 
          responseStatus: res.status,
          apiResponse: {
            ok: res.ok,
            status: res.status,
            statusText: res.statusText,
            headers: Object.fromEntries([...res.headers.entries()])
          }
        }));
        
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
        
        const rawText = await res.text();
        console.log("Raw response text:", rawText);
        
        let data;
        try {
          // Try to parse the JSON
          data = JSON.parse(rawText);
          console.log("Parsed JSON data:", data);
          setDebugInfo(prev => ({ ...prev, parsedData: data }));
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          throw new Error(`Failed to parse JSON: ${parseError.message}\nRaw text: ${rawText.slice(0, 200)}...`);
        }
        
        setGameData(data);
        
        // Try to find starting position if we have valid data
        if (data && data.Maze && data.Maze.Grid) {
          try {
            const startPos = findStartPosition(data.Maze.Grid);
            setPlayerPosition(startPos);
          } catch (posError) {
            console.error("Error finding start position:", posError);
          }
        } else {
          console.warn("Game data structure is not as expected:", data);
        }
      } catch (err) {
        console.error('Connection error:', err);
        setError(`Failed to connect to backend: ${err.message}`);
        setDebugInfo(prev => ({ ...prev, error: err.toString() }));
      }
    };

    fetchGameData();
  }, []);

  // Find the start position in the maze
  const findStartPosition = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].RoomType === 1) {
          return { row: i, col: j };
        }
      }
    }
    // Default if no start found
    return { row: 2, col: 1 };
  };

  // Check if all four pillars have been collected
  const hasAllPillars = () => {
    return collectedPillars.length === 4 && 
           collectedPillars.includes(1) && 
           collectedPillars.includes(2) && 
           collectedPillars.includes(3) && 
           collectedPillars.includes(4);
  };

  // Handle player movement
  const movePlayer = (direction) => {
    if (gameStatus !== 'playing' || !playerPosition || !gameData) return;

    const newPosition = { ...playerPosition };
    
    switch (direction) {
      case 'up':
        newPosition.row = Math.max(0, playerPosition.row - 1);
        break;
      case 'down':
        newPosition.row = Math.min(gameData.Maze.Grid.length - 1, playerPosition.row + 1);
        break;
      case 'left':
        newPosition.col = Math.max(0, playerPosition.col - 1);
        break;
      case 'right':
        newPosition.col = Math.min(gameData.Maze.Grid[0].length - 1, playerPosition.col + 1);
        break;
      default:
        break;
    }

    // Check if the move is valid (not a wall)
    const targetRoom = gameData.Maze.Grid[newPosition.row][newPosition.col];
    if (targetRoom.RoomType === 0) {
      setMessage("You can't move through walls!");
      return;
    }

    // Check for monsters - but skip if debug mode is enabled
    if (targetRoom.RoomMonster) {
      if (skipMonsters) {
        // When skipMonsters is enabled, just notify but allow movement
        setMessage(`[DEBUG] Skipped combat with ${targetRoom.RoomMonster.Name}`);
      } else {
        setMessage(`You encountered a ${targetRoom.RoomMonster.Name}! Defeat it to proceed.`);
        // In a real implementation, this would handle combat with the backend
        return; // Stop movement only if not skipping monsters
      }
    }

    // Check for pillars
    if (targetRoom.PillarType > 0 && !collectedPillars.includes(targetRoom.PillarType)) {
      const newPillars = [...collectedPillars, targetRoom.PillarType];
      setCollectedPillars(newPillars);
      setMessage(`You found Pillar ${targetRoom.PillarType}! ${4 - newPillars.length} pillars remaining.`);
      
      if (newPillars.length === 4) {
        setMessage("You've collected all pillars! Find the exit to win.");
      }
    }
    
    // Check for potions
    if (targetRoom.PotionType > 0) {
      const potionTypes = {
        1: "Health Potion",
        2: "Vision Potion",
        3: "Strength Potion"
      };
      const potionName = potionTypes[targetRoom.PotionType] || `Potion type ${targetRoom.PotionType}`;
      
      // Update potion count
      const newPotions = { ...collectedPotions };
      newPotions[targetRoom.PotionType] = (newPotions[targetRoom.PotionType] || 0) + 1;
      setCollectedPotions(newPotions);
      
      setMessage(`You found a ${potionName}! (${newPotions[targetRoom.PotionType]} total)`);
      
      // Clear the potion from the room to prevent multiple collection
      const updatedGameData = { ...gameData };
      updatedGameData.Maze.Grid[newPosition.row][newPosition.col].PotionType = 0;
      setGameData(updatedGameData);
    }

    // Check for exit
    if (targetRoom.RoomType === 2) {
      if (hasAllPillars()) {
        setGameStatus('won');
        setMessage("Congratulations! You've collected all pillars and found the exit!");
      } else {
        setMessage(`You found the exit, but you need to collect all 4 pillars first! (${collectedPillars.length}/4 collected)`);
        // Allow player to stand on exit tile, but don't trigger win condition
      }
    }

    // Move player to new position
    setPlayerPosition(newPosition);
  };

  // Handle key presses for movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameData) return;
      
      switch (e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, gameStatus, gameData, collectedPillars, collectedPotions, skipMonsters]);

  // Reset the game
  const resetGame = () => {
    window.location.reload();
  };

  // Toggle debug section visibility
  const toggleDebugSection = () => {
    setShowDebug(!showDebug);
  };

  // Toggle monster skipping
  const toggleSkipMonsters = () => {
    setSkipMonsters(!skipMonsters);
    setMessage(skipMonsters ? "Monster skipping disabled." : "Monster skipping enabled! You can now pass through monsters.");
  };

  // Display game data as JSON for debugging
  const renderDebugInfo = () => {
    return (
      <div className={styles.debugSection}>
        <h3>Debug Controls</h3>
        <div className={styles.debugControls}>
          <button 
            onClick={toggleSkipMonsters}
            className={`${styles.debugButton} ${skipMonsters ? styles.debugButtonActive : ''}`}
          >
            {skipMonsters ? "Disable Monster Skipping" : "Enable Monster Skipping"}
          </button>
        </div>
        
        <h3>Debug Information</h3>
        <div className={styles.debugItem}>
          <strong>API Call Attempted:</strong> {debugInfo.apiCallAttempted ? 'Yes' : 'No'}
        </div>
        {debugInfo.responseStatus && (
          <div className={styles.debugItem}>
            <strong>Response Status:</strong> {debugInfo.responseStatus}
          </div>
        )}
        {debugInfo.error && (
          <div className={styles.debugItem}>
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}
        <div className={styles.debugItem}>
          <strong>API Response:</strong>
          <pre>{JSON.stringify(debugInfo.apiResponse, null, 2)}</pre>
        </div>
        {gameData && (
          <div className={styles.debugItem}>
            <strong>Game Data:</strong>
            <pre>{JSON.stringify(gameData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  // Render pillar collection status
  const renderPillarStatus = () => {
    return (
      <div className={styles.pillarStatus}>
        <h3>Collected Pillars:</h3>
        <div className={styles.pillarsContainer}>
          {[1, 2, 3, 4].map(pillarNumber => (
            <div 
              key={pillarNumber} 
              className={`${styles.pillarIndicator} ${collectedPillars.includes(pillarNumber) ? styles.collected : styles.missing}`}
            >
              {pillarNumber}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Saves Game
  const saveGame = async () => {
    try {
      const res = await fetch('/api/load', { method: 'POST' ,  headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({Name: gName})
      });


      if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);

      setgName("");
      setGMessage(res.status);
      console.log(res)
    } catch (err) {
      console.log(err);
      setGMessage(err);
    }
  };
  
  // Render potion collection status
  const renderPotionStatus = () => {
    // Define potion types and their names
    const potionTypes = {
      1: "Health",
      2: "Vision",
      3: "Strength"
    };
    
    const hasPotions = Object.values(collectedPotions).some(count => count > 0);
    
    return (
      <div className={styles.potionStatus}>
        <h3>Collected Potions:</h3>
        <div className={styles.potionsContainer}>
          {hasPotions ? (
            Object.entries(collectedPotions).map(([potionType, count]) => {
              if (count > 0) {
                return (
                  <div 
                    key={potionType} 
                    className={`${styles.potionIndicator} ${styles['potion' + potionType]}`}
                  >
                    {potionTypes[potionType] || `Type ${potionType}`}: {count}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className={styles.noPotions}>None yet</div>
          )}
        </div>
      </div>
    );
  };

  // If there's an error, show error with debug info
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Error</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
        {renderDebugInfo()}
      </div>
    );
  }

  // If still loading, show loading with debug info
  if (!gameData) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Loading Maze...</h2>
        <div className={styles.loadingSpinner}></div>
        {renderDebugInfo()}
      </div>
    );
  }

  // Display the maze game with pillar status and debug info
  return (
    <div className={styles.mazeGame}>
      <h1 className={styles.gameTitle}>Maze Adventure</h1>
  
      <div>
        <label for="gameName">Game Name: </label><br/>
        <input type="text" id="gameName" name="gameName" value={gName} onChange={e => setgName(e.target.value)}/><br/>
        <button onClick={saveGame}>Save Game</button>
        <p>{gMessage}</p>
      </div>

      {/* Debug mode indicator */}
      {skipMonsters && (
        <div className={styles.debugModeIndicator}>
          DEBUG MODE: Monster Skipping Enabled
        </div>
      )}
      
      {/* Hero info */}
      <div className={styles.heroInfo}>
        <h3>{gameData.Hero.Name}</h3>
        <div className={styles.heroStats}>
          <div className={styles.healthBar}>
            <div 
              className={styles.healthFill} 
              style={{ width: `${(gameData.Hero.CurrHealth / gameData.Hero.TotalHealh) * 100}%` }}
            ></div>
          </div>
          <div className={styles.healthText}>
            {gameData.Hero.CurrHealth} / {gameData.Hero.TotalHealh}
          </div>
        </div>
      </div>
      
      {/* Pillar collection status */}
      {renderPillarStatus()}
      
      {/* Potion collection status */}
      {renderPotionStatus()}
      
      <div className={styles.gameStatus}>
        <p>{message}</p>
        {gameStatus !== 'playing' && (
          <button onClick={resetGame} className={styles.resetButton}>Play Again</button>
        )}
      </div>
      
      {/* Use the Maze component */}
      <Maze 
        gameData={gameData}
        playerPosition={playerPosition}
        movePlayer={movePlayer}
        skipMonsters={skipMonsters}
        collectedPillars={collectedPillars}
        setCollectedPillars={setCollectedPillars}
        collectedPotions={collectedPotions}
        setCollectedPotions={setCollectedPotions}
        setMessage={setMessage}
        hasAllPillars={hasAllPillars}
      />
      
      {/* Debug toggle */}
      <div className={styles.debugToggle}>
        <button onClick={toggleDebugSection}>
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>
      
      {/* Debug section that's shown/hidden based on state */}
      {showDebug && renderDebugInfo()}
    </div>
  );
};

export default Play;