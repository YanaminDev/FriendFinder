// ─── EditProfileScreen ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import { MOCK_CURRENT_USER } from '../../constants/mockData';

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState(MOCK_CURRENT_USER.name);
  const [bio, setBio] = useState(MOCK_CURRENT_USER.bio);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title="แก้ไขโปรไฟล์" showBack onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 20 }}>

          {/* Avatar */}
          <View className="items-center">
            <View className="relative">
              <Image
                source={{ uri: MOCK_CURRENT_USER.avatar }}
                className="w-24 h-24 rounded-full bg-gray-200"
              />
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
                <Text className="text-xs text-white">📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-gray-700">ชื่อที่แสดง</Text>
            <View className="border border-gray-300 rounded-xl px-4 h-[52px] justify-center">
              <TextInput
                value={name}
                onChangeText={setName}
                className="text-base text-gray-900 p-0"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Bio */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-gray-700">เกี่ยวกับตัวคุณ</Text>
            <View className="border border-gray-300 rounded-xl px-4 py-3 h-[100px]">
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                placeholder="เขียนอธิบายเกี่ยวกับตัวคุณ..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
                textAlignVertical="top"
              />
            </View>
          </View>

          <Button
            label="บันทึก"
            onPress={() => navigation.goBack()}
            disabled={name.trim().length < 2}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
