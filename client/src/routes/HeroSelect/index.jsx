import React, { useState, useContext } from 'react';
import styles from './HeroSelect.module.css';
import { useNavigate } from 'react-router-dom';
import { AudioContext } from '../../context/AudioContext';
import clickSFX from '../../assets/click.mp3';
import startSFX from '../../assets/startGame.mp3';
import nickImg from '../../assets/nick.png';
import matthewImg from '../../assets/matthew.png';
import celestinImg from '../../assets/celestin.png';
import primoImg from '../../assets/primo.png';
import bgImage from '../../assets/background.jpg';

const myHeroes = [
  {
    id: 6,
    name: "Nick",
    img: nickImg,
    desc: "A powerful warrior with high attack damage and strong defense capabilities.",
    skills: ["Heavy Strike", "Shield Bash", "Battle Cry"],
    stats: {
      attack: 8,
      defense: 7,
      health: 9,
      magic: 2
    },
    class: "Warrior"
  },
  {
    id: 4,
    name: "Matthew",
    img: matthewImg,
    desc: "A brilliant mage who masters arcane spells and tactical positioning.",
    skills: ["Fireball", "Ice Shield", "Teleport"],
    stats: {
      attack: 3,
      defense: 4,
      health: 5,
      magic: 10
    },
    class: "Mage"
  },
  {
    id: 7,
    name: "Celestin",
    img: celestinImg,
    desc: "A nimble rogue with exceptional speed and evasion abilities.",
    skills: ["Shadow Step", "Backstab", "Smoke Bomb"],
    stats: {
      attack: 7,
      defense: 5,
      health: 6,
      magic: 4
    },
    class: "Rogue"
  },
  {
    id: 5,
    name: "Primo",
    img: primoImg,
    desc: "A dedicated healer with support abilities and protective enchantments.",
    skills: ["Healing Touch", "Protection Aura", "Divine Blessing"],
    stats: {
      attack: 2,
      defense: 6,
      health: 7,
      magic: 9
    },
    class: "Healer"
  }
];

const HeroSelect = () => {
  const [mySelectedHero, setMySelectedHero] = useState(null);
  const [myHoveredHero, setMyHoveredHero] = useState(null);
  const { playSFX } = useContext(AudioContext);
  const myNavigate = useNavigate();

  const handleSelectHero = (finalTheHero) => {
    playSFX(clickSFX);
    setMySelectedHero(finalTheHero);
  };

  const handleStartGame = async () => {
    playSFX(startSFX);
    console.log(`Starting game with hero: ${mySelectedHero.name}`);
    try {
      const res = await fetch('api/game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // can have variable maze_size, however must be odd
        // maybe 7, 9, 11, or 13
        body: JSON.stringify({ hero_id: mySelectedHero.id, maze_size: 7 }),
      });
      if (!res.ok) {
        throw new Error('http err')
      }
      const result = await res.json();
      console.log(result)
      myNavigate('/play', { state: { hero: mySelectedHero } });
    } catch (error) {
      console.log("Coulndt set the game")
    }
  };

  const StatBar = ({ label, value, color }) => (
    <div className={styles.statItem}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}/10</span>
      </div>
      <div className={styles.statBarBg}>
        <div 
          className={styles.statBarFill} 
          style={{ 
            width: `${value * 10}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );

  return (
    <div 
      className={styles.heroSelectContainer} 
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={styles.bgOverlay} />
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>CHOOSE YOUR HERO</h1>
        <div className={styles.titleUnderline} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.charactersSection} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.charactersGrid}>
            {myHeroes.map((theHero) => (
              <div
                key={theHero.id}
                className={`${styles.characterCard} ${mySelectedHero?.id === theHero.id ? styles.selected : ''} ${myHoveredHero?.id === theHero.id ? styles.hovered : ''}`}
                onClick={() => handleSelectHero(theHero)}
                onMouseEnter={() => setMyHoveredHero(theHero)}
                onMouseLeave={() => setMyHoveredHero(null)}
              >
                <div className={styles.characterImageContainer}>
                  <img src={theHero.img} alt={theHero.name} className={styles.characterImage} />
                  <div className={styles.characterOverlay}>
                    <div className={styles.characterName}>{theHero.name}</div>
                    <div className={styles.characterClass}>{theHero.class}</div>
                  </div>
                </div>
                {mySelectedHero?.id === theHero.id && (
                  <div className={styles.selectionIndicator}>
                    <div className={styles.selectionGlow} />
                    <div className={styles.selectionBorder} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Button wrapper with spacing */}
          {mySelectedHero && (
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
              <button className={styles.startButton} onClick={handleStartGame}>
                <span className={styles.buttonText}>BEGIN ADVENTURE</span>
                <div className={styles.buttonGlow} />
              </button>
            </div>
          )}
        </div>

        {mySelectedHero && (
          <div className={styles.detailsPanel}>
            <div className={styles.detailsHeader}>
              <h2 className={styles.heroName}>{mySelectedHero.name}</h2>
              <span className={styles.heroClass}>{mySelectedHero.class}</span>
            </div>
            <p className={styles.heroDescription}>{mySelectedHero.desc}</p>

            <div className={styles.statsSection}>
              <h3 className={styles.sectionTitle}>COMBAT STATS</h3>
              <div className={styles.statsGrid}>
                <StatBar label="ATK" value={mySelectedHero.stats.attack} color="#ff4757" />
                <StatBar label="DEF" value={mySelectedHero.stats.defense} color="#3742fa" />
                <StatBar label="HP" value={mySelectedHero.stats.health} color="#2ed573" />
                <StatBar label="MAG" value={mySelectedHero.stats.magic} color="#a55eea" />
              </div>
            </div>

            <div className={styles.skillsSection}>
              <h3 className={styles.sectionTitle}>SPECIAL ABILITIES</h3>
              <div className={styles.skillsList}>
                {mySelectedHero.skills.map((theSkill, theIndex) => (
                  <div key={theIndex} className={styles.skillItem}>
                    <div className={styles.skillIcon}>⚡</div>
                    <span className={styles.skillName}>{theSkill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!mySelectedHero && (
          <div className={styles.placeholderPanel}>
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon}>⚔️</div>
              <h3>Select a Hero</h3>
              <p>Choose your champion to view their abilities and begin your quest</p>
            </div>
          </div>
        )}
      </div>

      <button className={styles.backButton} onClick={() => {
        playSFX(clickSFX);
        myNavigate('/');
      }}>
        <span>← BACK TO MENU</span>
      </button>
    </div>
  );
};

export default HeroSelect;
