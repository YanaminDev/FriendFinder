import React from 'react';
import { IoClose, IoLocationOutline, IoCallOutline, IoTimeOutline } from 'react-icons/io5';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';

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
  onEditLocation: (position: PositionData) => void;
  onEditPosition: (position: PositionData) => void;
  onDelete: (positionId: string) => void;
}

const PositionDetailPopup: React.FC<PositionDetailPopupProps> = ({
  isOpen,
  onClose,
  position,
  onEditLocation,
  onEditPosition,
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
            className="flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <div className="px-5 py-4 space-y-2 text-sm text-gray-600">
          {position.information && (
            <div className="flex items-start gap-2">
              <IoLocationOutline className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <span>{position.information}</span>
            </div>
          )}
          {position.phone && (
            <div className="flex items-center gap-2">
              <IoCallOutline className="h-4 w-4 text-green-500 shrink-0" />
              <span>{position.phone}</span>
            </div>
          )}
          {(position.open_date || position.open_time || position.close_time) && (
            <div className="flex items-center gap-2">
              <IoTimeOutline className="h-4 w-4 text-red-400 shrink-0" />
              <span>
                {position.open_date && `${position.open_date} `}
                {position.open_time && position.close_time
                  ? `${position.open_time} - ${position.close_time}`
                  : position.open_time || position.close_time || ''}
              </span>
            </div>
          )}
        </div>

        {/* Images */}
        {position.image && (() => {
          let images: string[] = [];
          try {
            images = Array.isArray(position.image)
              ? position.image
              : typeof position.image === 'string' && position.image.startsWith('[')
                ? JSON.parse(position.image)
                : [position.image];
          } catch {
            images = [position.image];
          }
          return images.length > 0 ? (
            <div className="px-5 p-4">
              <ImageCarousel images={images} />
            </div>
          ) : null;
        })()}

        {/* Action Buttons */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          <Button
            variant="primary"
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
            onClick={() => onEditPosition(position)}
          >
            EDIT POSITION
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
