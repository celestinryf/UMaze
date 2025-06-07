import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveLoadAPI, hasUsername, getDisplayUsername } from '../../context/api.js';
import GameCard from '../../components/GameCard/GameCard';

const LoadGames = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const myNavigate = useNavigate();

    // Get username from API service
    const username = hasUsername() ? getDisplayUsername() : null;

    // Check for username and redirect if not found
    useEffect(() => {
        if (!username) {
            myNavigate('/');
            return;
        }
    }, [username, myNavigate]);

    // Load games from db
    useEffect(() => {
        if (!username) return;

        const fetchLoadGame = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Debug: Log username being used
                console.log('LoadGames: Fetching games for username:', username);
                
                const loads = await saveLoadAPI.getSavedGames();
                
                setGames(loads || []);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch saved games:', err);
                console.error('Username was:', username);
                setError(`Failed to load saved games: ${err.message}`);
                setLoading(false);
            }
        };
        
        fetchLoadGame();
    }, [username]);

    // Removes game from db and client
    const removeGame = async (id) => {
        if (!window.confirm('Are you sure you want to delete this saved game? This action cannot be undone.')) {
            return;
        }

        try {
            await saveLoadAPI.deleteGame(id);
            setGames((prevGames) => prevGames.filter((game) => game.Id !== id));
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Failed to delete game:', err);
            setError(`Failed to delete game: ${err.message}`);
        }
    };

    const loadGame = async (theId) => {
        try {
            setError(''); // Clear any previous errors
            await saveLoadAPI.loadGame(theId);
            myNavigate('/play'); 
        } catch (err) {
            console.error('Failed to load game:', err);
            setError(`Failed to load game: ${err.message}`);
        }
    };

    // Show loading screen if no username yet
    if (!username) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Load Saved Games</h1>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Load Saved Games - {username}</h1>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    backgroundColor: '#ffe6e6', 
                    padding: '1rem', 
                    borderRadius: '4px', 
                    margin: '1rem 0',
                    border: '1px solid #ffcccc'
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ margin: '2rem 0' }}>
                    <p>Loading your saved games...</p>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '3px solid #f3f3f3', 
                        borderTop: '3px solid #3498db', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '1rem auto'
                    }}></div>
                </div>
            ) : games.length === 0 ? (
                <div style={{ margin: '2rem 0' }}>
                    <p>No saved games found.</p>
                    <button 
                        onClick={() => myNavigate('/heroselect')}
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginTop: '1rem'
                        }}
                    >
                        Start New Game
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    {games.map((game, index) => (
                        <div key={game.Id || index} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '1rem',
                            backgroundColor: '#f9f9f9',
                            maxWidth: '500px',
                            width: '100%'
                        }}>
                            <GameCard name={game.Name} date={game.Date} />
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button 
                                    onClick={() => loadGame(game.Id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Load Game
                                </button>
                                <button 
                                    onClick={() => removeGame(game.Id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete Game
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
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '1rem'
                    }}
                >
                    ← Back to Menu
                </button>
                <button 
                    onClick={() => myNavigate('/heroselect')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Start New Game
                </button>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadGames;