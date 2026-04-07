// ─── HomeScreen ────────────────────────────────────────────────────────────────

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import MapComponentWeb from '../../components/map/MapComponentWeb';
import { MOCK_VENUES } from '../../constants/mockData';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View className="flex-1 bg-white">
    <SafeAreaView className="flex-1 justify-between" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <AppHeader
          title="Home"
          rightElement={
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Text className="text-2xl">🔔</Text>
            </TouchableOpacity>
          }
        />
        {/* Map with fixed height */}
        <MapComponentWeb
          pins={MOCK_VENUES.map(v => ({
            id: v.id,
            title: v.name,
            longitude: v.longitude || 100.8861,
            latitude: v.latitude || 13.7563,
          }))}
          height={400}
          onPinPress={(pin) => {
            const venue = MOCK_VENUES.find(v => v.id === pin.id);
            if (venue) {
              navigation.navigate('VenueDetail', { venueId: venue.id });
            }
          }}
        />
      </View>
    </SafeAreaView>
  </View>
);

export default HomeScreen;
