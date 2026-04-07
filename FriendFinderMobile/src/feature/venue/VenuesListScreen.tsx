// ─── VenuesListScreen ────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import VenueCard from '../../components/match/VenueCard';
import { MOCK_VENUES } from '../../constants/mockData';

const VenuesListScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader title="สถานที่แนะนำ" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-4 pt-4">
        <View className="gap-3">
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
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default VenuesListScreen;
