import React from 'react';
import styles from './mazegrid.module.css';

// Import all the image assets
import nickImg from '../../../../assets/nick.png';
import matthewImg from '../../../../assets/matthew.png';
import celestinImg from '../../../../assets/celestin.png';
import primoImg from '../../../../assets/primo.png';

import apple from '../../../../assets/sprites/apple.png';
import horn from '../../../../assets/sprites/horn.png';
import saddle from '../../../../assets/sprites/saddle.png';
import wings from '../../../../assets/sprites/wings.png';

import salmon from '../../../../assets/sprites/salmon.png';
import bee_hive from '../../../../assets/sprites/bee_hive.png';
import anthill from '../../../../assets/sprites/anthill.png';

import heal_potion from '../../../../assets/sprites/heal_potion.png';
import attack_potion from '../../../../assets/sprites/attack_potion.png';

import poop from '../../../../assets/sprites/poop.png';
import tree from '../../../../assets/sprites/tree.png';
import exit from '../../../../assets/sprites/exit.png';

// Constants
const PILLAR_TYPES = {
  "Apple": 'Apple',
  "Saddle": 'Saddle', 
  "Horn": 'Horn',
  "Wings": 'Wings'
};

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

const ToolsOfEscapeImages = {
  'APPLE': apple,
  'HORN': horn,
  'SADDLE': saddle,
  'WINGS': wings
};

const EnemyImages = {
  'SALMON': salmon,
  'BEEHIVE': bee_hive,
  'ANTHILL': anthill
};

const EnvironmentImages = {
  'POOP': poop,
  'TREE_WALL': tree
};

const PotionImages = {
  1: heal_potion,
  2: attack_potion
};

// Utility function
const getName = (type, mapping) => mapping[type] || 'Unknown';

const MazeGrid = ({ 
  Grid, 
  CurrCoords, 
  Hero, 
  visitedPits, 
  visitedExits 
}) => {
  // Cell class helper
  const getCellClasses = (cell, rowIndex, colIndex) => {
    const isCurrent = rowIndex === CurrCoords.X && colIndex === CurrCoords.Y;
    const isPit = cell.RoomType === "Poop";
    const isExit = cell.RoomType === "Exit";
    const isVisitedPit = isPit && visitedPits.has(`${rowIndex}-${colIndex}`);
    const isVisitedExit = isExit && visitedExits.has(`${rowIndex}-${colIndex}`);
    
    let roomTypeClass;
    if (isPit) {
      roomTypeClass = isVisitedPit ? styles.pitVisited : styles.pit;
    } else if (isExit) {
      roomTypeClass = isVisitedExit ? styles.exit : styles.path; // Hide exit until visited
    } else {
      roomTypeClass = {
        "Wall": styles.wall,
        "Entrance": styles.entrance,
        "Exit": styles.path
      }[cell.RoomType] || '';
    }

    return [
      styles.mazeCell,
      roomTypeClass,
      isCurrent && styles.currentCell
    ].filter(Boolean).join(' ');
  };

  return (
    <div className={styles.mazeWrapper}>
      <div className={styles.mazeGrid}>
        {Grid.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.mazeRow}>
            {row.map((cell, colIndex) => {
              const isCurrent = rowIndex === CurrCoords.X && colIndex === CurrCoords.Y;
              const isWall = cell.RoomType === "Wall";
              const isExit = cell.RoomType === "Exit";
              const isVisitedExit = isExit && visitedExits.has(`${rowIndex}-${colIndex}`);

              let cellStyle = {};
              if (isWall) {
                cellStyle['--wall-background'] = `url(${EnvironmentImages['TREE_WALL'] || tree})`;
              } else if (isExit && isVisitedExit) {
                cellStyle['--exit-background'] = `url(${exit})`;
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClasses(cell, rowIndex, colIndex)}
                  style={cellStyle}
                >
                  {isCurrent && (
                    <div className={styles.player}>
                      {heroImages[Hero.Name] ? (
                        <img 
                          src={heroImages[Hero.Name]} 
                          alt={Hero.Name} 
                          className={styles.playerImage}
                        />
                      ) : (
                        '☺'
                      )}
                    </div>
                  )}

                  {!isWall && (
                    <div className={styles.cellContents}>
                      {/* Monster */}
                      {cell.RoomMonster && (
                        <div className={styles.monsterIndicator}>
                          {EnemyImages[cell.RoomMonster.Name] ? (
                            <img 
                              src={EnemyImages[cell.RoomMonster.Name]} 
                              alt={cell.RoomMonster.Name}
                              className={styles.monsterImage}
                            />
                          ) : (
                            <span>M</span>
                          )}
                        </div>
                      )}

                      {/* Pit */}
                      {(cell.RoomType === "Poop") && visitedPits.has(`${rowIndex}-${colIndex}`) && (
                        <div className={styles.pitIndicator}>
                          {EnvironmentImages['POOP'] ? (
                            <img 
                              src={EnvironmentImages['POOP']} 
                              alt={'poop'}
                              className={styles.poopImage}
                            />
                          ) : (
                            <span>P</span>
                          )}
                        </div>
                      )}
                      
                      {/* Pillar */}
                      {cell.PillarType > '' && (
                        <div className={styles.pillarIndicator}>
                          {ToolsOfEscapeImages[PILLAR_TYPES[cell.PillarType].toUpperCase()] ? (
                            <img 
                              src={ToolsOfEscapeImages[PILLAR_TYPES[cell.PillarType].toUpperCase()]} 
                              alt={PILLAR_TYPES[cell.PillarType]}
                              className={styles.pillarImage}
                            />
                          ) : (
                            <span>P</span>
                          )}
                        </div>
                      )}
                      
                      {/* Potion */}
                      {cell.PotionType > 0 && (
                        <div className={`${styles.potionIndicator} ${styles[`potion${cell.PotionType}`]}`}>
                          {PotionImages[cell.PotionType] ? (
                            <img 
                              src={PotionImages[cell.PotionType]} 
                              alt={`${getName(cell.PotionType, POTION_TYPES)}`}
                              className={styles.potionImage}
                            />
                          ) : (
                            <span>♦</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MazeGrid;