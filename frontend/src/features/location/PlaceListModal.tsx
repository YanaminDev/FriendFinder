import React, { useEffect, useState } from 'react';
import { IoClose, IoCallOutline, IoTimeOutline } from 'react-icons/io5';
import Card from '../../components/UI Components (Reusable)/Card';
import Button from '../../components/UI Components (Reusable)/Button';
import ImageCarousel from '../../components/UI Components (Reusable)/ImageCarousel';
import ConfirmDialog from '../../components/Logic Components/ConfirmDialog';
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'primary';
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', confirmLabel: '', confirmVariant: 'danger', onConfirm: () => {} });

  useEffect(() => {
    if (!isOpen || !positionId) return;
    setLoading(true);
    locationService
      .getByPositionIdWithImages(positionId)
      .then((data) => {
        setLocations(data);
      })
      .catch(err => console.error('Failed to fetch places:', err))
      .finally(() => setLoading(false));
  }, [isOpen, positionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{positionName}</h2>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={onAddPlace}>
              ADD LOCATION
            </Button>
            <button
              onClick={onClose}
              className="flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-4">
          Locations in <span className="font-semibold">{positionName}</span>
        </p>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          )}

          {!loading && locations.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No locations yet. Click "ADD LOCATION" to create one.
            </div>
          )}

          {!loading &&
            locations.map(loc => (
              <div
                key={loc.id}
                className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl hover:shadow-md transition"
              >
                {/* Images Carousel - Left */}
                <div className="w-full md:w-48 shrink-0">
                  {loc.location_image && loc.location_image.length > 0 ? (
                    <ImageCarousel
                      images={[...loc.location_image].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(img => img.imageUrl)}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Info - Right */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
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
                          <IoCallOutline className="h-4 w-4 text-green-500 shrink-0" />
                          {loc.phone}
                        </div>
                      )}
                      {(loc.open_date || loc.open_time || loc.close_time) && (
                        <div className="flex items-center gap-2">
                          <IoTimeOutline className="h-4 w-4 text-red-400 shrink-0" />
                          {loc.open_date && `${loc.open_date} `}
                          {loc.open_time && loc.close_time
                            ? `${loc.open_time} - ${loc.close_time}`
                            : loc.open_time || loc.close_time || ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: 'แก้ไขสถานที่',
                          message: `คุณต้องการแก้ไข "${loc.name}" ใช่หรือไม่?`,
                          confirmLabel: 'แก้ไข',
                          confirmVariant: 'primary',
                          onConfirm: () => {
                            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                            onEditPlace(loc);
                          },
                        })
                      }
                    >
                      EDIT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: 'ลบสถานที่',
                          message: `คุณต้องการลบ "${loc.name}" ใช่หรือไม่? การลบจะไม่สามารถกู้คืนได้`,
                          confirmLabel: 'ยืนยันลบ',
                          confirmVariant: 'danger',
                          onConfirm: () => {
                            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                            onDeletePlace(loc.id);
                          },
                        })
                      }
                    >
                      DELETE
                    </Button>
                  </div>
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default PlaceListModal;