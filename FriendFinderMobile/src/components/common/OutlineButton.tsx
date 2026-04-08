// ─── OutlineButton (wrapper around Button) ────────────────────────────────────

import React from 'react';
import Button from './Button';

interface OutlineButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  label,
  onPress,
  disabled = false,
  className,
}) => (
  <Button
    label={label}
    onPress={onPress}
    variant="outline"
    color="gray"
    size="md"
    disabled={disabled}
    className={className}
  />
);

export default OutlineButton;
