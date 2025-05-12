import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import destockdisSvg from '../assets/destockdis.svg';

const LoadingSpinner = ({ color = "#C60C30", height = 80, width = 80 }) => {
  return (
    <div>
      <div className='bg-black min-h-screen flex flex-col justify-center items-center text-center'>
        <div className='flex z-50'>
          <h1 className="font-bold text-2xl text-[#E36A88] mr-4 visible font-fraunces">Mai's Kitchen</h1>
        </div>
        <div className='flex z-50'>
          <ThreeDots color={color} height={height} width={width} />
        </div>
      </div>
      
    </div>
  );
};

export default LoadingSpinner;
