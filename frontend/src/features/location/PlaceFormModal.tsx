import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import TimeInput from '../../components/TimeInput';
import OpenDateSelect from '../../components/OpenDateSelect';
import Button from '../../components/Button';
import Select from '../../components/Select';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useActivities } from '../../hooks/useActivities';
import { locationService } from '../../services';
import type { LocationResponse } from '../../types/responses';

interface PlaceFormData {
  name: string;
  description: string;
  phone: string;
  activity_id: string;
  open_date: string;
  open_time: string;
  close_time: string;
  newImages: File[];
  removedImageIds: string[];
}

interface ExistingImage {
  id: string;
  imageUrl: string;
  position: number;
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
  const addImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<PlaceFormData, 'newImages' | 'removedImageIds'>>({
    name: '',
    description: '',
    phone: '',
    activity_id: '',
    open_date: '',
    open_time: '',
    close_time: '',
  });

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Active existing images (not removed)
  const activeExisting = existingImages.filter(img => !removedImageIds.includes(img.id));
  const totalFilled = activeExisting.length + newImages.length;

  // Fetch existing images when editing
  useEffect(() => {
    if (editingPlace && isOpen) {
      setFormData({
        name: editingPlace.name,
        description: editingPlace.description || '',
        phone: editingPlace.phone || '',
        activity_id: editingPlace.activity_id || '',
        open_date: editingPlace.open_date || '',
        open_time: editingPlace.open_time || '',
        close_time: editingPlace.close_time || '',
      });
      locationService.getImagesByLocationId(editingPlace.id)
        .then(imgs => setExistingImages(imgs.sort((a, b) => a.position - b.position)))
        .catch(() => setExistingImages([]));
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        phone: '',
        activity_id: '',
        open_date: '',
        open_time: '',
        close_time: '',
      });
      setExistingImages([]);
    }
    setRemovedImageIds([]);
    setNewImages([]);
  }, [editingPlace, isOpen]);

  // Generate preview URLs for new files
  useEffect(() => {
    const urls = newImages.map(f => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [newImages]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (file: File) => {
    if (totalFilled < 4) {
      setNewImages(prev => [...prev, file]);
    }
  };

  const handleRemoveExisting = (id: string) => {
    setRemovedImageIds(prev => [...prev, id]);
  };

  const handleRemoveNew = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      setValidationMessage('กรุณากรอกชื่อสถานที่');
      setShowValidation(true);
      return;
    }
    if (!formData.activity_id) {
      setValidationMessage('กรุณาเลือกประเภทกิจกรรม');
      setShowValidation(true);
      return;
    }
    onSave({ ...formData, newImages, removedImageIds });
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', phone: '', activity_id: '', open_date: '', open_time: '', close_time: '' });
    setExistingImages([]);
    setRemovedImageIds([]);
    setNewImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Edit Location' : 'Create Location'}
          </h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Place Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Location Name *
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
                placeholder="Add description about this location"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Images (up to 4) */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Images (up to 4)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((slotIndex) => {
                  // Slot shows: existing → new → "+" → empty placeholder
                  if (slotIndex < activeExisting.length) {
                    const img = activeExisting[slotIndex];
                    return (
                      <div key={img.id} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300">
                        <img src={img.imageUrl} alt="existing" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExisting(img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        >
                          <IoClose className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  }
                  const newIndex = slotIndex - activeExisting.length;
                  if (newIndex < newImages.length) {
                    return (
                      <div key={`new-${newIndex}`} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300">
                        <img src={newPreviews[newIndex]} alt="new" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveNew(newIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        >
                          <IoClose className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  }
                  if (newIndex === newImages.length && totalFilled < 4) {
                    return (
                      <button
                        key={slotIndex}
                        type="button"
                        onClick={() => addImageRef.current?.click()}
                        className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition"
                      >
                        <span className="text-2xl text-gray-400">+</span>
                      </button>
                    );
                  }
                  return (
                    <div key={slotIndex} className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-100 bg-gray-50" />
                  );
                })}
              </div>
              <input
                ref={addImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddImage(file);
                  if (addImageRef.current) addImageRef.current.value = '';
                }}
              />
            </div>

            {/* Activity Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Choice Activity *
              </label>
              <Select
                options={activities.map(a => ({ value: a.id, label: a.name }))}
                value={formData.activity_id}
                onChange={(val) => setFormData(prev => ({ ...prev, activity_id: val }))}
                placeholder="Select an activity..."
              />
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

      <ConfirmDialog
        isOpen={showValidation}
        title="ข้อมูลไม่ครบ"
        message={validationMessage}
        confirmLabel="ตกลง"
        confirmVariant="primary"
        onConfirm={() => setShowValidation(false)}
        onCancel={() => setShowValidation(false)}
      />
    </div>
  );
};

export default PlaceFormModal;
