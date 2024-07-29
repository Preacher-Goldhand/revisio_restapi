import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const linkStyle = {
        fontWeight: 'bold'
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/certs" style={linkStyle}>Certyfikaty</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contracts" style={linkStyle}>Kontrakty</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/domains" style={linkStyle}>Domeny</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/softs" style={linkStyle}>Platformy</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/users" style={linkStyle}>Konta</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/smtp" style={linkStyle}> SMTP</Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" style={linkStyle} onClick={handleLogout}>Wyloguj sie</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;