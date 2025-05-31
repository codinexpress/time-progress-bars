
import React from 'react';
import { TimeOrbitProps } from '../types';

const TimeOrbit: React.FC<TimeOrbitProps> = ({
  label,
  percentage,
  details,
  icon,
  planetColor = '#0ea5e9', // Default hex (sky-500)
  orbitColor = '#e2e8f0', // Default hex (slate-200)
  textColor = 'text-slate-700 dark:text-slate-300', 
  mainValueColor, 
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const angle = (clampedPercentage / 100) * 360 - 90; 
  const radius = 40; 
  const planetRadius = 5;
  const strokeWidth = 6;
  const viewBoxSize = 100; 

  const x = viewBoxSize / 2 + radius * Math.cos(angle * Math.PI / 180);
  const y = viewBoxSize / 2 + radius * Math.sin(angle * Math.PI / 180);
  
  const percentageColor = mainValueColor || planetColor;

  // Simplified shadow for planet (using fixed color related to planetColor or removing if too complex without CSS vars)
  // For simplicity, let's use a fixed shadow or none.
  // const planetShadow = planetColor ? `${planetColor}66` : 'transparent'; // Add alpha for shadow

  return (
    <div className={`p-4 rounded-lg shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center ${textColor}`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon && <span className="w-6 h-6">{icon}</span>} {/* Icon color is passed via props to App.tsx */}
        <span className="text-md font-semibold">{label}</span>
      </div>

      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            stroke={orbitColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
           <circle
            cx={x}
            cy={y}
            r={planetRadius}
            fill={planetColor}
            className="transition-all duration-100 ease-out"
            // style={{ filter: `drop-shadow(0 0 3px ${planetShadow})` }} // Simplified or removed shadow
          />
        </svg>
        <div 
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color: percentageColor }}
        >
          {clampedPercentage.toFixed(1)}%
        </div>
      </div>
      
      {details && (
        <div className={`mt-3 text-xs text-center space-y-0.5 w-full ${textColor}`}>
          <p><strong className="font-semibold">Elapsed:</strong> {details.elapsed}</p>
          <p><strong className="font-semibold">Remaining:</strong> {details.remaining}</p>
          <p><strong className="font-semibold">Period:</strong> {details.period}</p>
        </div>
      )}
    </div>
  );
};

export default TimeOrbit;