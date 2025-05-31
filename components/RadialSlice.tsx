
import React from 'react';
import { RadialSliceProps } from '../types';

const RadialSlice: React.FC<RadialSliceProps> = ({
  label,
  percentage,
  details,
  icon,
  sliceColor = '#10b981', // Default hex (emerald-500)
  trackColor = '#e2e8f0', // Default hex (slate-200)
  textColor = 'text-slate-700 dark:text-slate-300', 
  mainValueColor, 
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const viewBoxSize = 100;
  const outerRadius = 40; // The visual outer radius of the pie
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;

  // For the progress circle using stroke-dasharray to simulate a pie:
  // The progress circle's radius is half the outerRadius, and strokeWidth is the full outerRadius.
  const progressCircleRadius = outerRadius / 2;
  const circumference = 2 * Math.PI * progressCircleRadius;
  const strokeDashoffset = circumference * (1 - clampedPercentage / 100);

  const percentageColor = mainValueColor || sliceColor;
  
  const progressCircleClassName = 'transition-all duration-100 ease-out';

  return (
    <div className={`p-3 sm:p-4 rounded-lg shadow-lg bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center ${textColor}`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon && <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>}
        <span className="text-sm sm:text-md font-semibold">{label}</span>
      </div>

      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
          {/* Background Track Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={outerRadius} // Track fills the full outer radius
            fill={trackColor}
          />
          
          {/* Foreground Progress Circle (Pie Slice) */}
          {clampedPercentage > 0.001 && ( // Avoid rendering tiny artifacts for 0%
            <circle
              cx={centerX}
              cy={centerY}
              r={progressCircleRadius} // Radius is half, stroke makes it full
              fill="none"
              stroke={sliceColor}
              strokeWidth={outerRadius} // Stroke width is the full visual radius
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${centerX} ${centerY})`} // Start from the top
              className={progressCircleClassName}
              strokeLinecap="butt" // Use butt for cleaner start/end of stroke
            />
          )}
        </svg>
      </div>
      <div
        className="mt-2 text-xl sm:text-2xl font-bold"
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

export default RadialSlice;
