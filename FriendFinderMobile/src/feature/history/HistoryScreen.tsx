// ─── HistoryScreen ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import HistoryCard from '../../components/history/HistoryCard';
import { MOCK_HISTORY } from '../../constants/mockData';
import { colors } from '../../constants/theme';

const HistoryScreen: React.FC = () => {
  const [scrollOffset] = useState(new Animated.Value(0));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Animated.View
        style={{
          transform: [
            {
              translateY: scrollOffset.interpolate({
                inputRange: [0, 60],
                outputRange: [0, -60],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <AppHeader title="History" />
      </Animated.View>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
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
