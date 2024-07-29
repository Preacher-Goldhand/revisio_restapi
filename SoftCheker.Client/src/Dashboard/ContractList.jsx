import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Shared/Pagination';
import SearchBar from '../Shared/Searchbar';
import HighlightedText from '../Shared/HighlightedText';
import AddEditContract from './Subforms/AddEditContract';

const ContractList = () => {
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editContract, setEditContract] = useState(null);

    const fetchContracts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/contract', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setContracts(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setLoading(false);
        } catch (err) {
            setError('Failed to load contracts. SprawdŸ konsolê dla wiêcej informacji.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = contracts.filter(contract =>
            contract.contractNumber.toLowerCase().includes(query.toLowerCase()) ||
            contract.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredContracts(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [query, contracts, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleAddContractClick = () => {
        setEditContract(null);
        setShowAddForm(true);
    };

    const handleEditContractClick = (contract) => {
        setEditContract(contract);
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleSave = () => {
        fetchContracts();
        setShowAddForm(false);
    };

    const handleDeleteContract = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5180/api/contract/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setContracts(contracts.filter(contract => contract.id !== id));
            setFilteredContracts(filteredContracts.filter(contract => contract.id !== id));
            setTotalPages(Math.ceil(filteredContracts.length / itemsPerPage));
        } catch (err) {
            setError('Failed to delete contract. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    const handleGenerateReport = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/csv/generate-report', {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError('Failed to generate report. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    const currentContracts = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={handleAddContractClick}
                    className="btn btn-primary"
                >
                    Dodaj kontrakt
                </button>
                <button
                    onClick={handleGenerateReport}
                    className="btn btn-secondary"
                >
                    Generuj raport
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Numer kontraktu</th>
                        <th>Opis</th>
                        <th>Data utworzenia</th>
                        <th>Data zakomczenia</th>
                        <th>Data odnowienia</th>
                        <th>Cena brutto</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {currentContracts.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '8px' }}>Brak kontraktów</td>
                        </tr>
                    ) : (
                        currentContracts.map(contract => (
                            <tr key={contract.id}>
                                <td>{contract.id}</td>
                                <td><HighlightedText text={contract.contractNumber} query={query} /></td>
                                <td><HighlightedText text={contract.description} query={query} /></td>
                                <td>{new Date(contract.startDate).toLocaleDateString()}</td>
                                <td>{new Date(contract.endDate).toLocaleDateString()}</td>
                                <td>{new Date(contract.renewDate).toLocaleDateString()}</td>
                                <td>{contract.grossPrice.toFixed(2)} PLN</td>
                                <td>
                                    <button onClick={() => handleEditContractClick(contract)} className="btn btn-primary btn-sm">
                                        Edytuj
                                    </button>
                                    <button onClick={() => handleDeleteContract(contract.id)} className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>
                                        Usun
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="itemsPerPage">Rekordy per strona:</label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        style={{ marginLeft: '10px' }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {showAddForm && <AddEditContract onClose={handleCloseAddForm} contract={editContract} onSave={handleSave} />}
        </div>
    );
};

export default ContractList;
