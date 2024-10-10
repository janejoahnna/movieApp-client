import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MoviesCard';
import axios from 'axios';

export default function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // Fetch movies from the API
        axios.get('https://movieapp-api-lms1.onrender.com/movies/getMovies')
            .then((response) => {
                // Access the 'movies' array within the response data
                if (response.data && Array.isArray(response.data.movies)) {
                    setMovies(response.data.movies);
                } else {
                    console.error('Unexpected data format:', response.data);
                    setMovies([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
                setMovies([]); // Set to an empty array on error
            });
    }, []);

    return (
        <div>
            <h1>Movie List</h1>
            {/* Only map if movies is an array */}
            {Array.isArray(movies) && movies.length > 0 ? (
                movies.map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))
            ) : (
                <p>No movies available.</p>
            )}
        </div>
    );
}
