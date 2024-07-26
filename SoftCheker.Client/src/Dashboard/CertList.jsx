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
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
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
                console.error('Error fetching certificates:', err.message);
                setError('Failed to load certificates. SprawdŸ konsolê dla wiêcej informacji.');
                setLoading(false);
            }
        };

        fetchCerts();
    }, [itemsPerPage]);

    useEffect(() => {
        const filtered = certs.filter(cert =>
            cert.name.toLowerCase().includes(query.toLowerCase()) ||
            cert.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCerts(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset page when query changes
    }, [query, certs, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleAddCertClick = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const currentCerts = filteredCerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={handleQueryChange} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    onClick={handleAddCertClick}
                    className="btn btn-primary"
                >
                    Dodaj certyfikat
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>Opis</th>
                        <th>Data wystawienia</th>
                        <th>Data wygaszenia</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCerts.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>Brak certyfikatów</td>
                        </tr>
                    ) : (
                        currentCerts.map(cert => (
                            <tr key={cert.id}>
                                <td>{cert.id}</td>
                                <td><HighlightedText text={cert.name} query={query} /></td>
                                <td><HighlightedText text={cert.description} query={query} /></td>
                                <td>{new Date(cert.issuedDate).toLocaleDateString()}</td>
                                <td>{new Date(cert.expiredDate).toLocaleDateString()}</td>
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
                        style={{ marginLeft: '10px', padding: '8px' }}
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {showAddForm && <AddCert onClose={handleCloseAddForm} />}
        </div>
    );
};

export default CertList;
