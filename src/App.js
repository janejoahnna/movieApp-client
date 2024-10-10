import { useState, useEffect, useContext } from 'react'; // Ensure `useContext` is imported here
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import AdminDashboard from './pages/AdminDashboard';
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MovieDetails from './pages/MovieDetails';
import MovieList from './pages/MovieList';
import Register from './pages/Register';
import './App.css';
import UserContext, { UserProvider } from './UserContext'; // Import `UserContext` without curly braces

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: false
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: false });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`https://movieapp-api-lms1.onrender.com/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
          } else {
            setUser({ id: null, isAdmin: false });
          }
        })
        .catch(error => {
          console.error("Error fetching user details:", error);
          setUser({ id: null, isAdmin: false });
        });
    }
  }, []);

  // Custom Route for Admin Protected Page
  function AdminRoute({ children }) {
    const { user } = useContext(UserContext); // Ensure `UserContext` is accessed correctly
    return user.isAdmin ? children : <Navigate to="/" />;
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
