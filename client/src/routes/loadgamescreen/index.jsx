import { useEffect, useState } from 'react';
import GameCard from '../../components/GameCard/GameCard';

const LoadGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchLoadGame = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/load', { method: 'GET' });

                if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);

                const loads = await res.json();
                
                setLoading(false);
                setGames(loads);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        };
        fetchLoadGame();
    }, []);

    // Removea game function to be added

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Load Saved Games</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            games.map((game) => (
            <>
                <GameCard key={game.Id} name={game.Name} date={game.Date} />
                <button onClick={removeGame()}>Remove Game</button>
            </>
            ))
        )}
        <p>{error}</p>
        </div>
    );
};

export default LoadGames;
