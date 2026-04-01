import React from 'react';

export interface Location {
  id?: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  tags?: string[];
  image?: string;
}

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Address */}
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="text-gray-900">{location?.address || '-'}</p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.151.377.456.839.956 1.338.5.5.96.805 1.338.956l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 4 14.18 4 9.5V5a1 1 0 011-1h2.153z" />
        </svg>
        <div>
          <p className="text-sm text-gray-600">Phone</p>
          <p className="text-gray-900 font-mono">{location?.phone || '-'}</p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm text-gray-600">Hours</p>
          <p className="text-gray-900">{location?.hours || '-'}</p>
        </div>
      </div>

      {/* Tags */}
      {location?.tags && location.tags.length > 0 && (
        <div className="flex items-start gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {location.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
