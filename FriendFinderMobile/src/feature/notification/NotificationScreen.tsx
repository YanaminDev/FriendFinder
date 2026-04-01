// ─── NotificationScreen ────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import NotificationItem from '../../components/notification/NotificationItem';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';

const NotificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader title="Notification" showBack onBackPress={() => navigation.goBack()} />
    <FlatList
      data={MOCK_NOTIFICATIONS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          notification={item}
          onPass={() => {}}
          onHangOut={() => navigation.navigate('Match')}
          onViewDetails={() => navigation.navigate('Match')}
        />
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

export default NotificationScreen;
