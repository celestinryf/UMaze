import React, { createContext, useEffect, useRef, useState } from 'react';
import musicFile from '../assets/music.mp3';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);

  const musicRef = useRef(new Audio(musicFile));

  // Start music only after user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        const music = musicRef.current;
        music.loop = true;
        music.volume = musicVolume / 100;
        music.play().catch((e) => console.warn("Music blocked:", e.message));
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [hasInteracted]);

  // Update music volume
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  // Function to play UI sound effect
  const playSFX = (file) => {
    const sfx = new Audio(file);
    sfx.volume = sfxVolume / 100;
    sfx.play().catch((e) => console.warn("SFX blocked:", e.message));
  };

  return (
    <AudioContext.Provider value={{
      musicVolume, setMusicVolume,
      sfxVolume, setSfxVolume,
      playSFX
    }}>
      {children}
    </AudioContext.Provider>
  );
};
