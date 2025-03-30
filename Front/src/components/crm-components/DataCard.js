import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const tailwindColors = {
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  orange: '#F97316',
};

const DataCard = ({ title, data, link, bgColor, iconType }) => {
  const [isHovered, setIsHovered] = useState(false);
  const backgroundColor = tailwindColors[bgColor] || bgColor;
  const textColor = '#FFFFFF';

  return (
    <div className={`flex flex-row rounded-lg shadow-lg justify-between	`} style={{ backgroundColor }}>
      <div className="flex flex-col items-start p-4">
        <div className="flex flex-row">
          <div className="text-4xl font-bold" style={{ color: textColor }}>{data}</div>
          {link && (
            <div className="mt-2 ml-4">
              <Link
                to={link}
                className="border-2 py-1 px-3 rounded-full text-sm transition-colors duration-300"
                style={{
                  color: isHovered ? backgroundColor : textColor,
                  borderColor: textColor,
                  backgroundColor: isHovered ? textColor : 'transparent'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Voir
              </Link>
            </div>
          )}
        </div>
        <div className="mt-2 uppercase" style={{ color: textColor }}>{title}</div>
      </div>
      <div className="flex flex-col justify-center p-4">
        <div
          className="p-4 rounded-full m-2"
          style={{ color: backgroundColor, backgroundColor: textColor }}
        >
          {iconType}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
