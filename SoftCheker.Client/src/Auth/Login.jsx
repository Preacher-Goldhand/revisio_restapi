import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5180/api/account/login', { username, password });
            localStorage.setItem('token', response.data.token);
            alert('Udane logowanie');
            if (isAuthenticated()) {
                navigate('/certs');
            }
        } catch (error) {
            alert('Blad logowania');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 className="my-4">Logowanie</h2>
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Nazwa uzytkownika"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ maxWidth: '100%' }} 
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Haslo"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ maxWidth: '100%' }} 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Zaloguj sie</button>
                </form>
                <p className="mt-3">Zmiana hasla <Link to="/resetPassword">Zmien haslo</Link></p>
            </div>
        </div>
    );
};

export default Login;
