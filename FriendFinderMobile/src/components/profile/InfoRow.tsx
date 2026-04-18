// ─── InfoRow ──────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors } from '../../constants/theme';

interface InfoRowProps {
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  onPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ iconName, label, value, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center py-3 gap-2.5 border-b border-gray-50"
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View className="w-8 h-8 rounded-full bg-primary-light items-center justify-center">
      <MaterialCommunityIcons name={iconName} size={16} color={colors.primary} />
    </View>
    <Text className="text-base font-medium text-gray-900">{label}</Text>
    <View className="flex-1" />
    <Text className="text-base text-gray-500">{value}</Text>
    {onPress && <Text className="text-xl text-gray-300 ml-0.5">›</Text>}
  </TouchableOpacity>
);

export default InfoRow;
