import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // New state for redirection

    function registerUser(e) {
        e.preventDefault();

        fetch('https://movieapp-api-lms1.onrender.com/users/register', {
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
            if (data.message === "Registered Successfully") {
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!"
                });

                setIsRegistered(true); // Set isRegistered to true to trigger redirection

            } else {
                Swal.fire({
                    title: "Something went wrong.",
                    icon: "error",
                    text: "Please try again later or contact us for assistance"
                });
            }
        });
    }

    useEffect(() => {
        if (email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password, confirmPassword]);

    if (user.id !== null) {
        return <Navigate to="/courses" />;
    }

    // Redirect to login page if registration was successful
    if (isRegistered) {
        return <Navigate to="/login" />;
    }

    return (
        <Form onSubmit={registerUser}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    type="email"
                    placeholder="Enter Email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Enter Password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                />
            </Form.Group>
            {
                isActive
                ? <Button variant="primary" type="submit">Submit</Button>
                : <Button variant="primary" disabled>Submit</Button>
            }
        </Form>
    );
}
