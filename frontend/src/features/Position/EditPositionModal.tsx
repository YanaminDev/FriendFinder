import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Card from '../../components/Card';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import TimeInput from '../../components/TimeInput';
import OpenDateSelect from '../../components/OpenDateSelect';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { mapService } from '../../services';

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

interface EditPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (positionId: string, data: PositionFormData) => void;
  onDelete?: (positionId: string) => void;
  location?: {
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
  } | null;
}

const MAX_IMAGES = 1;

const EditPositionModal: React.FC<EditPositionModalProps> = ({ isOpen, onClose, onSave, onDelete, location }) => {
  const [formData, setFormData] = useState<Omit<PositionFormData, 'images'>>({
    name: '',
    information: '',
    phone: '',
    open_date: '',
    open_time: '',
    close_time: '',
    latitude: 0,
    longitude: 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  // Parse existing images
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        information: location.information || '',
        phone: location.phone || '',
        open_date: location.open_date || '',
        open_time: location.open_time || '',
        close_time: location.close_time || '',
        latitude: location.latitude,
        longitude: location.longitude,
      });
      // Parse existing image — handle both JSON array and plain URL
      if (location.image) {
        try {
          const parsed = JSON.parse(location.image);
          setExistingImages(Array.isArray(parsed) ? parsed : [location.image]);
        } catch {
          setExistingImages([location.image]);
        }
      } else {
        setExistingImages([]);
      }
      setImages([]);
    }
  }, [location]);

  // Generate preview URLs for new files
  useEffect(() => {
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [images]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalSlots = MAX_IMAGES - existingImages.length;
    setImages(files.slice(0, totalSlots));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleExistingImageRemove = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch Mapbox token
  useEffect(() => {
    if (!isOpen) return;
    mapService.getToken()
      .then(token => {
        if (token) {
          mapboxgl.accessToken = token;
        }
      })
      .catch(err => console.error('Failed to load Mapbox token:', err))
      .finally(() => setTokenLoaded(true));
  }, [isOpen]);

  // Initialize mini map with draggable marker
  useEffect(() => {
    if (!isOpen || !tokenLoaded || !mapContainerRef.current || !location) return;

    // Clean up previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }

    const m = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [formData.longitude, formData.latitude],
      zoom: 15,
    });

    const marker = new mapboxgl.Marker({ draggable: true, color: '#FD7979' })
      .setLngLat([formData.longitude, formData.latitude])
      .addTo(m);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setFormData(prev => ({
        ...prev,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      }));
    });

    mapRef.current = m;
    markerRef.current = marker;

    return () => {
      m.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [isOpen, tokenLoaded, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const [showValidation, setShowValidation] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      setValidationMessage('กรุณากรอกชื่อตำแหน่ง');
      setShowValidation(true);
      return;
    }
    if (location) {
      onSave(location.id, { ...formData, images });
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    if (location && onDelete) {
      setShowDeleteConfirm(true);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold">Edit Position</h2>
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
            {/* Name */}
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

            {/* Images  */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Image
              </label>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                    <img src={url} alt={`existing ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleExistingImageRemove(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      <IoClose className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.map((url, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-blue-300">
                    <img src={url} alt={`new ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      <IoClose className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(existingImages.length + images.length) < MAX_IMAGES && (
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

            {/* Draggable Map */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Location (drag marker to move)
              </label>
              <div
                ref={mapContainerRef}
                className="w-full h-48 rounded-lg overflow-hidden border border-gray-300"
              />
              <div className="mt-2 font-mono text-xs text-gray-500">
                Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </Button>
          <div className="flex gap-3">
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
              Update Position
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="ลบตำแหน่ง"
        message="คุณต้องการลบตำแหน่งนี้ใช่หรือไม่?"
        confirmLabel="ยืนยันลบ"
        confirmVariant="danger"
        onConfirm={() => {
          if (location) {
            onDelete?.(location.id);
            onClose();
          }
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

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

export default EditPositionModal;
