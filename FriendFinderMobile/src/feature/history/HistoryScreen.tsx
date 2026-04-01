// ─── HistoryScreen ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import HistoryCard from '../../components/history/HistoryCard';
import { MOCK_HISTORY } from '../../constants/mockData';

const HistoryScreen: React.FC = () => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader title="History" />
    <FlatList
      data={MOCK_HISTORY}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <HistoryCard item={item} />}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <Text className="text-4xl mb-3">🕐</Text>
          <Text className="text-base text-gray-500">ยังไม่มีประวัติ</Text>
        </View>
      }
    />
  </SafeAreaView>
);

export default HistoryScreen;
