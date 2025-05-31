
export type Theme = 'light' | 'dark';
export type WeekStartDay = 0 | 1; // 0 for Sunday, 1 for Monday
export type VisualizationMode = 'bars' | 'orbits' | 'pixels' | 'spiral' | 'hourglass' | 'radialSlice';

export interface TimeDetails {
  percentage: number;
  elapsed: string;
  remaining: string;
  period: string;
  raw?: {
    totalMs: number;
    elapsedMs: number;
    remainingMs: number;
  }
}

export interface ProgressBarProps {
  label: string;
  percentage: number;
  details?: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon?: React.ReactNode;
  barColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  trailColor?: string; // Expects a Tailwind class
  textColor?: string; // For label and percentage text at top; expects a Tailwind class or hex color string
  showPercentageText?: boolean;
}

export interface TimeOrbitProps {
  label: string;
  percentage: number;
  details: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon: React.ReactNode;
  orbitColor?: string; // Expects a hex color string for the planet's orbit path, or a Tailwind class
  planetColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  textColor?: string; // General text color for the card (label, details); expects a Tailwind class or hex color string
  mainValueColor?: string; // Specific color for the percentage text; expects a hex color string
}

export interface PixelGridProps {
  label: string;
  percentage: number;
  details: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon: React.ReactNode;
  pixelColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  emptyPixelColor?: string; // Expects a hex color string (likely with alpha) or Tailwind class
  textColor?: string; // General text color; expects a Tailwind class or hex color string
  mainValueColor?: string; // Specific color for the percentage text; expects a hex color string
  gridRows?: number;
  gridCols?: number;
}

export interface TimeSpiralProps {
  label: string;
  percentage: number;
  details: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon: React.ReactNode;
  spiralColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  trackColor?: string; // Color for the background spiral track
  textColor?: string; // General text color; expects a Tailwind class or hex color string
  mainValueColor?: string; // Specific color for the percentage text; expects a hex color string
}

export interface HourglassProps {
  label: string;
  percentage: number;
  details: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon: React.ReactNode;
  sandColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  frameColor?: string; // Expects a Tailwind class for the frame
  textColor?: string; // General text color; expects a Tailwind class or hex color string
  mainValueColor?: string; // Specific color for the percentage text; expects a hex color string
}

export interface RadialSliceProps {
  label: string;
  percentage: number;
  details: Omit<TimeDetails, 'percentage' | 'raw'>;
  icon: React.ReactNode;
  sliceColor?: string; // Expects a hex color string for custom colors, or a Tailwind class for defaults
  trackColor?: string; // Expects a Tailwind class or hex string for the background track
  textColor?: string; // General text color; expects a Tailwind class or hex color string
  mainValueColor?: string; // Specific color for the percentage text; expects a hex color string
}

export type TimeUnitId = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | 'decade';

export interface ProgressItemConfig {
  id: TimeUnitId;
  label: string;
  getDetails: (date: Date, weekStartDay: WeekStartDay) => TimeDetails;
  icon: (props: {className?: string, color?: string}) => React.ReactNode; // Updated to accept color prop
  baseColor: string; // Now expects a hex color string by default
  gridConfig?: { rows: number; cols: number };
}

export interface CurrentTimeDisplayProps {
  currentTime: Date;
}

export type CustomColors = {
  [key in TimeUnitId]?: string; // Stores hex color strings
};

export interface AppSettings {
  theme: Theme;
  weekStartDay: WeekStartDay;
  visualizationMode: VisualizationMode;
  updateIntervalMs: number;
  customColors: CustomColors;
}

export interface SettingsProps {
  settings: AppSettings;
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onResetAllSettings: () => void;
}

export interface ColorCustomizerProps {
  progressConfigs: ReadonlyArray<ProgressItemConfig>; 
  customColors: CustomColors;
  onColorChange: (unitId: TimeUnitId, colorHex: string) => void; // colorHex is a hex string
  onResetColors: () => void;
  // availableColors prop is removed as we are using input type="color"
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string; // ISO string
}

export interface CommentData { // The structure stored in the bin
  comments: Comment[];
}

export interface CommentSectionProps {
  apiKey: string; // API key for extendsclass.com
  appTheme: Theme; // To help style the comment section consistently
}
