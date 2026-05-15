import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo CODEL PROGRAMMATION avec style moderne */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Fond sombre avec effet néon */}
        <div className="absolute inset-0 bg-gray-900 rounded-lg shadow-2xl">
          {/* Effet de lueur néon orange */}
          <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.5)]"></div>
          
          {/* Lettre C stylisée en orange */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* C orange */}
              <div className="w-6 h-8 border-4 border-orange-500 rounded-l-full rounded-r-none border-r-0"></div>
              
              {/* P vert avec icône laptop */}
              <div className="absolute -right-1 top-1">
                <div className="w-4 h-5 border-2 border-green-500 rounded-sm relative">
                  {/* Écran du laptop */}
                  <div className="absolute inset-x-0.5 top-0.5 h-2 bg-green-400 rounded-sm"></div>
                  {/* Clavier du laptop */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-green-500 leading-tight`}>
            CODEL
          </span>
          <span className={`${textSizeClasses[size]} font-bold text-orange-500 leading-tight -mt-1`}>
            PROGRAMMATION
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
