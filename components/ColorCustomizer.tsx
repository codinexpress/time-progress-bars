
import React from 'react';
import { ColorCustomizerProps, TimeUnitId } from '../types';

const ResetIcon = ({ className = "w-4 h-4"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);


const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  progressConfigs,
  customColors,
  onColorChange,
  onResetColors,
}) => {

  return (
    <div className="space-y-4 p-1">
      {progressConfigs.map((config) => {
        const currentHexColor = customColors[config.id] || config.baseColor;
        return (
          <div 
            key={config.id} 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-slate-100 dark:bg-slate-700/50 shadow"
          >
            <label 
              htmlFor={`color-picker-${config.id}`} 
              className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 sm:mb-0 flex items-center"
            >
              {config.icon({ className: 'w-5 h-5 mr-2', color: currentHexColor })}
              {config.label}:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id={`color-picker-${config.id}`}
                value={currentHexColor}
                onChange={(e) => onColorChange(config.id, e.target.value)}
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-md border border-slate-300 dark:border-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-700"
                aria-label={`Select color for ${config.label}`}
                title={`Current color: ${currentHexColor}`}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono select-all" style={{ color: currentHexColor }}>
                {currentHexColor}
              </span>
            </div>
          </div>
        );
      })}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onResetColors}
          className="px-4 py-2 text-xs sm:text-sm rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-rose-600 dark:hover:bg-rose-700 transition-colors flex items-center space-x-1.5"
          aria-label="Reset all unit colors to default"
        >
          <ResetIcon className="w-4 h-4" />
          <span>Reset All Colors to Default</span>
        </button>
      </div>
    </div>
  );
};

export default ColorCustomizer;
