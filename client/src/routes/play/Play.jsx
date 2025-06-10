import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gameAPI, saveLoadAPI, hasUsername, getDisplayUsername } from '../../context/api.js';
import styles from './play.module.css';
import Sidebar from './components/sidebar/sidebar.jsx';
import nickImg from '../../assets/nick.png';
import matthewImg from '../../assets/matthew.png';
import celestinImg from '../../assets/celestin.png';
import primoImg from '../../assets/primo.png';

import apple from '../../assets/sprites/apple.png';
import horn from '../../assets/sprites/horn.png';
import saddle from '../../assets/sprites/saddle.png';
import wings from '../../assets/sprites/wings.png';

import salmon from '../../assets/sprites/salmon.png';
import bee_hive from '../../assets/sprites/bee_hive.png';
import anthill from '../../assets/sprites/anthill.png';

import heal_potion from '../../assets/sprites/heal_potion.png';
import attack_potion from '../../assets/sprites/attack_potion.png';

import path from '../../assets/sprites/path.png';
import poop from '../../assets/sprites/poop.png';
import tree from '../../assets/sprites/tree.png';
import background from '../../assets/background.jpg';

// Constants
const ROOM_TYPES = {
  0: 'Wall',
  1: 'Entrance',
  2: 'Exit',
  3: 'Path',
  4: 'Poop'
};

const PILLAR_TYPES = {
  1: 'Apple',
  2: 'Saddle',
  3: 'Horn',
  4: 'Wings'
};

