// ─── ReviewExperienceScreen ────────────────────────────────────────────────────
// หน้า review ประสบการณ์ match
// - รีวิวสถานที่ (👍/👎 + comment)
// - รีวิวคนที่พบ (👍/👎 + comment)
// - ส่งรีวิว → กลับหน้าหลัก

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearReviewMatchId } from '../../redux/reviewSlice';
import mainApi from '../../api/main.api';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  location_id?: string;
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
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  // Fetch match data to get location_id and other user's id
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) {
        setLoading(false);
        return;
      }
      try {
        const response = await mainApi.get(`/v1/match/get/${matchId}`) as any;
        setMatchData(response.data as Match);
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

  const canSubmit = locationComment.trim().length > 0 && personComment.trim().length > 0
    && locationLiked !== null && personLiked !== null;

  const handleSubmit = async () => {
    if (!canSubmit || !userId || !matchData) return;

    // Determine reviewed user (the other person in the match)
    const reviewedUserId = matchData.user1_id === userId ? matchData.user2_id : matchData.user1_id;

    setSubmitting(true);
    try {
      // ส่งรีวิวสถานที่
      if (matchData.location_id) {
        await mainApi.post('/v1/location-review/create', {
          user_id: userId,
          location_id: matchData.location_id,
          status: locationLiked ? 1 : 0,
          review_text: locationComment,
          match_id: matchId,
        });
      }

      // ส่งรีวิวคนที่พบ
      await mainApi.post('/v1/user-review/create', {
        user_id: userId,
        reviewed_user_id: reviewedUserId,
        status: personLiked ? 1 : 0,
        review_text: personComment,
        match_id: matchId,
      });

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
      <AppHeader title="รีวิวประสบการณ์" showBack onBackPress={() => router.back()} />

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
      />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingBottom: bottomPadding, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 20 }}>

          {loading && (
            <Text className="text-center text-gray-500 py-8">กำลังโหลดข้อมูล...</Text>
          )}

          {!loading && (
            <>
          {/* Location review */}
          <View className="gap-3">
            <Text className="text-base font-bold text-gray-900">รีวิวสถานที่</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${locationLiked === true ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
                onPress={() => setLocationLiked(true)}
              >
                <Text className="text-xl">👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${locationLiked === false ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                onPress={() => setLocationLiked(false)}
              >
                <Text className="text-xl">👎</Text>
              </TouchableOpacity>
            </View>
            <View className="border border-gray-300 rounded-xl px-4 py-3 h-24">
              <TextInput
                value={locationComment}
                onChangeText={setLocationComment}
                multiline
                placeholder="บอกเล่าประสบการณ์สถานที่..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Person review */}
          <View className="gap-3">
            <Text className="text-base font-bold text-gray-900">รีวิวคนที่พบ</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${personLiked === true ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
                onPress={() => setPersonLiked(true)}
              >
                <Text className="text-xl">👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${personLiked === false ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                onPress={() => setPersonLiked(false)}
              >
                <Text className="text-xl">👎</Text>
              </TouchableOpacity>
            </View>
            <View className="border border-gray-300 rounded-xl px-4 py-3 h-24">
              <TextInput
                value={personComment}
                onChangeText={setPersonComment}
                multiline
                placeholder="บอกเล่าประสบการณ์คนที่พบ..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
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
