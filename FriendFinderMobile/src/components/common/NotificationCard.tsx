// ─── NotificationCard ──────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  icon: string;
  type: 'message' | 'match' | 'like' | 'system';
}

interface NotificationCardProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationPress?: (notification: Notification) => void;
}

const ICON_COLOR = {
  message: colors.primary,
  match: colors.success,
  like: colors.danger,
  system: colors.warning,
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notifications,
  onClose,
  onNotificationPress,
}) => {
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      className="flex-row gap-3 px-4 py-3 border-b border-gray-100 active:bg-gray-50"
      onPress={() => onNotificationPress?.(item)}
    >
      {/* Icon */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: ICON_COLOR[item.type],
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name={item.icon as any} size={20} color={colors.white} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.message}</Text>
        <Text className="text-xs text-gray-400 mt-1">{item.timestamp}</Text>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color={colors.gray300} />
    </TouchableOpacity>
  );

  return (
    <View className="absolute top-20 right-4 left-4 md:left-auto md:w-80 bg-white rounded-lg shadow-lg max-h-96 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900">Notifications</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.gray500} />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="items-center justify-center py-8">
          <Ionicons name="notifications-off" size={48} color={colors.gray300} />
          <Text className="text-gray-400 mt-2">No notifications</Text>
        </View>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <TouchableOpacity className="px-4 py-3 border-t border-gray-100 items-center">
          <Text className="text-primary font-semibold">View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NotificationCard;
