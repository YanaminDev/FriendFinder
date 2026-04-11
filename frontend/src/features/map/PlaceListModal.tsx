import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { locationService } from '../../services';
import type { LocationResponse } from '../../types/responses';

interface PlaceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  positionId: string | null;
  positionName: string;
  onAddPlace: () => void;
  onEditPlace: (location: LocationResponse) => void;
  onDeletePlace: (locationId: string) => void;
}

const PlaceListModal: React.FC<PlaceListModalProps> = ({
  isOpen,
  onClose,
  positionId,
  positionName,
  onAddPlace,
  onEditPlace,
  onDeletePlace,
}) => {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !positionId) return;
    setLoading(true);
    locationService
      .getByPositionId(positionId)
      .then(data => setLocations(data))
      .catch(err => console.error('Failed to fetch places:', err))
      .finally(() => setLoading(false));
  }, [isOpen, positionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Place List</h2>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={onAddPlace}>
              ADD PLACE
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-4">
          Places in <span className="font-semibold">{positionName}</span>
        </p>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          )}

          {!loading && locations.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No places yet. Click "ADD PLACE" to create one.
            </div>
          )}

          {!loading &&
            locations.map(loc => (
              <div
                key={loc.id}
                className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl hover:shadow-md transition"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 truncate">
                    {loc.name}
                  </h3>
                  {loc.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                      {loc.description}
                    </p>
                  )}

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {loc.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">📞</span>
                        {loc.phone}
                      </div>
                    )}
                    {(loc.open_date || loc.open_time || loc.close_time) && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">🕐</span>
                        {loc.open_date && `${loc.open_date} `}
                        {loc.open_time && loc.close_time
                          ? `${loc.open_time} - ${loc.close_time}`
                          : loc.open_time || loc.close_time || ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEditPlace(loc)}
                  >
                    EDIT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePlace(loc.id)}
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlaceListModal;
