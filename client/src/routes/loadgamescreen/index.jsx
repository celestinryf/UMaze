import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard';

const LoadGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const myNavigate = useNavigate();

        // Load games from db
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

    // Removes game from db and client
    const removeGame = async (id) => {
        try {
            const res = await fetch('/api/load', { method: 'DELETE' ,  headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({Id: id})
            });

            if (!res.ok) throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);

            setGames((prevGames) => prevGames.filter((game) => game.Id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const loadGame = async (theId) => {
        try {
            const res = await fetch('api/load/', { 
                method: 'PUT' , 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: theId })
            });
            if (!res.ok) throw new Error(`Network respsonse was not ok`);
            myNavigate('/play'); 
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Load Saved Games</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            games && games.map((game, index) => (
            <div key={index}>
                <GameCard name={game.Name} date={game.Date} />
                <button onClick={() => loadGame(game.Id)}>Load Game</button>
                <button onClick={() => removeGame(game.Id)}>Remove Game</button>
            </div>
            ))
        )}
        <p>{error}</p>
        </div>
    );
};

export default LoadGames;
