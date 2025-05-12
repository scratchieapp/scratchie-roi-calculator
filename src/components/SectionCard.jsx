import React from 'react';

const SCRATCHIE_ORANGE = '#F97115';

const SectionCard = ({ title, sectionNumber, children, color = "orange", icon, className = "" }) => {
  const borderColors = { orange: 'border-orange-500', red: 'border-red-500', blue: 'border-blue-500', green: 'border-green-500', purple: 'border-purple-500', gray: 'border-gray-500'};
  const textColors = { orange: 'text-orange-600', red: 'text-red-600', blue: 'text-blue-600', green: 'text-green-600', purple: 'text-purple-600', gray: 'text-gray-700'};
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border-t-4 ${borderColors[color]} ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-2xl" style={{color: SCRATCHIE_ORANGE}}>{icon}</div>}
        <h2 className={`text-xl font-semibold ${textColors[color]}`}>
          {sectionNumber && `${sectionNumber}. `}{title}
        </h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default SectionCard; 