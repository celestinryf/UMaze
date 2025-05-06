import React, { useEffect, useState } from 'react';
import style from './play.module.css';

const Menu = () => {
    const [gameTitle, setGameTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diagnosticData, setDiagnosticData] = useState(null);
    const [isTestingDiagnostic, setIsTestingDiagnostic] = useState(false);

    // Main game data fetch
    useEffect(() => {
        const initializeAndFetchGame = async () => {
            try {
                // First initialize the game
                console.log('Initializing game...');
                const initResponse = await fetch('/api/game', {
                    method: 'POST'
                });
                
                if (!initResponse.ok) {
                    throw new Error(`Failed to initialize game: ${initResponse.status}`);
                }
                
                console.log('Game initialized successfully');
                
                // Then fetch the game data
                const getResponse = await fetch('/api/game');
                
                if (!getResponse.ok) {
                    throw new Error(`Failed to fetch game: ${getResponse.status}`);
                }
                
                const data = await getResponse.json();
                setGameTitle(data.title || 'Unknown Game');
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        initializeAndFetchGame();
    }, []);
    
    // Function to test the diagnostic endpoint
    const testDiagnosticEndpoint = async () => {
        setIsTestingDiagnostic(true);
        
        try {
            console.log('Testing diagnostic endpoint...');
            const response = await fetch('/api/diagnostic');
            
            console.log('Diagnostic response status:', response.status);
            console.log('Diagnostic headers:', Object.fromEntries([...response.headers.entries()]));
            
            const responseText = await response.text();
            console.log('Raw diagnostic response:', responseText);
            
            try {
                const diagnosticJson = JSON.parse(responseText);
                setDiagnosticData(diagnosticJson);
                console.log('Diagnostic data:', diagnosticJson);
            } catch (parseError) {
                console.error('Failed to parse diagnostic response:', parseError);
            }
        } catch (err) {
            console.error('Error fetching diagnostic endpoint:', err);
        } finally {
            setIsTestingDiagnostic(false);
        }
    };

    return (
        <div className={style.layoutWrapper}>
            <div className={style.mainContent}>
                <div className={style.section}>
                    {loading ? (
                        <div>
                            <p>Loading game title...</p>
                            <button 
                                onClick={testDiagnosticEndpoint}
                                disabled={isTestingDiagnostic}
                            >
                                {isTestingDiagnostic ? 'Testing...' : 'Test API Connection'}
                            </button>
                        </div>
                    ) : error ? (
                        <div className={style.infoBox}>
                            <h2>Error Loading Game</h2>
                            <p>{error}</p>
                            
                            {/* Diagnostic button */}
                            <button 
                                onClick={testDiagnosticEndpoint}
                                disabled={isTestingDiagnostic}
                            >
                                {isTestingDiagnostic ? 'Testing...' : 'Test API Connection'}
                            </button>
                            
                            {/* Display diagnostic data if available */}
                            {diagnosticData && (
                                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                    <h3>API Diagnostic Results:</h3>
                                    <pre style={{ 
                                        backgroundColor: '#f5f5f5', 
                                        padding: '10px', 
                                        borderRadius: '4px',
                                        overflow: 'auto',
                                        maxHeight: '300px',
                                        fontSize: '12px'
                                    }}>
                                        {JSON.stringify(diagnosticData, null, 2)}
                                    </pre>
                                </div>
                            )}
                            
                            <div style={{ marginTop: '20px' }}>
                                <h3>Debugging Tips:</h3>
                                <ol style={{ textAlign: 'left' }}>
                                    <li>Check that your Go server is running (port 8080)</li>
                                    <li>Verify Vite's proxy configuration in vite.config.js</li>
                                    <li>Check network tab in browser developer tools</li>
                                    <li>Make sure your Go API sets Content-Type: application/json</li>
                                </ol>
                            </div>
                        </div>
                    ) : (
                        <div className={style.infoBox}>
                            <h1>{gameTitle}</h1>
                            <p>i aint doin all that</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;