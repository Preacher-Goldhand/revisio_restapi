import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Navbar from './Layout/Navbar';
import { isAuthenticated } from './utils/authUtils';

const AppRoutes = () => {
    const location = useLocation();
    const userIsAuthenticated = isAuthenticated();
    const showNavbar = userIsAuthenticated && !['/', '/login'].includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
