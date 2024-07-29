import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Shared/Pagination';
import SearchBar from '../Shared/Searchbar';
import HighlightedText from '../Shared/HighlightedText';
import AddCert from '../Dashboard/Subforms/AddCert';

const CertList = () => {
    const [certs, setCerts] = useState([]);
    const [filteredCerts, setFilteredCerts] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editCert, setEditCert] = useState(null);

    const fetchCerts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5180/api/cert', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCerts(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            setLoading(false);
        } catch (err) {
            setError('Failed to load certificates. SprawdŸ konsolê dla wiêcej informacji.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCerts();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = certs.filter(cert =>
            cert.name.toLowerCase().includes(query.toLowerCase()) ||
            cert.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCerts(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [query, certs, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleAddCertClick = () => {
        setEditCert(null);
        setShowAddForm(true);
    };

    const handleEditCertClick = (cert) => {
        setEditCert(cert);
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleSave = () => {
        fetchCerts();
        setShowAddForm(false);
    };

    const handleDeleteCert = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Brak tokenu autoryzacyjnego.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5180/api/cert/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCerts(certs.filter(cert => cert.id !== id));
            setFilteredCerts(filteredCerts.filter(cert => cert.id !== id));
            setTotalPages(Math.ceil(filteredCerts.length / itemsPerPage));
        } catch (err) {
            setError('Failed to delete certificate. SprawdŸ konsolê dla wiêcej informacji.');
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

    const currentCerts = filteredCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={handleAddCertClick}
                    className="btn btn-primary"
                >
                    Dodaj certyfikat
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
                        <th>Data wystawienia</th>
                        <th>Data wygasniecia</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCerts.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>Brak certyfikatów</td>
                        </tr>
                    ) : (
                        currentCerts.map(cert => (
                            <tr key={cert.id}>
                                <td>{cert.id}</td>
                                <td><HighlightedText text={cert.name} query={query} /></td>
                                <td><HighlightedText text={cert.description} query={query} /></td>
                                <td>{new Date(cert.issuedDate).toLocaleDateString()}</td>
                                <td>{new Date(cert.expiredDate).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEditCertClick(cert)} className="btn btn-primary btn-sm">
                                        Edytuj
                                    </button>
                                    <button onClick={() => handleDeleteCert(cert.id)} className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>
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

            {showAddForm && <AddCert onClose={handleCloseAddForm} cert={editCert} onSave={handleSave} />}
        </div>
    );
};

export default CertList;
