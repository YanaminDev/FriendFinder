// ─── PrimaryButton (wrapper around Button) ────────────────────────────────────

import React from 'react';
import Button from './Button';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'light';
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading  = false,
  variant  = 'filled',
  className,
}) => (
  <Button
    label={label}
    onPress={onPress}
    variant={variant}
    color="primary"
    size="md"
    disabled={disabled}
    loading={loading}
    className={className}
  />
);

export default PrimaryButton;
