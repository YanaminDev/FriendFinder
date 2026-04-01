// ─── UserMatchCard ────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { UserBase } from '../../types';

interface UserMatchCardProps {
  user: UserBase;
  activity?: string;
}

const UserMatchCard: React.FC<UserMatchCardProps> = ({ user, activity }) => (
  <View className="flex-1 items-center gap-1.5 p-3">
    <Image source={{ uri: user.avatar }} className="w-18 h-18 rounded-xl bg-gray-200" resizeMode="cover" />
    <Text className="text-sm font-semibold text-gray-900 text-center">{user.username}</Text>
    {activity && (
      <View className="px-2.5 py-1 rounded-full border border-gray-200">
        <Text className="text-xs text-gray-500">🎬 {activity}</Text>
      </View>
    )}
  </View>
);

export default UserMatchCard;
