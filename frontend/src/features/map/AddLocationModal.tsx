import React, { useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface LocationFormData {
  name: string;
  description: string;
  phone: string;
  activityId: string;
  openDate: string;
  openTime: string;
  closeTime: string;
  lat: number;
  lng: number;
}

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: LocationFormData) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

// Sample activities - in real app would fetch from API
const ACTIVITY_OPTIONS = [
  { id: '1', name: 'Cafe' },
  { id: '2', name: 'Restaurant' },
  { id: '3', name: 'Cinema' },
  { id: '4', name: 'Shopping Mall' },
  { id: '5', name: 'Park' },
  { id: '6', name: 'Karaoke' },
  { id: '7', name: 'Gym' },
];

const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onSave, initialCoords }) => {
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    description: '',
    phone: '',
    activityId: '',
    openDate: '',
    openTime: '',
    closeTime: '',
    lat: initialCoords?.lat || 0,
    lng: initialCoords?.lng || 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter location name');
      return;
    }
    if (!formData.activityId) {
      alert('Please select an activity');
      return;
    }
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      phone: '',
      activityId: '',
      openDate: '',
      openTime: '',
      closeTime: '',
      lat: initialCoords?.lat || 0,
      lng: initialCoords?.lng || 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold">Add Location Details</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
          {/* Location Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Location Name *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., The Mall, Central Park"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add description about this location"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Activity Type *
            </label>
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Select an activity...</option>
              {ACTIVITY_OPTIONS.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0xxxxxxxxx"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Open Date
              </label>
              <Input
                type="text"
                name="openDate"
                value={formData.openDate}
                onChange={handleInputChange}
                placeholder="e.g., Mon-Fri"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Open Time
              </label>
              <Input
                type="text"
                name="openTime"
                value={formData.openTime}
                onChange={handleInputChange}
                placeholder="09:00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Close Time
              </label>
              <Input
                type="text"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleInputChange}
                placeholder="21:00"
              />
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Selected Location Coordinates</p>
            <div className="font-mono text-sm">
              <div>Latitude: <span className="font-bold">{formData.lat.toFixed(6)}</span></div>
              <div>Longitude: <span className="font-bold">{formData.lng.toFixed(6)}</span></div>
            </div>
          </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
          >
            Save Location
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddLocationModal;
