import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Play.module.css';

/*
 * Maze Adventure Game Component
 * Features: meow
 * - Pokemon-style battle overlay system
 * - Turn-based combat with attack/special attack options
 * - Potion usage allowed during battle for strategic healing
 * - Real-time maze navigation with arrow keys
 * - Collectible pillars and potions
 * - Save/load game functionality
 * - Visual health bars and battle animations
 * - Debug mode: Game Over bypass for testing
 * 
 * Battle System:
 * - Encounters trigger a full-screen overlay
 * - Game content is dimmed and disabled during battle
 * - Players can use potions during combat for strategic advantage
 * - Victory allows continuation
 * 
 * Debug Features:
 * - Toggle to bypass Game Over screen and continue playing after death
 * - Visual indicators when playing in "ghost mode"
 */

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

const StatCard = ({ title, stats, children }) => (
  <div className={styles[`${title.toLowerCase()}Card`]}>
    <h2>{title}</h2>
    <div className={styles[`${title.toLowerCase()}Stats`]}>
      {stats}
      {children}
    </div>
  </div>
);

const LegendItem = ({ colorClass, icon, label }) => (
  <div className={styles.legendItem}>
    {colorClass ? (
      <div className={`${styles.legendColor} ${styles[colorClass]}`} />
    ) : (
      <div className={styles.legendIcon}>{icon}</div>
    )}
    {label}
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
            <span className={styles.heroEmoji}>🗡️</span>
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
            const count = collectedPotions.has(String(potion)) ? collectedPotions.get(String(potion)) : 69;
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
  const location = useLocation();
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
  const collectedPotions = new Map(Object.entries(Hero.AquiredPotions || {}));

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
    <div className={styles.mazeGame}>
      <h1 className={styles.gameTitle}>
        Maze Adventure
        {gameData.Status === "Lost" && bypassGameOver && (
          <span className={styles.debugStatus}> [DEBUG: Playing as Ghost]</span>
        )}
      </h1>

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

      {/* Main Game Content - Dimmed when in battle */}
      <div className={inBattle ? styles.dimmedContent : ''}>
        {/* Save Game Section */}
        <div className={styles.saveSection}>
          <label htmlFor="gameName">Game Name: </label>
          <input
            type="text"
            id="gameName"
            value={gName}
            onChange={e => setgName(e.target.value)}
            disabled={inBattle}
          />
          <button onClick={saveGame} disabled={inBattle}>Save Game</button>
          <p className={styles.saveMessage}>{gMessage}</p>
        </div>

        {/* Hero Stats */}
        <StatCard 
          title="Hero"
          stats={
            <>
              <HealthBar current={Hero.CurrHealth} total={Hero.TotalHealh} label="Health" />
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Attack:</span> {Hero.Attack}
              </div>
            </>
          }
        />

      {/* Pillars Collection */}
      <div className={styles.collectionSection}>
        <h2>Pillars Collected</h2>
        <div className={styles.pillarsContainer}>
          {Object.entries(PILLAR_TYPES).map(([id, name]) => {
            const pillarId = parseInt(id);
            const isCollected = collectedPillars.includes(pillarId);
            return (
              <div
                key={pillarId}
                className={`${styles.pillarItem} ${isCollected ? styles.collected : styles.missing}`}
              >
                <div className={styles.pillarIcon}>P</div>
                <span>{name}</span>
                <span className={isCollected ? styles.checkmark : styles.crossmark}>
                  {isCollected ? '✓' : '✗'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Potions Collection */}
      <div className={styles.collectionSection}>
        <h2>Potions Collected</h2>
        <div className={styles.potionsContainer}>
          {[1, 2].map(potion => {
            const count = collectedPotions.has(String(potion)) ? collectedPotions.get(String(potion)) : 69;
            const canUse = count > 0;

            return (
              <div key={potion} className={styles.potionItem}>
                <div className={`${styles.potionIcon} ${styles[`potion${potion}`]}`}>
                  {count}
                </div>
                <span
                  className={styles.potionName}
                  onClick={() => canUse && usePotion(potion)}
                  style={{ 
                    cursor: canUse ? 'pointer' : 'not-allowed', 
                    textDecoration: 'underline'
                  }}
                  title={canUse ? 'Click to use potion' : 'No potions available'}
                >
                  {getName(potion, POTION_TYPES)} Potions: {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maze Grid */}
      <div className={styles.mazeSection}>
        <h2>Maze Map</h2>
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
                    {isCurrent && <div className={styles.player}>☺</div>}

                    {!isWall && (
                      <div className={styles.cellContents}>
                        {cell.RoomMonster && <div className={styles.monsterIndicator}>M</div>}
                        {cell.PillarType > 0 && <div className={styles.pillarIndicator}>P{cell.PillarType}</div>}
                        {cell.PotionType > 0 && (
                          <div className={`${styles.potionIndicator} ${styles[`potion${cell.PotionType}`]}`}>
                            {cell.PotionType}
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

        {/* Map Legend */}
        <div className={styles.mapLegend}>
          <LegendItem colorClass="wall" label="Wall" />
          <LegendItem colorClass="entrance" label="Entrance" />
          <LegendItem colorClass="exit" label="Exit" />
          <LegendItem colorClass="normal" label="Normal Room" />
          <LegendItem colorClass="pit" label="Pit" />
          <LegendItem icon="☺" label="Player" />
          <LegendItem icon="M" label="Monster" />
          <LegendItem icon="P#" label="Pillar" />
          <LegendItem colorClass="potion1" label="Health Potion" />
          <LegendItem colorClass="potion2" label="Attack Potion" />
        </div>
      </div>

        {/* Debug Section */}
        <div className={styles.debugToggle}>
          <button onClick={() => setShowDebug(!showDebug)} disabled={inBattle}>
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>
          <button 
            onClick={() => setBypassGameOver(!bypassGameOver)} 
            disabled={inBattle}
            className={bypassGameOver ? styles.debugActiveButton : ''}
            title="When enabled, prevents the Game Over screen from appearing, allowing continued play after death"
          >
            {bypassGameOver ? "Debug: Game Over Bypass ON" : "Debug: Game Over Bypass OFF"}
          </button>
          {gameData.Status === "Lost" && bypassGameOver && (
            <p className={styles.debugWarning}>
              ⚠️ DEBUG MODE: You are currently dead but can continue playing
            </p>
          )}
        </div>

        {showDebug && (
          <div className={styles.debugSection}>
            <h3>Game State JSON</h3>
            <pre className={styles.jsonPre}>{JSON.stringify(gameData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;