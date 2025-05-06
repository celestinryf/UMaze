import React, { useEffect, useState } from 'react';	
import style from './menu.module.css';	

const Menu = () => {	
    const [gameTitle, setGameTitle] = useState('');	
    const [loading, setLoading] = useState(true);	
    const [error, setError] = useState(null);	

    useEffect(() => {	
        const fetchGameTitle = async () => {	
            try {	
                // Replace with your actual API endpoint	
                const response = await fetch('/api/game/title');	

                if (!response.ok) {	
                    throw new Error(`HTTP error! Status: ${response.status}`);	
                }	

                const data = await response.json();	
                setGameTitle(data.title);	
                setLoading(false);	
            } catch (err) {	
                console.error('Error fetching game title:', err);	
                setError(err.message);	
                setLoading(false);	
            }	
        };	

        fetchGameTitle();	
    }, []);	

    return (	
        <div className={style.layoutWrapper}>	
            <div className={style.mainContent}>	
                <div className={style.section}>	
                    {loading ? (	
                        <p>Loading game title...</p>	
                    ) : error ? (	
                        <p>Error: {error}</p>	
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