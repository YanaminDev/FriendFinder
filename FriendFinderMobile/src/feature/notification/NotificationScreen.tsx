// ─── NotificationScreen ────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import NotificationItem from '../../components/notification/NotificationItem';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';
import { useResponsive } from '../../hooks/useResponsive';

const NotificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth } = useResponsive();
  return (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader title="Notification" showBack onBackPress={() => navigation.goBack()} />
    <FlatList
      data={MOCK_NOTIFICATIONS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: maxContentWidth }}>
            <NotificationItem
              notification={item}
              onPass={() => {}}
              onHangOut={() => navigation.navigate('Match')}
              onViewDetails={() => navigation.navigate('Match')}
            />
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <Text className="text-4xl mb-3">🔔</Text>
          <Text className="text-base text-gray-500">ยังไม่มีการแจ้งเตือน</Text>
        </View>
      }
    />
  </SafeAreaView>
  );
};

export default NotificationScreen;
