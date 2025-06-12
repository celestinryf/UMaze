import React from 'react';
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

const BattleOverlay = ({ hero, monster, onAttack, onSpecialAttack, onContinue, onUsePotion, battleMessage, collectedPotions }) => {
  const canUseSpecial = hero.CurrCoolDown === 0;
  
  return (
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
              disabled={!canUseSpecial}
              title={!canUseSpecial ? `Special Attack on cooldown: ${hero.CurrCoolDown} attacks remaining` : 'Use Special Attack'}
            >
              Special Attack {!canUseSpecial && `(${hero.CurrCoolDown})`}
            </button>
            
            {/* Buzz Ball Actions */}
            {["Health", "Attack"].map(potion => {
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
};

export default BattleOverlay;