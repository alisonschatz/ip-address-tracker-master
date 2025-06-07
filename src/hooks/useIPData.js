import { useState, useCallback } from 'react';
import { fetchIPInformation } from '../services/ipifyAPI';
import { MOCK_DATA } from '../utils/constants';

export const useIPData = () => {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIPData = useCallback(async (searchValue = '') => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchIPInformation(searchValue);
      setIpData(data);
    } catch (err) {
      console.error('Erro ao buscar IP:', err);
      
      if (err.message.includes('API')) {
        setError('Erro na API. Verifique sua conexão e tente novamente.');
      } else if (err.message.includes('inválido')) {
        setError('Por favor, insira um endereço IP ou domínio válido.');
      } else {
        setError('Falha ao buscar informações do IP. Tente novamente.');
      }

      // Fallback para dados mock em caso de erro
      if (!searchValue) {
        setIpData(MOCK_DATA);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    ipData,
    loading,
    error,
    fetchIPData,
    clearError
  };
};