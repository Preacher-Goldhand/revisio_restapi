import React from 'react';

const SearchBar = ({ query, onQueryChange }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <input
                type="text"
                placeholder="..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
            />
        </div>
    );
};

export default SearchBar;
