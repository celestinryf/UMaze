// import React from 'react';
// import styles from './maze.module.css';

// const Maze = ({ 
//   gameData, 
//   playerPosition, 
//   movePlayer, 
//   skipMonsters, 
//   collectedPillars, 
//   setCollectedPillars, 
//   collectedPotions, 
//   setCollectedPotions, 
//   setMessage, 
//   hasAllPillars,
//   inEncounter 
// }) => {
//   // Get the character for a room
//   const getRoomChar = (room, i, j) => {
//     // Player position overrides room display
//     if (playerPosition && i === playerPosition.row && j === playerPosition.col) {
//       return 'P';
//     }

//     if (room.RoomType === 0) {
//       return '+'; // Wall
//     } else if (room.RoomType === 1) {
//       return 'S'; // Start
//     } else if (room.RoomType === 2) {
//       return 'E'; // Exit
//     } else if (room.RoomMonster) {
//       return 'M'; // Monster
//     } else if (room.PillarType > 0) {
//       return room.PillarType.toString(); // Pillar with its number
//     } else if (room.PotionType > 0) {
//       return 'p'; // Potion
//     } else {
//       return '-'; // Path
//     }
//   };

//   // Get CSS class for a room
//   const getRoomClass = (room, i, j) => {
//     const isPlayer = playerPosition && i === playerPosition.row && j === playerPosition.col;
    
//     if (isPlayer) {
//       return `${styles.cell} ${styles.player}`;
//     } else if (room.RoomType === 0) {
//       return `${styles.cell} ${styles.wall}`;
//     } else if (room.RoomType === 1) {
//       return `${styles.cell} ${styles.start}`;
//     } else if (room.RoomType === 2) {
//       return `${styles.cell} ${styles.exit}`;
//     } else if (room.RoomMonster) {
//       return `${styles.cell} ${styles.monster}`;
//     } else if (room.PillarType > 0) {
//       return `${styles.cell} ${styles.pillar}`;
//     } else if (room.PotionType > 0) {
//       return `${styles.cell} ${styles.potion} ${styles['potion' + room.PotionType]}`;
//     } else {
//       return `${styles.cell} ${styles.path}`;
//     }
//   };

//   // Handle player movement directly from the maze
//   const handleMove = (direction) => {
//     movePlayer(direction);
//   };

//   return (
//     <>
//       <div className={styles.mazeContainer}>
//         {gameData.Maze.Grid.map((row, i) => (
//           <div key={i} className={styles.mazeRow}>
//             {row.map((cell, j) => (
//               <div 
//                 key={`${i}-${j}`} 
//                 className={getRoomClass(cell, i, j)}
//               >
//                 {getRoomChar(cell, i, j)}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
      
//       <div className={styles.controls}>
//         <button 
//           onClick={() => handleMove('up')}
//           disabled={inEncounter && !skipMonsters}
//           className={inEncounter && !skipMonsters ? styles.disabledButton : ''}
//         >
//           Up
//         </button>
//         <div className={styles.horizontalControls}>
//           <button 
//             onClick={() => handleMove('left')}
//             disabled={inEncounter && !skipMonsters}
//             className={inEncounter && !skipMonsters ? styles.disabledButton : ''}
//           >
//             Left
//           </button>
//           <button 
//             onClick={() => handleMove('right')}
//             disabled={inEncounter && !skipMonsters}
//             className={inEncounter && !skipMonsters ? styles.disabledButton : ''}
//           >
//             Right
//           </button>
//         </div>
//         <button 
//           onClick={() => handleMove('down')}
//           disabled={inEncounter && !skipMonsters}
//           className={inEncounter && !skipMonsters ? styles.disabledButton : ''}
//         >
//           Down
//         </button>
//       </div>
      
//       <div className={styles.legend}>
//         <h3>Legend:</h3>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.wall}`}>+</div> Wall
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.path}`}>-</div> Path
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.start}`}>S</div> Start
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.exit}`}>E</div> Exit
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.player}`}>P</div> Player
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.monster}`}>M</div> Monster
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.pillar}`}>1-4</div> Pillars
//         </div>
//         <div className={styles.legendItem}>
//           <div className={`${styles.cellSample} ${styles.potion}`}>p</div> Potions
//         </div>
//       </div>
//     </>
//   );
// };

// export default Maze;