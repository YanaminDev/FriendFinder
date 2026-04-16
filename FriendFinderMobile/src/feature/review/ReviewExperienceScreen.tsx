// ─── ReviewExperienceScreen ────────────────────────────────────────────────────
// หน้า review ประสบการณ์ match
// - รีวิวสถานที่ (👍/👎 + comment)
// - รีวิวคนที่พบ (👍/👎 + comment)
// - ส่งรีวิว → กลับหน้าหลัก

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearReviewMatchId } from '../../redux/reviewSlice';
import { colors } from '../../constants/theme';
import { getMatchById, updateMatchEndDate } from '../../service/match.service';
import { getLocationById } from '../../service/location.service';
import { getLocationImages, LocationImage } from '../../service/location_image.service';
import { createLocationReview } from '../../service/location_review.service';
import { createUserReview } from '../../service/user_review.service';
import { getPublicUserImages, UserImage as UserImageType } from '../../service/user_image.service';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  location_id?: string;
  end_date?: string;
  user1?: any;
  user2?: any;
}

const ReviewExperienceScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const paramMatchId = params.matchId as string;
  const reduxMatchId = useAppSelector((state) => state.review.reviewMatchId);
  const matchId = paramMatchId || reduxMatchId;
  const userId = useAppSelector((state) => state.user.user_id);
  const [locationComment, setLocationComment] = useState('');
  const [personComment, setPersonComment] = useState('');
  const [locationLiked, setLocationLiked] = useState<boolean | null>(null);
  const [personLiked, setPersonLiked] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<any>(null);
  const [locationImages, setLocationImages] = useState<LocationImage[]>([]);
  const [otherUserImage, setOtherUserImage] = useState<UserImageType | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  // Fetch match data and location details
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) {
        setLoading(false);
        return;
      }
      try {
        const match = await getMatchById(matchId);
        setMatchData(match);

        // Get other user ID and fetch their image
        if (match && userId) {
          const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
          const otherUserData = match.user1_id === userId ? match.user2 : match.user1;

          if (otherUserData?.user_show_name) {
            setOtherUserName(otherUserData.user_show_name);
          }

          // Fetch other user's public images
          try {
            const userImages = await getPublicUserImages(otherUserId);
            if (userImages?.[0]) {
              setOtherUserImage(userImages[0]);
            }
          } catch (err) {
            console.error('Error fetching other user images:', err);
          }
        }

        // Fetch location details if location_id exists
        if (match?.location_id) {
          try {
            const location = await getLocationById(match.location_id);
            setLocationData(location);

            // Fetch location images
            const images = await getLocationImages(match.location_id);
            setLocationImages(images);
          } catch (err) {
            console.error('Error fetching location details:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching match data:', err);
        setAlert({
          visible: true,
          type: 'error',
          title: 'ผิดพลาด',
          message: 'ไม่สามารถโหลดข้อมูล match ได้',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  const locationReviewFilled = matchData?.location_id && locationLiked !== null && locationComment.trim().length > 0;
  const personReviewFilled = personLiked !== null && personComment.trim().length > 0;
  const canSubmit = locationReviewFilled || personReviewFilled;

  const handleSubmit = async () => {
    if (!canSubmit || !userId || !matchData || !matchId) return;

    // Determine reviewed user (the other person in the match)
    const reviewedUserId = matchData.user1_id === userId ? matchData.user2_id : matchData.user1_id;

    setSubmitting(true);
    try {
      // ส่งรีวิวสถานที่ (ถ้ามีและกรอก)
      if (locationReviewFilled && matchData.location_id) {
        await createLocationReview({
          user_id: userId,
          location_id: matchData.location_id,
          status: locationLiked ? 1 : 0,
          review_text: locationComment,
          match_id: matchId,
        });
      }

      // ส่งรีวิวคนที่พบ (ถ้ากรอก)
      if (personReviewFilled) {
        await createUserReview({
          user_id: userId,
          reviewed_user_id: reviewedUserId,
          status: personLiked ? 1 : 0,
          review_text: personComment,
          match_id: matchId,
        });
      }

      // จบการ match → set end_date (ถ้ายังไม่ได้ set)
      try {
        if (!matchData.end_date) {
          await updateMatchEndDate(matchId, new Date().toISOString());
        }
      } catch (err) {
        console.error('Error setting match end_date:', err);
      }

      setAlert({
        visible: true,
        type: 'success',
        title: 'ส่งรีวิวสำเร็จ',
        message: 'ขอบคุณที่แบ่งปันประสบการณ์ของคุณ',
      });

      dispatch(clearReviewMatchId());
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    } catch (err: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ผิดพลาด',
        message: err?.message || 'ไม่สามารถส่งรีวิวได้',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader
        title="รีวิวประสบการณ์"
        showBack
        onBackPress={() => {
          dispatch(clearReviewMatchId());
          router.replace('/(tabs)/home');
        }}
      />

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
      />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: bottomPadding, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 16 }}>

            {loading && (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-center text-gray-500 mt-3">กำลังโหลดข้อมูล...</Text>
              </View>
            )}

            {!loading && (
              <>
                

                {/* Location Card */}
                {locationData && (
                  <View style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' }}>
                    {/* Location Image */}
                    {locationImages[0]?.imageUrl ? (
                      <Image
                        source={{ uri: locationImages[0].imageUrl }}
                        style={{ width: '100%', height: 160 }}
                      />
                    ) : (
                      <View style={{ width: '100%', height: 160, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="image-outline" size={48} color={colors.gray300} />
                      </View>
                    )}

                    {/* Location Info */}
                    <View style={{ padding: 16, gap: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{locationData.name}</Text>
                      {locationData.description && (
                        <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 18 }} numberOfLines={3}>
                          {locationData.description}
                        </Text>
                      )}
                      {locationData.open_time && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <Ionicons name="time-outline" size={14} color={colors.primary} />
                          <Text style={{ fontSize: 12, color: colors.primary }}>
                            {locationData.open_time} - {locationData.close_time}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Location Review */}
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>รีวิวสถานที่</Text>

                  {/* Like/Dislike Buttons */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: locationLiked === true ? colors.primary : '#e5e7eb',
                        backgroundColor: locationLiked === true ? colors.primary + '15' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setLocationLiked(true)}
                    >
                      <Ionicons
                        name="thumbs-up"
                        size={24}
                        color={locationLiked === true ? colors.primary : '#d1d5db'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: locationLiked === false ? '#ef4444' : '#e5e7eb',
                        backgroundColor: locationLiked === false ? '#fee2e2' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setLocationLiked(false)}
                    >
                      <Ionicons
                        name="thumbs-down"
                        size={24}
                        color={locationLiked === false ? '#ef4444' : '#d1d5db'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Comment Input */}
                  <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, height: 100 }}>
                    <TextInput
                      value={locationComment}
                      onChangeText={setLocationComment}
                      multiline
                      placeholder="บอกเล่าประสบการณ์สถานที่..."
                      placeholderTextColor="#9ca3af"
                      style={{ fontSize: 14, color: '#111827', flex: 1, padding: 0 }}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Other User Profile Card */}
                <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f3f4f6', alignItems: 'center', gap: 12 }}>
                  {/* User Image */}
                  {otherUserImage?.imageUrl ? (
                    <Image
                      source={{ uri: otherUserImage.imageUrl }}
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                  ) : (
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 32, fontWeight: '700' }}>
                        {otherUserName?.charAt(0)?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                  {/* User Name */}
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center' }}>
                    {otherUserName}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>บอกเล่าประสบการณ์ที่เกิดขึ้น</Text>
                </View>

                {/* Person Review */}
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>รีวิวคนที่พบ</Text>

                  {/* Like/Dislike Buttons */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: personLiked === true ? colors.primary : '#e5e7eb',
                        backgroundColor: personLiked === true ? colors.primary + '15' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setPersonLiked(true)}
                    >
                      <Ionicons
                        name="thumbs-up"
                        size={24}
                        color={personLiked === true ? colors.primary : '#d1d5db'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: personLiked === false ? '#ef4444' : '#e5e7eb',
                        backgroundColor: personLiked === false ? '#fee2e2' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setPersonLiked(false)}
                    >
                      <Ionicons
                        name="thumbs-down"
                        size={24}
                        color={personLiked === false ? '#ef4444' : '#d1d5db'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Comment Input */}
                  <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, height: 100 }}>
                    <TextInput
                      value={personComment}
                      onChangeText={setPersonComment}
                      multiline
                      placeholder="บอกเล่าประสบการณ์คนที่พบ..."
                      placeholderTextColor="#9ca3af"
                      style={{ fontSize: 14, color: '#111827', flex: 1, padding: 0 }}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <Button
                  label={submitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                  onPress={handleSubmit}
                  disabled={!canSubmit || submitting}
                />
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReviewExperienceScreen;
