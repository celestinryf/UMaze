// src/context/AudioContext.jsx
import React, { createContext, useEffect, useRef, useState } from 'react';
import musicFile from '../assets/music.mp3';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(new Audio(musicFile));

  // Start audio after first user interaction (e.g. click).. couldn't find a way to make it start automatically :(
  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted) {
        const audio = audioRef.current;
        audio.loop = true;
        audio.volume = volume / 100;
        audio.play().catch((e) => {
          console.warn("Playback blocked by browser:", e.message);
        });
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', startAudio);
    return () => window.removeEventListener('click', startAudio);
  }, [hasInteracted, volume]);

  // Sync volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <AudioContext.Provider value={{ volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
};
