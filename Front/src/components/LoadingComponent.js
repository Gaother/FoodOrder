import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = ({ color = "#C60C30", height = 80, width = 80 }) => {
  return (
    <div className="flex justify-center items-center h-20vh">
      <div className="flex justify-center items-center">
        <ThreeDots color={color} height={height} width={width} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
