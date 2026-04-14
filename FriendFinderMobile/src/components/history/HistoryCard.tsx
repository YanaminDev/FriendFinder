// ─── HistoryCard ──────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HistoryItem, VenueReview } from '../../types';
import { colors } from '../../constants/theme';

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ReviewBox: React.FC<{ label: string; review: VenueReview }> = ({ label, review }) => {
  const hasValidImage = review.avatar && !review.avatar.includes('i.pravatar.cc');
  const initials = getInitials(review.username);

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-gray-500">{label}</Text>
      <View className="border border-gray-200 rounded-xl p-3 gap-2">
        <View className="flex-row items-center gap-2">
          {hasValidImage ? (
            <Image source={{ uri: review.avatar }} className="w-8 h-8 rounded-full bg-gray-200" />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-xs font-bold text-white">{initials}</Text>
            </View>
          )}
          <Text className="flex-1 text-sm font-semibold text-gray-900">{review.username}</Text>
          <Ionicons name={review.liked ? 'thumbs-up' : 'thumbs-down'} size={18} color={review.liked ? colors.primary : colors.gray300} />
        </View>
        {review.reviewedUsername ? (
          <Text className="text-xs text-gray-400">ถึง: {review.reviewedUsername}</Text>
        ) : null}
        {review.comment ? (
          <Text className="text-sm text-gray-500 leading-[18px]">{review.comment}</Text>
        ) : null}
      </View>
    </View>
  );
};

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <View className="bg-white rounded-xl border border-gray-200 p-3.5 gap-3">
    {/* Venue row */}
    <View className="flex-row justify-between items-start gap-3">
      <View className="flex-1 gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-bold text-gray-900">{item.venue.name}</Text>
          {item.isCancelled && (
            <View className="px-2 py-0.5 bg-red-100 rounded-full">
              <Text className="text-xs font-semibold text-red-600">Cancelled</Text>
            </View>
          )}
        </View>
        <View className="self-start px-2.5 py-1 rounded-full border border-gray-200 flex-row items-center gap-1.5">
          <Ionicons name="film" size={12} color={colors.gray500} />
          <Text className="text-xs text-gray-500">{item.venue.category}</Text>
        </View>
      </View>
      {item.isCancelled && item.venue.name === 'Unknown Location' ? (
        <View className="w-24 h-20 rounded-lg bg-red-100 items-center justify-center">
          <Ionicons name="close-circle-outline" size={32} color="#DC2626" />
        </View>
      ) : !item.venue.image ? (
        <View className="w-24 h-20 rounded-lg bg-gray-200 items-center justify-center">
          <Ionicons name="image-outline" size={32} color={colors.gray300} />
        </View>
      ) : (
        <Image source={{ uri: item.venue.image }} className="w-24 h-20 rounded-lg bg-gray-200" resizeMode="cover" />
      )}
    </View>

    {!item.isCancelled && (
      <>
        <View className="h-px bg-gray-100" />
        {item.locationReview && <ReviewBox label="Your Review ( Location )" review={item.locationReview} />}
        {item.personReview && <ReviewBox label="Your Review ( People )" review={item.personReview} />}
      </>
    )}
  </View>
);

export default HistoryCard;
