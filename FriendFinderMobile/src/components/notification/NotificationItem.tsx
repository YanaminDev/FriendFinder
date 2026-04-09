// ─── NotificationItem ─────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Notification } from '../../types';
import Button from '../common/Button';

interface NotificationItemProps {
  notification: Notification;
  onPass?: () => void;
  onHangOut?: () => void;
  onViewDetails?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification, onPass, onHangOut, onViewDetails,
}) => (
  <View className="bg-white px-4 py-3.5 border-b border-gray-50 gap-3">
    {/* Top row */}
    <View className="flex-row gap-3 items-start">
      <View className="relative w-14 h-14">
        <Image source={{ uri: notification.avatar }} className="w-14 h-14 rounded-full bg-gray-200" />
        {!notification.isRead && (
          <View className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white" />
        )}
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-semibold text-gray-900 tracking-widest">••••••</Text>
          <Text className="text-sm text-primary font-medium">{notification.time}</Text>
        </View>
        <Text className="text-sm text-gray-500 leading-[18px]">{notification.message}</Text>
      </View>
    </View>

    {/* Actions */}
    {notification.hasActions ? (
      <View className="flex-row gap-2.5">
        <Button variant="outline" color="gray" label="Pass" onPress={onPass ?? (() => {})} className="flex-1 h-10" />
        <Button label="Let's Hang Out" onPress={onHangOut ?? (() => {})} className="flex-[1.4] h-10" />
      </View>
    ) : (
      <Button variant="outline" color="gray" label="View Details" onPress={onViewDetails ?? (() => {})} className="h-10" />
    )}
  </View>
);

export default NotificationItem;
