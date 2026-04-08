// ─── NotificationButton ────────────────────────────────────────────────────────

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface NotificationButtonProps {
  onPress: () => void;
  badge?: number;
  size?: 'sm' | 'md';
}

const SIZE_CONFIG = {
  sm: { width: 36, height: 36, iconSize: 18 },
  md: { width: 44, height: 44, iconSize: 24 },
} as const;

const NotificationButton: React.FC<NotificationButtonProps> = ({
  onPress,
  badge,
  size = 'md',
}) => {
  const cfg = SIZE_CONFIG[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        width: cfg.width,
        height: cfg.height,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: cfg.width,
          height: cfg.height,
          borderRadius: cfg.width / 2,
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Ionicons name="notifications" size={cfg.iconSize} color={colors.primary} />
      </View>

      {badge !== undefined && badge > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.danger,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text className="text-white text-2xs font-bold">
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationButton;
