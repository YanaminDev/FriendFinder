import React, { useState } from 'react';
import Modal from '../../components/Modal';
import LocationForm from './components/LocationForm';
import type { Location } from './components/LocationCard';
import type { LocationFormData } from './components/LocationForm';

interface LocationDetailProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<LocationFormData>({
    placeName: '',
    position: '',
    location: '',
    openingHours: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    console.log('Form data:', formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create And Edit Main Location"
      centered
    >
      <LocationForm
        formData={formData}
        onInputChange={handleInputChange}
        onConfirm={handleConfirm}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default LocationDetail;
