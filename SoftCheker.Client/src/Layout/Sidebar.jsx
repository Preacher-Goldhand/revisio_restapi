import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS (jeœli jeszcze nie jest zaimportowany w main.jsx)

const Sidebar = () => {
    return (
        <aside className="sidebar bg-light p-3">
            <nav>
                <ul className="nav flex-column">
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
            </nav>
        </aside>
    );
};

export default Sidebar;
