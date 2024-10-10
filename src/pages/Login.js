import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    // Authenticate the user
    function authenticate(e) {
        e.preventDefault();

        fetch('https://movieapp-api-lms1.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                // Store token in local storage and retrieve user details
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to Movie App!"
                });
            } else {
                Swal.fire({
                    title: "Authentication Failed",
                    icon: "error",
                    text: "Check your login details and try again."
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                title: "An Error Occurred",
                icon: "error",
                text: "Please try again later."
            });
        });

        // Clear form fields
        setEmail('');
        setPassword('');
    }

    // Retrieve user details after login
    const retrieveUserDetails = (token) => {
        fetch('https://movieapp-api-lms1.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                email: data.user.email,
                isAdmin: data.user.isAdmin // Set admin status
            });
        })
        .catch(error => console.error("Error retrieving user details:", error));
    };

    // Form validation to enable/disable the submit button
    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        user.id ? (
            <Navigate to="/movies" />
        ) : (
            <Form onSubmit={authenticate} className="my-5">
                <h1 className="text-center">Login</h1>

                <Form.Group controlId="userEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button
                    variant={isActive ? "primary" : "secondary"}
                    type="submit"
                    disabled={!isActive}
                    className="w-100"
                >
                    Submit
                </Button>
            </Form>
        )
    );
}
