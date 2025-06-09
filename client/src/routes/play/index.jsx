import React, { useState, useEffect, useCallback } from 'react';
import styles from './Play.module.css';
import nickImg from '../../assets/nick.png';
import matthewImg from '../../assets/matthew.png';
import celestinImg from '../../assets/celestin.png';
import primoImg from '../../assets/primo.png';

// Constants
const ROOM_TYPES = {
  0: 'Wall',
  1: 'Entrance',
  2: 'Exit',
  3: 'Normal',
  4: 'Pit'
};

const PILLAR_TYPES = {
  1: 'Abstraction',
  2: 'Encapsulation',
  3: 'Inheritance',
  4: 'Polymorphism'
};

const POTION_TYPES = {
  1: 'Health',
  2: 'Attack'
};

const DIRECTIONS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
};

const heroImages = {
  'Nick': nickImg,
  'Matthew': matthewImg,
  'Celestin': celestinImg,
  'Primo': primoImg
};

// Utility functions
const getName = (type, mapping) => mapping[type] || 'Unknown';

// Reusable API function
const apiCall = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : {},
    ...(body && { body: JSON.stringify(body) })
  };
  
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${method} failed: ${res.status} ${res.statusText}`);
  return res.json();
};

// Reusable Components
const HealthBar = ({ current, total, label, showLabel = true, className = '' }) => (
  <div className={`${styles.statItem} ${className}`}>
    {showLabel && <span className={styles.statLabel}>{label}:</span>}
    <div className={styles.healthBar}>
      <div
        className={styles.healthFill}
        style={{ width: `${(current / total) * 100}%` }}
      />
      <span className={styles.healthText}>{current} / {total}</span>
    </div>
  </div>
);

const GameEndScreen = ({ status, message }) => (
  <div className={styles.endgameContainer}>
    <h1 className={styles.gameTitle}>Maze Adventure</h1>
    <h2 className={styles[`${status.toLowerCase()}Message`]}>
      {status === 'Won' ? '🎉 You Win! 🎉' : '💀 Game Over 💀'}
    </h2>
    <p>{message}</p>
  </div>
);

// Battle Overlay Component
const BattleOverlay = ({ hero, monster, onAttack, onSpecialAttack, onContinue, onUsePotion, battleMessage, collectedPotions }) => (
  <div className={styles.battleOverlay}>
    <div className={styles.battleContainer}>
      <h2 className={styles.battleTitle}>⚔️ BATTLE ⚔️</h2>
      
      <div className={styles.battleArena}>
        {/* Monster Section */}
        <div className={styles.battleMonsterSection}>
          <div className={styles.battleCharacterInfo}>
            <h3>{monster.Name}</h3>
            <HealthBar 
              current={monster.CurrHealth} 
              total={monster.TotalHealth} 
              showLabel={false}
              className={styles.battleHealthBar}
            />
            <p className={styles.battleStats}>ATK: {monster.Attack}</p>
          </div>
          <div className={styles.battleMonsterSprite}>
            <span className={styles.monsterEmoji}>👹</span>
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
              total={hero.TotalHealh} 
              showLabel={false}
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
          
          {/* Potion Actions */}
          {[1, 2].map(potion => {
            const count = collectedPotions.filter(p => p === potion).length;
            const canUse = count > 0;
            const potionName = getName(potion, POTION_TYPES);

            return (
              <button
                key={potion}
                onClick={() => canUse && onUsePotion(potion)}
                className={`${styles.battleButton} ${styles.battlePotionButton}`}
                disabled={!canUse}
                title={canUse ? `Use ${potionName} Potion` : `No ${potionName} potions available`}
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
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [bypassGameOver, setBypassGameOver] = useState(false);
  const [gName, setgName] = useState("");
  const [gMessage, setGMessage] = useState("");
  const [inBattle, setInBattle] = useState(false);
  const [battleMessage, setBattleMessage] = useState("");

  // Fetch game data on mount
  useEffect(() => {
    apiCall('/api/game')
      .then(data => {
        setGameData(data);
        // Check if we should be in battle on load
        const currentRoom = data?.Maze?.Grid?.[data.Maze.coords.row]?.[data.Maze.coords.col];
        if (currentRoom?.RoomMonster) {
          setInBattle(true);
          setBattleMessage(`A wild ${currentRoom.RoomMonster.Name} appears!`);
        }
      })
      .catch(err => setError(`Failed to fetch game state: ${err.message}`));
  }, []);

  // Game actions
  const saveGame = async () => {
    try {
      await apiCall('/api/load/', 'POST', { Name: gName });
      setgName("");
      setGMessage('Game saved successfully!');
    } catch (err) {
      setGMessage(`Error saving game: ${err.message}`);
    }
  };

  const attackMonster = async (isSpecial = false) => {
    try {
      const result = await apiCall('/api/battle', 'PUT', {});
      setGameData(result);
      
      const monster = result?.Maze?.Grid?.[result.Maze.coords.row]?.[result.Maze.coords.col]?.RoomMonster;
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
      const updatedData = await apiCall('/api/game');
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
      const result = await apiCall('/api/potion', 'PUT', { potion_type: potionType });
      setGameData(result);
      setGMessage(`Used ${getName(potionType, POTION_TYPES)} Potion!`);
    } catch (err) {
      setGMessage(`Potion use failed: ${err.message}`);
    }
  };

  const movePlayer = useCallback(async (newRow, newCol) => {
    if (!gameData || inBattle) return;
    
    const { Maze } = gameData;
    const { Grid, coords } = Maze;

    if (Grid[coords.row][coords.col].RoomMonster) {
      setInBattle(true);
      setBattleMessage(`A wild ${Grid[coords.row][coords.col].RoomMonster.Name} blocks your path!`);
      return;
    }

    if (
      newRow < 0 || newRow >= Grid.length ||
      newCol < 0 || newCol >= Grid[0].length ||
      Grid[newRow][newCol].RoomType === 0
    ) {
      setGMessage("Invalid move: Wall or out of bounds.");
      return;
    }

    try {
      const updatedData = await apiCall('/api/move', 'PUT', { row: newRow, col: newCol });
      setGameData(updatedData);
      setGMessage(`Moved to row ${newRow + 1}, col ${newCol + 1}`);
      
      // Check if new room has a monster
      const newRoom = updatedData.Maze.Grid[newRow][newCol];
      if (newRoom.RoomMonster) {
        setInBattle(true);
        setBattleMessage(`A wild ${newRoom.RoomMonster.Name} appears!`);
      }
    } catch (err) {
      setGMessage(`Move failed: ${err.message}`);
    }
  }, [gameData, inBattle]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameData || !DIRECTIONS[e.key] || inBattle) return;
      
      const { coords } = gameData.Maze;
      const [dRow, dCol] = DIRECTIONS[e.key];
      movePlayer(coords.row + dRow, coords.col + dCol);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData, movePlayer, inBattle]);

  // Loading and error states
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Error</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.gameTitle}>Maze Adventure</h1>
        <h2>Loading Maze...</h2>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Game end states
  if (gameData.Status === "Won") {
    return <GameEndScreen status="Won" message="Congratulations! You have collected all pillars and reached the exit." />;
  }

  if (gameData.Status === "Lost" && !bypassGameOver) {
    return <GameEndScreen status="Lost" message="You have perished in the maze. Better luck next time!" />;
  }

  // Game state
  const { Maze, Hero } = gameData;
  const { Grid, coords } = Maze;
  const currentRoom = Grid[coords.row][coords.col];
  const collectedPillars = Hero.AquiredPillars || [];
  const collectedPotions = Hero.AquiredPotions || [];

  // Cell class helper
  const getCellClasses = (cell, rowIndex, colIndex) => {
    const isCurrent = rowIndex === coords.row && colIndex === coords.col;
    const roomTypeClass = {
      0: styles.wall,
      1: styles.entrance,
      2: styles.exit,
      4: styles.pit
    }[cell.RoomType];

    return [
      styles.mazeCell,
      roomTypeClass,
      isCurrent && styles.currentCell
    ].filter(Boolean).join(' ');
  };

  return (
    <div className={styles.gameContainer}>
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
          <h1 className={styles.gameTitle}>
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

        {/* Game Message */}
        {gMessage && (
          <div className={styles.gameMessage}>
            <p>{gMessage}</p>
          </div>
        )}

        {/* Main Game Layout */}
        <div className={styles.mainGameLayout}>
          {/* Maze Display */}
          <div className={styles.mazeContainer}>
            <div className={styles.mazeWrapper}>
              <div className={styles.mazeGrid}>
                {Grid.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.mazeRow}>
                    {row.map((cell, colIndex) => {
                      const isCurrent = rowIndex === coords.row && colIndex === coords.col;
                      const isWall = cell.RoomType === 0;

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellClasses(cell, rowIndex, colIndex)}
                        >
                          {isCurrent && (
                            <div className={styles.player}>
                              {heroImages[Hero.Name] ? (
                                <img src={heroImages[Hero.Name]} alt={Hero.Name} />
                              ) : (
                                '☺'
                              )}
                            </div>
                          )}

                          {!isWall && (
                            <div className={styles.cellContents}>
                              {cell.RoomMonster && <div className={styles.monsterIndicator}>M</div>}
                              {cell.PillarType > 0 && <div className={styles.pillarIndicator}>P</div>}
                              {cell.PotionType > 0 && (
                                <div className={`${styles.potionIndicator} ${styles[`potion${cell.PotionType}`]}`}>
                                  ♦
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
              <p>Use arrow keys to move</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Hero Stats */}
            <div className={styles.heroPanel}>
              <div className={styles.panelHeader}>
                <h2>🗡️ {Hero.Name}</h2>
              </div>
              <div className={styles.panelContent}>
                <HealthBar 
                  current={Hero.CurrHealth} 
                  total={Hero.TotalHealh} 
                  label="HP" 
                />
                <div className={styles.heroStat}>
                  <span className={styles.statIcon}>⚔️</span>
                  <span className={styles.statLabel}>Attack:</span>
                  <span className={styles.statValue}>{Hero.Attack}</span>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className={styles.inventoryPanel}>
              <div className={styles.panelHeader}>
                <h2>🎒 Inventory</h2>
              </div>
              <div className={styles.panelContent}>
                {/* Pillars */}
                <div className={styles.inventorySection}>
                  <h3>Pillars of OOP</h3>
                  <div className={styles.pillarsList}>
                    {Object.entries(PILLAR_TYPES).map(([id, name]) => {
                      const pillarId = parseInt(id);
                      const isCollected = collectedPillars.includes(pillarId);
                      return (
                        <div
                          key={pillarId}
                          className={`${styles.pillarItem} ${isCollected ? styles.collected : ''}`}
                        >
                          <span className={styles.pillarIcon}>
                            {isCollected ? '✓' : '○'}
                          </span>
                          <span className={styles.pillarName}>{name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Potions */}
                <div className={styles.inventorySection}>
                  <h3>Potions</h3>
                  <div className={styles.potionsList}>
                    {[1, 2].map(potion => {
                      const count = collectedPotions.filter(p => p === potion).length;
                      const canUse = count > 0 && !inBattle;

                      return (
                        <div 
                          key={potion} 
                          className={`${styles.potionItem} ${canUse ? styles.canUse : ''}`}
                          onClick={() => canUse && usePotion(potion)}
                        >
                          <span className={`${styles.potionIcon} ${styles[`potion${potion}`]}`}>
                            ♦
                          </span>
                          <span className={styles.potionName}>
                            {getName(potion, POTION_TYPES)}
                          </span>
                          <span className={styles.potionCount}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className={styles.legendPanel}>
              <div className={styles.panelHeader}>
                <h2>📍 Legend</h2>
              </div>
              <div className={styles.panelContent}>
                <div className={styles.legendGrid}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendSymbol} ${styles.wall}`}></div>
                    <span>Wall</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendSymbol} ${styles.entrance}`}></div>
                    <span>Entrance</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendSymbol} ${styles.exit}`}></div>
                    <span>Exit</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendSymbol} ${styles.pit}`}></div>
                    <span>Pit</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendSymbol}>M</div>
                    <span>Monster</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendSymbol}>P</div>
                    <span>Pillar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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