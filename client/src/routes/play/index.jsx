import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Play.module.css';

const Play = () => {
  const location = useLocation();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [gName, setgName] = useState("");
  const [gMessage, setGMessage] = useState("");

  const getRoomTypeName = (type) => {
    switch (type) {
      case 0: return 'Wall';
      case 1: return 'Entrance';
      case 2: return 'Exit';
      case 3: return 'Normal';
      case 4: return 'Pit';
      default: return 'Unknown';
    }
  };

  const getPillarName = (type) => {
    switch (type) {
      case 1: return 'Abstraction';
      case 2: return 'Encapsulation';
      case 3: return 'Inheritance';
      case 4: return 'Polymorphism';
      default: return 'None';
    }
  };

  const getPotionName = (type) => {
    switch (type) {
      case 1: return 'Health';
      case 2: return 'Attack';
      default: return 'None';
    }
  };

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const res = await fetch('/api/game', { method: 'GET' });
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setGameData(data);
      } catch (err) {
        setError(`Failed to fetch game state: ${err.message}`);
      }
    };

    fetchGameData();
  }, []);

  const saveGame = async () => {
    try {
      const res = await fetch('/api/load/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: gName })
      });
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
      setgName("");
      setGMessage(`Game saved successfully! (${res.status})`);
    } catch (err) {
      setGMessage(`Error saving game: ${err.message}`);
    }
  };

  const attackMonster = async () => {
    try {
      const res = await fetch('/api/battle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ })
      });
      if (!res.ok) throw new Error(`Failed to attack: ${res.status}`);
      const result = await res.json();

      setGameData(result);
      const monster = result?.Maze?.Grid?.[result.Maze.coords.row]?.[result.Maze.coords.col]?.RoomMonster;
      setGMessage(`Attacked monster! Hero HP: ${result.Hero.CurrHealth}, Monster HP: ${monster?.CurrHealth ?? 'Defeated'}`);
    } catch (err) {
      setGMessage(`Attack failed: ${err.message}`);
    }
  };

  const usePotion = async (potionType) => {
    try {
      const res = await fetch('/api/potion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ potion_type: potionType })
      });
      if (!res.ok) throw new Error(`Failed to use potion: ${res.status}`);
      const result = await res.json();
      console.log(result);
      setGameData(result);
      setGMessage(`Used ${getPotionName(potionType)} Potion!`);
    } catch (err) {
      setGMessage(`Potion use failed: ${err.message}`);
    }
  };

  const movePlayer = async (newRow, newCol) => {
    const { Maze } = gameData;
    const { Grid, coords } = Maze;

    if (Grid[coords.row][coords.col].RoomMonster) {
      setGMessage("A monster blocks your path! Defeat it before moving.");
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
      const res = await fetch('/api/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row: newRow, col: newCol })
      });
      if (!res.ok) throw new Error(`Failed to move: ${res.status}`);
      const updatedData = await res.json();
      setGameData(updatedData);
      setGMessage(`Moved to row ${newRow + 1}, col ${newCol + 1}`);
    } catch (err) {
      setGMessage(`Move failed: ${err.message}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameData) return;
      const { coords } = gameData.Maze;
      switch (e.key) {
        case 'ArrowUp': movePlayer(coords.row - 1, coords.col); break;
        case 'ArrowDown': movePlayer(coords.row + 1, coords.col); break;
        case 'ArrowLeft': movePlayer(coords.row, coords.col - 1); break;
        case 'ArrowRight': movePlayer(coords.row, coords.col + 1); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData]);

  const toggleDebugSection = () => {
    setShowDebug(!showDebug);
  };

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

  const { Maze, Hero } = gameData;
  const { Grid, coords } = Maze;
  const currentRoom = Grid[coords.row][coords.col];
  const collectedPillars = Hero.AquiredPillars || [];
  const collectedPotions = Hero.AquiredPotions || [];

  return (
    <div className={styles.mazeGame}>
      <h1 className={styles.gameTitle}>Maze Adventure</h1>

      <div className={styles.saveSection}>
        <label htmlFor="gameName">Game Name: </label>
        <input
          type="text"
          id="gameName"
          value={gName}
          onChange={e => setgName(e.target.value)}
        />
        <button onClick={saveGame}>Save Game</button>
        <p className={styles.saveMessage}>{gMessage}</p>
      </div>

      {currentRoom.RoomMonster && (
        <div className={styles.encounterAlert}>
          <p>⚔️ A wild {currentRoom.RoomMonster.Name} blocks your path! HP: {currentRoom.RoomMonster.CurrHealth}</p>
          <button onClick={() => attackMonster(false)}>Attack</button>
          <button onClick={() => attackMonster(true)}>Special Attack</button>

          {/* Allow potion usage during encounter */}
          {collectedPotions.includes(1) && (
            <button onClick={() => usePotion(1)}>Use Health Potion</button>
          )}
          {collectedPotions.includes(2) && (
            <button onClick={() => usePotion(2)}>Use Strength Potion</button>
          )}
        </div>
      )}

      <div className={styles.heroCard}>
        <h2>Hero: {Hero.Name}</h2>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Health:</span>
            <div className={styles.healthBar}>
              <div
                className={styles.healthFill}
                style={{ width: `${(Hero.CurrHealth / Hero.TotalHealh) * 100}%` }}
              ></div>
              <span className={styles.healthText}>
                {Hero.CurrHealth} / {Hero.TotalHealh}
              </span>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Attack:</span> {Hero.Attack}
          </div>
        </div>
      </div>

      <div className={styles.collectionSection}>
        <h2>Pillars Collected</h2>
        <div className={styles.pillarsContainer}>
          {[1, 2, 3, 4].map(pillar => (
            <div
              key={pillar}
              className={`${styles.pillarItem} ${collectedPillars.includes(pillar) ? styles.collected : styles.missing}`}
            >
              <div className={styles.pillarIcon}>P</div>
              <span>{getPillarName(pillar)}</span>
              {collectedPillars.includes(pillar) ? (
                <span className={styles.checkmark}>✓</span>
              ) : (
                <span className={styles.crossmark}>✗</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.collectionSection}>
        <h2>Potions Collected</h2>
        <div className={styles.potionsContainer}>
          {[1, 2, 3].map(potion => {
            const count = collectedPotions.filter(p => p === potion).length;
            return (
              <div key={potion} className={styles.potionItem}>
                <div className={`${styles.potionIcon} ${styles[`potion${potion}`]}`}>
                  {count}
                </div>
                <span>{getPotionName(potion)} Potions: {count}</span>
              </div>
            );
          })}
        </div>
      </div>

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
                    className={`
                      ${styles.mazeCell}
                      ${isWall ? styles.wall : ''}
                      ${isCurrent ? styles.currentCell : ''}
                      ${cell.RoomType === 1 ? styles.entrance : ''}
                      ${cell.RoomType === 2 ? styles.exit : ''}
                      ${cell.RoomType === 4 ? styles.pit : ''}
                    `}
                  >
                    {isCurrent && <div className={styles.player}>☺</div>}

                    {!isWall && (
                      <div className={styles.cellContents}>
                        {cell.RoomMonster && (
                          <div className={styles.monsterIndicator}>M</div>
                        )}
                        {cell.PillarType > 0 && (
                          <div className={styles.pillarIndicator}>P{cell.PillarType}</div>
                        )}
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

        <div className={styles.mapLegend}>
          <div className={styles.legendItem}><div className={styles.legendColor + ' ' + styles.wall}></div> Wall</div>
          <div className={styles.legendItem}><div className={styles.legendColor + ' ' + styles.entrance}></div> Entrance</div>
          <div className={styles.legendItem}><div className={styles.legendColor + ' ' + styles.exit}></div> Exit</div>
          <div className={styles.legendItem}><div className={styles.legendColor + ' ' + styles.normal}></div> Normal Room</div>
          <div className={styles.legendItem}><div className={styles.legendColor + ' ' + styles.pit}></div> Pit</div>
          <div className={styles.legendItem}><div className={styles.legendIcon}>☺</div> Player</div>
          <div className={styles.legendItem}><div className={styles.legendIcon}>M</div> Monster</div>
          <div className={styles.legendItem}><div className={styles.legendIcon}>P#</div> Pillar</div>
          <div className={styles.legendItem}><div className={styles.legendIcon + ' ' + styles.potion1}></div> Health Potion</div>
          <div className={styles.legendItem}><div className={styles.legendIcon + ' ' + styles.potion2}></div> Attack Potion</div>
        </div>
      </div>

      <div className={styles.roomDetails}>
        <h2>Current Room</h2>
        <div className={styles.roomInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Position:</span>
            Row {coords.row + 1}, Column {coords.col + 1}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Room Type:</span>
            {getRoomTypeName(currentRoom.RoomType)}
          </div>

          {currentRoom.RoomMonster && (
            <div className={styles.monsterCard}>
              <h3>Monster: {currentRoom.RoomMonster.Name}</h3>
              <div className={styles.monsterStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Health:</span>
                  <div className={styles.healthBar}>
                    <div
                      className={styles.healthFill}
                      style={{ width: `${(currentRoom.RoomMonster.CurrHealth / currentRoom.RoomMonster.TotalHealth) * 100}%` }}
                    ></div>
                    <span className={styles.healthText}>
                      {currentRoom.RoomMonster.CurrHealth} / {currentRoom.RoomMonster.TotalHealth}
                    </span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Attack:</span> {currentRoom.RoomMonster.Attack}
                </div>
              </div>
            </div>
          )}

          {currentRoom.PillarType > 0 && (
            <div className={styles.featureCard}>
              <h3>Pillar: {getPillarName(currentRoom.PillarType)}</h3>
              <div className={styles.pillarIcon}>P{currentRoom.PillarType}</div>
            </div>
          )}

          {currentRoom.PotionType > 0 && (
            <div className={styles.featureCard}>
              <h3>Potion: {getPotionName(currentRoom.PotionType)}</h3>
              <div className={`${styles.potionIcon} ${styles[`potion${currentRoom.PotionType}`]}`}></div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.debugToggle}>
        <button onClick={toggleDebugSection}>
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>

      {showDebug && (
        <div className={styles.debugSection}>
          <h3>Game State JSON</h3>
          <pre className={styles.jsonPre}>{JSON.stringify(gameData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Play;
