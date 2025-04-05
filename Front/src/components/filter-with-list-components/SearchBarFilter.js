import React, { useState, useEffect } from 'react';

const SearchBarFilter = ({ searchQuery, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Met à jour le filtre lorsqu'un utilisateur tape quelque chose
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    setTypingTimeout(setTimeout(() => {
      onSearchChange(value); // Notifie le parent de la mise à jour du filtre 'search'
    }, 800));
  };

  // Handle the Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      onSearchChange(searchTerm); // Notifie le parent de la mise à jour du filtre 'search'
    }
  };

  return (
    <div className="border border-gray-400 rounded-md h-full w-full p-2 flex items-center">
      <input
        className="flex-grow p-2 rounded-full border-2 border-gray-300 bg-white text-sm placeholder-gray-400 overflow-auto"
        type="text"
        placeholder="Uniquement Référence, Nom"
        value={searchTerm}
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default SearchBarFilter;