import React, { useState } from 'react';

// Mock background image URL for demo
const backgroundImg = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop';

function Options() {
  // Mock audio context values for demo
  const [musicVolume, setMusicVolume] = useState(75);
  const [sfxVolume, setSfxVolume] = useState(50);

  const handleBackClick = () => {
    // Mock SFX play and navigation
    console.log('Playing click SFX');
    console.log('Navigating to main menu');
  };

  return (
    <>
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4);
          }
          100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
        }
        
        .glow-hover:hover {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
      `}</style>
      
      <div
        className="h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8 bg-black/50 text-white box-border"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 className="text-5xl mb-8 uppercase glow-text">
          Game Settings
        </h1>

        <div className="bg-black/60 border border-white/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md w-full max-w-md mx-auto mb-8 flex flex-col gap-6">
          <div className="my-6 w-full max-w-sm text-left">
            <label htmlFor="musicVolume" className="block">
              Music Volume: {musicVolume}
            </label>
            <input
              id="musicVolume"
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div className="my-6 w-full max-w-sm text-left">
            <label htmlFor="sfxVolume" className="block">
              SFX Volume: {sfxVolume}
            </label>
            <input
              id="sfxVolume"
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div className="my-6 w-full max-w-sm text-left">
            <label className="block">Difficulty</label>
            <select className="w-full p-2 mt-2 text-base bg-gray-900 text-white border border-gray-300 rounded">
              <option>Easy</option>
              <option>Normal</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <button
          className="mt-12 px-8 py-4 text-lg font-bold uppercase border-2 border-white/50 bg-white/10 text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-fuchsia-500/10 hover:scale-105 glow-hover rounded"
          onClick={handleBackClick}
        >
          ← Back to Main Menu
        </button>
      </div>
    </>
  );
}

export default Options;