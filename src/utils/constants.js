// API Key do IPify
export const API_KEY = process.env.REACT_APP_IPIFY_API_KEY;

// Dados mock para fallback
export const MOCK_DATA = {
  ip: '192.212.174.101',
  location: {
    city: 'São Paulo',
    region: 'SP',
    postalCode: '01310-100',
    timezone: '-03:00',
    lat: -23.5505,
    lng: -46.6333
  },
  isp: 'Vivo Fibra'
};

// Configurações do mapa
export const MAP_CONFIG = {
  defaultZoom: 13,
  maxZoom: 19,
  minZoom: 2,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Por favor, insira um endereço IP ou domínio válido',
  API_ERROR: 'Erro na API. Verifique sua conexão e tente novamente',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet',
  INVALID_API_KEY: 'Chave de API inválida',
  RATE_LIMIT: 'Muitas requisições. Tente novamente em alguns minutos'
};

// Configurações de animação
export const ANIMATION_CONFIG = {
  mapLoadDelay: 100,
  cardFadeIn: 500,
  searchDelay: 300
};