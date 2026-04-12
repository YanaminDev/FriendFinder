// ─── SelectActivityScreen ──────────────────────────────────────────────────────

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../../types';
import { colors } from '../../constants/theme';
import { getActivity } from '../../service/activity.service';
import { useAppDispatch } from '../../redux/hooks';
import { setSelectedActivities } from '../../redux/findMatchSlice';


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
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch]     = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]   = useState(false);

  // ── fetch จาก backend ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getActivity();

        // สุ่มเลือก activities
        const shuffled = [...data].sort(() => Math.random() - 0.5);

        // Popular = ขั้นต่ำ 4 ตัว หรือ 30% เเล้วแต่ว่ามากกว่า (แต่ไม่เกิน 70% ของทั้งหมด)
        const popularIds = new Set(data.map((a: any) => a.id));

        const recommendedCount = Math.min(4, data.length);
        const recommendedIds = new Set(shuffled.slice(0, recommendedCount).map((a: any) => a.id));

        const mapped: Activity[] = data.map((a: any) => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
          isPopular: popularIds.has(a.id),
          isRecommended: recommendedIds.has(a.id),
        }));
        setActivities(mapped);
      } catch (err) {
        console.error('Failed to load activities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
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

  const handleFindFriend = () => {
    const selectedData = activities
      .filter((a) => selected.includes(a.id))
      .map((a) => ({ id: a.id, name: a.name, icon: a.icon }));
    dispatch(setSelectedActivities(selectedData));
    navigation.navigate('Home');
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
        contentContainerStyle={{ paddingBottom: 110 }}
      >
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
      </ScrollView>

      {/* ── Find Friend Button ── */}
      <View
        className="absolute bottom-0 left-0 right-0 px-5 pt-3 bg-white border-t border-gray-100"
        style={{ paddingBottom: Math.max(insets.bottom + 16, 36) }}
      >
        <TouchableOpacity
          onPress={handleFindFriend}
          disabled={selected.length === 0}
          activeOpacity={0.85}
          className={`h-14 rounded-full items-center justify-center ${
            selected.length > 0 ? 'bg-primary' : 'bg-primary opacity-50'
          }`}
        >
          <Text className="text-white text-base font-semibold tracking-wide">
            Find Friend ({selected.length}/3)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectActivityScreen;
