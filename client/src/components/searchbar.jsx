import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search plants..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: '10px',
        fontSize: '16px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '400px',
      }}
    />
  );
};

export default SearchBar;
