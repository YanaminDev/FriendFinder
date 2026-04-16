import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import TimeInput from '../../components/TimeInput';
import OpenDateSelect from '../../components/OpenDateSelect';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

interface PositionFormData {
  name: string;
  information: string;
  phone: string;
  open_date: string;
  open_time: string;
  close_time: string;
  latitude: number;
  longitude: number;
  images: File[];
}

interface AddPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PositionFormData) => void;
  initialCoords?: { latitude: number; longitude: number } | null;
}

const MAX_IMAGES = 1;

const AddPositionModal: React.FC<AddPositionModalProps> = ({ isOpen, onClose, onSave, initialCoords }) => {
  const [formData, setFormData] = useState<Omit<PositionFormData, 'images'>>({
    name: '',
    information: '',
    phone: '',
    open_date: '',
    open_time: '',
    close_time: '',
    latitude: initialCoords?.latitude || 0,
    longitude: initialCoords?.longitude || 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCoords) {
      setFormData(prev => ({
        ...prev,
        latitude: initialCoords.latitude,
        longitude: initialCoords.longitude,
      }));
    }
  }, [initialCoords]);

  // Generate preview URLs
  useEffect(() => {
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [images]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 1));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const [showValidation, setShowValidation] = useState(false);

  const handleSave = () => {
    if (!formData.name.trim()) {
      setShowValidation(true);
      return;
    }
    onSave({ ...formData, images });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      information: '',
      phone: '',
      open_date: '',
      open_time: '',
      close_time: '',
      latitude: initialCoords?.latitude || 0,
      longitude: initialCoords?.longitude || 0,
    });
    setImages([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold">Add Position</h2>
          <button
            onClick={handleClose}
            className="flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
          {/* Position Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Name *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., The Mall, Central Park"
            />
          </div>

          {/* Information */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Information
            </label>
            <textarea
              name="information"
              value={formData.information}
              onChange={handleInputChange}
              placeholder="Add information about this position"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Image
            </label>
            <div className="grid grid-cols-4 gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                  <img src={url} alt={`preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    <IoClose className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition"
                >
                  <span className="text-2xl text-gray-400">+</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageAdd}
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
              Open Date
            </label>
            <OpenDateSelect
              value={formData.open_date}
              onChange={(val) => setFormData(prev => ({ ...prev, open_date: val }))}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Open Time
              </label>
              <TimeInput
                name="open_time"
                value={formData.open_time}
                onChange={handleInputChange}
                placeholder="09:00"
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
                placeholder="21:00"
              />
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Selected Coordinates</p>
            <div className="font-mono text-sm">
              <div>Latitude: <span className="font-bold">{formData.latitude.toFixed(6)}</span></div>
              <div>Longitude: <span className="font-bold">{formData.longitude.toFixed(6)}</span></div>
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
            Save Position
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showValidation}
        title="ข้อมูลไม่ครบ"
        message="กรุณากรอกชื่อตำแหน่ง"
        confirmLabel="ตกลง"
        confirmVariant="primary"
        onConfirm={() => setShowValidation(false)}
        onCancel={() => setShowValidation(false)}
      />
    </div>
  );
};

export default AddPositionModal;
