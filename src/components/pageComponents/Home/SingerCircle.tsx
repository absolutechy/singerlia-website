import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import LogoLia from '@/assets/images/common/logolia.png';

interface SingerCircleProps {
  imageUrl?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackText?: string;
}

const SingerCircle: React.FC<SingerCircleProps> = ({
  imageUrl,
  alt = 'Singer',
  size = 'lg',
  fallbackText = 'S',
}) => {
  // Size mappings
  const sizeClasses = {
    sm: { container: 'w-20 h-20', svg: 80 },
    md: { container: 'w-28 h-28', svg: 112 },
    lg: { container: 'w-36 h-36', svg: 144 },
    xl: { container: 'w-44 h-44', svg: 176 },
  };

  const badgeSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const svgSize = sizeClasses[size].svg;
  const radius = svgSize / 2;
  const strokeRadius = radius - 1;

  return (
    <div className="relative inline-block mx-2 !h-40">
      {/* SVG Border */}
      <div className={`${sizeClasses[size].container} relative`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          fill="none"
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}
        >
          <circle
            cx={radius}
            cy={radius}
            r={strokeRadius}
            stroke="url(#paint0_linear_border)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="paint0_linear_border"
              x1={radius}
              y1="0"
              x2={radius}
              y2={svgSize}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFD700" stopOpacity="0" />
              <stop offset="1" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner white border and Avatar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full p-0.5 bg-white">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={imageUrl}
                alt={alt}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl font-semibold">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Singerlia Badge - Top Right */}
      <div
        className={`${badgeSizes[size]} absolute top-0 -right-1 rounded-full bg-gray-700 flex items-center justify-center shadow-md border-2 border-white`}
      >
        <img
          src={LogoLia}
          alt="Singerlia"
          className="w-full h-full object-contain p-1"
        />
      </div>
    </div>
  );
};

export default SingerCircle;
