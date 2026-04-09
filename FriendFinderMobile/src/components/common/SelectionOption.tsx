// ─── SelectionOption ──────────────────────────────────────────────────────────
// Single/multi-select pill used across all onboarding steps.

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../utils/cn';
import { colors } from '../../constants/theme';

interface SelectionOptionProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  className?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

const SelectionOption: React.FC<SelectionOptionProps> = ({
  label,
  selected = false,
  onPress,
  className,
  icon,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={cn(
      'w-full h-14 rounded-full border flex-row items-center justify-center gap-3 px-4',
      selected
        ? 'bg-primary border-primary'
        : 'bg-white border-gray-300',
      className,
    )}
  >
    {icon && (
      <Ionicons
        name={icon}
        size={22}
        color={selected ? 'white' : colors.primary}
      />
    )}
    <Text className={cn('text-base font-medium', selected ? 'text-white font-semibold' : 'text-gray-800')}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default SelectionOption;
