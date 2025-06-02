import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Play.module.css';
import Maze from './Maze';

const Play = () => {
  const location = useLocation();
  const selectedHero = location.state?.hero;
  const difficulty = location.state?.difficulty;
  
  // State to hold game data and debug information
  const [gameData, setGameData] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    lastApiCall: null,
    lastApiResponse: null,
    allApiCalls: []
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
  const [inEncounter, setInEncounter] = useState(false);
  const [skipMonsters, setSkipMonsters] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [gName, setgName] = useState("");
  const [gMessage, setGMessage] = useState("");

  // Helper function to add debug info
  const addDebugInfo = (callType, request, response) => {
    const debugEntry = {
      timestamp: new Date().toISOString(),
      type: callType,
      request: request,
      response: response
    };
    
    setDebugInfo(prev => ({
      lastApiCall: callType,
      lastApiResponse: response,
      allApiCalls: [...prev.allApiCalls, debugEntry]
    }));
  };

  // Get initial game state
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        console.log("Fetching current game state...");
        
        // Get the current game state (should already be initialized from hero select)
        const res = await fetch('/api/game', { method: 'GET' });
        
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
        
        const data = await res.json();
        console.log("Game state received:", data);
        
        addDebugInfo('GET /api/game', { method: 'GET' }, data);
        
        setGameData(data);
        
        // Find starting position
        if (data && data.Maze && data.Maze.Grid) {
          const startPos = findStartPosition(data.Maze.Grid);
          setPlayerPosition(startPos);
          
          // Get initial room state
          await getRoomState(startPos.row, startPos.col);
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(`Failed to fetch game state: ${err.message}`);
        addDebugInfo('GET /api/game ERROR', { method: 'GET' }, { error: err.message });
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
    return { row: 0, col: 0 };
  };

  // Get room state from backend
  const getRoomState = async (row, col) => {
    try {
      console.log(`Getting room state for position (${row}, ${col})`);
      
      // Assuming the backend expects coordinates in the request
      // You might need to adjust this based on your actual backend API
      const requestBody = {
        row: row,
        col: col
      };
      console.log(requestBody);
      const res = await fetch('/api/move', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
      
      const roomData = await res.json();
      console.log("Room state received:", roomData);
      
      addDebugInfo('POST /api/move', requestBody, roomData);
      
      setCurrentRoom(roomData);
      
      // Handle room contents based on backend response
      // handleRoomContents(roomData);
      
      return roomData;
    } catch (err) {
      console.error('Error getting room state:', err);
      setError(`Failed to get room state: ${err.message}`);
      addDebugInfo('POST /api/move ERROR', { row, col }, { error: err.message });
      return null;
    }
  };

  // Handle room contents based on backend response
  // const handleRoomContents = (roomData) => {
  //   // Handle encounter
  //   if (roomData.encounter) {
  //     setInEncounter(true);
  //     if (roomData.Monster) {
  //       setMessage(`You encountered a ${roomData.Monster.Name || 'Monster'}! Defeat it to proceed.`);
  //     }
  //   } else {
  //     setInEncounter(false);
  //   }
    
  //   // Handle pillars
  //   if (roomData.pillar && roomData.pillar > 0 && !collectedPillars.includes(roomData.pillar)) {
  //     const newPillars = [...collectedPillars, roomData.pillar];
  //     setCollectedPillars(newPillars);
  //     setMessage(`You found Pillar ${roomData.pillar}! ${4 - newPillars.length} pillars remaining.`);
      
  //     if (newPillars.length === 4) {
  //       setMessage("You've collected all pillars! Find the exit to win.");
  //     }
  //   }
    
  //   // Handle potions
  //   if (roomData.potion && roomData.potion > 0) {
  //     const potionTypes = {
  //       1: "Health Potion",
  //       2: "Vision Potion",
  //       3: "Strength Potion"
  //     };
  //     const potionName = potionTypes[roomData.potion] || `Potion type ${roomData.potion}`;
      
  //     const newPotions = { ...collectedPotions };
  //     newPotions[roomData.potion] = (newPotions[roomData.potion] || 0) + 1;
  //     setCollectedPotions(newPotions);
      
  //     setMessage(`You found a ${potionName}! (${newPotions[roomData.potion]} total)`);
  //   }
    
  //   // Handle exit
  //   if (roomData.roomtype === 2) {
  //     if (hasAllPillars()) {
  //       setGameStatus('won');
  //       setMessage("Congratulations! You've collected all pillars and found the exit!");
  //     } else {
  //       setMessage(`You found the exit, but you need to collect all 4 pillars first! (${collectedPillars.length}/4 collected)`);
  //     }
  //   }
  // };

  // Check if all four pillars have been collected
  const hasAllPillars = () => {
    return collectedPillars.length === 4 && 
           collectedPillars.includes(1) && 
           collectedPillars.includes(2) && 
           collectedPillars.includes(3) && 
           collectedPillars.includes(4);
  };

  // Handle player movement
  const movePlayer = async (direction) => {
    if (gameStatus !== 'playing' || !playerPosition || !gameData) return;
    
    // Prevent movement during encounters (unless skipping monsters)
    if (inEncounter && !skipMonsters) {
      setMessage("You must defeat the monster before moving!");
      return;
    }

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

    // Move player to new position
    setPlayerPosition(newPosition);
    
    // Get room state from backend
    const roomState = await getRoomState(newPosition.row, newPosition.col);
    
    if (skipMonsters && roomState?.encounter) {
      setMessage(`[DEBUG] Skipped combat with ${roomState.Monster?.Name || 'Monster'}`);
      setInEncounter(false);
    }
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
  }, [playerPosition, gameStatus, gameData, collectedPillars, collectedPotions, skipMonsters, inEncounter]);

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

  // Save game
  const saveGame = async () => {
    try {
      const res = await fetch('/api/load/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name: gName })
      });

      if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);

      setgName("");
      setGMessage(`Game saved successfully! (${res.status})`);
      console.log(res);
    } catch (err) {
      console.log(err);
      setGMessage(`Error saving game: ${err.message}`);
    }
  };

  // Display debug info
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
          <strong>Last API Call:</strong> {debugInfo.lastApiCall || 'None'}
        </div>
        <div className={styles.debugItem}>
          <strong>Last API Response:</strong>
          <pre>{JSON.stringify(debugInfo.lastApiResponse, null, 2)}</pre>
        </div>
        <div className={styles.debugItem}>
          <strong>Current Room State:</strong>
          <pre>{JSON.stringify(currentRoom, null, 2)}</pre>
        </div>
        <div className={styles.debugItem}>
          <strong>Player Position:</strong> Row: {playerPosition?.row}, Col: {playerPosition?.col}
        </div>
        <div className={styles.debugItem}>
          <strong>In Encounter:</strong> {inEncounter ? 'Yes' : 'No'}
        </div>
        <div className={styles.debugItem}>
          <strong>All API Calls:</strong>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {debugInfo.allApiCalls.map((call, index) => (
              <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <strong>{call.timestamp} - {call.type}</strong>
                <pre>Request: {JSON.stringify(call.request, null, 2)}</pre>
                <pre>Response: {JSON.stringify(call.response, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
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
  
  // Render potion collection status
  const renderPotionStatus = () => {
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
        {showDebug && renderDebugInfo()}
      </div>
    );
  }

  // Display the maze game
  return (
    <div className={styles.mazeGame}>
      <h1 className={styles.gameTitle}>Maze Adventure</h1>
  
      <div>
        <label htmlFor="gameName">Game Name: </label><br/>
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
      
      {/* Encounter indicator */}
      {inEncounter && !skipMonsters && (
        <div className={styles.encounterIndicator}>
          ⚔️ IN COMBAT - Defeat the monster to continue!
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
        inEncounter={inEncounter}
      />
      
      {/* Debug toggle */}
      <div className={styles.debugToggle}>
        <button onClick={toggleDebugSection}>
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>
      
      {/* Debug section */}
      {showDebug && renderDebugInfo()}
    </div>
  );
};

export default Play;