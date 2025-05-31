
import React, { useState, useEffect, useCallback } from 'react';
import ProgressBar from './components/ProgressBar';
import CurrentTimeDisplay from './components/CurrentTimeDisplay';
import TimeOrbit from './components/TimeOrbit';
import PixelGrid from './components/PixelGrid'; 
import TimeSpiral from './components/TimeSpiral'; 
import Hourglass from './components/Hourglass'; 
import RadialSlice from './components/RadialSlice'; 
import ColorCustomizer from './components/ColorCustomizer';
import CommentSection from './components/CommentSection'; // Import CommentSection
import { 
  ProgressItemConfig, Theme, WeekStartDay, SettingsProps, VisualizationMode, 
  AppSettings, TimeUnitId, CustomColors
} from './types';
import VisitorCountDisplay from './components/VisitorCountDisplay';
import LikeButton from './components/LikeButton';
import RatingSystem from './components/RatingSystem';
import {
  getSecondDetails, getMinuteDetails, getHourDetails, 
  getDayDetails, getWeekDetails, getMonthDetails, getYearDetails, getDecadeDetails,
} from './utils/timeUtils';
import { getValue, updateValue } from './utils/keyValueService';

// --- SVG Icons ---
// Helper for icon props
interface IconProps {
  className?: string;
  color?: string; // For applying custom hex colors via style or currentColor
}

const SunIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={color ? { color } : {}}>
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.834a.75.75 0 00-1.06 1.06l-1.59-1.591a.75.75 0 00-1.061-1.06l1.59-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.106 6.106a.75.75 0 001.06-1.06l-1.591-1.59a.75.75 0 00-1.06 1.061l1.591 1.59z" />
  </svg>
);
const MoonIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={color ? { color } : {}}>
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.636 4.382-8.442a.75.75 0 01.819.162z" clipRule="evenodd" />
  </svg>
);

// Time Unit Icons
const SecondIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 1.5M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L12 6" />
  </svg>
);
const MinuteIcon = ({ className = "w-5 h-5", color }: IconProps) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const HourIcon = ({ className = "w-5 h-5", color }: IconProps) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);
const DayIcon = ({className, color}: IconProps) => <SunIcon className={className} color={color} />;
const WeekIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);
const MonthIcon = ({ className = "w-5 h-5", color }: IconProps) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5M12 15H9.75v2.25H7.5V15H5.25v-2.25H7.5V10.5h2.25V12.75h2.25V15Z" />
  </svg>
);
const YearIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" transform="scale(0.8) translate(2.5 2.5)"/>
     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5M12 2.25V9" />
  </svg>
);
const DecadeIcon = ({ className = "w-5 h-5", color }: IconProps) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM12 12h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM9.75 12h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008ZM7.5 12h.008v.008H7.5v-.008ZM14.25 15h.008v.008h-.008v-.008ZM14.25 12h.008v.008h-.008v-.008ZM16.5 15h.008v.008h-.008v-.008ZM16.5 12h.008v.008h-.008v-.008Z" />
  </svg>
);

