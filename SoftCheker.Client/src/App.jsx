import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Navbar from './Layout/Navbar';
import { isAuthenticated } from './utils/authUtils';
import ChangePassword from './Auth/ChangePassword';
import UserList from './Dashboard/UserList';
import SmtpConfig from './Dashboard/SmtpConfig';
import CertList from "./Dashboard/CertList"
import ContractList from "./Dashboard/ContractList"

const AppRoutes = () => {
    const location = useLocation();
    const userIsAuthenticated = isAuthenticated();
    const showNavbar = userIsAuthenticated && !['/', '/resetPassword'].includes(location.pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/resetPassword" element={<ChangePassword />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/smtp" element={<SmtpConfig />} />
                    <Route path="/certs" element={<CertList />} />
                    <Route path="/contracts" element={<ContractList />} />
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
