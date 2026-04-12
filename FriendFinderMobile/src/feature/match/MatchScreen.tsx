// ─── MatchScreen ───────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { colors } from '../../constants/theme';
import { useAppSelector } from '../../redux/hooks';
import { searchFindMatch, FindMatch } from '../../service/find_match.service';
import { createNotification } from '../../service/notification.service';

const MatchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedActivities, positionId } = useAppSelector((state) => state.findMatch);
  const userId = useAppSelector((state) => state.user.user_id);

  const [matches, setMatches] = useState<FindMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [alert, setAlert] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }>({ visible: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await searchFindMatch({
          position_id: positionId,
          activity_id1: selectedActivities[0]?.id,
          activity_id2: selectedActivities[1]?.id,
          activity_id3: selectedActivities[2]?.id,
        });
        // กรองตัวเองออก
        const filtered = data.filter((m) => m.user_id !== userId);
        setMatches(filtered);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    };

    if (positionId) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, [positionId, selectedActivities, userId]);

  const currentMatch = matches[currentIndex];

  // กดถูกใจ → ส่ง notification
  const handleLike = async () => {
    if (!currentMatch) return;
    setLikeLoading(true);
    try {
      await createNotification({
        receiver_id: currentMatch.user_id,
        type: 'match_request',
        position_id: positionId,
        activity_id: selectedActivities[0]?.id,
      });
      setAlert({ visible: true, type: 'success', title: 'ส่งคำขอแล้ว!', message: `ส่งคำขอ Match ไปยัง ${currentMatch.user?.user_show_name || 'ผู้ใช้'} แล้ว` });
      // ไปคนถัดไป
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error: any) {
      setAlert({ visible: true, type: 'error', title: 'ข้อผิดพลาด', message: error?.message || 'ไม่สามารถส่งคำขอได้' });
    } finally {
      setLikeLoading(false);
    }
  };

  // กดข้าม
  const handleSkip = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setAlert({ visible: true, type: 'info', title: 'หมดแล้ว', message: 'ไม่มีผู้ใช้ที่ตรงกันเพิ่มเติมแล้ว' });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-4">กำลังค้นหาเพื่อน...</Text>
      </SafeAreaView>
    );
  }

  if (matches.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="people-outline" size={64} color={colors.gray300} />
        <Text className="text-xl font-bold text-gray-700 mt-4">ยังไม่มีคนที่ตรงกัน</Text>
        <Text className="text-sm text-gray-400 text-center mt-2">ลองรอสักครู่หรือเปลี่ยน Activity แล้วลองใหม่</Text>
        <View className="w-full mt-8">
          <Button label="กลับหน้าหลัก" onPress={() => navigation.navigate('Home')} />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentMatch) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="checkmark-circle-outline" size={64} color={colors.success} />
        <Text className="text-xl font-bold text-gray-700 mt-4">ดูครบแล้ว!</Text>
        <Text className="text-sm text-gray-400 text-center mt-2">คุณดูผู้ใช้ทั้งหมดแล้ว รอการตอบรับจากเพื่อนนะ</Text>
        <View className="w-full mt-8">
          <Button label="กลับหน้าหลัก" onPress={() => navigation.navigate('Home')} />
        </View>
      </SafeAreaView>
    );
  }

  // แสดง activities ที่ match กัน
  const matchActivities = [currentMatch.activity1, currentMatch.activity2, currentMatch.activity3].filter(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader
        title="Match"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Profile card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden border border-gray-100">
          <View className="w-full h-80 bg-gray-200 items-center justify-center">
            <Ionicons name="person-circle-outline" size={120} color={colors.gray300} />
          </View>
          <View className="p-4">
            <Text className="font-bold text-2xl text-gray-900">
              {currentMatch.user?.user_show_name || 'ผู้ใช้'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {currentMatch.user?.sex} | อายุ {currentMatch.user?.age} ปี
            </Text>
          </View>
        </View>

        {/* Activities ที่ match */}
        <View className="mx-4 mt-3 bg-white rounded-xl p-4 border border-gray-100">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Activities ที่ตรงกัน</Text>
          <View className="flex-row flex-wrap gap-2">
            {matchActivities.map((act: any) => (
              <View key={act.id} className="flex-row items-center bg-primary/10 rounded-full px-3 py-1.5">
                <Ionicons name={act.icon as any} size={14} color={colors.primary} />
                <Text className="text-sm text-primary ml-1.5">{act.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Position */}
        <View className="mx-4 mt-3 bg-white rounded-xl p-4 border border-gray-100">
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text className="text-sm text-gray-700">{currentMatch.position?.name || 'ไม่ระบุ'}</Text>
          </View>
        </View>

        {/* Counter */}
        <Text className="text-center text-xs text-gray-400 mt-3">
          {currentIndex + 1} / {matches.length}
        </Text>

        {/* Actions */}
        <View className="mx-4 mt-4 gap-3">
          <Button
            label={likeLoading ? 'กำลังส่ง...' : "Let's Hang Out"}
            onPress={handleLike}
            disabled={likeLoading}
          />
          <Button variant="outline" color="gray"
            label="ข้าม"
            onPress={handleSkip}
          />
        </View>

      </ScrollView>

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
      />
    </SafeAreaView>
  );
};

export default MatchScreen;
