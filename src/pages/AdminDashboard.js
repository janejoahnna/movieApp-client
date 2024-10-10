import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false); // Modal visibility for adding
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal for updating
    const [newMovieTitle, setNewMovieTitle] = useState('');
    const [newMovieDirector, setNewMovieDirector] = useState('');
    const [newMovieDescription, setNewMovieDescription] = useState('');
    const [newMovieYear, setNewMovieYear] = useState('');
    const [newMovieGenre, setNewMovieGenre] = useState('');
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    // Fetch movies from API
    const fetchMovies = async () => {
        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovies`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setMovies(data.movies); // Update to match API response structure if necessary
        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to fetch movies.',
            });
        }
    };

    // Fetch movies on component mount
    useEffect(() => {
        fetchMovies();
    }, []);

    // Handle movie creation
    const handleAddMovie = async () => {
        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addMovie`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newMovieTitle,
                    director: newMovieDirector,
                    year: newMovieYear,
                    description: newMovieDescription,
                    genre: newMovieGenre,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add movie');
            }

            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Movie added successfully!',
            });

            setShowModal(false); // Close modal after adding movie
            setNewMovieTitle('');
            setNewMovieDirector('');
            setNewMovieDescription('');
            setNewMovieYear('');
            setNewMovieGenre('');

            await fetchMovies(); // Refresh movie list

        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to add movie.',
            });
        }
    };

    // Open update modal with selected movie details
    const handleUpdate = (movieId, movie) => {
        setSelectedMovieId(movieId);
        setNewMovieTitle(movie.title);
        setNewMovieDirector(movie.director);
        setNewMovieDescription(movie.description);
        setNewMovieYear(movie.year);
        setNewMovieGenre(movie.genre);
        setShowUpdateModal(true); // Open update modal
    };

    // Save movie updates
    const handleSaveUpdate = async () => {
        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${selectedMovieId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newMovieTitle,
                    director: newMovieDirector,
                    year: newMovieYear,
                    description: newMovieDescription,
                    genre: newMovieGenre,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update movie');
            }

            Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Movie updated successfully!',
            });

            setShowUpdateModal(false); // Close modal after updating
            await fetchMovies(); // Refresh movie list

        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to update movie.',
            });
        }
    };

    // Handle movie deletion
    const handleDeleteMovie = async (movieId) => {
        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movieId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }

            Swal.fire({
                title: 'Deleted',
                icon: 'success',
                text: 'Movie deleted successfully!',
            });

            await fetchMovies(); // Refresh movie list

        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Unable to delete movie.',
            });
        }
    };

    return (
        <>
            <section className="admin-dashboard mt-5 pt-5">
                <h1 className="mb-4">Admin Dashboard</h1>

                <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                    Add Movie
                </Button>

                {movies.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Director</th>
                                <th>Year</th>
                                <th>Genre</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map(movie => (
                                <tr key={movie._id}>
                                    <td>{movie.title}</td>
                                    <td>{movie.director}</td>
                                    <td>{movie.year}</td>
                                    <td>{movie.genre}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleUpdate(movie._id, movie)}>
                                            Update
                                        </Button>
                                        <Button variant="danger" className="ml-2" onClick={() => handleDeleteMovie(movie._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className='text-center'>
                        <h2>No movies available</h2>
                    </div>
                )}
            </section>

            {/* Modal for adding new movie */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="movieTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={newMovieTitle} onChange={(e) => setNewMovieTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieDirector">
                            <Form.Label>Director</Form.Label>
                            <Form.Control type="text" value={newMovieDirector} onChange={(e) => setNewMovieDirector(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" value={newMovieYear} onChange={(e) => setNewMovieYear(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={newMovieDescription} onChange={(e) => setNewMovieDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" value={newMovieGenre} onChange={(e) => setNewMovieGenre(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddMovie}>Add Movie</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for updating movie */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="movieTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={newMovieTitle} onChange={(e) => setNewMovieTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieDirector">
                            <Form.Label>Director</Form.Label>
                            <Form.Control type="text" value={newMovieDirector} onChange={(e) => setNewMovieDirector(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieYear">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" value={newMovieYear} onChange={(e) => setNewMovieYear(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={newMovieDescription} onChange={(e) => setNewMovieDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="movieGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" value={newMovieGenre} onChange={(e) => setNewMovieGenre(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveUpdate}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
