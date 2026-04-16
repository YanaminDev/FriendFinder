// ─── VenueDetailScreen ─────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../constants/theme';
import { getLocationById, Location } from '../../service/location.service';
import { getLocationImages, LocationImage } from '../../service/location_image.service';
import { getLocationReviewsByLocation, LocationReview } from '../../service/location_review.service';
import { getPublicUserImages, UserImage } from '../../service/user_image.service';
import { Ionicons } from '@expo/vector-icons';

interface ReviewWithUser extends LocationReview {
  userImages?: UserImage[];
  userName?: string;
}

const VenueDetailScreen: React.FC<{ navigation: any; route: { params: { venueId: string } } }> = ({ navigation, route }) => {
  const { venueId } = route.params;
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  const [location, setLocation] = useState<Location | null>(null);
  const [images, setImages] = useState<LocationImage[]>([]);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadVenueDetails();
  }, [venueId]);

  const loadVenueDetails = async () => {
    try {
      setLoading(true);
      // ดึง location details
      const loc = await getLocationById(venueId);
      setLocation(loc);

      // ดึง images
      const locImages = await getLocationImages(venueId).catch(() => []);
      setImages(locImages);

      // ดึง reviews + user details
      const locReviews = await getLocationReviewsByLocation(venueId).catch(() => []);
      const reviewsWithUsers = await Promise.all(
        locReviews.map(async (review) => {
          try {
            const userImages = await getPublicUserImages(review.user_id).catch(() => []);
            return {
              ...review,
              userImages,
            };
          } catch {
            return { ...review, userImages: [] };
          }
        })
      );
      setReviews(reviewsWithUsers);
    } catch (err) {
      console.error('Error loading venue details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / maxContentWidth);
    setCurrentImageIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-3">กำลังโหลด...</Text>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">ไม่พบข้อมูลสถานที่</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title="รีวิวสถานที่" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, alignItems: 'center' }}>

        <View style={{ width: '100%', maxWidth: maxContentWidth }}>
          {/* Location Images */}
          {images.length > 0 ? (
            <View className="relative w-full">
              <ScrollView
                ref={imageScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="w-full"
                scrollEventThrottle={16}
                onScroll={handleImageScroll}
              >
                {images.map((img) => (
                  <Image
                    key={img.id}
                    source={{ uri: img.imageUrl }}
                    className="h-52 bg-gray-200"
                    style={{ width: maxContentWidth }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              <View className="absolute bottom-2 right-4 px-2 py-1 rounded-full bg-black/50">
                <Text className="text-white text-sm font-semibold">
                  {currentImageIndex + 1}/{images.length}
                </Text>
              </View>
            </View>
          ) : (
            <View className="w-full h-52 bg-gray-200 items-center justify-center">
              <Ionicons name="image-outline" size={48} color={colors.gray300} />
            </View>
          )}

          <View style={{ paddingHorizontal: horizontalPadding, paddingVertical: 16, rowGap: 12 }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">{location.name}</Text>
              {location.activity?.name && (
                <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.primaryLight }}>
                  <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
                    {location.activity.name}
                  </Text>
                </View>
              )}
            </View>

            {location.description && (
              <Text className="text-sm text-gray-600 leading-5">{location.description}</Text>
            )}

            <View className="gap-1.5 mt-2">
              {location.phone && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="call-outline" size={16} color={colors.primary} />
                  <Text className="text-sm text-gray-600">{location.phone}</Text>
                </View>
              )}
              {location.open_time && location.close_time && (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text className="text-sm text-gray-600">{location.open_time} - {location.close_time}</Text>
                </View>
              )}
            </View>

            {/* Reviews */}
            <View className="mt-2 gap-3">
              {reviews.length > 0 ? (
                <>
                  <Text className="text-base font-bold text-gray-900">รีวิว</Text>
                  {reviews.map((r) => (
                    <View key={r.id} className="border border-gray-200 rounded-xl p-3 gap-2">
                      <View className="flex-row items-center gap-2">
                        {r.userImages && r.userImages.length > 0 ? (
                          <Image source={{ uri: r.userImages[0].imageUrl }} className="w-8 h-8 rounded-full bg-gray-200" />
                        ) : (
                          <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center">
                            <Text className="text-xs font-bold text-gray-600">
                              {r.user?.user_show_name?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                          </View>
                        )}
                        <Text className="text-sm font-semibold text-gray-900 flex-1">
                          {r.user?.user_show_name || 'ผู้ใช้'}
                        </Text>
                        <Ionicons
                          name={r.status === 1 ? 'thumbs-up' : 'thumbs-down'}
                          size={18}
                          color={r.status === 1 ? colors.primary : colors.gray400}
                        />
                      </View>
                      {r.review_text && (
                        <Text className="text-sm text-gray-500 leading-5">{r.review_text}</Text>
                      )}
                    </View>
                  ))}
                </>
              ) : (
                <View className="items-center gap-4 py-8">
                  <Ionicons name="chatbubble-outline" size={64} color={colors.primary} />
                  <Text className="text-center text-gray-500">สถานที่นี้ยังไม่เคยมีรีวิว</Text>
                </View>
              )}
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VenueDetailScreen;
