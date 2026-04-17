// ─── ChatListScreen ────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import ChatListItem from '../../components/chat/ChatListItem';
import SearchBar from '../../components/common/SearchBar';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchConversations } from '../../redux/chatSlice';
import { colors } from '../../constants/theme';
import type { ChatConversation } from '../../types';
import type { Chat } from '../../service/chat.service';

// Helper function สำหรับหาสีจาก user_id
const getColorFromUserId = (userId: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper function สำหรับหา initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// แปลง Chat จาก API → ChatConversation ที่ component ใช้
const mapChatToConversation = (chat: Chat, currentUserId: string): ChatConversation => {
  const isUser1 = chat.user1_id === currentUserId;
  const otherUser = isUser1 ? chat.user2 : chat.user1;
  const lastMsg = chat.chatMessage?.[chat.chatMessage.length - 1];

  // ดึงรูปโปรไฟล์จาก user images หรือใช้ default avatar (รูปเก่าสุด)
  const userImage = (otherUser as any)?.images?.[0]?.imageUrl;
  const avatar = userImage;
  const initials = getInitials(otherUser?.user_show_name ?? otherUser?.username ?? 'Unknown');
  const avatarBgColor = getColorFromUserId(otherUser?.user_id ?? '');

  const unreadCount = chat._count?.chatMessage ?? 0;

  return {
    id: chat.id,
    user: {
      id: otherUser?.user_id ?? '',
      username: otherUser?.username ?? 'Unknown',
      name: otherUser?.user_show_name ?? otherUser?.username ?? 'Unknown',
      avatar: avatar,
      initials: initials,
      avatarBgColor: avatarBgColor,
      age: 0,
      gender: 'Male',
      isOnline: (otherUser as any)?.isOnline ?? false,
    },
    lastMessage: lastMsg?.chatType === 'image' ? 'รูปภาพ' : (lastMsg?.message ?? ''),
    lastMessageType: lastMsg?.chatType,
    lastMessageTime: lastMsg
      ? new Date(lastMsg.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      : '',
    unreadCount,
  };
};

const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { maxContentWidth } = useResponsive();
  const currentUserId = useAppSelector(state => state.user.user_id);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const { conversations, loadingConversations } = useAppSelector(state => state.chat);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUserId && isAuthenticated) {
      dispatch(fetchConversations(currentUserId));
    }
  }, [currentUserId, isAuthenticated]);

  // Refetch ทุกครั้งที่กดเข้าหน้านี้
  useFocusEffect(
    useCallback(() => {
      if (currentUserId && isAuthenticated) {
        dispatch(fetchConversations(currentUserId));
      }
    }, [currentUserId, isAuthenticated])
  );

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (currentUserId && isAuthenticated) {
        await dispatch(fetchConversations(currentUserId));
      }
    } finally {
      setRefreshing(false);
    }
  }, [currentUserId, isAuthenticated, dispatch]);


  const mappedConversations = conversations.map(chat =>
    mapChatToConversation(chat, currentUserId)
  );

  // Filter conversations by search text
  const filteredConversations = mappedConversations.filter(conv => {
    const searchLower = searchText.toLowerCase().trim();
    if (!searchLower) return true;

    return (
      conv.user.name.toLowerCase().includes(searchLower) ||
      conv.user.username.toLowerCase().includes(searchLower)
    );
  });

  // Filter only online friends
  const onlineFriends = mappedConversations.filter(conv => conv.user.isOnline);

  return (
    <SafeAreaViewContext className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="Chat" />

      <View className="bg-white" style={{ alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 }}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="ค้นหาการสนทนา..."
          />
        </View>
      </View>

      <View className="h-px bg-gray-100" />

      {/* Online Friends Section */}
      {onlineFriends.length > 0 && (
        <View className="bg-white py-4 border-b border-gray-100" style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: maxContentWidth }}>
            <Text className="px-4 mb-3 text-sm font-semibold text-gray-900">เพื่อนออนไลน์</Text>
            <FlatList
              horizontal
              data={onlineFriends}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="items-center px-2"
                  onPress={() =>
                    navigation.navigate('ChatDetail', {
                      conversationId: item.id,
                      otherUsername: item.user.name,
                      otherAvatar: item.user.avatar,
                    })
                  }
                >
                  <View className="relative w-16 h-16 mb-2">
                    {item.user.avatar ? (
                      <Image
                        source={{ uri: item.user.avatar }}
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                    ) : (
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: (item.user as any).avatarBgColor }}
                      >
                        <Text className="text-white text-lg font-bold">
                          {(item.user as any).initials}
                        </Text>
                      </View>
                    )}
                    {item.user.isOnline && (
                      <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-online border-2 border-white" />
                    )}
                  </View>
                  <Text className="text-xs text-gray-900 text-center w-16" numberOfLines={1} ellipsizeMode="tail">
                    {item.user.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            />
          </View>
        </View>
      )}

      {loadingConversations ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ec4899" />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: '100%', maxWidth: maxContentWidth }}>
                <ChatListItem
                  conversation={item}
                  onPress={() =>
                    navigation.navigate('ChatDetail', {
                      conversationId: item.id,
                      otherUsername: item.user.name,
                      otherAvatar: item.user.avatar || null,
                      otherInitials: (item.user as any).initials,
                      otherAvatarBgColor: (item.user as any).avatarBgColor,
                    })
                  }
                />
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="chatbubbles" size={48} color={colors.gray300} style={{ marginBottom: 12 }} />
              <Text className="text-base text-gray-500">ยังไม่มีการสนทนา</Text>
            </View>
          }
        />
      )}
    </SafeAreaViewContext>
  );
};

export default ChatListScreen;
