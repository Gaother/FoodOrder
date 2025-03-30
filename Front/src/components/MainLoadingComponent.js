import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import destockdisSvg from '../assets/destockdis.svg';

const LoadingSpinner = ({ color = "#FFFFFF", height = 80, width = 80 }) => {
  return (
    <div>
      <div className='bg-black min-h-screen flex flex-col justify-center items-center text-center'>
        <div className='flex z-50'>
          <img src={destockdisSvg} className="h-32 w-64" alt="Loading" />
        </div>
        <div className='flex z-50'>
          <ThreeDots color={color} height={height} width={width} />
        </div>
      </div>
      
    </div>
  );
};

export default LoadingSpinner;
