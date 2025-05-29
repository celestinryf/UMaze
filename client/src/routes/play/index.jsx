import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Play.module.css';
import Maze from './Maze'; // Import the Maze component
import Fight from './Fight'; // Import the Fight component

const Play = () => {
  const myLocation = useLocation();
  const mySelectedHero = myLocation.state?.hero;
  
  // State to hold game data and debug information
  const [myGameData, mySetGameData] = useState(null);
  const [myError, mySetError] = useState(null);
  const [myDebugInfo, mySetDebugInfo] = useState({
    apiCallAttempted: false,
    apiResponse: null,
    responseStatus: null,
    parsedData: null,
    error: null
  });
  const [myPlayerPosition, mySetPlayerPosition] = useState(null);
  const [myGameStatus, mySetGameStatus] = useState('playing');
  const [myMessage, mySetMessage] = useState('Navigate through the maze to find all 4 pillars before reaching the exit!');
  const [myCollectedPillars, mySetCollectedPillars] = useState([]);
  const [myCollectedPotions, mySetCollectedPotions] = useState({
    1: 0, // Health potions
    2: 0, // Vision potions
    3: 0  // Strength potions
  });
  const [mySkipMonsters, mySetSkipMonsters] = useState(false);
  const [myShowDebug, mySetShowDebug] = useState(false);
  
  // Fight state
  const [myInFight, mySetInFight] = useState(false);
  const [myCurrentMonster, mySetCurrentMonster] = useState(null);

  // Use the exact fetch approach from the working solution with more debug info
  useEffect(() => {
    const myFetchGameData = async () => {
      try {
        mySetDebugInfo(thePrev => ({ ...thePrev, apiCallAttempted: true }));
        console.log("Attempting API call to /api/game");
        
        const myRes = await fetch('/api/game', { method: 'POST' });
        console.log("API response received:", myRes);
        
        mySetDebugInfo(thePrev => ({ 
          ...thePrev, 
          responseStatus: myRes.status,
          apiResponse: {
            ok: myRes.ok,
            status: myRes.status,
            statusText: myRes.statusText,
            headers: Object.fromEntries([...myRes.headers.entries()])
          }
        }));
        
        if (!myRes.ok) throw new Error(`Network response was not ok: ${myRes.status} ${myRes.statusText}`);
        
        const myRawText = await myRes.text();
        console.log("Raw response text:", myRawText);
        
        let myData;
        try {
          // Try to parse the JSON
          myData = JSON.parse(myRawText);
          console.log("Parsed JSON data:", myData);
          mySetDebugInfo(thePrev => ({ ...thePrev, parsedData: myData }));
        } catch (theParseError) {
          console.error("JSON parsing error:", theParseError);
          throw new Error(`Failed to parse JSON: ${theParseError.message}\nRaw text: ${myRawText.slice(0, 200)}...`);
        }
        
        mySetGameData(myData);
        
        // Try to find starting position if we have valid data
        if (myData && myData.Maze && myData.Maze.Grid) {
          try {
            const myStartPos = myFindStartPosition(myData.Maze.Grid);
            mySetPlayerPosition(myStartPos);
          } catch (thePosError) {
            console.error("Error finding start position:", thePosError);
          }
        } else {
          console.warn("Game data structure is not as expected:", myData);
        }
      } catch (theErr) {
        console.error('Connection error:', theErr);
        mySetError(`Failed to connect to backend: ${theErr.message}`);
        mySetDebugInfo(thePrev => ({ ...thePrev, error: theErr.toString() }));
      }
    };

    myFetchGameData();
  }, []);

  // Find the start position in the maze
  const myFindStartPosition = (theGrid) => {
    for (let myI = 0; myI < theGrid.length; myI++) {
      for (let myJ = 0; myJ < theGrid[myI].length; myJ++) {
        if (theGrid[myI][myJ].RoomType === 1) {
          return { row: myI, col: myJ };
        }
      }
    }
    // Default if no start found
    return { row: 2, col: 1 };
  };

  // Check if all four pillars have been collected
  const myHasAllPillars = () => {
    return myCollectedPillars.length === 4 && 
           myCollectedPillars.includes(1) && 
           myCollectedPillars.includes(2) && 
           myCollectedPillars.includes(3) && 
           myCollectedPillars.includes(4);
  };

  // Handle player movement
  const myMovePlayer = (theDirection) => {
    if (myGameStatus !== 'playing' || !myPlayerPosition || !myGameData) return;

    const myNewPosition = { ...myPlayerPosition };
    
    switch (theDirection) {
      case 'up':
        myNewPosition.row = Math.max(0, myPlayerPosition.row - 1);
        break;
      case 'down':
        myNewPosition.row = Math.min(myGameData.Maze.Grid.length - 1, myPlayerPosition.row + 1);
        break;
      case 'left':
        myNewPosition.col = Math.max(0, myPlayerPosition.col - 1);
        break;
      case 'right':
        myNewPosition.col = Math.min(myGameData.Maze.Grid[0].length - 1, myPlayerPosition.col + 1);
        break;
      default:
        break;
    }

    // Check if the move is valid (not a wall)
    const myTargetRoom = myGameData.Maze.Grid[myNewPosition.row][myNewPosition.col];
    if (myTargetRoom.RoomType === 0) {
      mySetMessage("You can't move through walls!");
      return;
    }

    // Check for monsters - but skip if debug mode is enabled
    if (myTargetRoom.RoomMonster) {
      if (mySkipMonsters) {
        // When skipMonsters is enabled, just notify but allow movement
        mySetMessage(`[DEBUG] Skipped combat with ${myTargetRoom.RoomMonster.Name}`);
      } else {
        mySetInFight(true);
        mySetCurrentMonster(myTargetRoom.RoomMonster);
        return;
      }
    }

    // Check for pillars
    if (myTargetRoom.PillarType > 0 && !myCollectedPillars.includes(myTargetRoom.PillarType)) {
      const myNewPillars = [...myCollectedPillars, myTargetRoom.PillarType];
      mySetCollectedPillars(myNewPillars);
      mySetMessage(`You found Pillar ${myTargetRoom.PillarType}! ${4 - myNewPillars.length} pillars remaining.`);
      
      if (myNewPillars.length === 4) {
        mySetMessage("You've collected all pillars! Find the exit to win.");
      }
    }
    
    // Check for potions
    if (myTargetRoom.PotionType > 0) {
      const myPotionTypes = {
        1: "Health Potion",
        2: "Vision Potion",
        3: "Strength Potion"
      };
      const myPotionName = myPotionTypes[myTargetRoom.PotionType] || `Potion type ${myTargetRoom.PotionType}`;
      
      // Update potion count
      const myNewPotions = { ...myCollectedPotions };
      myNewPotions[myTargetRoom.PotionType] = (myNewPotions[myTargetRoom.PotionType] || 0) + 1;
      mySetCollectedPotions(myNewPotions);
      
      mySetMessage(`You found a ${myPotionName}! (${myNewPotions[myTargetRoom.PotionType]} total)`);
      
      // Clear the potion from the room to prevent multiple collection
      const myUpdatedGameData = { ...myGameData };
      myUpdatedGameData.Maze.Grid[myNewPosition.row][myNewPosition.col].PotionType = 0;
      mySetGameData(myUpdatedGameData);
    }

    // Check for exit
    if (myTargetRoom.RoomType === 2) {
      if (myHasAllPillars()) {
        mySetGameStatus('won');
        mySetMessage("Congratulations! You've collected all pillars and found the exit!");
      } else {
        mySetMessage(`You found the exit, but you need to collect all 4 pillars first! (${myCollectedPillars.length}/4 collected)`);
        // Allow player to stand on exit tile, but don't trigger win condition
      }
    }

    // Move player to new position
    mySetPlayerPosition(myNewPosition);
  };

  // Handle key presses for movement
  useEffect(() => {
    const myHandleKeyDown = (theE) => {
      if (!myGameData || myInFight) return;
      
      switch (theE.key) {
        case 'ArrowUp':
          myMovePlayer('up');
          break;
        case 'ArrowDown':
          myMovePlayer('down');
          break;
        case 'ArrowLeft':
          myMovePlayer('left');
          break;
        case 'ArrowRight':
          myMovePlayer('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', myHandleKeyDown);
    return () => {
      window.removeEventListener('keydown', myHandleKeyDown);
    };
  }, [myPlayerPosition, myGameStatus, myGameData, myCollectedPillars, myCollectedPotions, mySkipMonsters, myInFight]);

  // Handle fight victory
  const myHandleFightVictory = () => {
    mySetInFight(false);
    mySetMessage(`You defeated the ${myCurrentMonster.Name}!`);
    
    // Remove monster from the room
    const myUpdatedGameData = { ...myGameData };
    myUpdatedGameData.Maze.Grid[myPlayerPosition.row][myPlayerPosition.col].RoomMonster = null;
    mySetGameData(myUpdatedGameData);
    
    mySetCurrentMonster(null);
  };

  // Handle fight escape
  const myHandleFightEscape = () => {
    mySetInFight(false);
    mySetCurrentMonster(null);
    mySetMessage("You escaped from battle!");
  };

  // Reset the game
  const myResetGame = () => {
    window.location.reload();
  };

  // Toggle debug section visibility
  const myToggleDebugSection = () => {
    mySetShowDebug(!myShowDebug);
  };

  // Toggle monster skipping
  const myToggleSkipMonsters = () => {
    mySetSkipMonsters(!mySkipMonsters);
    mySetMessage(mySkipMonsters ? "Monster skipping disabled." : "Monster skipping enabled! You can now pass through monsters.");
  };

  // Display game data as JSON for debugging
  const myRenderDebugInfo = () => {
    return (
      <div className={styles.debugSection}>
        <h3>Debug Controls</h3>
        <div className={styles.debugControls}>
          <button 
            onClick={myToggleSkipMonsters}
            className={`${styles.debugButton} ${mySkipMonsters ? styles.debugButtonActive : ''}`}
          >
            {mySkipMonsters ? "Disable Monster Skipping" : "Enable Monster Skipping"}
          </button>
        </div>
        
        <h3>Debug Information</h3>
        <div className={styles.debugItem}>
          <strong>API Call Attempted:</strong> {myDebugInfo.apiCallAttempted ? 'Yes' : 'No'}
        </div>
        {myDebugInfo.responseStatus && (
          <div className={styles.debugItem}>
            <strong>Response Status:</strong> {myDebugInfo.responseStatus}
          </div>
        )}
        {myDebugInfo.error && (
          <div className={styles.debugItem}>
            <strong>Error:</strong> {myDebugInfo.error}
          </div>
        )}
        <div className={styles.debugItem}>
          <strong>API Response:</strong>
          <pre>{JSON.stringify(myDebugInfo.apiResponse, null, 2)}</pre>
        </div>
        {myGameData && (
          <div className={styles.debugItem}>
            <strong>Game Data:</strong>
            <pre>{JSON.stringify(myGameData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };

  // Render pillar collection status
  const myRenderPillarStatus = () => {
    return (
      <div className={styles.pillarStatus}>
        <h3>Collected Pillars:</h3>
        <div className={styles.pillarsContainer}>
          {[1, 2, 3, 4].map(thePillarNumber => (
            <div 
              key={thePillarNumber} 
              className={`${styles.pillarIndicator} ${myCollectedPillars.includes(thePillarNumber) ? styles.collected : styles.missing}`}
            >
              {thePillarNumber}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render potion collection status
  const myRenderPotionStatus = () => {
    // Define potion types and their names
    const myPotionTypes = {
      1: "Health",
      2: "Vision",
      3: "Strength"
    };
    
    const myHasPotions = Object.values(myCollectedPotions).some(theCount => theCount > 0);
    
    return (
      <div className={styles.potionStatus}>
        <h3>Collected Potions:</h3>
        <div className={styles.potionsContainer}>
          {myHasPotions ? (
            Object.entries(myCollectedPotions).map(([thePotionType, theCount]) => {
              if (theCount > 0) {
                return (
                  <div 
                    key={thePotionType} 
                    className={`${styles.potionIndicator} ${styles['potion' + thePotionType]}`}
                  >
                    {myPotionTypes[thePotionType] || `Type ${thePotionType}`}: {theCount}
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
  if (myError) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Error</h2>
        <p className={styles.errorMessage}>{myError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Retry
        </button>
        {myRenderDebugInfo()}
      </div>
    );
  }

  // If still loading, show loading with debug info
  if (!myGameData) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Loading Maze...</h2>
        <div className={styles.loadingSpinner}></div>
        {myRenderDebugInfo()}
      </div>
    );
  }

  // Display the maze game with pillar status and debug info
  return (
    <div className={styles.mazeGame}>
      <h1 className={styles.gameTitle}>Maze Adventure</h1>
      
      {/* Debug mode indicator */}
      {mySkipMonsters && (
        <div className={styles.debugModeIndicator}>
          DEBUG MODE: Monster Skipping Enabled
        </div>
      )}
      
      {/* Hero info */}
      <div className={styles.heroInfo}>
        <h3>{myGameData.Hero.Name}</h3>
        <div className={styles.heroStats}>
          <div className={styles.healthBar}>
            <div 
              className={styles.healthFill} 
              style={{ width: `${(myGameData.Hero.CurrHealth / myGameData.Hero.TotalHealh) * 100}%` }}
            ></div>
          </div>
          <div className={styles.healthText}>
            {myGameData.Hero.CurrHealth} / {myGameData.Hero.TotalHealh}
          </div>
        </div>
      </div>
      
      {/* Pillar collection status */}
      {myRenderPillarStatus()}
      
      {/* Potion collection status */}
      {myRenderPotionStatus()}
      
      <div className={styles.gameStatus}>
        <p>{myMessage}</p>
        {myGameStatus !== 'playing' && (
          <button onClick={myResetGame} className={styles.resetButton}>Play Again</button>
        )}
      </div>
      
      {/* Conditionally render either Maze or Fight */}
      {myInFight && myCurrentMonster ? (
        <Fight
          monster={myCurrentMonster}
          hero={myGameData.Hero}
          onVictory={myHandleFightVictory}
          onEscape={myHandleFightEscape}
        />
      ) : (
        <Maze 
          gameData={myGameData}
          playerPosition={myPlayerPosition}
          movePlayer={myMovePlayer}
          skipMonsters={mySkipMonsters}
          collectedPillars={myCollectedPillars}
          setCollectedPillars={mySetCollectedPillars}
          collectedPotions={myCollectedPotions}
          setCollectedPotions={mySetCollectedPotions}
          setMessage={mySetMessage}
          hasAllPillars={myHasAllPillars}
        />
      )}
      
      {/* Debug toggle */}
      <div className={styles.debugToggle}>
        <button onClick={myToggleDebugSection}>
          {myShowDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>
      
      {/* Debug section that's shown/hidden based on state */}
      {myShowDebug && myRenderDebugInfo()}
    </div>
  );
};

export default Play;