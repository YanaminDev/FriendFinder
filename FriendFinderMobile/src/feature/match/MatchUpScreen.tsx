// ─── MatchUpScreen ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import VenueCard from '../../components/match/VenueCard';
import Button from '../../components/common/Button';
import { MOCK_VENUES, MOCK_MATCH_PROFILES } from '../../constants/mockData';
import { useResponsive } from '../../hooks/useResponsive';


const MatchUpScreen: React.FC<{ navigation: any; route: { params: { userId: string } } }> = ({ navigation, route }) => {
  const { userId } = route.params;
  const matchedUser = MOCK_MATCH_PROFILES.find(p => p.id === userId) ?? MOCK_MATCH_PROFILES[0];
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader title="เลือกสถานที่" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: 100, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 12 }}>
          <Text className="text-sm text-gray-500 mb-1">เลือกสถานที่นัดพบกับ <Text className="text-gray-900 font-semibold">{matchedUser.name}</Text></Text>
          {MOCK_VENUES.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isSelected={selectedVenueId === venue.id}
              primaryLabel={selectedVenueId === venue.id ? '✓ เลือกแล้ว' : 'เลือกสถานที่นี้'}
              onPrimaryPress={() => setSelectedVenueId(venue.id)}
              onReadReview={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
            />
          ))}
        </View>
      </ScrollView>
      <View className="bg-white border-t border-gray-100 pt-3" style={{ alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: bottomPadding }}>
          <Button label="ยืนยันการนัด" onPress={() => navigation.navigate('MatchSuccess')} disabled={!selectedVenueId} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MatchUpScreen;