const POTION_TYPES = {
  1: 'Health Buzz Ball',
  2: 'Attack Buzz Ball'
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

const heroImages = {
  'NICK': nickImg,
  'MATT': matthewImg,
  'CELESTIN': celestinImg,
  'PRIMO': primoImg
};

const ToolsOfEscapeImages = {
  'APPLE': apple,
  'HORN': horn,
  'SADDLE': saddle,
  'WINGS': wings
};

const EnemyImages = {
  'SALMON': salmon,
  'BEEHIVE': bee_hive,
  'ANTHILL': anthill
};

const EnvironmentImages = {
  'PATH': path,
  'POOP': poop,
  'TREE_WALL': tree
};

const PotionImages = {
  1: heal_potion,
  2: attack_potion
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

const GameEndScreen = ({ status, message, navigate }) => (
  <div 
    className={styles.endgameContainer}
    style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}
  >
    <h1 
      className={styles.gameTitle}
      onClick={() => navigate('/')}
      style={{ cursor: 'pointer' }}
      title="Return to Home"
    >
      Maze Adventure
    </h1>
    <h2 className={styles[`${status.toLowerCase()}Message`]}>
      {status === 'Won' ? '🎉 You Win! 🎉' : '💀 Game Over 💀'}
    </h2>
    <p>{message}</p>
    <div className={styles.endgameButtons}>
      <button onClick={() => navigate('/heroselect')} className={styles.retryButton}>
        Start New Game
      </button>
      <button onClick={() => navigate('/')} className={styles.retryButton}>
        Back to Home
      </button>
    </div>
  </div>
);

// Battle Overlay Component - UPDATED with monster images
const BattleOverlay = ({ hero, monster, onAttack, onSpecialAttack, onContinue, onUsePotion, battleMessage, collectedPotions }) => (
  <div className={styles.battleOverlay}>
    <div className={styles.battleContainer}>
      <h2 className={styles.battleTitle}>⚔️ BATTLE ⚔️</h2>
      
      <div className={styles.battleArena}>
        {/* Monster Section - UPDATED with image */}
        <div className={styles.battleMonsterSection}>
          <div className={styles.battleCharacterInfo}>
            <h3>{monster.Name}</h3>
            <HealthBar 
              current={monster.CurrHealth} 
              total={monster.TotalHealth} 
              label="HP"
              showLabel={true}
              className={styles.battleHealthBar}
            />
            <p className={styles.battleStats}>ATK: {monster.Attack}</p>
          </div>
          <div className={styles.battleMonsterSprite}>
            {EnemyImages[monster.Name] ? (
              <img 
                src={EnemyImages[monster.Name]} 
                alt={monster.Name} 
                className={styles.battleMonsterImage}
              />
            ) : (
              <span className={styles.monsterEmoji}>👹</span>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className={styles.battleHeroSection}>
          <div className={styles.battleHeroSprite}>
            {heroImages[hero.Name] ? (
              <img src={heroImages[hero.Name]} alt={hero.Name} />
            ) : (
              <span className={styles.heroEmoji}>🗡️</span>
            )}
          </div>
          <div className={styles.battleCharacterInfo}>
            <h3>{hero.Name}</h3>
            <HealthBar 
              current={hero.CurrHealth} 
              total={hero.TotalHealth} 
              label="HP"
              showLabel={true}
              className={styles.battleHealthBar}
            />
            <p className={styles.battleStats}>ATK: {hero.Attack}</p>
          </div>
        </div>
      </div>

      {/* Battle Message */}
      {battleMessage && (
        <div className={styles.battleMessage}>
          <p>{battleMessage}</p>
        </div>
      )}

      {/* Battle Actions */}
      {monster.CurrHealth > 0 ? (
        <div className={styles.battleActions}>
          <button 
            onClick={onAttack} 
            className={styles.battleButton}
          >
            Attack
          </button>
          <button 
            onClick={onSpecialAttack} 
            className={styles.battleButton}
          >
            Special Attack
          </button>
          
          {/* Buzz Ball Actions */}
          {[1, 2].map(potion => {
            const count = collectedPotions.has ? (collectedPotions.has(String(potion)) ? collectedPotions.get(String(potion)) : 0) : collectedPotions.filter(p => p === potion).length;
            const canUse = count > 0;
            const potionName = getName(potion, POTION_TYPES);

            return (
              <button
                key={potion}
                onClick={() => canUse && onUsePotion(potion)}
                className={`${styles.battleButton} ${styles.battlePotionButton}`}
                disabled={!canUse}
                title={canUse ? `Use ${potionName}` : `No ${potionName}s available`}
              >
                Use {potionName} ({count})
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.battleVictory}>
          <p>Victory! The {monster.Name} has been defeated!</p>
          <button onClick={onContinue} className={styles.battleButton}>
            Continue
          </button>
        </div>
      )}
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
        
        if (currentRoom?.RoomType === 2) {
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
      Grid[newX][newY].RoomType === 0
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
      if (newRoom.RoomType === 4) { // Pit
        setVisitedPits(prev => new Set(prev).add(`${newX}-${newY}`));
      }
      
      // Check if new room is an exit and mark it as visited
      if (newRoom.RoomType === 2) { // Exit
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
      if (!gameData || !DIRECTIONS[e.key] || inBattle) return;
      
      const { CurrCoords } = gameData.Maze;
      const [dX, dY] = DIRECTIONS[e.key];
      movePlayer(CurrCoords.X + dX, CurrCoords.Y + dY);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData, movePlayer, inBattle]);

  // Loading and error states
  if (error) {
    return (
      <div 
        className={styles.errorContainer}
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
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
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
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

  // Cell class helper
  const getCellClasses = (cell, rowIndex, colIndex) => {
    const isCurrent = rowIndex === CurrCoords.X && colIndex === CurrCoords.Y;
    const isPit = cell.RoomType === 4;
    const isExit = cell.RoomType === 2;
    const isVisitedPit = isPit && visitedPits.has(`${rowIndex}-${colIndex}`);
    const isVisitedExit = isExit && visitedExits.has(`${rowIndex}-${colIndex}`);
    
    let roomTypeClass;
    if (isPit) {
      roomTypeClass = isVisitedPit ? styles.pitVisited : styles.pit;
    } else if (isExit) {
      roomTypeClass = isVisitedExit ? styles.exit : styles.path; // Hide exit until visited
    } else {
      roomTypeClass = {
        0: styles.wall,
        1: styles.entrance,
        3: styles.path
      }[cell.RoomType] || '';
    }

    return [
      styles.mazeCell,
      roomTypeClass,
      isCurrent && styles.currentCell
    ].filter(Boolean).join(' ');
  };

  return (
    <div 
      className={styles.gameContainer}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
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
            <div className={styles.mazeWrapper}>
              <div className={styles.mazeGrid}>
                {Grid.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.mazeRow}>
                    {row.map((cell, colIndex) => {
                      const isCurrent = rowIndex === CurrCoords.X && colIndex === CurrCoords.Y;
                      const isWall = cell.RoomType === 0;
                      const isExit = cell.RoomType === 2;
                      const isVisitedExit = isExit && visitedExits.has(`${rowIndex}-${colIndex}`);

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellClasses(cell, rowIndex, colIndex)}
                        >
                          {isCurrent && (
                            <div className={styles.player}>
                              {heroImages[Hero.Name] ? (
                                <img 
                                  src={heroImages[Hero.Name]} 
                                  alt={Hero.Name} 
                                  className={styles.playerImage}
                                />
                              ) : (
                                '☺'
                              )}
                            </div>
                          )}

                          {isWall && (
                            <div className={styles.cellContents}>
                              {/* UPDATED: Wall image */}
                                <div className={styles.TreeWall}>
                                  {EnvironmentImages['TREE_WALL'] ? (
                                    <img 
                                      src={EnvironmentImages['TREE_WALL']} 
                                      alt={'Tree'}
                                      className={styles.TreeWall}
                                    />
                                  ) : (
                                    <span>W</span>
                                  )}
                                </div>
                            </div>
                          )}

                          {!isWall && (
                            <div className={styles.cellContents}>
                              {/* UPDATED: Monster image */}
                              {cell.RoomMonster && (
                                <div className={styles.monsterIndicator}>
                                  {EnemyImages[cell.RoomMonster.Name] ? (
                                    <img 
                                      src={EnemyImages[cell.RoomMonster.Name]} 
                                      alt={cell.RoomMonster.Name}
                                      className={styles.monsterImage}
                                    />
                                  ) : (
                                    <span>M</span>
                                  )}
                                </div>
                              )}

                              {/* Pit image - only shown after being visited */}
                              {(cell.RoomType == 4) && visitedPits.has(`${rowIndex}-${colIndex}`) && (
                                <div className={styles.pitIndicator}>
                                  {EnvironmentImages['POOP'] ? (
                                    <img 
                                      src={EnvironmentImages['POOP']} 
                                      alt={'poop'}
                                      className={styles.poopImage}
                                    />
                                  ) : (
                                    <span>P</span>
                                  )}
                                </div>
                              )}
                              
                              {/* Exit indicator - only shown after being visited */}
                              {isExit && isVisitedExit && (
                                <div className={styles.exitIndicator}>
                                  <span>🚪</span>
                                </div>
                              )}
                              
                              {/* UPDATED: Pillar image */}
                              {cell.PillarType > 0 && (
                                <div className={styles.pillarIndicator}>
                                  {ToolsOfEscapeImages[PILLAR_TYPES[cell.PillarType].toUpperCase()] ? (
                                    <img 
                                      src={ToolsOfEscapeImages[PILLAR_TYPES[cell.PillarType].toUpperCase()]} 
                                      alt={PILLAR_TYPES[cell.PillarType]}
                                      className={styles.pillarImage}
                                    />
                                  ) : (
                                    <span>P</span>
                                  )}
                                </div>
                              )}
                              
                              {/* UPDATED: Buzz Ball image */}
                              {cell.PotionType > 0 && (
                                <div className={`${styles.potionIndicator} ${styles[`Buzz Ball${cell.PotionType}`]}`}>
                                  {PotionImages[cell.PotionType] ? (
                                    <img 
                                      src={PotionImages[cell.PotionType]} 
                                      alt={`${getName(cell.PotionType, POTION_TYPES)}`}
                                      className={styles.potionImage}
                                    />
                                  ) : (
                                    <span>♦</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

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