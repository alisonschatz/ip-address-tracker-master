import React, { useState, useEffect, useRef } from 'react';

// Componentes de Ícones SVG
const ChevronRight = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const MapPin = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const Clock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const Wifi = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // API Key - em produção, use variável de ambiente
  const API_KEY = 'at_1Mn9Dj1tBSBRrUKYtGHIjZ8KhlvzJ';

  // Dados mock para fallback
  const mockData = {
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

  // Função para inicializar o mapa
  const initializeMap = (lat, lng) => {
    if (!window.L || !mapRef.current) return;

    // Remove mapa anterior se existir
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      // Criar novo mapa
      const map = window.L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Adicionar tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Criar ícone personalizado
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 48px; 
            height: 48px; 
            background: black; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
      });

      // Adicionar marcador
      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(map);
      
      // Adicionar popup
      if (ipData) {
        marker.bindPopup(`
          <div style="text-align: center; font-family: 'Rubik', sans-serif;">
            <strong>${ipData.location.city}, ${ipData.location.region}</strong><br>
            <span style="color: #6b7280;">IP: ${ipData.ip}</span><br>
            <span style="color: #6b7280;">${ipData.isp}</span>
          </div>
        `);
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  };

  // Função para atualizar localização no mapa
  const updateMapLocation = (lat, lng) => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = [lat, lng];
      mapInstanceRef.current.setView(newLatLng, 13);
      markerRef.current.setLatLng(newLatLng);
      
      // Atualizar popup
      if (ipData) {
        markerRef.current.setPopupContent(`
          <div style="text-align: center; font-family: 'Rubik', sans-serif;">
            <strong>${ipData.location.city}, ${ipData.location.region}</strong><br>
            <span style="color: #6b7280;">IP: ${ipData.ip}</span><br>
            <span style="color: #6b7280;">${ipData.isp}</span>
          </div>
        `);
      }
    } else {
      setTimeout(() => initializeMap(lat, lng), 100);
    }
  };

  // Buscar IP do usuário no carregamento inicial
  useEffect(() => {
    const fetchUserIP = async () => {
      try {
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const newIpData = {
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
          setIpData(newIpData);
          
          // Inicializar mapa
          setTimeout(() => {
            if (newIpData.location.lat && newIpData.location.lng) {
              initializeMap(newIpData.location.lat, newIpData.location.lng);
            }
          }, 500);
        } else {
          setIpData(mockData);
          setTimeout(() => initializeMap(mockData.location.lat, mockData.location.lng), 500);
        }
      } catch (error) {
        console.error('Erro ao buscar IP do usuário:', error);
        setIpData(mockData);
        setTimeout(() => initializeMap(mockData.location.lat, mockData.location.lng), 500);
      }
    };

    fetchUserIP();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Função de busca
  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${encodeURIComponent(searchValue)}`
      );
      
      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('Endereço IP ou domínio inválido');
        } else {
          throw new Error(`Erro na API: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      const newIpData = {
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
      
      setIpData(newIpData);
      
      // Atualizar mapa
      if (newIpData.location.lat && newIpData.location.lng) {
        updateMapLocation(newIpData.location.lat, newIpData.location.lng);
      }
      
    } catch (err) {
      console.error('Erro ao buscar IP:', err);
      setError(err.message || 'Falha ao buscar informações do IP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-rubik">
      {/* Header Section */}
      <div className="relative h-80 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 overflow-hidden">
        {/* Padrão Geométrico de Fundo */}
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
          
          {/* Search Form */}
          <div className="w-full max-w-md flex rounded-2xl overflow-hidden shadow-lg">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Busque por qualquer endereço IP ou domínio"
              className="flex-1 px-6 py-4 text-lg text-gray-700 bg-white outline-none placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-600 px-6 py-4 transition-colors duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronRight className="text-white" />
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Card */}
      {ipData && (
        <div className="relative -mt-20 mx-4 mb-8 z-20">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {/* IP Address */}
              <div className="text-center md:text-left md:border-r md:border-gray-200 md:pr-8">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Endereço IP
                </div>
                <div className="text-xl md:text-2xl font-medium text-gray-900">
                  {ipData.ip}
                </div>
              </div>

              {/* Location */}
              <div className="text-center md:text-left md:border-r md:border-gray-200 md:pr-8">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Localização
                </div>
                <div className="text-xl md:text-2xl font-medium text-gray-900">
                  {ipData.location.city}, {ipData.location.region} {ipData.location.postalCode}
                </div>
              </div>

              {/* Timezone */}
              <div className="text-center md:text-left md:border-r md:border-gray-200 md:pr-8">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Fuso Horário
                </div>
                <div className="text-xl md:text-2xl font-medium text-gray-900">
                  UTC {ipData.location.timezone}
                </div>
              </div>

              {/* ISP */}
              <div className="text-center md:text-left">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Provedor
                </div>
                <div className="text-xl md:text-2xl font-medium text-gray-900">
                  {ipData.isp}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="relative">
        {/* Map Overlay Info */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md z-20">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <MapPin />
            <span>
              {ipData ? `${ipData.location.city}, ${ipData.location.region}` : 'Carregando localização...'}
            </span>
          </div>
        </div>

        {/* Interactive Map Badge */}
        <div className="absolute top-4 right-4 bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-sm text-green-800 z-20">
          <div className="font-medium">Mapa Interativo</div>
          <div className="text-xs">LeafletJS + OpenStreetMap</div>
        </div>

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="h-96 w-full relative z-10 bg-gray-200"
          style={{ minHeight: '384px' }}
        >
          {/* Loading Fallback */}
          {!ipData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando mapa interativo...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
          <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
            <div className="flex items-center space-x-2">
              <Wifi />
              <span>Rastreamento de IP em tempo real</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock />
              <span>Detecção de fuso horário</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin />
              <span>Mapeamento de localização</span>
            </div>
          </div>
          <p>
            Aplicativo completo com{' '}
            <a href="https://geo.ipify.org/" className="text-blue-600 hover:underline">
              API do IPify
            </a>
            {' '}e mapa interativo{' '}
            <a href="https://leafletjs.com/" className="text-blue-600 hover:underline">
              LeafletJS
            </a>
            {' '}em tempo real!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;