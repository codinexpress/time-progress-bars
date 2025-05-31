
import React, { useMemo } from 'react';
import { TimeSpiralProps } from '../types';

const generateSpiralPath = (a: number, b: number, rotations: number, pointsPerRotation: number, centerX: number, centerY: number): string => {
  let pathData = `M ${centerX + a} ${centerY}`; 
  const totalPoints = rotations * pointsPerRotation;

  for (let i = 1; i <= totalPoints; i++) {
    const angle = (i / pointsPerRotation) * 2 * Math.PI; 
    const radius = a + (b * angle) / (2 * Math.PI); 
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    pathData += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return pathData;
};


const TimeSpiral: React.FC<TimeSpiralProps> = ({
  label,
  percentage,
  details,
  icon,
  spiralColor = '#0ea5e9', // Default hex (sky-500)
  trackColor = '#e2e8f0', // Default hex (slate-200)
  textColor = 'text-slate-700 dark:text-slate-300', 
  mainValueColor, 
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const viewBoxSize = 100;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;

  const a = 5; 
  const b = 5; 
  const rotations = 3;
  const pointsPerRotation = 60; 

  const spiralPathData = useMemo(() => generateSpiralPath(a, b, rotations, pointsPerRotation, centerX, centerY), [a, b, rotations, pointsPerRotation, centerX, centerY]);
  
  const totalPathLength = useMemo(() => {
    if (typeof document === 'undefined') return 200; 
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', spiralPathData);
    return path.getTotalLength();
  }, [spiralPathData]);

  const strokeDasharray = totalPathLength;
  const strokeDashoffset = totalPathLength * (1 - clampedPercentage / 100);

  const percentageColor = mainValueColor || spiralColor;
  
  return (
    <div className={`p-3 sm:p-4 rounded-lg shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center ${textColor}`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon && <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>}
        <span className="text-sm sm:text-md font-semibold">{label}</span>
      </div>

      <div className="relative w-32 h-32 sm:w-36 sm:h-36"> {/* Container for SVG */}
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
          <path
            d={spiralPathData}
            stroke={trackColor}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={spiralPathData}
            stroke={spiralColor}
            className="transition-all duration-100 ease-out"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>
      
      <div 
        className="text-xl sm:text-2xl font-bold mt-2" // Moved percentage text here, added margin top
        style={{ color: percentageColor }}
      >
        {clampedPercentage.toFixed(1)}%
      </div>
      
      {details && (
        <div className={`mt-2 text-xs text-center space-y-0.5 w-full ${textColor}`}>
          <p><strong className="font-semibold">Elapsed:</strong> {details.elapsed}</p>
          <p><strong className="font-semibold">Remaining:</strong> {details.remaining}</p>
          <p><strong className="font-semibold">Period:</strong> {details.period}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSpiral;