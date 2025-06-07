import React from 'react';

const InfoCard = ({ ipData }) => {
  if (!ipData) return null;

  const infoItems = [
    {
      label: 'Endereço IP',
      value: ipData.ip,
      id: 'ip-address'
    },
    {
      label: 'Localização',
      value: `${ipData.location.city}, ${ipData.location.region} ${ipData.location.postalCode}`,
      id: 'location'
    },
    {
      label: 'Fuso Horário',
      value: `UTC ${ipData.location.timezone}`,
      id: 'timezone'
    },
    {
      label: 'Provedor',
      value: ipData.isp,
      id: 'isp'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {infoItems.map((item, index) => (
          <div 
            key={item.id}
            className={`text-center md:text-left ${
              index < infoItems.length - 1 ? 'md:border-r md:border-gray-200 md:pr-8' : ''
            }`}
          >
            <div className="text-xs font-bold text-dark-gray uppercase tracking-wide mb-2">
              {item.label}
            </div>
            <div className="text-xl md:text-2xl font-medium text-very-dark-gray break-words">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;