import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Shared/Pagination';
import SearchBar from '../Shared/Searchbar';
import HighlightedText from '../Shared/HighlightedText';
import AddEditSoft from './Subforms/AddEditSoft';

const SoftList = () => {
    const [softs, setSofts] = useState([]);
    const [filteredSofts, setFilteredSofts] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editSoft, setEditSoft] = useState(null);

    const fetchSofts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/soft', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSofts(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setLoading(false);
        } catch (err) {
            console.error('Failed to load softs:', err);
            setError('Failed to load softs. SprawdŸ konsolê dla wiêcej informacji.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSofts();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = softs.filter(soft =>
            soft.name.toLowerCase().includes(query.toLowerCase()) ||
            soft.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSofts(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [query, softs, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleAddSoftClick = () => {
        setEditSoft(null);
        setShowAddForm(true);
    };

    const handleEditSoftClick = (soft) => {
        setEditSoft(soft);
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleSave = () => {
        fetchSofts();
        setShowAddForm(false);
    };

    const handleDeleteSoft = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5180/api/soft/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSofts(softs.filter(soft => soft.id !== id));
            setFilteredSofts(filteredSofts.filter(soft => soft.id !== id));
            setTotalPages(Math.ceil(filteredSofts.length / itemsPerPage));
        } catch (err) {
            setError('Failed to delete soft. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    const handleGenerateReport = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/csv/generate-soft-report', {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'soft_report.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError('Failed to generate report. SprawdŸ konsolê dla wiêcej informacji.');
        }
    };

    const currentSofts = filteredSofts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={handleAddSoftClick}
                    className="btn btn-primary"
                >
                    Dodaj platforme
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
                        <th>Nazwa</th>
                        <th>Opis</th>
                        <th>Wersja</th>
                        <th>Data podstawowego wsparcia</th>
                        <th>Data rozszerzonego wsparcia</th>
                        <th>Nastepna wersja</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSofts.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '8px' }}>Brak softów</td>
                        </tr>
                    ) : (
                        currentSofts.map(soft => (
                            <tr key={soft.id}>
                                <td>{soft.id}</td>
                                <td><HighlightedText text={soft.name} query={query} /></td>
                                <td><HighlightedText text={soft.description} query={query} /></td>
                                <td>{soft.currentVersion}</td>
                                <td>{new Date(soft.eolBasicSupport).toLocaleDateString()}</td>
                                <td>{new Date(soft.eolExtendedSupport).toLocaleDateString()}</td>
                                <td>{soft.eolNextVersion}</td>
                                <td>
                                    <button onClick={() => handleEditSoftClick(soft)} className="btn btn-primary btn-sm">
                                        Edytuj
                                    </button>
                                    <button onClick={() => handleDeleteSoft(soft.id)} className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>
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

            {showAddForm && <AddEditSoft onClose={handleCloseAddForm} soft={editSoft} onSave={handleSave} />}
        </div>
    );
};

export default SoftList;
