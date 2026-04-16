// ─── MatchScreen ───────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { colors } from '../../constants/theme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { addSeenUserId } from '../../redux/findMatchSlice';
import { useResponsive } from '../../hooks/useResponsive';
import { searchFindMatch, getFindMatch, FindMatch } from '../../service/find_match.service';
import { createNotification } from '../../service/notification.service';
import { getActiveMatchByUser } from '../../service/match.service';
import { getPublicUserImages } from '../../service/user_image.service';
import { getUserInformation, UserInformation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle } from '../../service/user_life_style.service';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Detail Bottom Sheet ──────────────────────────────────────────────────────

interface DetailSheetProps {
  visible: boolean;
  onClose: () => void;
  match: FindMatch;
  info: UserInformation | null;
  lifeStyle: UserLifeStyle | null;
  infoLoading: boolean;
}

const DetailSheet: React.FC<DetailSheetProps> = ({ visible, onClose, match, info, lifeStyle, infoLoading }) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  // reset position ทุกครั้งที่เปิด
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 120 || vy > 0.8) {
          // เลื่อนลงพอ → ปิด
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // ยังไม่พอ → spring กลับ
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray-100">
      <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
      <Text className="text-sm text-gray-500 w-28">{label}</Text>
      <Text className="text-sm font-medium text-gray-900 flex-1">{value || '-'}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      <Animated.View
        className="bg-white rounded-t-3xl"
        style={{ maxHeight: SCREEN_HEIGHT * 0.88, paddingBottom: insets.bottom + 16, transform: [{ translateY }] }}
      >
        {/* Handle — ลาก handle นี้เพื่อปิด */}
        <View className="items-center pt-3 pb-2" {...panResponder.panHandlers}>
          <View className="w-10 h-1 rounded-full bg-gray-300" />
          <View style={{ height: 10 }} />
        </View>

        {/* Header — ลากที่ header ก็ปิดได้ */}
        <View className="flex-row items-center justify-between px-5 pb-3 border-b border-gray-100" {...panResponder.panHandlers}>
          <View>
            <Text className="text-lg font-bold text-gray-900">
              {match.user?.user_show_name || 'ผู้ใช้'}
            </Text>
            <Text className="text-sm text-gray-500">
              {match.user?.sex} · อายุ {match.user?.age} ปี
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {infoLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="px-5 pt-4" scrollEventThrottle={16}>

            {/* Bio */}
            <View className="mb-5 bg-gray-50 rounded-2xl p-4">
              <Text className="text-sm text-gray-500 mb-1 font-semibold">ประวัติส่วนตัว</Text>
              <Text className="text-sm text-gray-700 leading-6">{info?.user_bio || 'ยังไม่มีข้อมูล'}</Text>
            </View>

            {/* User Information */}
            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialCommunityIcons name="information" size={18} color={colors.primary} />
                <Text className="text-base font-bold text-gray-900">ข้อมูลเพิ่มเติม</Text>
              </View>
              <InfoRow icon="resize" label="ส่วนสูง" value={info?.user_height ? `${info.user_height} cm` : '-'} />
              <InfoRow icon="water" label="กรุ๊ปเลือด" value={info?.blood_group || '-'} />
              <InfoRow icon="school" label="การศึกษา" value={info?.education?.name || '-'} />
              <InfoRow icon="translate" label="ภาษา" value={info?.language?.name || '-'} />
            </View>

            {/* Life Style */}
            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-2 mt-2">
                <MaterialCommunityIcons name="heart-multiple" size={18} color={colors.primary} />
                <Text className="text-base font-bold text-gray-900">ไลฟ์สไตล์</Text>
              </View>
              <InfoRow icon="heart-search" label="มองหา" value={lifeStyle?.looking_for?.name || '-'} />
              <InfoRow icon="bottle-wine" label="แอลกอฮอล์" value={lifeStyle?.drinking?.name || '-'} />
              <InfoRow icon="smoke" label="บุหรี่" value={lifeStyle?.smoke?.name || '-'} />
              <InfoRow icon="dumbbell" label="ออกกำลังกาย" value={lifeStyle?.workout?.name || '-'} />
              <InfoRow icon="paw" label="สัตว์เลี้ยง" value={lifeStyle?.pet?.name || '-'} />
            </View>

          </ScrollView>
        )}
      </Animated.View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const MatchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { maxContentWidth } = useResponsive();
  const dispatch = useAppDispatch();
  const { selectedActivities, positionId, seenUserIds, isFinding } = useAppSelector((state) => state.findMatch);
  const userId = useAppSelector((state) => state.user.user_id);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [matches, setMatches] = useState<FindMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  // รูปของ match ปัจจุบัน
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Detail sheet
  const [sheetVisible, setSheetVisible] = useState(false);
  const [detailInfo, setDetailInfo] = useState<UserInformation | null>(null);
  const [detailLifeStyle, setDetailLifeStyle] = useState<UserLifeStyle | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });
  const [shouldNavigateToHome, setShouldNavigateToHome] = useState(false);

  // ดึง matches ใหม่ทุกครั้ง กรอง user ที่เคย Like/Skip แล้วออก
  const fetchMatches = useCallback(async (skipLoading = false) => {
    try {
      if (!skipLoading) setLoading(true);
      const data = await searchFindMatch({
        position_id: positionId,
        activity_id1: selectedActivities[0]?.id,
        activity_id2: selectedActivities[1]?.id,
        activity_id3: selectedActivities[2]?.id,
      });
      setMatches(data.filter((m) => m.user_id !== userId && !seenUserIds.includes(m.user_id)));
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  }, [positionId, selectedActivities, userId, seenUserIds]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (positionId) fetchMatches();
    else setLoading(false);
  }, [positionId, seenUserIds, isAuthenticated]);

  // ตรวจสอบว่า findMatch ของ User A ยังมีอยู่ไหม ถ้าหมดแล้ว (match สร้าง) ให้ไปหน้า MatchSuccess
  const matchDetectedRef = useRef(false);
  useEffect(() => {
    matchDetectedRef.current = false;
    const checkFindMatchExists = async () => {
      if (matchDetectedRef.current) return;
      try {
        await getFindMatch(userId);
        // findMatch ยังมี ไม่ต้องทำอะไร
      } catch (err) {
        if (matchDetectedRef.current) return;
        matchDetectedRef.current = true;
        try {
          const activeMatch = await getActiveMatchByUser(userId);
          if (activeMatch?.id) {
            navigation.navigate('MatchSuccess', { matchId: activeMatch.id });
            return;
          }
        } catch (e) {
          console.error('Fetch active match failed:', e);
        }
        navigation.navigate('Home');
      }
    };

    if (positionId && userId && isFinding && isAuthenticated) {
      const interval = setInterval(checkFindMatchExists, 5000);
      return () => clearInterval(interval);
    }
  }, [positionId, userId, isFinding, navigation, isAuthenticated]);

  // ดึงรูปทั้งหมดเมื่อ match แรกเปลี่ยน
  useEffect(() => {
    const match = matches[0];
    if (!match) return;
    setImageLoading(true);
    setCoverImages([]);
    setPhotoIndex(0);
    getPublicUserImages(match.user_id)
      .then((imgs) => setCoverImages(imgs.map(i => i.imageUrl)))
      .catch(() => {})
      .finally(() => setImageLoading(false));
  }, [matches]);

  // เปิด detail sheet + ดึงข้อมูลรายละเอียด
  const handleOpenDetail = async () => {
    const match = matches[0];
    if (!match) return;
    setSheetVisible(true);
    setDetailLoading(true);
    try {
      const [info, lifeStyle] = await Promise.all([
        getUserInformation(match.user_id).catch(() => null),
        getUserLifeStyle(match.user_id).catch(() => null),
      ]);
      setDetailInfo(info);
      setDetailLifeStyle(lifeStyle);
    } finally {
      setDetailLoading(false);
    }
  };

  // เพิ่ม user เข้า seenUserIds (Redux) แล้ว re-fetch จะ trigger อัตโนมัติ
  const advanceToNext = (seenId: string) => {
    dispatch(addSeenUserId(seenId));
  };

  const handleLike = async () => {
    const match = matches[0];
    if (!match) return;
    setLikeLoading(true);
    try {
      await createNotification({
        receiver_id: match.user_id,
        type: 'match_request',
        position_id: positionId,
        activity_id: selectedActivities[0]?.id,
      });
      advanceToNext(match.user_id);
    } catch (error: any) {
      setAlert({ visible: true, type: 'error', title: 'ข้อผิดพลาด', message: error?.message || 'ไม่สามารถส่งคำขอได้' });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSkip = () => {
    const match = matches[0];
    if (!match) return;
    advanceToNext(match.user_id);
  };

  // ─── States: loading / empty / done ─────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-400 mt-4">กำลังค้นหาเพื่อน...</Text>
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

  if (!matches[0]) {
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

  const currentMatch = matches[0];
  const matchActivities = [currentMatch.activity1, currentMatch.activity2, currentMatch.activity3].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>

      {/* ── Full-screen image gallery ── */}
      <View style={{ flex: 1 }}>
        {imageLoading || coverImages.length === 0 ? (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={handleOpenDetail}
            style={{ flex: 1, backgroundColor: '#1c1c1c', alignItems: 'center', justifyContent: 'center' }}
          >
            {imageLoading
              ? <ActivityIndicator size="large" color={colors.primary} />
              : <Ionicons name="person-circle-outline" size={120} color="#374151" />
            }
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setPhotoIndex(idx);
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ height: '100%' }}
          >
            {coverImages.map((uri, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.95}
                onPress={handleOpenDetail}
                style={{ width: SCREEN_WIDTH, height: '100%' }}
              >
                <Image
                  source={{ uri }}
                  style={{ width: SCREEN_WIDTH, height: '100%' }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Overlay ด้านบน */}
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 20 }}
          pointerEvents="box-none"
        >
          {/* Back + photo counter */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            {coverImages.length > 1 && (
              <View style={{ backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  {photoIndex + 1} / {coverImages.length}
                </Text>
              </View>
            )}
          </View>

          {/* Photo dots */}
          {coverImages.length > 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
              {coverImages.map((_, i) => (
                <View
                  key={i}
                  style={{
                    height: 3,
                    flex: 1,
                    maxWidth: 40,
                    borderRadius: 99,
                    backgroundColor: i === photoIndex ? 'white' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Info overlay — ไม่มีกล่อง ใช้ text shadow แทน */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 28, paddingHorizontal: 20 }} pointerEvents="box-none">
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 }}>
              {currentMatch.user?.user_show_name || 'ผู้ใช้'}
            </Text>
            <Text style={{ fontSize: 20, color: 'white', marginBottom: 3, textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 }}>
              {currentMatch.user?.age}
            </Text>
          </View>

          {currentMatch.position?.name && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <Ionicons name="location-outline" size={15} color="white" />
              <Text style={{ fontSize: 13, color: 'white', textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 }}>
                {currentMatch.position.name}
              </Text>
            </View>
          )}

          {matchActivities.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {matchActivities.map((act: any) => (
                <View key={act.id} style={{ backgroundColor: colors.primary, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>{act.name}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={handleOpenDetail} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="information-circle-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>แตะเพื่อดูรายละเอียด</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Action Buttons ── */}
      <View
        style={{ backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 14, paddingBottom: insets.bottom + 16, width: '100%', borderTopWidth: 1, borderTopColor: '#f3f4f6' }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* ข้าม */}
          <TouchableOpacity
            onPress={handleSkip}
            style={{ flex: 1, height: 54, borderRadius: 16, borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color="#9ca3af" />
            <Text style={{ color: '#9ca3af', fontWeight: '600', fontSize: 15 }}>ข้าม</Text>
          </TouchableOpacity>

          {/* Let's Hang Out */}
          <TouchableOpacity
            onPress={handleLike}
            disabled={likeLoading}
            style={{ flex: 2, height: 54, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            activeOpacity={0.85}
          >
            {likeLoading
              ? <ActivityIndicator size="small" color="white" />
              : <>
                  <Ionicons name="heart" size={19} color="white" />
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Let's Hang Out</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Detail Bottom Sheet ── */}
      <DetailSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        match={currentMatch}
        info={detailInfo}
        lifeStyle={detailLifeStyle}
        infoLoading={detailLoading}
      />

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => {
          setAlert({ visible: false, type: 'info', title: '', message: '' });
          if (shouldNavigateToHome) {
            setShouldNavigateToHome(false);
            navigation.navigate('Home');
          }
        }}
      />
    </View>
  );
};

export default MatchScreen;
