
import React from 'react';
import { HourglassProps } from '../types';

const Hourglass: React.FC<HourglassProps> = ({
  label,
  percentage,
  details,
  icon,
  sandColor = '#f59e0b', // Default hex (amber-500)
  frameColor = '#94a3b8', // Default hex (slate-400)
  textColor = 'text-slate-700 dark:text-slate-300', 
  mainValueColor, 
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const viewBoxWidth = 100;
  const viewBoxHeight = 150;

  const neckY = viewBoxHeight / 2;
  const bulbWidth = viewBoxWidth * 0.8; 
  const neckWidth = viewBoxWidth * 0.1;
  const bulbHeight = (viewBoxHeight / 2) * 0.85;
  const framePadding = 5; 

  const topSandY = neckY - bulbHeight * (1 - clampedPercentage / 100);
  const topSandFillHeight = bulbHeight * (1 - clampedPercentage / 100);
  
  const bottomSandY = neckY;
  const bottomSandFillHeight = bulbHeight * (clampedPercentage / 100);

  const topBulbPath = `M${framePadding},${framePadding} L${viewBoxWidth-framePadding},${framePadding} L${viewBoxWidth/2 + neckWidth/2},${neckY} L${viewBoxWidth/2 - neckWidth/2},${neckY} Z`;
  const bottomBulbPath = `M${viewBoxWidth/2 - neckWidth/2},${neckY} L${viewBoxWidth/2 + neckWidth/2},${neckY} L${viewBoxWidth-framePadding},${viewBoxHeight-framePadding} L${framePadding},${viewBoxHeight-framePadding} Z`;
  
  const percentageColor = mainValueColor || sandColor;
  
  const maskIdTop = `hourglassMaskTop-${label.replace(/\s+/g, '-')}`;
  const maskIdBottom = `hourglassMaskBottom-${label.replace(/\s+/g, '-')}`;

  return (
    <div className={`p-3 sm:p-4 flex flex-col items-center ${textColor}`}> {/* Removed card classes */}
      <div className="flex items-center space-x-2 mb-2">
        {icon && <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>}
        <span className="text-sm sm:text-md font-semibold">{label}</span>
      </div>

      <div className="relative" style={{ width: `${viewBoxWidth * 0.6}px`, height: `${viewBoxHeight * 0.6}px` }}>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
          <defs>
            <mask id={maskIdTop}>
              <path d={topBulbPath} fill="white" />
            </mask>
            <mask id={maskIdBottom}>
              <path d={bottomBulbPath} fill="white" />
            </mask>
          </defs>

          <path d={topBulbPath} stroke={frameColor} strokeWidth="3" fill="none" />
          <path d={bottomBulbPath} stroke={frameColor} strokeWidth="3" fill="none" />
          
          <rect
            x={framePadding} 
            y={topSandY}
            width={bulbWidth} 
            height={topSandFillHeight}
            fill={sandColor}
            className="transition-all duration-150 ease-linear"
            mask={`url(#${maskIdTop})`}
          />

          <rect
            x={framePadding} 
            y={bottomSandY} 
            width={bulbWidth} 
            height={bottomSandFillHeight} 
            fill={sandColor}
            className="transition-all duration-150 ease-linear"
            mask={`url(#${maskIdBottom})`}
          />
        </svg>
        <div 
          className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold"
          style={{ color: percentageColor }}
        >
          {clampedPercentage.toFixed(1)}%
        </div>
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

export default Hourglass;