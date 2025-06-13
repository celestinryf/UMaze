import React from 'react';
import styles from './movement.module.css';

const MovementControls = ({ inBattle, onMove }) => {
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
              className={styles.moveButton}
              onClick={() => onMove(-1, 0)}
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
              onClick={() => onMove(0, -1)}
              disabled={inBattle}
              title="Move Left"
            >
              ←
            </button>
            <button
              className={styles.moveButton}
              onClick={() => onMove(1, 0)}
              disabled={inBattle}
              title="Move Down"
            >
              ↓
            </button>
            <button
              className={styles.moveButton}
              onClick={() => onMove(0, 1)}
              disabled={inBattle}
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