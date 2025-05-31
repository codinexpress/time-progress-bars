import React from 'react';

interface VisitorCountDisplayProps {
  count: number | null;
}

const VisitorCountDisplay: React.FC<VisitorCountDisplayProps> = ({ count }) => {
  if (count === null) {
    return <p className="text-xs text-slate-500 dark:text-slate-400">Loading visitors...</p>;
  }

  return (
    <div className="text-center my-2">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Visitors: <span className="font-semibold text-sky-600 dark:text-sky-400">{count.toLocaleString()}</span>
      </p>
    </div>
  );
};

export default VisitorCountDisplay;
