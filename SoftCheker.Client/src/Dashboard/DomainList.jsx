import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Shared/Pagination';
import SearchBar from '../Shared/Searchbar';
import HighlightedText from '../Shared/HighlightedText';
import AddEditDomain from './Subforms/AddEditDomain';

const DomainList = () => {
    const [domains, setDomains] = useState([]);
    const [filteredDomains, setFilteredDomains] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editDomain, setEditDomain] = useState(null);

    // Fetch domains from the API
    const fetchDomains = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/domain', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDomains(response.data);
            setFilteredDomains(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setLoading(false);
        } catch (err) {
            setError('Failed to load domains. SprawdŸ konsolê dla wiêcej informacji.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = domains.filter(domain =>
            domain.name.toLowerCase().includes(query.toLowerCase()) ||
            domain.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredDomains(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [query, domains, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleAddDomainClick = () => {
        setEditDomain(null);
        setShowAddForm(true);
    };

    const handleEditDomainClick = (domain) => {
        setEditDomain(domain);
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleSave = () => {
        fetchDomains();
        setShowAddForm(false);
    };

    const handleDeleteDomain = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5180/api/domain/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const updatedDomains = domains.filter(domain => domain.id !== id);
            setDomains(updatedDomains);
            setFilteredDomains(updatedDomains);
            setTotalPages(Math.ceil(updatedDomains.length / itemsPerPage));
        } catch (err) {
            setError('Failed to delete domain. SprawdŸ konsolê dla wiêcej informacji.');
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

    const handleCancelEmail = async (id) => {
        try {
            await axios.post(`http://localhost:5180/api/domain/cancel-email/${id}`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('E-mail anulowany!');
            fetchDomains();
        } catch (err) {
            alert('Failed to cancel email.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    };

    const currentDomains = filteredDomains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                <button onClick={handleAddDomainClick} className="btn btn-primary">Dodaj domene</button>
                <button onClick={handleGenerateReport} className="btn btn-secondary">Generuj raport</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>Opis</th>
                        <th>Data wygasniecia</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDomains.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>Brak domen</td>
                        </tr>
                    ) : (
                        currentDomains.map(domain => (
                            <tr key={domain.id}>
                                <td>{domain.id}</td>
                                <td><HighlightedText text={domain.name} query={query} /></td>
                                <td><HighlightedText text={domain.description} query={query} /></td>
                                <td>{formatDate(domain.expiredDate)}</td>
                                <td>
                                    <button onClick={() => handleEditDomainClick(domain)} className="btn btn-primary btn-sm">Edytuj</button>
                                    <button onClick={() => handleDeleteDomain(domain.id)} className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>Usun</button>
                                    {!domain.emailCanceled && (
                                        <button onClick={() => handleCancelEmail(domain.id)} className="btn btn-warning btn-sm" style={{ marginLeft: '10px' }}>
                                            Anuluj email
                                        </button>
                                    )}
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

            {showAddForm && (
                <AddEditDomain
                    domain={editDomain}
                    onClose={handleCloseAddForm}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default DomainList;
