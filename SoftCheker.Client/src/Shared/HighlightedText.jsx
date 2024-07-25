import React from 'react';

const HighlightedText = ({ text, query }) => {
    if (!query) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export default HighlightedText;