// Visualization Mode Icons
const BarsIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={color ? { color } : {}}>
    <path d="M3 12h2V4H3v8zm4-6h2v14H7V6zm4-4h2v18h-2V2zm4 6h2v12h-2V8zm4-3h2v15h-2V5z"/>
  </svg>
);
const OrbitIcon = ({ className = "w-5 h-5", color }: IconProps) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.0006 18.0002C13.1338 19.867 10.3074 20.1335 8.13281 18.6854C5.9582 17.2373 4.93805 14.6043 5.89438 12.2502C6.85071 9.89609 9.31836 8.36805 11.8662 8.99713C14.414 9.6262 16.3159 11.8655 16.487 14.496C16.6581 17.1266 14.986 19.5441 12.5 20.0002" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
    <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/>
  </svg>
);
const PixelIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={color ? { color } : {}}>
    <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 1h4v4h-4v-4zm6-1h4v4h-4v-4z"/>
  </svg>
);
const SpiralIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929C15.166 1.024 8.834 1.024 4.929 4.929s-3.905 8.237 0 12.142C7.834 20.076 12.166 21 15 21c2.834 0 6.166-.924 9.071-4.829-2.905-3.905-1.976-9.237 1-12.142zM12 12a3 3 0 100-6 3 3 0 000 6z" transform="rotate(45 12 12)"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-2.333-2.333-2.333-6.167 0-8.5s6.167-2.333 8.5 0c2.333 2.333 2.333 6.167 0 8.5s-6.167 2.333-8.5 0z" />
  </svg>
);
const HourglassIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 18.75L5.25 5.25m13.5 0L5.25 18.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v2H5V3zm0 16h14v2H5v-2z" fill="currentColor"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5l4 4 4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 19l4-4 4 4" />
  </svg>
);
const RadialSliceIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={color ? { color } : {}}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v8h8c0 4.41-3.59 8-8 8z" />
  </svg>
);
const ResetIcon = ({ className = "w-5 h-5", color }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={color ? { color } : {}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
// --- End SVG Icons ---

const DEFAULT_PROGRESS_CONFIGS: ReadonlyArray<ProgressItemConfig> = [
  { id: 'second', label: 'Second', getDetails: getSecondDetails, icon: (props) => SecondIcon(props), baseColor: '#14b8a6'}, // teal-500
  { id: 'minute', label: 'Minute', getDetails: getMinuteDetails, icon: (props) => MinuteIcon(props), baseColor: '#06b6d4'}, // cyan-500
  { id: 'hour', label: 'Hour', getDetails: getHourDetails, icon: (props) => HourIcon(props), baseColor: '#3b82f6'},   // blue-500
  { id: 'day', label: 'Day', getDetails: getDayDetails, icon: (props) => DayIcon(props), baseColor: '#0ea5e9' },    // sky-500
  { id: 'week', label: 'Week', getDetails: getWeekDetails, icon: (props) => WeekIcon(props), baseColor: '#10b981' },  // emerald-500
  { id: 'month', label: 'Month', getDetails: getMonthDetails, icon: (props) => MonthIcon(props), baseColor: '#f59e0b' }, // amber-500
  { id: 'year', label: 'Year', getDetails: getYearDetails, icon: (props) => YearIcon(props), baseColor: '#f43f5e' },   // rose-500
  { id: 'decade', label: 'Decade', getDetails: getDecadeDetails, icon: (props) => DecadeIcon(props), baseColor: '#8b5cf6' },// violet-500
];

const defaultAppSettings: AppSettings = {
  theme: 'light',
  weekStartDay: 0,
  visualizationMode: 'bars',
  updateIntervalMs: 200,
  customColors: {},
};

// Add 'comments' to ActiveTab type
type ActiveTab = 'visualizations' | 'settings' | 'colors' | 'comments';

const EXTENDSCLASS_API_KEY = "d9892a88-3e66-11f0-8efd-0242ac110009";

const SettingsDisplay: React.FC<SettingsProps> = ({
  settings,
  onSettingChange,
  onResetAllSettings,
}) => {
  const vizOptions: { mode: VisualizationMode, label: string, Icon: React.FC<IconProps> }[] = [
    { mode: 'bars', label: 'Bars', Icon: BarsIcon },
    { mode: 'orbits', label: 'Orbits', Icon: OrbitIcon },
    { mode: 'pixels', label: 'Pixels', Icon: PixelIcon },
    { mode: 'spiral', label: 'Spiral', Icon: SpiralIcon },
    { mode: 'hourglass', label: 'Hourglass', Icon: HourglassIcon },
    { mode: 'radialSlice', label: 'Radial Slice', Icon: RadialSliceIcon },
  ];

  const intervalOptions = [
    { value: 50, label: "Very Fast (50ms)" },
    { value: 200, label: "Fast (200ms)" },
    { value: 500, label: "Medium (500ms)" },
    { value: 1000, label: "Standard (1s)" },
    { value: 2000, label: "Slow (2s)" },
  ];

  return (
    <div className="space-y-6 p-1">
      {/* Theme Toggle */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-24">Theme:</span>
        <button
          onClick={() => onSettingChange('theme', settings.theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {settings.theme === 'light' ? <MoonIcon className="w-5 h-5 text-slate-700" /> : <SunIcon className="w-5 h-5 text-slate-300" />}
        </button>
      </div>

      {/* Visualization Mode Selector */}
      <div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">View Mode:</span>
        <div className="flex flex-wrap gap-2 items-center">
          {vizOptions.map(opt => (
            <button
              key={opt.mode}
              onClick={() => onSettingChange('visualizationMode', opt.mode)}
              className={`flex items-center px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 focus:ring-sky-500
                ${settings.visualizationMode === opt.mode 
                  ? 'bg-sky-500 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              aria-label={`${opt.label} View`} 
              title={`${opt.label} View`}
            >
              <opt.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="ml-1.5 text-xs sm:text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Week Start Day */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-24">Week starts:</span>
        {(['Sun', 'Mon'] as const).map((day, index) => (
          <button
            key={day}
            onClick={() => onSettingChange('weekStartDay', index as WeekStartDay)}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              settings.weekStartDay === index
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Update Interval Selector */}
      <div className="flex items-center space-x-3">
        <label htmlFor="updateInterval" className="text-sm font-medium text-slate-700 dark:text-slate-300 w-24">Update Speed:</label>
        <select
          id="updateInterval"
          value={settings.updateIntervalMs}
          onChange={(e) => onSettingChange('updateIntervalMs', parseInt(e.target.value, 10))}
          className="flex-grow px-2 py-1.5 text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          aria-label="Select update speed for time display"
        >
          {intervalOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Reset All Settings Button */}
      <div className="pt-4">
        <button
          onClick={onResetAllSettings}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-300 bg-slate-200 hover:bg-red-200 dark:bg-slate-700 dark:hover:bg-red-800 hover:text-red-700 dark:hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label="Reset all settings to default"
          title="Reset All Settings"
        >
          <ResetIcon className="w-4 h-4" />
          <span className="text-xs sm:text-sm">Reset All Settings</span>
        </button>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizations');
  
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedSettings = localStorage.getItem('temporalFluxSettings');
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings) as Partial<AppSettings>;
          // Ensure customColors is an object, even if not present in older stored settings
          const customColors = (typeof parsed.customColors === 'object' && parsed.customColors !== null) ? parsed.customColors : {};
          return { ...defaultAppSettings, ...parsed, customColors };
        } catch (e) {
          console.error("Failed to parse settings from localStorage", e);
        }
      }
    }
     const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { ...defaultAppSettings, theme: prefersDark ? 'dark' : 'light' };
  });

// New state variables
const [visitorCount, setVisitorCount] = useState<number | null>(null);
const [likeCount, setLikeCount] = useState<number | null>(null);
const [ratingCounts, setRatingCounts] = useState<Record<string, number>>({
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
});
const APP_KEY = "l3micf0v"; // Provided app key
const LIKE_COUNT_KEY = 'likeCount';
const RATING_KEY_PREFIX = 'rating_';

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, appSettings.updateIntervalMs); 
    return () => clearInterval(timerId);
  }, [appSettings.updateIntervalMs]);

  useEffect(() => {
    if (appSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appSettings.theme]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('temporalFluxSettings', JSON.stringify(appSettings));
    }
  }, [appSettings]);

  useEffect(() => {
    const VISITOR_COUNT_KEY = 'visitorCount';

    const initializeVisitorCount = async () => {
      try {
        let currentCount = 0;
        const storedCountStr = await getValue(APP_KEY, VISITOR_COUNT_KEY);

        if (storedCountStr !== null) {
          const parsedCount = parseInt(storedCountStr, 10);
          if (!isNaN(parsedCount)) {
            currentCount = parsedCount;
          } else {
            console.warn(`Stored visitor count "${storedCountStr}" is not a valid number. Resetting to 0.`);
            await updateValue(APP_KEY, VISITOR_COUNT_KEY, '0');
          }
        }

        const newCount = currentCount + 1;
        setVisitorCount(newCount);

        const updateSuccess = await updateValue(APP_KEY, VISITOR_COUNT_KEY, newCount.toString());
        if (!updateSuccess) {
          console.error('Failed to update visitor count on the server.');
        }
      } catch (error) {
        console.error('Error initializing visitor count:', error);
      }
    };

    const initializeLikeCount = async () => {
      try {
        const storedLikeCountStr = await getValue(APP_KEY, LIKE_COUNT_KEY);
        if (storedLikeCountStr !== null) {
          const parsedLikes = parseInt(storedLikeCountStr, 10);
          if (!isNaN(parsedLikes)) {
            setLikeCount(parsedLikes);
          } else {
            console.warn(`Stored like count "${storedLikeCountStr}" is not a valid number. Initializing to 0.`);
            setLikeCount(0);
            await updateValue(APP_KEY, LIKE_COUNT_KEY, '0');
          }
        } else {
          setLikeCount(0);
        }
      } catch (error) {
        console.error('Error initializing like count:', error);
        setLikeCount(0);
      }
    };

    initializeVisitorCount();
    initializeLikeCount();
    initializeRatingCounts();
  }, []);

  const handleLike = async () => {
    setLikeCount(prevLikes => {
      const newLikes = (prevLikes === null ? 0 : prevLikes) + 1;

      updateValue(APP_KEY, LIKE_COUNT_KEY, newLikes.toString()).then(success => {
        if (!success) {
          console.error('Failed to update like count on the server.');
          // Optionally, revert state or show error to user
          // setLikeCount(prevLikes);
        }
      });
      return newLikes;
    });
  };

  const initializeRatingCounts = async () => {
    try {
      const newRatingCounts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
      let needsServerUpdateForDefaults = false;

      for (let i = 1; i <= 5; i++) {
        const ratingKey = `${RATING_KEY_PREFIX}${i}`;
        const storedRatingCountStr = await getValue(APP_KEY, ratingKey);

        if (storedRatingCountStr !== null) {
          const parsedCount = parseInt(storedRatingCountStr, 10);
          if (!isNaN(parsedCount)) {
            newRatingCounts[i.toString()] = parsedCount;
          } else {
            console.warn(`Stored rating count for key "${ratingKey}" ("${storedRatingCountStr}") is not a valid number. Initializing to 0.`);
            newRatingCounts[i.toString()] = 0;
            await updateValue(APP_KEY, ratingKey, '0');
          }
        } else {
          newRatingCounts[i.toString()] = 0;
          await updateValue(APP_KEY, ratingKey, '0');
          needsServerUpdateForDefaults = true;
        }
      }
      setRatingCounts(newRatingCounts);
      if (needsServerUpdateForDefaults) {
          console.log("Initialized some rating counts to 0 on the server.");
      }

    } catch (error) {
      console.error('Error initializing rating counts:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (rating < 1 || rating > 5) {
      console.error(`Invalid rating: ${rating}. Must be between 1 and 5.`);
      return;
    }

    const ratingKey = `${RATING_KEY_PREFIX}${rating}`;

    setRatingCounts(prevRatingCounts => {
      const currentSpecificRatingCount = prevRatingCounts[rating.toString()] || 0;
      const newSpecificRatingCount = currentSpecificRatingCount + 1;

      const updatedCounts = {
        ...prevRatingCounts,
        [rating.toString()]: newSpecificRatingCount,
      };

      updateValue(APP_KEY, ratingKey, newSpecificRatingCount.toString()).then(success => {
        if (!success) {
          console.error(`Failed to update rating count for key "${ratingKey}" on the server.`);
        }
      });
      return updatedCounts;
    });
  };

  const handleSettingChange = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleColorChange = useCallback((unitId: TimeUnitId, colorHex: string) => {
    setAppSettings(prev => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [unitId]: colorHex,
      }
    }));
  }, []);

  const handleResetColors = useCallback(() => {
    setAppSettings(prev => ({ ...prev, customColors: {} }));
  }, []);
  
  const handleResetAllSettings = useCallback(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('temporalFluxSettings');
      // Also clear comment bin ID if we want full reset
      // localStorage.removeItem('temporalFluxCommentsBinId_v2'); // We might not want to clear comments on app settings reset
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setAppSettings({ ...defaultAppSettings, theme: prefersDark ? 'dark' : 'light' });
    setActiveTab('visualizations'); // Reset to default tab
  }, []);

  // This function now prepares hex color strings for components
  const getDynamicHexColors = (baseHexColor: string) => {
    const primaryColor = baseHexColor;
    const unitSpecificTextColor = baseHexColor; 
    const emptyPixelHexColor = `${baseHexColor}33`;

    return {
      primary: primaryColor,
      unitSpecificText: unitSpecificTextColor, 
      emptyPixel: emptyPixelHexColor, 
      cardGeneralTextColor: appSettings.theme === 'dark' ? 'text-slate-300' : 'text-slate-700',
      progressBarDetailTextColor: appSettings.theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    };
  };

  const gridLayoutClasses = {
    bars: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    orbits: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    pixels: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
    spiral: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    hourglass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    radialSlice: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  
  // Updated tabs array
  const tabs: { id: ActiveTab, label: string }[] = [
    { id: 'visualizations', label: 'Visualizations' },
    { id: 'settings', label: 'Display Settings' },
    { id: 'colors', label: 'Color Scheme' },
    { id: 'comments', label: 'Comments' }, // New "Comments" tab
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 selection:bg-sky-500 selection:text-white text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <main className="w-full max-w-5xl bg-white/80 dark:bg-slate-800/[.7] backdrop-blur-lg shadow-2xl rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-300 dark:border-slate-700 transition-colors duration-300">
        <header className="mb-6 text-center">
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 pb-2"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Temporal Flux Visualizer
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Observe time's flow through diverse lenses.</p>
        </header>
        
        <CurrentTimeDisplay currentTime={currentTime} />

        <div className="mb-6 border-b border-slate-300 dark:border-slate-700">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 font-medium text-sm rounded-t-md transition-colors
                  ${activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="py-4">
          {activeTab === 'visualizations' && (
            <div className={`grid gap-3 sm:gap-4 ${gridLayoutClasses[appSettings.visualizationMode]}`}>
              {DEFAULT_PROGRESS_CONFIGS.map((config) => {
                const effectiveHexColor = appSettings.customColors[config.id] || config.baseColor;
                const details = config.getDetails(currentTime, appSettings.weekStartDay);
                const unitColors = getDynamicHexColors(effectiveHexColor);
                
                const commonProps = {
                  key: config.id,
                  label: config.label,
                  percentage: details.percentage,
                  details: { elapsed: details.elapsed, remaining: details.remaining, period: details.period },
                  icon: config.icon({ className: 'w-5 h-5', color: unitColors.unitSpecificText }),
                  textColor: unitColors.cardGeneralTextColor, 
                  mainValueColor: unitColors.unitSpecificText, 
                };
                
                const cardTextColorClass = appSettings.theme === 'dark' ? 'text-slate-300' : 'text-slate-700';

                return (
                  <div key={config.id} className={`w-full ${appSettings.visualizationMode !== 'bars' && config.id === 'decade' ? (gridLayoutClasses[appSettings.visualizationMode].includes('lg:grid-cols-3') ? 'lg:col-span-full' : (gridLayoutClasses[appSettings.visualizationMode].includes('xl:grid-cols-4') ? 'xl:col-span-2' : (gridLayoutClasses[appSettings.visualizationMode].includes('md:grid-cols-4') ? 'md:col-span-2' : 'sm:col-span-full'))) : ''}`}>
                    {appSettings.visualizationMode === 'bars' && (
                      <ProgressBar
                        {...commonProps}
                        icon={config.icon({ className: 'w-5 h-5', color: unitColors.progressBarDetailTextColor})} 
                        textColor={unitColors.progressBarDetailTextColor} 
                        barColor={unitColors.primary} 
                        trailColor="bg-slate-200 dark:bg-slate-700" 
                      />
                    )}
                    {appSettings.visualizationMode === 'orbits' && (
                      <TimeOrbit
                        {...commonProps}
                        textColor={cardTextColorClass}
                        planetColor={unitColors.primary} 
                        orbitColor={appSettings.theme === 'dark' ? '#334155' : '#e2e8f0'} 
                      />
                    )}
                    {appSettings.visualizationMode === 'pixels' && (
                      <PixelGrid
                        {...commonProps}
                        textColor={cardTextColorClass}
                        pixelColor={unitColors.primary} 
                        emptyPixelColor={unitColors.emptyPixel}
                        gridRows={config.gridConfig?.rows ?? 8} 
                        gridCols={config.gridConfig?.cols ?? (config.id === 'second' || config.id === 'minute' ? 10 : 8)}
                      />
                    )}
                    {appSettings.visualizationMode === 'spiral' && (
                      <TimeSpiral
                        {...commonProps}
                        textColor={cardTextColorClass}
                        spiralColor={unitColors.primary} 
                        trackColor={appSettings.theme === 'dark' ? '#334155' : '#e2e8f0'} 
                      />
                    )}
                    {appSettings.visualizationMode === 'hourglass' && (
                      <Hourglass
                        {...commonProps}
                        textColor={cardTextColorClass}
                        sandColor={unitColors.primary} 
                        frameColor={appSettings.theme === 'dark' ? '#64748b' : '#94a3b8'} 
                      />
                    )}
                    {appSettings.visualizationMode === 'radialSlice' && (
                      <RadialSlice
                        {...commonProps}
                        textColor={cardTextColorClass}
                        sliceColor={unitColors.primary} 
                        trackColor={appSettings.theme === 'dark' ? '#334155' : '#e2e8f0'}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === 'settings' && (
             <SettingsDisplay 
              settings={appSettings}
              onSettingChange={handleSettingChange}
              onResetAllSettings={handleResetAllSettings}
            />
          )}
          {activeTab === 'colors' && (
            <ColorCustomizer
              progressConfigs={DEFAULT_PROGRESS_CONFIGS}
              customColors={appSettings.customColors}
              onColorChange={handleColorChange}
              onResetColors={handleResetColors}
            />
          )}
           {/* Render CommentSection for the new tab */}
          {activeTab === 'comments' && (
            <CommentSection 
              apiKey={EXTENDSCLASS_API_KEY} 
              appTheme={appSettings.theme} 
            />
          )}
        </div>
        
        <footer className="mt-8 sm:mt-10 text-center">
          <VisitorCountDisplay count={visitorCount} />
          <LikeButton likeCount={likeCount} onLike={handleLike} />
          <RatingSystem ratingCounts={ratingCounts} onRate={handleRating} />
          <p className="text-xs text-slate-500 dark:text-slate-400/80">
            Crafted with React, TypeScript & Tailwind CSS. &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
