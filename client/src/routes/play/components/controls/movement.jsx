import React, { useEffect, useCallback, useState } from 'react';
import styles from './movement.module.css';

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

const MovementControls = ({ 
  gameData,
  inBattle, 
  isTyping,
  gameAPI,
  onGameUpdate,
  onMessage,
  onBattleStart,
  onPitVisited,
  onExitVisited
}) => {
  const [isMoving, setIsMoving] = useState(false);

  // Core movement function with full logic
  const movePlayer = useCallback(async (newX, newY) => {
    if (!gameData || inBattle || isMoving) return;
    
    setIsMoving(true);
    
    const { Maze } = gameData;
    const { Grid, CurrCoords } = Maze;

    // Check if current room has a monster (should trigger battle)
    if (Grid[CurrCoords.X][CurrCoords.Y].RoomMonster) {
      if (onBattleStart) {
        onBattleStart();
      }
      setIsMoving(false);
      return;
    }

    // Validate movement bounds and walls
    if (
      newX < 0 || newX >= Grid.length ||
      newY < 0 || newY >= Grid[0].length ||
      Grid[newX][newY].RoomType === "Wall"
    ) {
      if (onMessage) {
        onMessage("Invalid move: Wall or out of bounds.");
      }
      setIsMoving(false);
      return;
    }

    try {
      // Make API call to move
      const updatedData = await gameAPI.move({ x: newX, y: newY });
      
      // Update main game state
      if (onGameUpdate) {
        onGameUpdate(updatedData);
      }
      
      // Send success message
      if (onMessage) {
        onMessage(`Moved to row ${newX + 1}, col ${newY + 1}`);
      }
      
      // Check new room for special properties
      const newRoom = updatedData.Maze.Grid[newX][newY];
      
      // Mark pit as visited
      if (newRoom.RoomType === "Poop" && onPitVisited) { // Pit
        onPitVisited(`${newX}-${newY}`);
      }
      
      // Mark exit as visited  
      if (newRoom.RoomType === "Exit" && onExitVisited) { // Exit
        onExitVisited(`${newX}-${newY}`);
      }
      
      // Check if new room has a monster (trigger battle)
      if (newRoom.RoomMonster && onBattleStart) {
        onBattleStart();
      }
    } catch (err) {
      // Send error message
      if (onMessage) {
        onMessage(`Move failed: ${err.message}`);
      }
    } finally {
      setIsMoving(false);
    }
  }, [gameData, inBattle, isMoving, gameAPI, onGameUpdate, onMessage, onBattleStart, onPitVisited, onExitVisited]);

  // Handle movement from buttons (relative movement)
  const handleButtonMove = useCallback((deltaX, deltaY) => {
    if (!gameData || inBattle || isMoving) return;
    
    const { CurrCoords } = gameData.Maze;
    movePlayer(CurrCoords.X + deltaX, CurrCoords.Y + deltaY);
  }, [gameData, inBattle, isMoving, movePlayer]);

  // Keyboard controls (supports both arrow keys and WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameData || !DIRECTIONS[e.key] || inBattle || isTyping || isMoving) return;
      
      const { CurrCoords } = gameData.Maze;
      const [dX, dY] = DIRECTIONS[e.key];
      movePlayer(CurrCoords.X + dX, CurrCoords.Y + dY);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameData, movePlayer, inBattle, isTyping, isMoving]);

  return (
    <>
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
              className={`${styles.moveButton} ${isMoving ? styles.moving : ''}`}
              onClick={() => handleButtonMove(-1, 0)}
              disabled={inBattle || isMoving}
              title="Move Up"
            >
              ↑
            </button>
            <div className={styles.controlSpacer}></div>
          </div>
          <div className={styles.controlRow}>
            <button
              className={`${styles.moveButton} ${isMoving ? styles.moving : ''}`}
              onClick={() => handleButtonMove(0, -1)}
              disabled={inBattle || isMoving}
              title="Move Left"
            >
              ←
            </button>
            <button
              className={`${styles.moveButton} ${isMoving ? styles.moving : ''}`}
              onClick={() => handleButtonMove(1, 0)}
              disabled={inBattle || isMoving}
              title="Move Down"
            >
              ↓
            </button>
            <button
              className={`${styles.moveButton} ${isMoving ? styles.moving : ''}`}
              onClick={() => handleButtonMove(0, 1)}
              disabled={inBattle || isMoving}
              title="Move Right"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovementControls;