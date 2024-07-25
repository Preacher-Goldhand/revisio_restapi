import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmtpConfig = () => {
    const [smtpConfig, setSmtpConfig] = useState({
        SmtpServer: '',
        SmtpPort: 0,
        UseSsl: false,
        SmtpUsername: '',
        SmtpPassword: '',
        RecipientEmail: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('http://localhost:5180/api/smtpconfig', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setSmtpConfig(response.data);
            } catch (err) {
                setError('Failed to load SMTP configuration.');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSmtpConfig(prevConfig => ({
            ...prevConfig,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5180/api/smtpconfig', smtpConfig, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('SMTP configuration updated successfully.');
        } catch (err) {
            setError('Failed to update SMTP configuration.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Konfiguracja SMTP</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Serwer SMTP:
                        <input
                            type="text"
                            name="SmtpServer"
                            value={smtpConfig.SmtpServer}
                            onChange={handleChange}
                            placeholder="smtp.example.com"
                            style={{ marginLeft: '10px', width: '300px', padding: '8px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        SMTP Port:
                        <input
                            type="number"
                            name="SmtpPort"
                            value={smtpConfig.SmtpPort}
                            onChange={handleChange}
                            placeholder="587"
                            style={{ marginLeft: '10px', width: '100px', padding: '8px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        SSL:
                        <input
                            type="checkbox"
                            name="UseSsl"
                            checked={smtpConfig.UseSsl}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Uzytkownik SMTP:
                        <input
                            type="text"
                            name="SmtpUsername"
                            value={smtpConfig.SmtpUsername}
                            onChange={handleChange}
                            placeholder="your_username"
                            style={{ marginLeft: '10px', width: '300px', padding: '8px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Haslo SMTP:
                        <input
                            type="password"
                            name="SmtpPassword"
                            value={smtpConfig.SmtpPassword}
                            onChange={handleChange}
                            placeholder="your_password"
                            style={{ marginLeft: '10px', width: '300px', padding: '8px' }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Adres email odbiorcy:
                        <input
                            type="email"
                            name="RecipientEmail"
                            value={smtpConfig.RecipientEmail}
                            onChange={handleChange}
                            placeholder="recipient@example.com"
                            style={{ marginLeft: '10px', width: '300px', padding: '8px' }}
                        />
                    </label>
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Update
                </button>
            </form>
        </div>
    );
};

export default SmtpConfig;
