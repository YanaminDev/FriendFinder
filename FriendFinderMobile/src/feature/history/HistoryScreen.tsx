// ─── HistoryScreen ─────────────────────────────────────────────────────────────

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, SectionList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import HistoryCard from '../../components/history/HistoryCard';
import { colors } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppSelector } from '../../redux/hooks';
import { getEndedMatchesByUser } from '../../service/match.service';
import { getLocationImages } from '../../service/location_image.service';
import { getUserImages } from '../../service/user_image.service';
import { getUserProfile } from '../../service/user.service';
import type { HistoryItem, VenueReview } from '../../types';

interface HistorySection {
  title: string;
  data: HistoryItem[];
}

const HistoryScreen: React.FC = () => {
  const { maxContentWidth } = useResponsive();
  const userId = useAppSelector(state => state.user.user_id);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userImage, setUserImage] = useState<string | undefined>();
  const [userShowName, setUserShowName] = useState<string>('');

  // จัดกลุ่มตามวัน
  const historySections = useMemo(() => {
    const grouped = new Map<string, HistoryItem[]>();

    historyItems.forEach(item => {
      const existingGroup = grouped.get(item.date);
      if (existingGroup) {
        existingGroup.push(item);
      } else {
        grouped.set(item.date, [item]);
      }
    });

    return Array.from(grouped).map(([date, items]) => ({
      title: date,
      data: items,
    })) as HistorySection[];
  }, [historyItems]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      // ดึงข้อมูล user profile จาก backend ก่อน
      let currentUserShowName = '';
      try {
        const profile = await getUserProfile();
        if (profile?.user_show_name) {
          currentUserShowName = profile.user_show_name;
          setUserShowName(currentUserShowName);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }

      // ดึงรูปของผู้ login
      let currentUserImage: string | undefined;
      try {
        const userImages = await getUserImages(userId);
        if (userImages && userImages.length > 0) {
          currentUserImage = userImages[0].imageUrl;
          setUserImage(currentUserImage);
        }
      } catch (err) {
        console.error('Failed to fetch user images:', err);
      }

      const endedMatches = await getEndedMatchesByUser(userId);

      const items: HistoryItem[] = await Promise.all(
        endedMatches.map(async (match) => {
          // หา other user (คนที่ไม่ใช่ตัวเรา)
          const otherUser = match.user1_id === userId ? match.user2 : match.user1;

          // ถ้า match ถูก cancel ไม่ต้องมี review
          const isCancelled = match.cancel_status;

          let personReview: VenueReview | undefined;
          let locationReview: VenueReview | undefined;

          if (!isCancelled) {
            // Map user_review (ดึงมาแล้วเฉพาะ user_id = current user) หรือ experience
            const userRev = (match as any).user_review?.[0];
            const experience = (match as any).experience?.[0];

            if (userRev || experience) {
              const reviewData = userRev || experience;

              // personReview แสดงว่าเราเป็นคนเขียน พร้อมเนื้อหาที่เราเขียนถึงคู่ของเรา
              personReview = {
                id: reviewData?.id || '',
                userId: userId,
                username: currentUserShowName || 'You',
                avatar: currentUserImage,
                comment: reviewData?.review_text || reviewData?.content || 'ไม่มีความเห็น',
                liked: reviewData?.status === 1,
                reviewedUsername: otherUser?.user_show_name,
              };
            }

            // Map location_review to locationReview (backend ดึงมาแล้วเฉพาะ user = current user)
            const locReview = (match as any).location_review?.[0];
            if (locReview) {
              locationReview = {
                id: locReview?.id || '',
                userId: userId,
                username: currentUserShowName || 'You',
                avatar: currentUserImage,
                comment: locReview?.review_text || 'ไม่มีความเห็น',
                liked: locReview?.status === 1,
              };
            }
          }

          // ดึงรูปภาพของสถานที่
          let locationImage = '';
          if (match.location?.id) {
            try {
              const images = await getLocationImages(match.location.id);
              if (images && images.length > 0) {
                locationImage = images[0].imageUrl;
              }
            } catch (err) {
              console.error('Failed to fetch location images:', err);
            }
          }

          // Map location to venue
          const venue = {
            id: match.location?.id || '',
            name: match.location?.name || 'Unknown Location',
            category: match.activity?.name || 'Unknown',
            image: locationImage,
            successfulMatches: 0,
            address: '',
            phone: '',
            openHours: '',
            description: '',
            reviews: [],
          };

          return {
            id: match.id,
            date: new Date(match.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            venue,
            personReview,
            locationReview,
            isCancelled,
          };
        })
      );

      setHistoryItems(items);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;
      fetchHistory();
    }, [fetchHistory, isAuthenticated])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="History" />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <SectionList
          sections={historySections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: '100%', maxWidth: maxContentWidth }}>
                <HistoryCard item={item} />
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ alignItems: 'center', paddingTop: 16 }}>
              <View style={{ width: '100%', maxWidth: maxContentWidth }}>
                <Text className="text-sm font-semibold text-gray-600 px-4 mb-3">{title}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="time" size={48} color={colors.gray300} style={{ marginBottom: 12 }} />
              <Text className="text-base text-gray-500">ยังไม่มีประวัติ</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;
