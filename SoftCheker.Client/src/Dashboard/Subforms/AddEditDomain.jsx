import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEditDomain = ({ domain, onClose, onSave }) => {
    const [name, setName] = useState(domain ? domain.name : '');
    const [description, setDescription] = useState(domain ? domain.description : '');
    const [expiredDate, setExpiredDate] = useState(domain ? domain.expiredDate.split('T')[0] : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (domain) {
            setName(domain.name);
            setDescription(domain.description);
            setExpiredDate(domain.expiredDate ? domain.expiredDate.split('T')[0] : '');
        } else {
            setName('');
            setDescription('');
            setExpiredDate('');
        }
    }, [domain]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            const url = domain
                ? `http://localhost:5180/api/domain/${domain.id}`
                : 'http://localhost:5180/api/domain';
            const method = domain ? 'PUT' : 'POST';

            await axios({
                method,
                url,
                headers: { 'Authorization': `Bearer ${token}` },
                data: {
                    name,
                    description,
                    expiredDate: new Date(expiredDate).toISOString()
                }
            });

            setSuccess(domain ? 'Domena zaktualizowana pomyœlnie!' : 'Domena dodana pomyœlnie!');
            setError('');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1000);
        } catch (err) {
            setError('Failed to save domain. SprawdŸ konsolê dla wiêcej informacji.');
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
                <h2 className="my-4">{domain ? 'Edytuj domene' : 'Dodaj domene'}</h2>
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Nazwa domeny"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            id="description"
                            className="form-control"
                            placeholder="Opis domeny"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            {domain ? 'OK' : 'Dodaj'}
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

export default AddEditDomain;
