// ─── SelectionOption ──────────────────────────────────────────────────────────
// Single/multi-select pill used across all onboarding steps.

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface SelectionOptionProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  className?: string;
}

const SelectionOption: React.FC<SelectionOptionProps> = ({
  label,
  selected = false,
  onPress,
  className,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={cn(
      'w-full h-14 rounded-full border items-center justify-center',
      selected
        ? 'bg-primary border-primary'
        : 'bg-white border-gray-300',
      className,
    )}
  >
    <Text className={cn('text-base font-medium', selected ? 'text-white font-semibold' : 'text-gray-800')}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default SelectionOption;
