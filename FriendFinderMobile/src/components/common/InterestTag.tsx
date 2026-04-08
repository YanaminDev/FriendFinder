// ─── InterestTag ──────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface InterestTagProps {
  label: string;
  icon?: string;
  variant?: 'light' | 'dark' | 'outline';
  className?: string;
}

const InterestTag: React.FC<InterestTagProps> = ({
  label,
  icon,
  variant = 'dark',
  className,
}) => (
  <View
    className={cn(
      'flex-row items-center px-2.5 py-1 rounded-full gap-1 self-start',
      variant === 'dark'    && 'bg-black/35',
      variant === 'light'   && 'bg-primary-light',
      variant === 'outline' && 'bg-white border border-gray-200',
      className,
    )}
  >
    {icon && <Text className="text-xs">{icon}</Text>}
    <Text
      className={cn(
        'text-xs font-semibold tracking-wide',
        variant === 'dark'    && 'text-white',
        variant === 'light'   && 'text-primary',
        variant === 'outline' && 'text-gray-600',
      )}
    >
      {label}
    </Text>
  </View>
);

export default InterestTag;
