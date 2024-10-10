import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

// Custom provider to manage user state and actions
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ id: null, isAdmin: false });

    // Function to clear user state on logout
    const unsetUser = () => {
        setUser({ id: null, isAdmin: false });
        localStorage.clear(); // Clear local storage for tokens and user data
    };

    // Load user data from token on initial load
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
                    }
                })
                .catch(error => {
                    console.error("Error fetching user details:", error);
                });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
