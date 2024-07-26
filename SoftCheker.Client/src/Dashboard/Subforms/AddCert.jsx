import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCert = ({ onClose, cert, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [expiredDate, setExpiredDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (cert) {
            setName(cert.name);
            setDescription(cert.description);
            setIssuedDate(cert.issuedDate.split('T')[0]);
            setExpiredDate(cert.expiredDate.split('T')[0]);
        } else {
            setName('');
            setDescription('');
            setIssuedDate('');
            setExpiredDate('');
        }
    }, [cert]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            const url = cert ? `http://localhost:5180/api/cert/${cert.id}` : 'http://localhost:5180/api/cert';
            const method = cert ? 'put' : 'post';

            await axios({
                method,
                url,
                data: {
                    name,
                    description,
                    issuedDate: new Date(issuedDate).toISOString(),
                    expiredDate: new Date(expiredDate).toISOString()
                },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccess(cert ? 'Certyfikat zosta³ zaktualizowany!' : 'Certyfikat zosta³ dodany!');
            setError('');
            setTimeout(() => {
                onSave(); 
                onClose();
            }, 1000);
        } catch (err) {
            console.error('Error saving certificate:', err.message);
            setError('Failed to save certificate. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
            zIndex: 1000
        }}>
            <div style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '600px'
            }}>
                <h2 className="my-4">{cert ? 'Edytuj certyfikat' : 'Dodaj certyfikat'}</h2>
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Nazwa certyfikatu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            id="description"
                            className="form-control"
                            placeholder="Opis certyfikatu"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="issuedDate">Data wystawienia:</label>
                        <input
                            type="date"
                            id="issuedDate"
                            className="form-control"
                            value={issuedDate}
                            onChange={(e) => setIssuedDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="expiredDate">Data wygasniecia:</label>
                        <input
                            type="date"
                            id="expiredDate"
                            className="form-control"
                            value={expiredDate}
                            onChange={(e) => setExpiredDate(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" className="btn btn-primary">
                            {cert ? 'OK' : 'Dodaj'}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                            Anuluj
                        </button>
                    </div>
                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default AddCert;
