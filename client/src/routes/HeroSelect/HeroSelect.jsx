import React, { useState, useContext, useEffect } from 'react';
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
    skills: ["Immune To Pits"],
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
    desc: "A nerdy fella, who is always prepared.",
    skills: ["Starts with 2 potions"],
    stats: {
      attack: 3,
      defense: 4,
      health: 5,
      magic: 10
    },
    class: "Collecter"
  },
  {
    id: 7,
    name: "Celestin",
    img: celestinImg,
    desc: "No matter the damage, he always gets back up.",
    skills: ["Gets a second chance"],
    stats: {
      attack: 7,
      defense: 5,
      health: 6,
      magic: 4
    },
    class: "Pheonix"
  },
  {
    id: 5,
    name: "Primo",
    img: primoImg,
    desc: "Crafty Mage that can make the best of what he has.",
    skills: ["Better Utilize Potions"],
    stats: {
      attack: 2,
      defense: 6,
      health: 7,
      magic: 9
    },
    class: "Mage"
  }
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 9 },
  { label: 'Medium', value: 11 },
  { label: 'Hard', value: 13 }
];

const HeroSelect = () => {
  const [mySelectedHero, setMySelectedHero] = useState(null);
  const [myHoveredHero, setMyHoveredHero] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_OPTIONS[1]); // Default to Medium
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { playSFX } = useContext(AudioContext);
  const myNavigate = useNavigate();

  // Get username from sessionStorage
  const getUsername = () => sessionStorage.getItem('username') || '';

  // Check for username and redirect if not found
  useEffect(() => {
    const username = getUsername();
    if (!username) {
      myNavigate('/');
    }
  }, [myNavigate]);

  const handleSelectHero = (finalTheHero) => {
    playSFX(clickSFX);
    setMySelectedHero(finalTheHero);
    setError(null); // Clear any previous errors
  };

  const handleDifficultyChange = (e) => {
    playSFX(clickSFX);
    const difficulty = DIFFICULTY_OPTIONS.find(opt => opt.value === parseInt(e.target.value));
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = async () => {
    const username = getUsername();
    if (!username) {
      setError('No username found. Please return to the main menu.');
      return;
    }

    playSFX(startSFX);
    setLoading(true);
    setError(null);
    
    console.log(`Starting game for ${username} with hero: ${mySelectedHero.name}, difficulty: ${selectedDifficulty.label} (maze size: ${selectedDifficulty.value})`);
    
    try {
      const res = await fetch(`api/game/?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hero_id: mySelectedHero.id, maze_size: selectedDifficulty.value }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to start game: ${res.status} - ${errorText}`);
      }
      
      const result = await res.json();
      console.log('Game created:', result);
      
      // Navigate to play screen
      myNavigate('/play', { state: { hero: mySelectedHero, difficulty: selectedDifficulty } });
    } catch (error) {
      console.error("Couldn't start the game:", error);
      setError(`Failed to start game: ${error.message}`);
      setLoading(false);
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

  const username = getUsername();

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
        {username && (
          <p style={{ color: '#fff', marginTop: '0.5rem', fontSize: '1.2rem' }}>
            Player: <strong>{username}</strong>
          </p>
        )}
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

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#ff4757', 
              textAlign: 'center', 
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 71, 87, 0.1)',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {/* Difficulty Selection and Start Button */}
          {mySelectedHero && (
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div className={styles.difficultySelector}>
                <label className={styles.difficultyLabel}>Select Difficulty:</label>
                <select 
                  className={styles.difficultyDropdown}
                  value={selectedDifficulty.value}
                  onChange={handleDifficultyChange}
                  disabled={loading}
                >
                  {DIFFICULTY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} (Maze Size: {option.value})
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className={styles.startButton} 
                onClick={handleStartGame}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                <span className={styles.buttonText}>
                  {loading ? 'STARTING...' : 'BEGIN ADVENTURE'}
                </span>
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