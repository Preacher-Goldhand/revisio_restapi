import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmtpConfig = () => {
    const [smtpConfig, setSmtpConfig] = useState({
        SmtpServer: '',
        SmtpPort: '',
        UseSsl: false,
        SmtpUsername: '',
        SmtpPassword: '',
        RecipientEmail: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [testEmailStatus, setTestEmailStatus] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('http://localhost:5180/api/smtpconfig', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setSmtpConfig({
                    SmtpServer: response.data.smtpServer || '',
                    SmtpPort: response.data.smtpPort != null ? response.data.smtpPort.toString() : '',
                    UseSsl: response.data.useSsl || false,
                    SmtpUsername: response.data.smtpUsername || '',
                    SmtpPassword: response.data.smtpPassword || '',
                    RecipientEmail: response.data.recipientEmail || ''
                });
            } catch (err) {
                setError('Nie uda�o si� za�adowa� konfiguracji SMTP.');
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
            await axios.put('http://localhost:5180/api/smtpconfig', {
                ...smtpConfig,
                SmtpPort: parseInt(smtpConfig.SmtpPort, 10)
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Konfiguracja SMTP zosta�a pomy�lnie zaktualizowana.');
        } catch (err) {
            setError('Nie uda�o si� zaktualizowa� konfiguracji SMTP.');
        }
    };

    const handleTestEmail = async () => {
        try {
            await axios.post('http://localhost:5180/api/email/send', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setTestEmailStatus('Testowy email zosta� pomy�lnie wys�any.');
        } catch (err) {
            setTestEmailStatus('Nie uda�o si� wys�a� testowego emaila.');
        }
    };

    if (loading) return <div>�adowanie...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Konfiguracja SMTP</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}>Serwer SMTP:</label>
                        <input
                            type="text"
                            name="SmtpServer"
                            value={smtpConfig.SmtpServer}
                            onChange={handleChange}
                            placeholder="smtp.example.com"
                            style={{ flex: '1', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}>Port SMTP:</label>
                        <input
                            type="text"
                            name="SmtpPort"
                            value={smtpConfig.SmtpPort}
                            onChange={handleChange}
                            placeholder="587"
                            style={{ flex: '1', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}>SSL:</label>
                        <input
                            type="checkbox"
                            name="UseSsl"
                            checked={smtpConfig.UseSsl}
                            onChange={handleChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}>Uzytkownik SMTP:</label>
                        <input
                            type="text"
                            name="SmtpUsername"
                            value={smtpConfig.SmtpUsername}
                            onChange={handleChange}
                            placeholder="twoja_nazwa_uzytkownika"
                            style={{ flex: '1', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}>Haslo SMTP:</label>
                        <input
                            type="password"
                            name="SmtpPassword"
                            value={smtpConfig.SmtpPassword}
                            onChange={handleChange}
                            placeholder="************"
                            style={{ flex: '1', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ flex: '0 0 150px' }}> Email odbiorcy:</label>
                        <input
                            type="email"
                            name="RecipientEmail"
                            value={smtpConfig.RecipientEmail}
                            onChange={handleChange}
                            placeholder="odbiorca@example.com"
                            style={{ flex: '1', padding: '8px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            OK
                        </button>
                        <button type="button" onClick={handleTestEmail} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Testuj email
                        </button>
                    </div>
                    {testEmailStatus && <div style={{ marginTop: '10px' }}>{testEmailStatus}</div>}
                </form>
            </div>
        </div>
    );
};

export default SmtpConfig;
