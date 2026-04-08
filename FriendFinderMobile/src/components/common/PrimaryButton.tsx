// ─── CheckInButton ─────────────────────────────────────────────────────────────

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface CheckInButtonProps {
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

const SIZE_CONFIG = {
  sm: { width: 140, padding: 'px-4 py-2', fontSize: 'text-sm', iconSize: 16 },
  md: { width: 170, padding: 'px-6 py-3', fontSize: 'text-base', iconSize: 20 },
  lg: { width: 200, padding: 'px-8 py-4', fontSize: 'text-lg', iconSize: 24 },
} as const;

const CheckInButton: React.FC<CheckInButtonProps> = ({
  onPress,
  size = 'md',
  text = 'CHECK IN NOW',
  backgroundColor = colors.white,
  textColor = colors.primary,
  iconColor = colors.primary,
}) => {
  const cfg = SIZE_CONFIG[size];

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center gap-2 rounded-full active:opacity-70 ${cfg.padding}`}
      style={{
        width: cfg.width,
        backgroundColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={onPress}
    >
      <Ionicons name="location" size={cfg.iconSize} color={iconColor} />
      <Text style={{ color: textColor }} className={`font-bold ${cfg.fontSize}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckInButton;
