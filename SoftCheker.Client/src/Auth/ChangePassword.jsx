import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5180/api/account/change-password', {
                userName: username,
                currentPassword,
                newPassword
            });
            alert('Udana zmiana hasla');
            navigate('/login');
        } catch (error) {
            alert('Bledna zmiana hasla');
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
                <h2 className="my-4">Zmiana hasla</h2>
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
                            id="currentPassword"
                            className="form-control"
                            placeholder="Aktualne haslo"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            id="newPassword"
                            className="form-control"
                            placeholder="Nowe haslo"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">OK</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
