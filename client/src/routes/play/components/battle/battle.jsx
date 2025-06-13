import React, { useState, useEffect } from 'react';
import styles from './battle.module.css';

import salmon from '../../../../assets/sprites/salmon.png';
import bee_hive from '../../../../assets/sprites/bee_hive.png';
import anthill from '../../../../assets/sprites/anthill.png';
import nickImg from '../../../../assets/nick.png';
import matthewImg from '../../../../assets/matthew.png';
import celestinImg from '../../../../assets/celestin.png';
import primoImg from '../../../../assets/primo.png';

const POTION_TYPES = {
  "Health": 'Health Buzz Ball',
  "Attack": 'Attack Buzz Ball'
};

const heroImages = {
  'NICK': nickImg,
  'MATT': matthewImg,
  'CELESTIN': celestinImg,
  'PRIMO': primoImg
};

const EnemyImages = {
  'SALMON': salmon,
  'BEEHIVE': bee_hive,
  'ANTHILL': anthill
};

const getName = (type, mapping) => mapping[type] || 'Unknown';

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

const BattleOverlay = ({ hero, monster, collectedPotions, onBattleEnd, gameAPI }) => {
  const [currentHero, setCurrentHero] = useState(hero);
  const [currentMonster, setCurrentMonster] = useState(monster);
  const [battleMessage, setBattleMessage] = useState(`A wild ${monster.Name} appears!`);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setCurrentHero(hero);
    setCurrentMonster(monster);
  }, [hero, monster]);

  const attackMonster = async (isSpecial) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await gameAPI.attack(isSpecial);
      
      // Update local state with the result
      setCurrentHero(result.Hero);
      
      const updatedMonster = result?.Maze?.Grid?.[result.Maze.CurrCoords.X]?.[result.Maze.CurrCoords.Y]?.RoomMonster;
      const attackType = isSpecial ? 'special attack' : 'attack';
      
      if (updatedMonster) {
        setCurrentMonster(updatedMonster);
        setBattleMessage(`You used ${attackType}! Monster HP: ${updatedMonster.CurrHealth}`);
      } else {
        setCurrentMonster({ ...currentMonster, CurrHealth: 0 });
        setBattleMessage(`Your ${attackType} defeated the monster!`);
        
        // Automatically end battle after a short delay when monster is defeated
        setTimeout(() => {
          handleBattleEnd(result, "Monster defeated! You can now move freely.");
        }, 1500);
      }
    } catch (err) {
      setBattleMessage(`Attack failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const continueBattle = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Fetch updated game state from backend after monster defeat
      const updatedData = await gameAPI.getGame();
      handleBattleEnd(updatedData, "Monster defeated! You can now move freely.");
    } catch (err) {
      // Still end battle even if sync fails, but with error message
      handleBattleEnd(null, `Error syncing game state: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const usePotion = async (potionType) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await gameAPI.usePotion(potionType);
      
      // Update local hero state
      setCurrentHero(result.Hero);
      setBattleMessage(`Used ${getName(potionType, POTION_TYPES)}! ${potionType === 'Health' ? 'Health restored!' : 'Attack boosted!'}`);
    } catch (err) {
      setBattleMessage(`Buzz Ball use failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBattleEnd = (updatedGameData, message) => {
    if (onBattleEnd) {
      onBattleEnd(updatedGameData, message);
    }
  };

  const canUseSpecial = currentHero.CurrCoolDown === 0;
  const isMonsterDefeated = currentMonster.CurrHealth <= 0;
  
  return (
    <div className={styles.battleOverlay}>
      <div className={styles.battleContainer}>
        <h2 className={styles.battleTitle}>⚔️ BATTLE ⚔️</h2>
        
        <div className={styles.battleArena}>
          {/* Monster Section */}
          <div className={styles.battleMonsterSection}>
            <div className={styles.battleCharacterInfo}>
              <h3>{currentMonster.Name}</h3>
              <HealthBar 
                current={Math.max(0, currentMonster.CurrHealth)} 
                total={currentMonster.TotalHealth} 
                label="HP"
                showLabel={true}
                className={styles.battleHealthBar}
              />
              <p className={styles.battleStats}>ATK: {currentMonster.Attack}</p>
            </div>
            <div className={styles.battleMonsterSprite}>
              {EnemyImages[currentMonster.Name] ? (
                <img 
                  src={EnemyImages[currentMonster.Name]} 
                  alt={currentMonster.Name} 
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
              {heroImages[currentHero.Name] ? (
                <img src={heroImages[currentHero.Name]} alt={currentHero.Name} />
              ) : (
                <span className={styles.heroEmoji}>🗡️</span>
              )}
            </div>
            <div className={styles.battleCharacterInfo}>
              <h3>{currentHero.Name}</h3>
              <HealthBar 
                current={currentHero.CurrHealth} 
                total={currentHero.TotalHealth} 
                label="HP"
                showLabel={true}
                className={styles.battleHealthBar}
              />
              <p className={styles.battleStats}>ATK: {currentHero.Attack}</p>
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
        {!isMonsterDefeated ? (
          <div className={styles.battleActions}>
            <button 
              onClick={() => attackMonster(false)} 
              className={styles.battleButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Attack'}
            </button>
            <button 
              onClick={() => attackMonster(true)} 
              className={styles.battleButton}
              disabled={!canUseSpecial || isProcessing}
              title={!canUseSpecial ? `Special Attack on cooldown: ${currentHero.CurrCoolDown} attacks remaining` : 'Use Special Attack'}
            >
              Special Attack {!canUseSpecial && `(${currentHero.CurrCoolDown})`}
            </button>
            
            {/* Buzz Ball Actions */}
            {["Health", "Attack"].map(potion => {
              const count = collectedPotions.has ? (collectedPotions.has(String(potion)) ? collectedPotions.get(String(potion)) : 0) : collectedPotions.filter(p => p === potion).length;
              const canUse = count > 0;
              const potionName = getName(potion, POTION_TYPES);

              return (
                <button
                  key={potion}
                  onClick={() => canUse && usePotion(potion)}
                  className={`${styles.battleButton} ${styles.battlePotionButton}`}
                  disabled={!canUse || isProcessing}
                  title={canUse ? `Use ${potionName}` : `No ${potionName}s available`}
                >
                  Use {potionName} ({count})
                </button>
              );
            })}
          </div>
        ) : (
          <div className={styles.battleVictory}>
            <p>Victory! The {currentMonster.Name} has been defeated!</p>
            <button 
              onClick={continueBattle} 
              className={styles.battleButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Loading...' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleOverlay;