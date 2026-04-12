// ─── VenuesListScreen ────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import VenueCard from '../../components/match/VenueCard';
import { MOCK_VENUES } from '../../constants/mockData';
import { useResponsive } from '../../hooks/useResponsive';

const VenuesListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding } = useResponsive();
  return (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader title="สถานที่แนะนำ" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 12 }}>
        {MOCK_VENUES.map(venue => (
          <VenueCard
            key={venue.id}
            venue={venue}
            primaryLabel="ดูรายละเอียด"
            onPrimaryPress={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
            onReadReview={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
          />
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default VenuesListScreen;
