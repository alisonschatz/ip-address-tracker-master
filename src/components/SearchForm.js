import React from 'react';
import { ChevronRight } from 'lucide-react';

const SearchForm = ({ searchValue, setSearchValue, onSearch, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex rounded-2xl overflow-hidden shadow-lg">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Busque por qualquer endereço IP ou domínio"
          className="flex-1 px-6 py-4 text-lg text-gray-700 bg-white outline-none placeholder-gray-400 font-rubik"
          disabled={loading}
        />
        <button
          onClick={() => onSearch(searchValue)}
          disabled={loading}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-600 px-6 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Buscar IP"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ChevronRight className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;