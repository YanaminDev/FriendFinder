// ─── OnlineUserAvatar ─────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface OnlineUserAvatarProps {
  avatar: string;
  username: string;
  isOnline?: boolean;
  onPress?: () => void;
}

const OnlineUserAvatar: React.FC<OnlineUserAvatarProps> = ({ avatar, username, isOnline = false, onPress }) => (
  <TouchableOpacity className="items-center gap-1 w-16" onPress={onPress} activeOpacity={0.8}>
    <View className="relative w-14 h-14">
      <Image source={{ uri: avatar }} className="w-14 h-14 rounded-full bg-gray-200" />
      {isOnline && (
        <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-online border-2 border-white" />
      )}
    </View>
    <Text className="text-xs text-gray-500 text-center" numberOfLines={1}>{username}</Text>
  </TouchableOpacity>
);

export default OnlineUserAvatar;
