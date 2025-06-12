import React, { useState, useContext } from 'react';
import styles from './HeroSelect.module.css';
import { useNavigate } from 'react-router-dom';
import { AudioContext } from '../../context/AudioContext';
import { gameAPI } from '../../context/api.js';
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
    name: "NICK",
    img: nickImg,
    desc: "A powerful warrior with high power.",
    spec: "DUI: Powerful, but reckless attack",
    pass: "Pregame: Starts with 2 Buzz Ballz",
    stats: {
      attack: 20,
      health: 200,
    },
    class: "Drunk Warrior"
  },
  {
    id: 4,
    name: "MATT",
    img: matthewImg,
    desc: "Bulky, who can take this guy down?.",
    pass: "Stinky: Immune to Poos",
    spec: "Always Hungry: Life Steal",
    stats: {
      attack: 25,
      health: 250,
    },
    class: "Tank"
  },
  {
    id: 7,
    name: "CELESTIN",
    img: celestinImg,
    desc: "No matter the damage, he always gets back up.",
    spec: "Great at Math: Halves Opponenents HP",
    pass: "Clutch: Gets a second life",
    stats: {
      attack: 30,
      health: 150,
    },
    class: "Phoenix"
  },
  {
    id: 5,
    name: "PRIMO",
    img: primoImg,
    desc: "Crafty Mage that can make the best of what he has.",
    pass: "Crafty: Better Utilizes Buzz Ballz",
    spec: "Gambler: Take a turn to increase attack, at the cost of health",
    stats: {
      attack: 15,
      health: 220,
    },
    class: "Mage"
  }
];

const DIFFICULTY_OPTIONS = [
  { label: 'Ultra-Easy', value: 5 },
  { label: 'Easy', value: 11 },
  { label: 'Medium', value: 15 },
  { label: 'Hard', value: 21 }
];

const HeroSelect = () => {
  const [mySelectedHero, setMySelectedHero] = useState(null);
  const [myHoveredHero, setMyHoveredHero] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_OPTIONS[1]); // Default to Medium
  const { playSFX } = useContext(AudioContext);
  const myNavigate = useNavigate();

  const handleSelectHero = (finalTheHero) => {
    playSFX(clickSFX);
    setMySelectedHero(finalTheHero);
  };

  const handleDifficultyChange = (e) => {
    playSFX(clickSFX);
    const difficulty = DIFFICULTY_OPTIONS.find(opt => opt.value === parseInt(e.target.value));
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = async () => {
    playSFX(startSFX);
    console.log(`Starting game with hero: ${mySelectedHero.name}, difficulty: ${selectedDifficulty.label} (maze size: ${selectedDifficulty.value})`);
    
    try {
      const result = await gameAPI.startGame(mySelectedHero.name, selectedDifficulty.value);
      console.log(result);
      myNavigate('/play', { state: { hero: mySelectedHero, difficulty: selectedDifficulty } });
    } catch (error) {
      console.log("Couldn't start the game:", error.message);
    }
  };

  const AttackBar = ({ label, value, color }) => (
    <div className={styles.statItem}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}/30</span>
      </div>
      <div className={styles.statBarBg}>
        <div 
          className={styles.statBarFill} 
          style={{ 
            width: `${value * 3.5}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
  const HealthBar = ({ label, value, color }) => (
    <div className={styles.statItem}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}/250</span>
      </div>
      <div className={styles.statBarBg}>
        <div 
          className={styles.statBarFill} 
          style={{ 
            width: `${value * 0.4}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
  return (
    <div 
      className={styles.heroSelectContainer} 
      style={{ '--background-image': `url(${bgImage})` }}
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

          {/* Difficulty Selection and Start Button */}
          {mySelectedHero && (
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div className={styles.difficultySelector}>
                <label className={styles.difficultyLabel}>Select Difficulty:</label>
                <select 
                  className={styles.difficultyDropdown}
                  value={selectedDifficulty.value}
                  onChange={handleDifficultyChange}
                >
                  {DIFFICULTY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} (Maze Size: {option.value})
                    </option>
                  ))}
                </select>
              </div>
              
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
                <HealthBar label="HP" value={mySelectedHero.stats.health} color="#00bfff" />
                <AttackBar label="ATK" value={mySelectedHero.stats.attack} color="#ff4757" />
              </div>
            </div>

            <div className={styles.skillsSection}>
              <h3 className={styles.sectionTitle}>Special Attack</h3>
              <div className={styles.skillsList}>
                <div className={styles.skillItem}>
                  <div className={styles.skillIcon}>🗡</div>
                  <span className={styles.skillName}>{mySelectedHero.spec}</span>
                </div>
              </div>
            </div>
            <div className={styles.skillsSection}>
              <h3 className={styles.sectionTitle}>Passive Ability</h3>
              <div className={styles.skillsList}>
                <div className={styles.skillItem}>
                  <div className={styles.skillIcon}>⚡</div>
                  <span className={styles.skillName}>{mySelectedHero.pass}</span>
                </div>
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