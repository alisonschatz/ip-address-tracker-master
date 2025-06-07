import { API_KEY, MOCK_DATA } from '../utils/constants';

const BASE_URL = 'https://geo.ipify.org/api/v2/country,city';

export const fetchIPInformation = async (ipAddress = '') => {
  try {
    if (!API_KEY) {
      console.warn('API Key não encontrada, usando dados mock');
      return MOCK_DATA;
    }

    const url = ipAddress 
      ? `${BASE_URL}?apiKey=${API_KEY}&ipAddress=${encodeURIComponent(ipAddress)}`
      : `${BASE_URL}?apiKey=${API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 422) {
        throw new Error('Endereço IP ou domínio inválido');
      } else if (response.status === 403) {
        throw new Error('Erro na API: Chave de acesso inválida');
      } else {
        throw new Error(`Erro na API: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // Validar se a resposta tem os dados necessários
    if (!data.ip || !data.location) {
      throw new Error('Resposta da API incompleta');
    }

    return {
      ip: data.ip,
      location: {
        city: data.location.city || 'Não disponível',
        region: data.location.region || 'Não disponível',
        postalCode: data.location.postalCode || '',
        timezone: data.location.timezone || '+00:00',
        lat: data.location.lat || 0,
        lng: data.location.lng || 0
      },
      isp: data.isp || 'Não disponível'
    };

  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// Função para validar IP
export const isValidIP = (ip) => {
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipRegex.test(ip);
};

// Função para validar domínio
export const isValidDomain = (domain) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};