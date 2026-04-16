// ─── VenuesListScreen ────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import VenueCard from '../../components/match/VenueCard';
import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../constants/theme';
import { getAllPositions } from '../../service/position.service';
import { getLocation, Location } from '../../service/location.service';
import { getLocationImages, LocationImage } from '../../service/location_image.service';
import { getLocationReviewsByLocation, LocationReview } from '../../service/location_review.service';
import { getPublicUserImages, UserImage } from '../../service/user_image.service';

interface VenueWithDetails {
  venue: Location;
  images: LocationImage[];
  reviews: (LocationReview & { userImages?: UserImage[] })[];
}

const VenuesListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding } = useResponsive();
  const [venues, setVenues] = useState<VenueWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenuesData();
  }, []);

  const loadVenuesData = async () => {
    try {
      setLoading(true);
      // ดึง locations ทั้งหมด
      const locations = await getLocation();

      // ดึง images, reviews, และ user details สำหรับแต่ละ location
      const venuesWithDetails: VenueWithDetails[] = await Promise.all(
        locations.map(async (loc) => {
          try {
            const [images, reviews] = await Promise.all([
              getLocationImages(loc.id).catch(() => []),
              getLocationReviewsByLocation(loc.id).catch(() => []),
            ]);

            // ดึงรูปภาพ user สำหรับแต่ละ review
            const reviewsWithUserImages = await Promise.all(
              reviews.map(async (review) => {
                try {
                  const userImages = await getPublicUserImages(review.user_id).catch(() => []);
                  return { ...review, userImages };
                } catch {
                  return { ...review, userImages: [] };
                }
              })
            );

            return {
              venue: loc,
              images,
              reviews: reviewsWithUserImages,
            };
          } catch (err) {
            console.error(`Error loading details for location ${loc.id}:`, err);
            return {
              venue: loc,
              images: [],
              reviews: [],
            };
          }
        })
      );

      setVenues(venuesWithDetails);
    } catch (err) {
      console.error('Error loading venues:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-3">กำลังโหลด...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader title="สถานที่แนะนำ" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 12 }}>
          {venues.length === 0 ? (
            <Text className="text-center text-gray-500 py-8">ไม่มีสถานที่แนะนำ</Text>
          ) : (
            venues.map((item) => (
              <VenueCard
                key={item.venue.id}
                venue={{
                  ...item.venue,
                  images: item.images,
                  reviews: item.reviews,
                } as any}
                onReadReview={() => navigation.navigate('VenueDetail', { venueId: item.venue.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VenuesListScreen;
