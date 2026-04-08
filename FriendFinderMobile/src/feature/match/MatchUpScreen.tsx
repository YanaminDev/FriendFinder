// ─── MatchUpScreen ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import VenueCard from '../../components/match/VenueCard';
import Button from '../../components/common/Button';
import { MOCK_VENUES, MOCK_MATCH_PROFILES } from '../../constants/mockData';
import { ScrollView } from 'react-native';

const MatchUpScreen: React.FC<{ navigation: any; route: { params: { userId: string } } }> = ({ navigation, route }) => {
  const { userId } = route.params;
  const matchedUser = MOCK_MATCH_PROFILES.find(p => p.id === userId) ?? MOCK_MATCH_PROFILES[0];
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader title="เลือกสถานที่" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
      <View className="px-4 pb-8 bg-white border-t border-gray-100 pt-3">
        <Button
          label="ยืนยันการนัด"
          onPress={() => navigation.navigate('MatchSuccess')}
          disabled={!selectedVenueId}
        />
      </View>
    </SafeAreaView>
  );
};

export default MatchUpScreen;
