// ─── HomeScreen ────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import NotificationButton from '../../components/common/NotificationButton';
import NotificationCard from '../../components/common/NotificationCard';
import LocationDetailCard from '../../components/map/LocationDetailCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import MapComponentWeb from '../../components/map/MapComponentWeb';
import { MOCK_VENUES } from '../../constants/mockData';
import { getAllPositions, Position } from '../../service/position.service';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useSocket } from '../../hooks/useSocket';

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
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const { userLocation, loading: locationLoading } = useUserLocation();

  // Initialize Socket.IO connection when home screen loads
  useSocket(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getAllPositions();
        setPositions(data);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return (
  <View className="flex-1 bg-white">
    <SafeAreaView className="flex-1 justify-between" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1">
        <AppHeader title="Home" />
        {/* Map with responsive height */}
        <View className="relative flex-1">
          {loading ? (
            <View className="flex-1 justify-center items-center bg-gray-100">
              <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
          ) : (
            <MapComponentWeb
              pins={positions.map(p => ({
                id: p.id,
                title: p.name,
                longitude: p.longitude,
                latitude: p.latitude,
              }))}
              userLocation={userLocation || undefined}
              height="100%"
              onPinPress={(pin: any) => {
                const position = positions.find(p => p.id === pin.id);
                if (position) {
                  setSelectedLocation({
                    ...position,
                    name: position.name,
                    description: position.information,
                    phone: position.phone,
                    openHours: position.open_time && position.close_time
                      ? `${position.open_time} - ${position.close_time}`
                      : position.open_time || position.close_time || 'ไม่ระบุเวลา',
                    markerPosition: pin.position
                  });
                }
              }}
            />
          )}

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
          <View className="absolute left-0 right-0 items-center" style={{ bottom: 30 }}>
            <PrimaryButton onPress={() => navigation.navigate('FindMatch')} size="md" text="CHECK IN NOW" />
          </View>

          {/* Location Detail Card */}
          {selectedLocation && (
            <LocationDetailCard
              id={selectedLocation.id}
              title={selectedLocation.name}
              description={selectedLocation.description}
              phone={selectedLocation.phone}
              openDate={selectedLocation.open_date}
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
