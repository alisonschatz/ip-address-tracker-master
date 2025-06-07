import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import InfoCard from './InfoCard';
import Map from './Map';
import { useIPData } from '../hooks/useIPData';

const IPAddressTracker = () => {
  const [searchValue, setSearchValue] = useState('');
  const { ipData, loading, error, fetchIPData, clearError } = useIPData();

  // Buscar IP do usuário no carregamento inicial
  useEffect(() => {
    fetchIPData();
  }, [fetchIPData]);

  const handleSearch = (value) => {
    if (!value.trim()) return;
    clearError();
    fetchIPData(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-rubik">
      {/* Header Section with Background Pattern */}
      <div className="relative h-80 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 overflow-hidden">
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M0 150 Q100 50 200 150 T400 150" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M0 200 Q150 100 300 200 T600 200" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center pt-8 px-4">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-8 text-center">
            Rastreador de Endereço IP
          </h1>
          
          <SearchForm
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onSearch={handleSearch}
            loading={loading}
          />

          {error && (
            <div className="mt-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm fade-in">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Card */}
      {ipData && (
        <div className="relative -mt-20 mx-4 mb-8 z-20">
          <InfoCard ipData={ipData} />
        </div>
      )}

      {/* Map Section */}
      <Map ipData={ipData} />
    </div>
  );
};

export default IPAddressTracker;