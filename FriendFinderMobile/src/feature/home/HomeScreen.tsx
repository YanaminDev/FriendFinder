// ─── HomeScreen ────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import NotificationButton from '../../components/common/NotificationButton';
import NotificationCard from '../../components/common/NotificationCard';
import LocationDetailCard from '../../components/map/LocationDetailCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import MapComponentWeb from '../../components/map/MapComponentWeb';
import { MOCK_VENUES } from '../../constants/mockData';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Match!',
    message: 'You matched with Sarah. Start a conversation now!',
    timestamp: '2 minutes ago',
    icon: 'heart',
    type: 'match' as const,
  },
  {
    id: '2',
    title: 'Message from John',
    message: 'Hey, how are you doing?',
    timestamp: '1 hour ago',
    icon: 'chatbubble',
    type: 'message' as const,
  },
  {
    id: '3',
    title: 'Someone liked you',
    message: 'Emma likes your profile',
    timestamp: '3 hours ago',
    icon: 'heart',
    type: 'like' as const,
  },
];

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
  <View className="flex-1 bg-white">
    <SafeAreaView className="flex-1 justify-between" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1">
        <AppHeader title="Home" />
        {/* Map with responsive height */}
        <View className="relative flex-1">
          <MapComponentWeb
            pins={MOCK_VENUES.map(v => ({
              id: v.id,
              title: v.name,
              longitude: v.longitude || 100.8861,
              latitude: v.latitude || 13.7563,
            }))}
            height="100%"
            onPinPress={(pin: any) => {
              console.log('Pin pressed:', pin);
              const venue = MOCK_VENUES.find(v => v.id === pin.id);
              console.log('Found venue:', venue);
              if (venue) {
                setSelectedLocation({ ...venue, markerPosition: pin.position });
              }
            }}
          />

          {/* Notification Button - Top Right */}
          <View className="absolute top-4 right-4 z-10">
            <NotificationButton
              onPress={() => setShowNotifications(!showNotifications)}
              badge={3}
              size="md"
            />
          </View>

          {/* Notification Card Popup */}
          {showNotifications && (
            <NotificationCard
              notifications={MOCK_NOTIFICATIONS}
              onClose={() => setShowNotifications(false)}
              onNotificationPress={(notification) => {
                setShowNotifications(false);
                navigation.navigate('Chat');
              }}
            />
          )}

          {/* Check In Now Button - Bottom Center */}
          <View className="absolute left-1/2" style={{ bottom: 30, marginLeft: -85 }}>
            <PrimaryButton onPress={() => navigation.navigate('FindMatch')} size="md" text="CHECK IN NOW" />
          </View>

          {/* Location Detail Card */}
          {selectedLocation && (
            <LocationDetailCard
              id={selectedLocation.id}
              title={selectedLocation.name}
              description={selectedLocation.description}
              phone={selectedLocation.phone}
              openTime={selectedLocation.openHours}
              imageUrl={selectedLocation.image}
              markerPosition={selectedLocation.markerPosition}
              onClose={() => setSelectedLocation(null)}
              onPress={() => {
                setSelectedLocation(null);
                navigation.navigate('VenueDetail', { venueId: selectedLocation.id });
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  </View>
  );
};

export default HomeScreen;
