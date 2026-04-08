// ─── HistoryCard ──────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HistoryItem, VenueReview } from '../../types';
import { colors } from '../../constants/theme';

const ReviewBox: React.FC<{ label: string; review: VenueReview }> = ({ label, review }) => (
  <View className="gap-1.5">
    <Text className="text-sm font-medium text-gray-500">{label}</Text>
    <View className="border border-gray-200 rounded-xl p-3 gap-2">
      <View className="flex-row items-center gap-2">
        <Image source={{ uri: review.avatar }} className="w-8 h-8 rounded-full bg-gray-200" />
        <Text className="flex-1 text-sm font-semibold text-gray-900">{review.username}</Text>
        <Ionicons name="thumbs-up" size={18} color={colors.primary} />
      </View>
      <Text className="text-sm text-gray-500 leading-[18px]">{review.comment}</Text>
    </View>
  </View>
);

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <View className="bg-white rounded-xl border border-gray-200 p-3.5 gap-3">
    {/* Venue row */}
    <View className="flex-row justify-between items-start gap-3">
      <View className="flex-1 gap-2">
        <Text className="text-base font-bold text-gray-900">{item.venue.name}</Text>
        <View className="self-start px-2.5 py-1 rounded-full border border-gray-200 flex-row items-center gap-1.5">
          <Ionicons name="film" size={12} color={colors.gray500} />
          <Text className="text-xs text-gray-500">{item.venue.category}</Text>
        </View>
      </View>
      <Image source={{ uri: item.venue.image }} className="w-[90px] h-[70px] rounded-lg bg-gray-200" resizeMode="cover" />
    </View>

    <View className="h-px bg-gray-100" />

    <ReviewBox label="Your Review ( Location )" review={item.locationReview} />
    <ReviewBox label="Your Review ( People )"   review={item.personReview} />
  </View>
);

export default HistoryCard;
