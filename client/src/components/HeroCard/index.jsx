import React from 'react';
import styles from './HeroCard.module.css';

const HeroCard = ({ props }) => {
  const { name, img, desc, skills } = props;
  
  // Generate a truncated description for the card
  const shortDesc = typeof desc === 'string' 
    ? desc.length > 85 ? `${desc.substring(0, 85)}...` : desc 
    : '';
  
  return (
    <div className={styles.heroCard}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.imgContainer}>
            {/* If the image is just a placeholder text, show a default avatar */}
            {img === 'Placeholder' ? (
              <div className={styles.placeholderImg}>
                {name.charAt(0)}
              </div>
            ) : (
              <img src={img} alt={`${name} character`} className={styles.heroImg} />
            )}
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.heroName}>{name}</h2>
            <p className={styles.heroShortDesc}>{shortDesc}</p>
            
            {/* Display skills as tags if it's an array, otherwise as text */}
            <div className={styles.skillsContainer}>
              {Array.isArray(skills) ? (
                skills.slice(0, 2).map((skill, index) => (
                  <span key={index} className={styles.skillTag}>{skill}</span>
                ))
              ) : (
                <p className={styles.skillsText}>{skills}</p>
              )}
              {Array.isArray(skills) && skills.length > 2 && (
                <span className={styles.moreSkills}>+{skills.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.selectIndicator}>
        <span>Select</span>
      </div>
    </div>
  );
};

export default HeroCard;