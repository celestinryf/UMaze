import React from 'react';
import styles from './Sidebar.module.css';

// Constants (copied from original)
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

// Utility function (copied from original)
const getName = (type, mapping) => mapping[type] || 'Unknown';

// Reusable Components (copied from original)
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

const StatBar = ({ current, max, label, className = '' }) => (
  <div className={`${styles.statItem} ${className}`}>
    <div className={styles.statBar}>
      <div
        className={styles.statFill}
        style={{ width: `${(current / max) * 100}%` }}
      />
      <span className={styles.statText}>
        {label}: {current}
      </span>
    </div>
  </div>
);

const Sidebar = ({ Hero, collectedPillars, collectedPotions, inBattle, usePotion }) => {
  return (
    <div className={styles.sidebar}>
      {/* Hero Stats */}
      <div className={styles.heroPanel}>
        <div className={styles.panelHeader}>
          <h2>🗡️ {Hero.Name}</h2>
        </div>
        <div className={styles.panelContent}>
          <HealthBar 
            current={Hero.CurrHealth} 
            total={Hero.TotalHealth} 
            label="HP" 
          />
          <StatBar 
            current={Hero.Attack} 
            max={100} 
            label="ATK" 
          />
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
                const count = collectedPotions.has(String(potion)) ? collectedPotions.get(String(potion)) : 0;
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
              <span>Hidden Pit</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendSymbol} ${styles.pitVisited}`}></div>
              <span>Discovered Pit</span>
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
  );
};

export default Sidebar;