// ─── AppHeader ────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppLogo from './AppLogo';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightElement,
}) => (
  <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
    {/* Left */}
    <View className="w-10 items-start">
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>
      ) : (
        <AppLogo size="sm" showText={false} />
      )}
    </View>

    {/* Center */}
    <View className="flex-1 items-center">
      {showBack ? (
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      ) : (
        <Text className="text-lg font-bold">
          <Text className="text-primary">FriendFinder </Text>
          <Text className="text-gray-900">{title}</Text>
        </Text>
      )}
    </View>

    {/* Right */}
    <View className="w-10 items-end">{rightElement ?? null}</View>
  </View>
);

export default AppHeader;
