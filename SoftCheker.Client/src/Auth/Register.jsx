import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5180/api/account/register', { username, email, password });
            alert('Udana rejestracja');
            navigate('/login');
        } catch (error) {
            alert('B³êdna rejestracja');
        }
    };

    const handleCancel = () => {
        navigate('/users');
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
                <h2 className="my-4">Dodawanie uzytkownika</h2>
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
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary">OK</button>
                        <button type="button" onClick={handleCancel} className="btn btn-secondary">Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
