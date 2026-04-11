import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface PositionData {
  id: string;
  name: string;
  information?: string;
  phone?: string;
  open_date?: string;
  open_time?: string;
  close_time?: string;
  image?: string;
  latitude: number;
  longitude: number;
}

interface PositionDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  position: PositionData | null;
  onEditPlace: (position: PositionData) => void;
  onEditLocation: (position: PositionData) => void;
  onDelete: (positionId: string) => void;
}

const PositionDetailPopup: React.FC<PositionDetailPopupProps> = ({
  isOpen,
  onClose,
  position,
  onEditPlace,
  onEditLocation,
  onDelete,
}) => {
  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40 p-4">
      <Card className="w-full max-w-lg p-0 overflow-hidden animate-slide-up">
        {/* Header with close */}
        <div className="flex justify-between items-start p-5 pb-0">
          <h2 className="text-xl font-bold text-gray-800">{position.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="px-5 py-4 space-y-2 text-sm text-gray-600">
          {position.information && (
            <div className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">📍</span>
              <span>{position.information}</span>
            </div>
          )}
          {position.phone && (
            <div className="flex items-center gap-2">
              <span className="text-green-500">📞</span>
              <span>{position.phone}</span>
            </div>
          )}
          {(position.open_date || position.open_time || position.close_time) && (
            <div className="flex items-center gap-2">
              <span className="text-red-400">🕐</span>
              <span>
                {position.open_date && `${position.open_date} `}
                {position.open_time && position.close_time
                  ? `${position.open_time} - ${position.close_time}`
                  : position.open_time || position.close_time || ''}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onEditPlace(position)}
          >
            EDIT PLACE
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onEditLocation(position)}
          >
            EDIT LOCATION
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="!text-red-500 !border-red-300 hover:!bg-red-50"
            onClick={() => onDelete(position.id)}
          >
            DELETE
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PositionDetailPopup;
