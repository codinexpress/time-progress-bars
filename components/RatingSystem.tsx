import React, { useState } from 'react';

// Basic Star Icon (SVG)
const StarIcon = ({ className = "w-5 h-5", filled = false, onClick, onMouseEnter, onMouseLeave }: {
    className?: string,
    filled?: boolean,
    onClick?: () => void,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={`${className} ${filled ? 'text-yellow-400' : 'text-slate-400 dark:text-slate-500'} cursor-pointer transition-colors`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.82.61l-4.725-2.885a.563.563 0 00-.652 0l-4.725 2.885a.562.562 0 01-.82-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface RatingSystemProps {
  ratingCounts: Record<string, number>; // e.g., { '1': 10, '2': 5, ... }
  onRate: (rating: number) => void;
  disabled?: boolean; // To prevent multiple rapid clicks
}

const RatingSystem: React.FC<RatingSystemProps> = ({ ratingCounts, onRate, disabled }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);
  const weightedSum = Object.entries(ratingCounts).reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0);
  const averageRating = totalRatings > 0 ? (weightedSum / totalRatings) : 0;

  const handleRate = (rating: number) => {
    if (!disabled) {
      onRate(rating);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 my-3">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={hoverRating >= star || (!hoverRating && averageRating >= star)}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="w-7 h-7"
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {totalRatings > 0
          ? `Avg: ${averageRating.toFixed(1)} (${totalRatings.toLocaleString()} rating${totalRatings !== 1 ? 's' : ''})`
          : 'No ratings yet.'}
      </p>
      {/* Optional: Display distribution
      <div className="text-xs text-slate-400 dark:text-slate-500">
        {([5,4,3,2,1] as const).map(r => (
          <div key={r}>{r} star: {ratingCounts[r.toString()] || 0}</div>
        ))}
      </div>
      */}
    </div>
  );
};

export default RatingSystem;
