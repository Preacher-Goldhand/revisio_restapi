import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from '../Shared/Searchbar';
import Pagination from '../Shared/Pagination';
import HighlightedText from '../Shared/HighlightedText';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5180/api/account/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.userName.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [query, users]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div style={{ padding: '20px' }}>
            <SearchBar query={query} onQueryChange={setQuery} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Link to="/register" className="btn btn-primary">Dodaj uzytkownika</Link>
            </div>
            {filteredUsers.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nazwa uzytkownika</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan="2" style={{ textAlign: 'center', padding: '8px' }}>Brak uzytkownikow</td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <HighlightedText text={user.userName} query={query} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <HighlightedText text={user.email} query={query} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <div style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="usersPerPage">Rekordy per strona:</label>
                    <select
                        id="usersPerPage"
                        value={usersPerPage}
                        onChange={handleUsersPerPageChange}
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
        </div>
    );
};

export default UserList;
