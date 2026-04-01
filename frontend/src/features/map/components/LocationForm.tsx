import React from 'react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

export interface LocationFormData {
  placeName: string;
  position: string;
  location: string;
  openingHours: string;
  phone: string;
}

interface LocationFormProps {
  formData: LocationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  onInputChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="space-y-6">
      {/* Place Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Place name
        </label>
        <Input
          type="text"
          name="placeName"
          placeholder="Central WestGate"
          value={formData.placeName}
          onChange={onInputChange}
        />
      </div>

      {/* XY Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          X - y axis position
        </label>
        <Input
          type="text"
          name="position"
          placeholder="23 x , 104 y , 50 z"
          value={formData.position}
          onChange={onInputChange}
        />
      </div>

      {/* Location Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <Input
          type="text"
          name="location"
          placeholder="โครง ซอย 4 ซอย โครง ต้นมะขามเจริงแขวงจตุจักร ประเทศไทย 11000"
          value={formData.location}
          onChange={onInputChange}
        />
      </div>

      {/* Opening Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opening hours
          </label>
          <Input
            type="text"
            name="openingHours"
            placeholder="08 : 30 AM - 10:30 PM"
            value={formData.openingHours}
            onChange={onInputChange}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            placeholder="0873568243"
            value={formData.phone}
            onChange={onInputChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
        >
          Confirm
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          size="md"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
