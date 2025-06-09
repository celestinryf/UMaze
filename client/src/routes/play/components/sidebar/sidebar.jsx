import React from 'react';
import styles from './sidebar.module.css';

// Constants
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

// Utility function
const getName = (type, mapping) => mapping[type] || 'Unknown';

// Reusable Components
const Sidebar = ({ Hero, collectedPillars, collectedPotions, inBattle, usePotion }) => {
  return (
    <div className={styles.sidebar}>
      {/* Hero Stats - Redesigned */}
      <div className={styles.heroPanel}>
        <div className={styles.panelHeader}>
          <h2>🗡️ {Hero.Name}</h2>
        </div>
        <div className={styles.heroStatsGrid}>
          {/* Health Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>❤️</div>
              <h3>Health</h3>
            </div>
            <div className={styles.statProgress}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${(Hero.CurrHealth / Hero.TotalHealth) * 100}%` }}
              >
                <div className={styles.progressGradient}></div>
              </div>
              <div className={styles.statValue}>
                {Hero.CurrHealth}/{Hero.TotalHealth}
              </div>
            </div>
          </div>
          
          {/* Attack Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>⚔️</div>
              <h3>Attack</h3>
            </div>
            <div className={styles.statValueLarge}>
              {Hero.Attack}
              <span className={styles.statSubtext}>/100</span>
            </div>
            <div className={styles.statProgress}>
              <div 
                className={styles.progressBarAttack} 
                style={{ width: `${Hero.Attack}%` }}
              >
                <div className={styles.progressGradientAttack}></div>
              </div>
            </div>
          </div>
          
          {/* Level Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>⭐</div>
              <h3>Level</h3>
            </div>
            <div className={styles.statValueLarge}>
              {Hero.Level || 1}
            </div>
            <div className={styles.xpContainer}>
              <div className={styles.xpLabel}>XP: {Hero.XP || 0}/{Hero.NextLevelXP || 100}</div>
              <div className={styles.xpBar}>
                <div 
                  className={styles.xpFill} 
                  style={{ width: `${((Hero.XP || 0) / (Hero.NextLevelXP || 100)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Pillars Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>🏆</div>
              <h3>Pillars Found</h3>
            </div>
            <div className={styles.pillarsCount}>
              {collectedPillars.length}/{Object.keys(PILLAR_TYPES).length}
            </div>
            <div className={styles.pillarsProgress}>
              {Object.entries(PILLAR_TYPES).map(([id, name]) => {
                const pillarId = parseInt(id);
                const isCollected = collectedPillars.includes(pillarId);
                return (
                  <div 
                    key={pillarId} 
                    className={`${styles.pillarIndicator} ${isCollected ? styles.collected : ''}`}
                    title={name}
                  >
                    {isCollected ? '✓' : '○'}
                  </div>
                );
              })}
            </div>
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