// ─── SelectActivityScreen ──────────────────────────────────────────────────────

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types';
import { colors } from '../../constants/theme';
import { getActivity } from '../../service/activity.service';
import { getAllPositions, Position } from '../../service/position.service';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSelectedActivities, setPositionId, setIsFinding, setUserLocation } from '../../redux/findMatchSlice';
import { useResponsive } from '../../hooks/useResponsive';
import { useUserLocation } from '../../hooks/useUserLocation';
import { createFindMatch } from '../../service/find_match.service';
import AlertModal from '../../components/common/AlertModal';


// ─── Popular Chip ─────────────────────────────────────────────────────────────
const PopularChip: React.FC<{
  activity: Activity;
  selected: boolean;
  onPress: () => void;
}> = ({ activity, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${
      selected
        ? 'bg-primary border-primary'
        : 'bg-white border-gray-200'
    }`}
  >
    <Ionicons
      name={activity.icon as any}
      size={15}
      color={selected ? '#fff' : colors.primary}
      style={{ marginRight: 5 }}
    />
    <Text
      className={`text-sm font-medium ${
        selected ? 'text-white' : 'text-gray-700'
      }`}
    >
      {activity.name}
    </Text>
  </TouchableOpacity>
);

// ─── Recommended Card ─────────────────────────────────────────────────────────
const RecommendedCard: React.FC<{
  activity: Activity;
  selected: boolean;
  onPress: () => void;
}> = ({ activity, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`flex-1 m-2 rounded-2xl border items-center py-5 ${
      selected ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'
    }`}
    style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
  >
    <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-3">
      <Ionicons name={activity.icon as any} size={32} color={selected ? colors.primary : colors.gray400} />
    </View>
    <Text className={`text-sm font-medium ${selected ? 'text-primary' : 'text-gray-700'}`}>
      {activity.name}
    </Text>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SelectActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { maxContentWidth } = useResponsive();
  const userId = useAppSelector((state) => state.user.user_id);
  const { userLocation } = useUserLocation();

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch]     = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]   = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [finding, setFinding] = useState(false);
  const [alert, setAlert] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }>({ visible: false, type: 'info', title: '', message: '' });

  // ── fetch activities และ positions ──────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesData, positionsData] = await Promise.all([
          getActivity(),
          getAllPositions(),
        ]);

        // สุ่มเลือก activities
        const shuffled = [...activitiesData].sort(() => Math.random() - 0.5);

        // Popular = ขั้นต่ำ 4 ตัว หรือ 30% เเล้วแต่ว่ามากกว่า (แต่ไม่เกิน 70% ของทั้งหมด)
        const popularIds = new Set(activitiesData.map((a: any) => a.id));

        const recommendedCount = Math.min(4, activitiesData.length);
        const recommendedIds = new Set(shuffled.slice(0, recommendedCount).map((a: any) => a.id));

        const mapped: Activity[] = activitiesData.map((a: any) => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
          isPopular: popularIds.has(a.id),
          isRecommended: recommendedIds.has(a.id),
        }));
        setActivities(mapped);
        setPositions(positionsData);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── filter by search ───────────────────────────────────────────────────────
  const filtered = activities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const popular     = filtered.filter((a) => a.isPopular);
  const recommended = filtered.filter((a) => a.isRecommended);

  const handleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const handleFindFriend = async () => {
    const selectedData = activities
      .filter((a) => selected.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, icon: a.icon }));

    dispatch(setSelectedActivities(selectedData));

    // หา position ที่ใกล้กับ user มากที่สุด
    if (!userLocation || positions.length === 0) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'ไม่พบสถานที่',
        message: 'ไม่สามารถหาสถานที่ใกล้เคียง กรุณาเปิด GPS',
      });
      return;
    }

    const lat = userLocation.latitude;
    const lng = userLocation.longitude;
    let nearest: Position | null = null;
    let minDistance = Infinity;

    for (const pos of positions) {
      const dist = Math.sqrt(
        Math.pow(pos.latitude - lat, 2) +
        Math.pow(pos.longitude - lng, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = pos;
      }
    }

    if (!nearest) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'ไม่พบสถานที่',
        message: 'ไม่พบสถานที่ใกล้เคียง',
      });
      return;
    }

    // เริ่มค้นหา
    setFinding(true);
    try {
      await createFindMatch({
        user_id: userId,
        position_id: nearest.id,
        activity_id1: selectedData[0]?.id,
        activity_id2: selectedData[1]?.id,
        activity_id3: selectedData[2]?.id,
      });

      dispatch(setUserLocation({ latitude: lat, longitude: lng }));
      dispatch(setPositionId(nearest.id));
      dispatch(setIsFinding(true));

      navigation.navigate('Match');
    } catch (error: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: error?.message || 'ไม่สามารถค้นหาได้',
      });
    } finally {
      setFinding(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Header ── */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 -ml-9">
          Select Activity
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110, alignItems: 'center' }}
      >
      <View style={{ width: '100%', maxWidth: maxContentWidth }}>
        {/* ── Hero text ── */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-900">What are you up for?</Text>
          <Text className="text-sm text-gray-400 mt-1">
            Pick things you'd love to do with someone today
          </Text>
        </View>

        {/* ── Search bar ── */}
        <View className="mx-5 mb-5">
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
            <Ionicons name="search-outline" size={18} color={colors.gray400} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search activities"
              placeholderTextColor={colors.gray400}
              className="flex-1 ml-2 text-sm text-gray-800"
            />
          </View>
        </View>

        {/* ── Popular Activity ── */}
        {popular.length > 0 && (
          <View className="mb-6">
            <Text className="px-5 text-xs font-bold text-gray-400 tracking-widest mb-3">
              POPULAR ACTIVITY
            </Text>
            <View className="flex-row flex-wrap px-5 gap-y-2">
              {popular.map((act) => (
                <PopularChip
                  key={act.id}
                  activity={act}
                  selected={selected.includes(act.id)}
                  onPress={() => handleSelect(act.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Recommended For You ── */}
        {recommended.length > 0 && (
          <View className="px-3">
            <Text className="px-2 text-xs font-bold text-gray-400 tracking-widest mb-3">
              RECOMMENDED FOR YOU
            </Text>
            {loading ? (
              <ActivityIndicator color={colors.primary} className="mt-4" />
            ) : (
              <View className="flex-row flex-wrap">
                {recommended.map((act) => (
                  <View key={act.id} style={{ width: '50%' }}>
                    <RecommendedCard
                      activity={act}
                      selected={selected.includes(act.id)}
                      onPress={() => handleSelect(act.id)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
      </ScrollView>

      {/* ── Find Friend Button ── */}
      <View
        className="absolute bottom-0 left-0 right-0 pt-3 bg-white border-t border-gray-100"
        style={{ paddingBottom: Math.max(insets.bottom + 16, 36), alignItems: 'center' }}
      >
      <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={handleFindFriend}
          disabled={selected.length === 0 || finding}
          activeOpacity={0.85}
          className={`h-14 rounded-full items-center justify-center ${
            selected.length > 0 && !finding ? 'bg-primary' : 'bg-primary opacity-50'
          }`}
        >
          {finding ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-base font-semibold tracking-wide">
              Find Friend ({selected.length}/3)
            </Text>
          )}
        </TouchableOpacity>
      </View>
      </View>

      {/* ── Loading Popup ── */}
      <Modal visible={finding} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-3xl px-8 py-10 items-center w-72">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-6 text-lg font-semibold text-gray-900 text-center">
              กำลังค้นหาเพื่อน
            </Text>
            <Text className="mt-2 text-sm text-gray-500 text-center">
              กรุณารอสักครู่...
            </Text>
          </View>
        </View>
      </Modal>

      {/* ── Alert Modal ── */}
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

export default SelectActivityScreen;
