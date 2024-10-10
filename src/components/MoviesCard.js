import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './MovieCard.css';

export default function MovieCard({ movie }) {
    const { _id, title, director, year, description, genre } = movie;
    const navigate = useNavigate();

    function viewMovieDetails() {
        navigate(`/movies/${_id}`);
    }

    return (
        <Card className="movie-card mt-3 mb-3">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Directed by: {director}</Card.Subtitle>
                <Card.Text><strong>Year:</strong> {year}</Card.Text>
                <Card.Text><strong>Genre:</strong> {genre}</Card.Text>
                <Card.Text><strong>Description:</strong> {description}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-around">
                <Button variant="primary" onClick={viewMovieDetails}>View Details</Button>
            </Card.Footer>
        </Card>
    );
}
