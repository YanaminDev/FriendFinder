// ─── VenueCard ────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { cn } from '../../utils/cn';
import { Venue } from '../../types';
import Button from '../common/Button';

interface VenueCardProps {
  venue: Venue;
  isSelected?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onReadReview?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  isSelected = false,
  primaryLabel = 'Select This Venue',
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
  onReadReview,
}) => (
  <View className={cn('bg-white rounded-xl p-3.5 gap-3 border', isSelected ? 'border-primary border-2' : 'border-gray-200')}>
    {/* Top row */}
    <View className="flex-row gap-3">
      <View className="flex-1 gap-1">
        <Text className="text-base font-bold text-gray-900">{venue.name}</Text>
        <Text className="text-sm font-medium text-primary">{venue.successfulMatches} successful matches</Text>
        <View className="flex-row gap-2 flex-wrap">
          <TouchableOpacity onPress={onReadReview} className="px-2.5 py-1 rounded-full border border-gray-200">
            <Text className="text-xs text-gray-500 font-medium">Read Review</Text>
          </TouchableOpacity>
          <View className="px-2.5 py-1 rounded-full border border-gray-200">
            <Text className="text-xs text-gray-500 font-medium">🎬 {venue.category}</Text>
          </View>
        </View>
      </View>
      <Image source={{ uri: venue.image }} className="w-20 h-[70px] rounded-lg bg-gray-100" resizeMode="cover" />
    </View>

    {onPrimaryPress && (
      <Button label={primaryLabel} onPress={onPrimaryPress} className="h-11" />
    )}
    {secondaryLabel && onSecondaryPress && (
      <Button variant="outline" color="gray" label={secondaryLabel} onPress={onSecondaryPress} className="h-11" />
    )}
  </View>
);

export default VenueCard;
