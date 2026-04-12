// ─── VenueDetailScreen ─────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';
import { MOCK_VENUES } from '../../constants/mockData';

const VenueDetailScreen: React.FC<{ navigation: any; route: { params: { venueId: string } } }> = ({ navigation, route }) => {
  const { venueId } = route.params;
  const venue = MOCK_VENUES.find(v => v.id === venueId) ?? MOCK_VENUES[0];
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title={venue.name} showBack onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, alignItems: 'center' }}>

        <View style={{ width: '100%', maxWidth: maxContentWidth }}>
        <Image source={{ uri: venue.image }} className="w-full h-52 bg-gray-200" resizeMode="cover" />

        <View style={{ paddingHorizontal: horizontalPadding, paddingVertical: 16, rowGap: 12 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">{venue.name}</Text>
            <View className="px-2.5 py-1 rounded-full bg-primary-light">
              <Text className="text-xs text-primary font-semibold">{venue.category}</Text>
            </View>
          </View>

          <Text className="text-sm text-primary font-medium">🏆 {venue.successfulMatches} successful matches</Text>
          <Text className="text-sm text-gray-600 leading-5">{venue.description}</Text>

          <View className="gap-1.5 mt-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-base">📍</Text>
              <Text className="text-sm text-gray-600 flex-1">{venue.address}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-base">📞</Text>
              <Text className="text-sm text-gray-600">{venue.phone}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-base">🕐</Text>
              <Text className="text-sm text-gray-600">{venue.openHours}</Text>
            </View>
          </View>

          {/* Reviews */}
          {venue.reviews.length > 0 && (
            <View className="mt-2 gap-3">
              <Text className="text-base font-bold text-gray-900">รีวิว</Text>
              {venue.reviews.map(r => (
                <View key={r.id} className="border border-gray-200 rounded-xl p-3 gap-2">
                  <View className="flex-row items-center gap-2">
                    <Image source={{ uri: r.avatar }} className="w-8 h-8 rounded-full bg-gray-200" />
                    <Text className="text-sm font-semibold text-gray-900 flex-1">{r.username}</Text>
                    <Text className="text-lg">{r.liked ? '👍' : '👎'}</Text>
                  </View>
                  <Text className="text-sm text-gray-500 leading-5">{r.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        </View>
      </ScrollView>
      <View className="bg-white border-t border-gray-100 pt-3" style={{ alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: bottomPadding }}>
          <Button label="เลือกสถานที่นี้" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VenueDetailScreen;
