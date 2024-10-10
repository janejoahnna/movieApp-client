import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://movieapp-api-lms1.onrender.com';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch movie details
    axios.get(`${API_BASE_URL}/movies/getMovie/${id}`)
      .then(response => setMovie(response.data))
      .catch(error => console.error("Error fetching movie details:", error));

    // Fetch comments with authorization
    axios.get(`${API_BASE_URL}/movies/getComments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (Array.isArray(response.data.comments)) {
          setComments(response.data.comments);
        } else {
          console.error("Unexpected comments format:", response.data);
          setComments([]);
        }
      })
      .catch(error => console.error("Error fetching comments:", error));
  }, [id, token]);

  return (
    <div>
      {movie ? (
        <>
          <h1>{movie.title}</h1>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Description:</strong> {movie.description}</p>
          
          <h2>Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <p key={index}>{comment}</p>
            ))
          ) : (
            <p>No comments available.</p>
          )}
          <div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
          </div>
        </>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
};

export default MovieDetails;
