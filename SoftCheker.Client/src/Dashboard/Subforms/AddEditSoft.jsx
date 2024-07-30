import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEditSoft = ({ onClose, soft, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [currentVersion, setCurrentVersion] = useState('');
    const [eolBasicSupport, setEolBasicSupport] = useState('');
    const [eolExtendedSupport, setEolExtendedSupport] = useState('');
    const [eolNextVersion, setEolNextVersion] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (soft) {
            setName(soft.name);
            setDescription(soft.description);
            setCurrentVersion(soft.currentVersion);
            setEolBasicSupport(soft.eolBasicSupport.split('T')[0]);
            setEolExtendedSupport(soft.eolExtendedSupport.split('T')[0]);
            setEolNextVersion(soft.eolNextVersion);
        } else {
            setName('');
            setDescription('');
            setCurrentVersion('');
            setEolBasicSupport('');
            setEolExtendedSupport('');
            setEolNextVersion('');
        }
    }, [soft]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            const url = soft ? `http://localhost:5180/api/soft/${soft.id}` : 'http://localhost:5180/api/soft';
            const method = soft ? 'put' : 'post';

            await axios({
                method,
                url,
                data: {
                    name,
                    description,
                    currentVersion,
                    eolBasicSupport: new Date(eolBasicSupport).toISOString(),
                    eolExtendedSupport: new Date(eolExtendedSupport).toISOString(),
                    eolNextVersion
                },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccess(soft ? 'Platforma zosta³a zaktualizowana!' : 'Platforma zosta³a dodana!');
            setError('');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1000);
        } catch (err) {
            setError('Nie uda³o siê zapisaæ platformy. SprawdŸ konsolê dla wiêcej informacji.');
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
                <h2 className="my-4">{soft ? 'Edytuj platforme' : 'Dodaj platforme'}</h2>
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Nazwa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            id="description"
                            className="form-control"
                            placeholder="Opis"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="currentVersion"
                            className="form-control"
                            placeholder="Aktualna wersja"
                            value={currentVersion}
                            onChange={(e) => setCurrentVersion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="eolBasicSupport">Data podstawowego wsparcia:</label>
                        <input
                            type="date"
                            id="eolBasicSupport"
                            className="form-control"
                            value={eolBasicSupport}
                            onChange={(e) => setEolBasicSupport(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="eolExtendedSupport">Data rozszerzonego wsparcia:</label>
                        <input
                            type="date"
                            id="eolExtendedSupport"
                            className="form-control"
                            value={eolExtendedSupport}
                            onChange={(e) => setEolExtendedSupport(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="eolNextVersion"
                            className="form-control"
                            placeholder="Nastepna wersja"
                            value={eolNextVersion}
                            onChange={(e) => setEolNextVersion(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" className="btn btn-primary">
                            {soft ? 'OK' : 'Dodaj platforme'}
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

export default AddEditSoft;
