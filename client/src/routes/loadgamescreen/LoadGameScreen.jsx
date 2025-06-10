import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveLoadAPI, hasUsername, getDisplayUsername } from '../../context/api.js';
import GameCard from '../../components/GameCard/GameCard';
import styles from './load.module.css';
import backgroundImg from '../../assets/background.jpg';

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
            <div 
                className={styles.gameContainer}
                style={{ '--background-image': `url(${backgroundImg})` }}
            >
                <h1 className={styles.gameTitle}>Load Saved Games</h1>
                <div className={styles.titleUnderline}></div>
                <p className={styles.loadingText}>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div 
            className={styles.gameContainer}
            style={{ '--background-image': `url(${backgroundImg})` }}
        >
            <h1 className={styles.gameTitle}>Load Saved Games - {username}</h1>
            <div className={styles.titleUnderline}></div>
            
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            {loading ? (
                <div className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Loading your saved games...</p>
                    <div className={styles.loadingSpinner}></div>
                </div>
            ) : games.length === 0 ? (
                <div className={styles.noGamesContainer}>
                    <p className={styles.noGamesText}>No saved games found.</p>
                </div>
            ) : (
                <div className={styles.gamesContainer}>
                    {games.map((game, index) => (
                        <div key={game.Id || index} className={styles.gameCard}>
                            <GameCard name={game.Name} date={game.Date} />
                            <div className={styles.gameButtons}>
                                <button 
                                    onClick={() => loadGame(game.Id)}
                                    className={styles.loadButton}
                                >
                                    Load Game
                                </button>
                                <button 
                                    onClick={() => removeGame(game.Id)}
                                    className={styles.deleteButton}
                                >
                                    Delete Game
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.navigationButtons}>
                <button 
                    onClick={() => myNavigate('/')}
                    className={styles.backButton}
                >
                    ← Back to Menu
                </button>
                <button 
                    onClick={() => myNavigate('/heroselect')}
                    className={styles.newGameButton}
                >
                    Start New Game
                </button>
            </div>
        </div>
    );
};

export default LoadGames;