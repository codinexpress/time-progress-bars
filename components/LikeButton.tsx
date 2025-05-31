import React from 'react';

// Basic Heart Icon (SVG)
const HeartIcon = ({ className = "w-5 h-5", filled = false }: { className?: string, filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    className={`${className} ${filled ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

interface LikeButtonProps {
  likeCount: number | null;
  onLike: () => void;
  disabled?: boolean; // To prevent multiple rapid clicks if desired
}

const LikeButton: React.FC<LikeButtonProps> = ({ likeCount, onLike, disabled }) => {
  return (
    <div className="flex items-center justify-center space-x-2 my-2">
      <button
        onClick={onLike}
        disabled={disabled || likeCount === null}
        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors group disabled:opacity-50"
        aria-label="Like this content"
      >
        <HeartIcon filled={likeCount !== null && likeCount > 0} className="w-6 h-6 group-hover:text-red-500 transition-colors" />
      </button>
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {likeCount === null ? 'Loading...' : `${likeCount.toLocaleString()} like${likeCount !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
};

export default LikeButton;
