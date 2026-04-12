// ─── HistoryScreen ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import HistoryCard from '../../components/history/HistoryCard';
import { MOCK_HISTORY } from '../../constants/mockData';
import { colors } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

const HistoryScreen: React.FC = () => {
  const { maxContentWidth } = useResponsive();
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="History" />
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '100%', maxWidth: maxContentWidth }}>
              <HistoryCard item={item} />
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
    </SafeAreaView>
  );
};

export default HistoryScreen;
