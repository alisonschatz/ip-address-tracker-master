import React, { useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = ({ ipData }) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // Criar ícone customizado
  const createCustomIcon = () => {
    return L.divIcon({
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
  };

  // Inicializar mapa
  const initializeMap = (lat, lng) => {
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    if (mapRef.current) {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      });

      // Adicionar camada de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Criar e adicionar marcador
      const customIcon = createCustomIcon();
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      
      // Adicionar popup ao marcador
      if (ipData) {
        marker.bindPopup(`
          <div style="text-align: center; font-family: 'Rubik', sans-serif;">
            <strong>${ipData.location.city}, ${ipData.location.region}</strong><br>
            <span style="color: #6b7280;">IP: ${ipData.ip}</span><br>
            <span style="color: #6b7280;">${ipData.isp}</span>
          </div>
        `);
      }
      
      leafletMapRef.current = map;
      markerRef.current = marker;
    }
  };

  // Atualizar localização do mapa
  const updateMapLocation = (lat, lng) => {
    if (leafletMapRef.current && markerRef.current) {
      const newLatLng = [lat, lng];
      leafletMapRef.current.setView(newLatLng, 13);
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
      initializeMap(lat, lng);
    }
  };

  // Effect para inicializar/atualizar o mapa
  useEffect(() => {
    if (ipData && ipData.location.lat && ipData.location.lng) {
      const timer = setTimeout(() => {
        if (leafletMapRef.current) {
          updateMapLocation(ipData.location.lat, ipData.location.lng);
        } else {
          initializeMap(ipData.location.lat, ipData.location.lng);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [ipData]);

  // Cleanup do mapa
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Texto Sobreposto do Mapa */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md z-20">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4" />
          <span>
            {ipData ? `${ipData.location.city}, ${ipData.location.region}` : 'Carregando localização...'}
          </span>
        </div>
      </div>

      {/* Aviso de Mapa Interativo */}
      <div className="absolute top-4 right-4 bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-sm text-green-800 z-20">
        <div className="font-medium">Mapa Interativo</div>
        <div className="text-xs">LeafletJS + OpenStreetMap</div>
      </div>

      {/* Container do Mapa */}
      <div 
        ref={mapRef}
        className="h-96 w-full relative z-10"
        style={{ minHeight: '384px' }}
      >
        {/* Fallback enquanto o mapa carrega */}
        {!ipData && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Carregando mapa interativo...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;