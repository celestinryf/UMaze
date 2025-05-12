import React, { useEffect, useState } from 'react';

const Menu = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                const res = await fetch('/api/game', { method: 'POST' });
                const data = await res.json();
                setMessage(data.message || 'Success');
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
            ) : (
                <h2>{message || 'Connecting to backend...'}</h2>
            )}
        </div>
    );
};

export default Menu;