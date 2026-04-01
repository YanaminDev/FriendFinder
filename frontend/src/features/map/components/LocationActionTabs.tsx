import React from 'react';

interface LocationActionTabsProps {
  onFavorite?: () => void;
  onAddReview?: () => void;
  onAddData?: () => void;
  onLogOut?: () => void;
}

const LocationActionTabs: React.FC<LocationActionTabsProps> = ({
  onFavorite,
  onAddReview,
  onAddData,
  onLogOut,
}) => {
  return (
    <div className="flex justify-around mt-8 pt-6 border-t border-gray-200">
      {/* Favorite */}
      <button
        onClick={onFavorite}
        className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-500 pb-4 transition"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-xs">Favorite</span>
      </button>

      {/* Add Review */}
      <button
        onClick={onAddReview}
        className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-500 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m0 0h6"
          />
        </svg>
        <span className="text-xs">Add Review</span>
      </button>

      {/* Add Data */}
      <button
        onClick={onAddData}
        className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-500 transition"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
        </svg>
        <span className="text-xs">Add Data</span>
      </button>

      {/* Log Out */}
      <button
        onClick={onLogOut}
        className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-500 transition"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 10-2 0v12H3z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs">Log Out</span>
      </button>
    </div>
  );
};

export default LocationActionTabs;
