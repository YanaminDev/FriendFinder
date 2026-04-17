// ─── ChatDetailScreen ──────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../components/common/AppHeader';
import MessageBubble from '../../components/chat/MessageBubble';
import AlertModal from '../../components/common/AlertModal';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMessages, clearMessages, addMessage } from '../../redux/chatSlice';
import { useSocket } from '../../hooks/useSocket';
import { uploadChatImage } from '../../service/chat_message.service';
import { colors } from '../../constants/theme';
import { deleteChat } from '../../service/chat.service';

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const getColorFromName = (name: string): string => {
  const colorList = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colorList[Math.abs(hash) % colorList.length];
};

const ChatDetailScreen: React.FC<{
  navigation: any;
  route: { params: { conversationId: string; otherUsername?: string; otherAvatar?: string; otherInitials?: string; otherAvatarBgColor?: string } };
}> = ({ navigation, route }) => {
  const { conversationId, otherUsername = 'Chat', otherAvatar, otherInitials: passedInitials, otherAvatarBgColor: passedBgColor } = route.params;
  const otherInitials = passedInitials || getInitials(otherUsername);
  const otherAvatarBgColor = passedBgColor || getColorFromName(otherUsername);

  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(state => state.user.user_id);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const { currentMessages, loadingMessages } = useAppSelector(state => state.chat);

  const [text, setText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingChat, setDeletingChat] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { sendMessage } = useSocket(conversationId);
  const { maxContentWidth } = useResponsive();

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchMessages(conversationId));
    return () => {
      dispatch(clearMessages());
    };
  }, [conversationId, isAuthenticated]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({
      chat_id: conversationId,
      message: text.trim(),
      sender_id: currentUserId,
      chatType: 'text',
    });
    setText('');
  };


  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตการเข้าถึงคลังรูปภาพ');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await sendImage(result.assets[0].uri, result.assets[0].mimeType ?? 'image/jpeg');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตการเข้าถึงกล้อง');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await sendImage(result.assets[0].uri, result.assets[0].mimeType ?? 'image/jpeg');
    }
  };

  const sendImage = async (uri: string, mimeType: string) => {
    setUploadingImage(true);
    try {
      const { imageUrl } = await uploadChatImage(uri, mimeType);

      // Optimistic add ฝั่ง sender ทันที (ไม่รอ socket echo)
      const tempId = `temp_${Date.now()}`;
      dispatch(addMessage({
        id: tempId,
        chat_id: conversationId,
        message: imageUrl,
        sender_id: currentUserId,
        createdAt: new Date().toISOString(),
        chatType: 'image',
        isRead: false,
        status: 'sent',
      }));

      sendMessage({
        chat_id: conversationId,
        message: imageUrl,
        sender_id: currentUserId,
        chatType: 'image',
      });
    } catch {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถส่งรูปภาพได้ กรุณาลองใหม่');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteChat = () => {
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteAlert(false);
    setDeletingChat(true);
    try {
      await deleteChat(conversationId);
      dispatch(clearMessages());
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setDeletingChat(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title={otherUsername}
        showBack
        onBackPress={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            onPress={handleDeleteChat}
            disabled={deletingChat}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        enabled
      >
        {loadingMessages ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#ec4899" />
          </View>
        ) : (
          <FlatList
            data={[...currentMessages].reverse()}
            inverted
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={{
                  id: item.id,
                  senderId: item.sender_id,
                  text: item.message,
                  timestamp: new Date(item.createdAt).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  isMine: item.sender_id === currentUserId,
                  isRead: item.isRead ?? false,
                  chatType: item.chatType,
                }}
                otherAvatar={otherAvatar}
                otherInitials={otherInitials}
                otherAvatarBgColor={otherAvatarBgColor}
                showAvatar
              />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-20" style={{ transform: [{ scaleY: -1 }] }}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.gray300} style={{ marginBottom: 12 }} />
                <Text className="text-base text-gray-500">เริ่มการสนทนาได้เลย</Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View className="border-t border-gray-100 bg-white" style={{ alignItems: 'center' }}>
        <View className="flex-row items-center px-3 py-3 gap-2" style={{ width: '100%', maxWidth: maxContentWidth }}>
          {/* Camera */}
          <TouchableOpacity
            onPress={takePhoto}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            activeOpacity={0.7}
            disabled={uploadingImage}
          >
            <Ionicons name="camera-outline" size={22} color="#6b7280" />
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity
            onPress={pickFromGallery}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            activeOpacity={0.7}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color="#ec4899" />
            ) : (
              <Ionicons name="image-outline" size={22} color="#6b7280" />
            )}
          </TouchableOpacity>

          <View className="flex-1 bg-gray-100 rounded-full px-4 h-11 justify-center">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="พิมพ์ข้อความ..."
              placeholderTextColor="#9ca3af"
              className="text-base text-gray-900 p-0"
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            className="w-11 h-11 bg-primary rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg">➤</Text>
          </TouchableOpacity>
        </View>
        </View>
      </KeyboardAvoidingView>

      <AlertModal
        visible={showDeleteAlert}
        type="warning"
        title="ลบห้องแชท"
        message="ยืนยันที่จะลบห้องแชท? ไม่สามารถกู้คืนได้"
        buttonLabel="ลบ"
        onPress={handleConfirmDelete}
        secondaryButtonLabel="ยกเลิก"
        onSecondaryPress={() => setShowDeleteAlert(false)}
      />
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
