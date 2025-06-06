import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard';

const LoadGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
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

    // Load games from db
    useEffect(() => {
        const fetchLoadGame = async () => {
            const username = getUsername();
            if (!username) return;

            try {
                setLoading(true);
                const res = await fetch(`/api/load?username=${encodeURIComponent(username)}`, { 
                    method: 'GET' 
                });

                if (!res.ok) {
                    throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
                }

                const loads = await res.json();
                
                setLoading(false);
                setGames(loads || []); // Ensure games is always an array
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchLoadGame();
    }, []);

    // Removes game from db and client
    const removeGame = async (id) => {
        const username = getUsername();
        if (!username) {
            setError('No username found');
            return;
        }

        try {
            const res = await fetch(`/api/load?username=${encodeURIComponent(username)}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
            }

            setGames((prevGames) => prevGames.filter((game) => game.Id !== id));
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const loadGame = async (theId) => {
        const username = getUsername();
        if (!username) {
            setError('No username found');
            return;
        }

        try {
            const res = await fetch(`/api/load?username=${encodeURIComponent(username)}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: theId })
            });
            
            if (!res.ok) {
                throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
            }
            
            // Game loaded to Redis, now navigate to play
            myNavigate('/play');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const username = getUsername();

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Load Saved Games</h1>
            {username && (
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                    Player: <strong>{username}</strong>
                </p>
            )}
            
            {loading ? (
                <p>Loading your saved games...</p>
            ) : error ? (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    <p>Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{ marginTop: '1rem' }}
                    >
                        Retry
                    </button>
                </div>
            ) : games.length === 0 ? (
                <div>
                    <p>No saved games found.</p>
                    <button 
                        onClick={() => myNavigate('/heroselect')} 
                        style={{ marginTop: '1rem' }}
                    >
                        Start New Game
                    </button>
                </div>
            ) : (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    maxWidth: '600px', 
                    margin: '0 auto' 
                }}>
                    {games.map((game, index) => (
                        <div 
                            key={game.Id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <GameCard name={game.Name} date={game.Date} />
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button 
                                    onClick={() => loadGame(game.Id)}
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Load Game
                                </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this save?')) {
                                            removeGame(game.Id);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '2rem' }}>
                <button 
                    onClick={() => myNavigate('/')}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
};

export default LoadGames;