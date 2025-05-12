import React, { useEffect, useState } from 'react';

const Menu = () => {
    const [gameData, setGameData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                const res = await fetch('/api/game', { method: 'POST' });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setGameData(data);
            } catch (err) {
                console.error('Connection error:', err);
                setError('Failed to connect to backend');
            }
        };

        testConnection();
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : gameData ? (
                <>
                    <h2>Game Data</h2>
                    <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '1rem', overflowX: 'auto' }}>
                        {JSON.stringify(gameData, null, 2)}
                    </pre>
                </>
            ) : (
                <p>Connecting to backend...</p>
            )}
        </div>
    );
};

export default Menu;