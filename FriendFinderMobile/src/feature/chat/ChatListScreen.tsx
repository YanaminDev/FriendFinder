// ─── ChatListScreen ────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, ScrollView, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import ChatListItem from '../../components/chat/ChatListItem';
import OnlineUserAvatar from '../../components/chat/OnlineUserAvatar';
import SearchBar from '../../components/common/SearchBar';
import { MOCK_CONVERSATIONS } from '../../constants/mockData';

const online = MOCK_CONVERSATIONS.filter(c => c.user.isOnline);

const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-white">
    <AppHeader title="Chat" />

    <View className="px-4 pt-3 pb-2">
      <SearchBar placeholder="ค้นหาการสนทนา..." onChangeText={() => {}} />
    </View>

    {/* Online users */}
    {online.length > 0 && (
      <View className="pb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {online.map(c => (
            <OnlineUserAvatar
              key={c.id}
              avatar={c.user.avatar}
              username={c.user.username}
              isOnline={c.user.isOnline}
              onPress={() => navigation.navigate('ChatDetail', { conversationId: c.id })}
            />
          ))}
        </ScrollView>
      </View>
    )}

    <View className="h-px bg-gray-100" />

    <FlatList
      data={MOCK_CONVERSATIONS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ChatListItem
          conversation={item}
          onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id })}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <Text className="text-4xl mb-3">💬</Text>
          <Text className="text-base text-gray-500">ยังไม่มีการสนทนา</Text>
        </View>
      }
    />
  </SafeAreaView>
);

export default ChatListScreen;
