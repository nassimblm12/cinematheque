import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/films'); // Adjust the URL as needed based on your backend setup
                setFilms(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFilms();
    }, []);

    if (loading) return <p>Loading films...</p>;
    if (error) return <p>Error fetching films: {error}</p>;

    return (
        <div>
            <h1>Films</h1>
            {films.length > 0 ? (
                films.map((film, index) => (
                    <div key={index} style={{ padding: '10px', border: '1px solid black', marginBottom: '5px' }}>
                        <h2>{film.Titre || 'No Title'}</h2>
                        <p><strong>Duration:</strong> {film.Durée || 'No Duration'}</p>
                        <p><strong>Genre:</strong> {film.Genre || 'No Genre'}</p>
                        <p><strong>Synopsis:</strong> {film.Synopsis || 'No Synopsis'}</p>
                    </div>
                ))
            ) : (
                <p>No films found!</p>
            )}
        </div>
    );
}

export default Home;
