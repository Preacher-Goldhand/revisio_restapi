import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">MyApp</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/certs">Certs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contracts">Contracts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/domains">Domains</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/softs">Softs</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
