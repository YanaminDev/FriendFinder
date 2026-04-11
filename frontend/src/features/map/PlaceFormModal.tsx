import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import TimeInput from '../../components/TimeInput';
import OpenDateSelect from '../../components/OpenDateSelect';
import Button from '../../components/Button';
import { useActivities } from '../../hooks/useActivities';
import type { LocationResponse } from '../../types/responses';

interface PlaceFormData {
  name: string;
  description: string;
  phone: string;
  activity_id: string;
  open_date: string;
  open_time: string;
  close_time: string;
  image: File | null;
}

interface PlaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlaceFormData) => void;
  editingPlace?: LocationResponse | null;
}

const PlaceFormModal: React.FC<PlaceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlace,
}) => {
  const { activities } = useActivities();
  const isEditing = !!editingPlace;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<PlaceFormData, 'image'>>({
    name: '',
    description: '',
    phone: '',
    activity_id: '',
    open_date: '',
    open_time: '',
    close_time: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlace) {
      setFormData({
        name: editingPlace.name,
        description: editingPlace.description || '',
        phone: editingPlace.phone || '',
        activity_id: editingPlace.activity_id || '',
        open_date: editingPlace.open_date || '',
        open_time: editingPlace.open_time || '',
        close_time: editingPlace.close_time || '',
      });
      setImage(null);
      setPreview(null);
    } else {
      setFormData({
        name: '',
        description: '',
        phone: '',
        activity_id: '',
        open_date: '',
        open_time: '',
        close_time: '',
      });
      setImage(null);
      setPreview(null);
    }
  }, [editingPlace, isOpen]);

  // Generate preview URL
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter place name');
      return;
    }
    if (!formData.activity_id) {
      alert('Please select an activity');
      return;
    }
    onSave({ ...formData, image });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      phone: '',
      activity_id: '',
      open_date: '',
      open_time: '',
      close_time: '',
    });
    setImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Place' : 'Create Place'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Place Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Place Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Blue Sky Game Center"
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
                placeholder="Add description about this place"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Image (1) */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Image
              </label>
              {preview ? (
                <div className="relative w-32 aspect-square rounded-lg overflow-hidden border border-gray-300">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition"
                >
                  <span className="text-2xl text-gray-400">+</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImage(file);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />
            </div>

            {/* Activity Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Choice Activity *
              </label>
              <select
                name="activity_id"
                value={formData.activity_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#FD7979] focus:border-transparent bg-white text-sm"
              >
                <option value="">Select an activity...</option>
                {activities.map(activity => (
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
              <PhoneInput
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Open Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Opening Days
              </label>
              <OpenDateSelect
                value={formData.open_date}
                onChange={(val) => setFormData(prev => ({ ...prev, open_date: val }))}
              />
            </div>

            {/* Opening Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Open Time
                </label>
                <TimeInput
                  name="open_time"
                  value={formData.open_time}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Close Time
                </label>
                <TimeInput
                  name="close_time"
                  value={formData.close_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {isEditing ? 'Confirm' : 'Confirm'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlaceFormModal;
