import React from 'react';

const Fight = ({ monster, hero, onVictory, onEscape }) => {
  return (
    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-8 max-w-4xl mx-auto text-center text-white">
      <h2 className="text-3xl font-bold mb-5 text-red-400">Battle!</h2>
      
      <div className="flex justify-between items-center my-8 gap-5">
        <div className="flex-1 bg-gray-700 p-5 rounded-lg border-2 border-teal-400">
          <h3 className="text-xl font-semibold mb-3">{hero.Name}</h3>
          <div className="w-full h-5 bg-gray-600 rounded-full my-3 overflow-hidden">
            <div 
              className="h-full bg-teal-400 transition-all duration-300 ease-in-out" 
              style={{ width: `${(hero.CurrHealth / hero.TotalHealh) * 100}%` }}
            ></div>
          </div>
          <p className="mb-2">HP: {hero.CurrHealth}/{hero.TotalHealh}</p>
          <p>Attack: {hero.Attack}</p>
        </div>
        
        <div className="text-2xl font-bold text-yellow-300 px-3">VS</div>
        
        <div className="flex-1 bg-gray-700 p-5 rounded-lg border-2 border-red-400">
          <h3 className="text-xl font-semibold mb-3">{monster.Name}</h3>
          <div className="w-full h-5 bg-gray-600 rounded-full my-3 overflow-hidden">
            <div className="w-full h-full bg-red-400 transition-all duration-300 ease-in-out"></div>
          </div>
          <p className="mb-2">HP: {monster.Health}</p>
          <p>Attack: {monster.Attack}</p>
        </div>
      </div>
      
      <div className="bg-gray-900 border-2 border-gray-600 rounded p-4 my-5">
        <p className="text-lg">A wild {monster.Name} appears!</p>
      </div>
      
      <div className="flex gap-5 justify-center mt-8">
        <button 
          className="px-8 py-4 text-lg font-bold bg-red-500 text-white rounded border-none cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600 hover:-translate-y-1"
          onClick={onVictory}
        >
          Fight (Auto Win)
        </button>
        <button 
          className="px-8 py-4 text-lg font-bold bg-yellow-400 text-gray-800 rounded border-none cursor-pointer transition-all duration-300 ease-in-out hover:bg-yellow-300 hover:-translate-y-1"
          onClick={onEscape}
        >
          Escape
        </button>
      </div>
    </div>
  );
};

export default Fight;