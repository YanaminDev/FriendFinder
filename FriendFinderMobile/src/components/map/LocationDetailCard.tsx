// ─── LocationDetailCard ────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface LocationDetailCardProps {
  id: string;
  title: string;
  description?: string;
  phone?: string;
  openTime?: string;
  imageUrl?: string;
  markerPosition?: { x: number; y: number };
  onClose: () => void;
  onPress?: () => void;
}

const LocationDetailCard: React.FC<LocationDetailCardProps> = ({
  id,
  title,
  description,
  phone,
  openTime,
  imageUrl,
  markerPosition,
  onClose,
  onPress,
}) => {
  const [translateY] = useState(new Animated.Value(0));
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <View
      className="absolute inset-0 bg-black/40"
      style={{ zIndex: 99 }}
      pointerEvents="box-none"
    >
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{
          zIndex: 100,
          maxHeight: '75%',
          paddingTop: 16,
          transform: [{ translateY }],
        }}
        pointerEvents="auto"
        {...panResponder.panHandlers}
      >
      {/* Drag Handle */}
      <View className="items-center py-2">
        <View className="w-10 h-1 bg-gray-300 rounded-full" />
      </View>

      {/* Header with Close Button */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <Text className="flex-1 text-base font-bold text-gray-900" numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={onClose} className="p-1 ml-2">
          <Ionicons name="close" size={20} color={colors.gray500} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: 120 }}
            className="bg-gray-200"
          />
        ) : (
          <View className="w-full h-24 bg-gray-100 items-center justify-center">
            <Ionicons name="image" size={32} color={colors.gray300} />
          </View>
        )}

        {/* Content */}
        <View className="px-3 py-2">
          {/* Description */}
          {description && (
            <View className="mb-2">
              <Text className="text-xs text-gray-600 leading-4" numberOfLines={2}>{description}</Text>
            </View>
          )}

          {/* Phone */}
          {phone && (
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="call" size={14} color={colors.primary} />
              <Text className="text-xs text-gray-700 font-medium">{phone}</Text>
            </View>
          )}

          {/* Hours */}
          {openTime && (
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="time" size={14} color={colors.primary} />
              <Text className="text-xs text-gray-700 font-medium" numberOfLines={1}>{openTime}</Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-2 items-center mt-2"
            onPress={onPress}
          >
            <Text className="text-white font-bold text-xs">View Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>
    </View>
  );
};

export default LocationDetailCard;
