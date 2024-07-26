import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCert = ({ onClose, cert }) => {
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
            setIssuedDate(cert.issuedDate);
            setExpiredDate(cert.expiredDate);
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
            // Konwertowanie dat na UTC
            const issuedDateUtc = new Date(issuedDate).toISOString();
            const expiredDateUtc = new Date(expiredDate).toISOString();

            const url = cert ? `http://localhost:5180/api/cert/${cert.id}` : 'http://localhost:5180/api/cert';
            const method = cert ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: {
                    name,
                    description,
                    issuedDate: issuedDateUtc,
                    expiredDate: expiredDateUtc
                },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccess(cert ? 'Certyfikat zosta³ zaktualizowany!' : 'Certyfikat zosta³ dodany!');
            setError('');
            onClose(); // Zamknij formularz po sukcesie
        } catch (err) {
            console.error('B³¹d dodawania certyfikatu:', err.message);
            setError('Nie uda³o siê dodaæ certyfikatu. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                width: '100%',
                maxWidth: '500px',
                position: 'relative'
            }}>
                <h2 className="my-4">{cert ? 'Edytuj' : 'Dodaj'} certyfikat</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
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
                        <label htmlFor="issuedDate" className="form-label">Data wystawienia:</label>
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
                        <label htmlFor="expiredDate" className="form-label">Data wygaszenia:</label>
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
                        <button type="submit" className="btn btn-primary">OK</button>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCert;
