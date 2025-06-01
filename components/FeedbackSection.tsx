
import React, { useState } from 'react';
import { FeedbackSectionProps, RatingCounts } from '../types';

// --- SVG Icons --- (Copied from App.tsx, consider moving to a shared icons file if used elsewhere)
interface IconProps {
  className?: string;
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const HeartIcon = ({ className = "w-6 h-6", color, onClick, style }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color || "currentColor"} className={className} onClick={onClick} style={style}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.004-.001z" />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6", color, onClick, style, filled = true }: IconProps & { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? (color || "currentColor") : "none"} stroke={color || "currentColor"} strokeWidth={1.5} className={className} onClick={onClick} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.82.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.82-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);
// --- End SVG Icons ---

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedbackData,
  onLikeToggle,
  onRate,
  isLoading,
  error,
  appTheme,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const { likeCount, hasLiked, ratingCounts, userRating } = feedbackData;

  const calculateAverageRating = (counts: RatingCounts): { average: number; total: number } => {
    let totalRatingSum = 0;
    let totalRatingsCount = 0;
    for (let i = 1; i <= 5; i++) {
      const count = counts[i as keyof RatingCounts] || 0;
      totalRatingSum += i * count;
      totalRatingsCount += count;
    }
    return {
      average: totalRatingsCount > 0 ? totalRatingSum / totalRatingsCount : 0,
      total: totalRatingsCount,
    };
  };

  const { average, total: totalRatings } = calculateAverageRating(ratingCounts);

  const likeButtonClass = `p-2 rounded-full transition-colors duration-200 ease-in-out
    ${hasLiked
      ? 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;
  
  const starColor = appTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-500';
  const starMutedColor = appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="space-y-8 p-2 sm:p-4">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800/30 dark:text-red-400" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* Like Section */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Enjoying the App?
        </h2>
        <button
          onClick={onLikeToggle}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-150 ease-out group focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-pressed={hasLiked}
          aria-label={hasLiked ? "Unlike the app" : "Like the app"}
        >
          <HeartIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${likeButtonClass} group-hover:scale-110`} color={hasLiked ? (appTheme === 'dark' ? '#f43f5e' : '#ef4444') : (appTheme === 'dark' ? '#64748b' : '#94a3b8')} />
          <span className={`text-lg sm:text-xl font-medium ${hasLiked ? (appTheme === 'dark' ? 'text-red-400' : 'text-red-600') : (appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
            {likeCount} Like{likeCount !== 1 ? 's' : ''}
          </span>
        </button>
         {isLoading && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updating...</p>}
      </div>

      {/* Rating Section */}
      <div className="text-center border-t border-slate-300 dark:border-slate-700 pt-8">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Rate Your Experience
        </h2>
        <div 
          className="flex justify-center items-center space-x-1 mb-3"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="Rate the application from 1 to 5 stars"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !isLoading && onRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              disabled={isLoading}
              className={`p-1 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-sky-400 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              role="radio"
              aria-checked={star === userRating}
            >
              <StarIcon
                className="w-7 h-7 sm:w-8 sm:h-8"
                filled={(hoverRating || userRating) >= star}
                color={(hoverRating || userRating) >= star ? (appTheme === 'dark' ? '#facc15' : '#f59e0b') : (appTheme === 'dark' ? '#475569':'#9ca3af')}
              />
            </button>
          ))}
        </div>
        {totalRatings > 0 ? (
          <p className={`text-sm ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Average Rating: <strong className={starColor}>{average.toFixed(1)}</strong> ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
          </p>
        ) : (
          <p className={`text-sm ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Be the first to rate!
          </p>
        )}
         {isLoading && userRating > 0 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updating rating...</p>}
      </div>
    </div>
  );
};

export default FeedbackSection;
