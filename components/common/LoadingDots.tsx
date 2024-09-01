import React from 'react';
import { FaCircle } from 'react-icons/fa';

function LoadingDots () {
  return (
    <div className="flex justify-center items-center space-x-1">
      <FaCircle className="animate-bounce text-gray-400" style={{ animationDelay: '0s' }} />
      <FaCircle className="animate-bounce text-gray-400" style={{ animationDelay: '0.2s' }} />
      <FaCircle className="animate-bounce text-gray-400" style={{ animationDelay: '0.4s' }} />
    </div>
  );
};

export default LoadingDots;
