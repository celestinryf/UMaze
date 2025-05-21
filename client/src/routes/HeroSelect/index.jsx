import React, { useState } from 'react';
import HeroCard from '../../components/HeroCard';
import styles from './HeroSelect.module.css';
import { useNavigate } from 'react-router-dom';

// Hero data with expanded information
const heroes = [
  {
    id: 1,
    name: "Nick",
    img: "/heroes/warrior.png", // Replace with actual image path
    desc: "A powerful warrior with high attack damage and strong defense capabilities. Perfect for players who prefer direct combat.",
    skills: ["Heavy Strike", "Shield Bash", "Battle Cry"],
    stats: {
      attack: 8,
      defense: 7,
      health: 9,
      magic: 2
    }
  },
  {
    id: 2,
    name: "Matthew",
    img: "/heroes/mage.png", // Replace with actual image path
    desc: "A brilliant mage who masters arcane spells and tactical positioning. Ideal for players who enjoy strategic gameplay.",
    skills: ["Fireball", "Ice Shield", "Teleport"],
    stats: {
      attack: 3,
      defense: 4,
      health: 5,
      magic: 10
    }
  },
  {
    id: 3,
    name: "Celestin",
    img: "/heroes/rogue.png", // Replace with actual image path
    desc: "A nimble rogue with exceptional speed and evasion abilities. Best for players who prefer stealth and critical strikes.",
    skills: ["Shadow Step", "Backstab", "Smoke Bomb"],
    stats: {
      attack: 7,
      defense: 5,
      health: 6,
      magic: 4
    }
  },
  {
    id: 4,
    name: "Primo",
    img: "/heroes/healer.png", // Replace with actual image path
    desc: "A dedicated healer with support abilities and protective enchantments. Perfect for players who enjoy helping their team.",
    skills: ["Healing Touch", "Protection Aura", "Divine Blessing"],
    stats: {
      attack: 2,
      defense: 6,
      health: 7,
      magic: 9
    }
  }
];

const HeroSelect = () => {
  const navigate = useNavigate();
  const [selectedHero, setSelectedHero] = useState(null);
  const [hoveredHero, setHoveredHero] = useState(null);

  const handleSelectHero = (hero) => {
    setSelectedHero(hero);
  };

  const handleStartGame = () => {
    // Implement navigation to game screen with selected hero
    console.log(`Starting game with hero: ${selectedHero.name}`);
    navigate('/play', { state: { hero: selectedHero } });
    // Navigation logic here, e.g., redirect to "/play" with the selected hero
  };

  return (
    <div className={styles.heroSelectContainer}>
      <div className={styles.header}>
        <h1 className={styles.gameTitle}>Choose Your Hero</h1>
        <p className={styles.subtitle}>Select a character to begin your adventure</p>
      </div>

      <div className={styles.cardContainer}>
        {heroes.map((hero) => (
          <div 
            key={hero.id}
            className={`
              ${styles.cardWrapper} 
              ${selectedHero && selectedHero.id === hero.id ? styles.selected : ''}
              ${hoveredHero && hoveredHero.id === hero.id ? styles.hovered : ''}
            `}
            onClick={() => handleSelectHero(hero)}
            onMouseEnter={() => setHoveredHero(hero)}
            onMouseLeave={() => setHoveredHero(null)}
          >
            <HeroCard 
              props={{
                name: hero.name,
                img: hero.img, 
                desc: hero.desc, 
                skills: hero.skills
              }}
            />
          </div>
        ))}
      </div>

      {selectedHero && (
        <div className={styles.heroDetails}>
          <div className={styles.detailsHeader}>
            <h2>{selectedHero.name}</h2>
            <p className={styles.heroDesc}>{selectedHero.desc}</p>
          </div>
          
          <div className={styles.statsContainer}>
            <h3>Hero Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Attack</span>
                <div className={styles.statBarContainer}>
                  <div 
                    className={styles.statBar} 
                    style={{ width: `${selectedHero.stats.attack * 10}%` }}
                  />
                </div>
                <span className={styles.statValue}>{selectedHero.stats.attack}/10</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Defense</span>
                <div className={styles.statBarContainer}>
                  <div 
                    className={styles.statBar} 
                    style={{ width: `${selectedHero.stats.defense * 10}%` }}
                  />
                </div>
                <span className={styles.statValue}>{selectedHero.stats.defense}/10</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Health</span>
                <div className={styles.statBarContainer}>
                  <div 
                    className={styles.statBar} 
                    style={{ width: `${selectedHero.stats.health * 10}%` }}
                  />
                </div>
                <span className={styles.statValue}>{selectedHero.stats.health}/10</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Magic</span>
                <div className={styles.statBarContainer}>
                  <div 
                    className={styles.statBar} 
                    style={{ width: `${selectedHero.stats.magic * 10}%` }}
                  />
                </div>
                <span className={styles.statValue}>{selectedHero.stats.magic}/10</span>
              </div>
            </div>
          </div>

          <div className={styles.skillsSection}>
            <h3>Special Skills</h3>
            <ul className={styles.skillsList}>
              {selectedHero.skills.map((skill, index) => (
                <li key={index} className={styles.skillItem}>
                  <span className={styles.skillIcon}>✦</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <button 
            className={styles.startButton}
            onClick={handleStartGame}
          >
            Begin Adventure with {selectedHero.name}
          </button>
        </div>
      )}

      {!selectedHero && (
        <div className={styles.promptMessage}>
          <p>Select a hero to view details and begin your adventure</p>
        </div>
      )}
    </div>
  );
};

export default HeroSelect;