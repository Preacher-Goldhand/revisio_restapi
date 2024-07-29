import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEditContract = ({ onClose, contract, onSave }) => {
    const [contractNumber, setContractNumber] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [renewDate, setRenewDate] = useState('');
    const [grossPrice, setGrossPrice] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (contract) {
            setContractNumber(contract.contractNumber);
            setDescription(contract.description);
            setStartDate(contract.startDate.split('T')[0]);
            setEndDate(contract.endDate.split('T')[0]);
            setRenewDate(contract.renewDate.split('T')[0]);
            setGrossPrice(contract.grossPrice);
        } else {
            setContractNumber('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setRenewDate('');
            setGrossPrice('');
        }
    }, [contract]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        const payload = {
            contractNumber,
            description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            renewDate: new Date(renewDate).toISOString(),
            grossPrice: parseFloat(grossPrice),
        };

        try {
            const url = contract ? `http://localhost:5180/api/contract/${contract.id}` : 'http://localhost:5180/api/contract';
            const method = contract ? 'put' : 'post';

            await axios({
                method,
                url,
                data: payload,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccess(contract ? 'Kontrakt zosta³ zaktualizowany!' : 'Kontrakt zosta³ dodany!');
            setError('');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1000);
        } catch (err) {
            setError('Failed to save contract. SprawdŸ konsolê dla wiêcej informacji.');
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
                <h2 className="my-4">{contract ? 'Edytuj Kontrakt' : 'Dodaj Kontrakt'}</h2>
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="mb-3">
                        <input
                            type="text"
                            id="contractNumber"
                            className="form-control"
                            placeholder="Numer kontraktu"
                            value={contractNumber}
                            onChange={(e) => setContractNumber(e.target.value)}
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
                        <label htmlFor="startDate">Data utworzenia:</label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="endDate">Data zakonczenia:</label>
                        <input
                            type="date"
                            id="endDate"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="renewDate">Data odnowienia:</label>
                        <input
                            type="date"
                            id="renewDate"
                            className="form-control"
                            value={renewDate}
                            onChange={(e) => setRenewDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="grossPrice">Cena brutto:</label>
                        <input
                            type="number"
                            step="0.01"
                            id="grossPrice"
                            className="form-control"
                            placeholder="Cena brutto"
                            value={grossPrice}
                            onChange={(e) => setGrossPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" className="btn btn-primary">
                            {contract ? 'OK' : 'Dodaj'}
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

export default AddEditContract;
