import React, { useState } from 'react';
import styles from './sidebar.module.css';

// Constants
const PILLAR_TYPES = {
  "Apple": 'Apple',
  "Saddle": 'Saddle', 
  "Horn": 'Horn',
  "Wings": 'Wings'
};

const POTION_TYPES = {
  "Health": 'Health Straberry Rita',
  "Attack": 'Stength Berry Cherry Limeade'
};

// Utility function
const getName = (type, mapping) => mapping[type] || 'Unknown';

const Sidebar = ({ Hero, collectedPillars, collectedPotions, inBattle, usePotion }) => {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className={styles.sidebar}>
      {/* Hero Stats - Taller Panel */}
      <div className={styles.heroPanel}>
        <div className={styles.panelHeader}>
          <h2>🗡️ {Hero.Name}</h2>
        </div>
        <div className={styles.compactStats}>
          {/* Health Bar */}
          <div className={styles.statSection}>
            <div className={styles.healthBarContainer}>
              <div 
                className={styles.healthBarFill} 
                style={{ width: `${(Hero.CurrHealth / Hero.TotalHealth) * 100}%` }}
              />
              <div className={styles.healthText}>
                HP: {Hero.CurrHealth} / {Hero.TotalHealth}
              </div>
            </div>
          </div>
          
          {/* Attack Bar - Blue/Purple */}
          <div className={styles.statSection}>
            <div className={styles.attackBarContainer}>
              <div 
                className={styles.attackBarFill} 
                style={{ width: `${Hero.Attack}%` }}
              />
              <div className={styles.attackText}>
                ATK: {Hero.Attack}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory - Slightly Smaller Panel */}
      <div className={`${styles.inventoryPanel} ${styles.smallerInventory}`}>
        <div className={styles.panelHeader}>
          <h2>🎒 Inventory</h2>
        </div>
        <div className={styles.panelContent}>
          {/* Pillars */}
          <div className={styles.inventorySection}>
            <h3>Tools of Escape</h3>
            <div className={styles.pillarsList}>
              {Object.entries(PILLAR_TYPES).map(([id, name]) => {
                // Fixed: Use string id directly instead of parsing as int
                const isCollected = collectedPillars.includes(id);
                return (
                  <div
                    key={id}
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

          {/* Buzz Balls */}
          <div className={styles.inventorySection}>
            <h3>Buzz Ballz</h3>
            <div className={styles.potionsList}>
              {["Health", "Attack"].map(potion => {
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

      {/* Legend Toggle Button */}
      <div className={styles.legendToggle} onClick={() => setShowLegend(!showLegend)}>
        <div className={styles.toggleIcon}>
          {showLegend ? '▼' : '▲'} Legend
        </div>
      </div>

      {/* Collapsible Legend */}
      {showLegend && (
        <div className={styles.legendPanel}>
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
      )}
    </div>
  );
};

export default Sidebar;