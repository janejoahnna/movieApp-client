import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
    const { unsetUser, setUser } = useContext(UserContext);

    useEffect(() => {
        // Clear user state and perform logout actions
        unsetUser();
        setUser({ id: null, isAdmin: false });
    }, [unsetUser, setUser]);

    // Redirect to login page after logout
    return <Navigate to="/login" />;
}
