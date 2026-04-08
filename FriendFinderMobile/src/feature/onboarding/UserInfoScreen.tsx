// ─── UserInfoScreen ───────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';

const UserInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity className="px-5 pt-3" onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <ScrollView className="flex-1 px-7" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="items-center my-6">
            <AppLogo size="md" showText={false} />
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-1">ข้อมูลของคุณ</Text>
          <Text className="text-sm text-gray-500 mb-7">ใส่รูปโปรไฟล์และชื่อของคุณ</Text>

          {/* Avatar picker */}
          <View className="items-center mb-8">
            <TouchableOpacity className="w-28 h-28 rounded-full bg-primary-light items-center justify-center border-2 border-dashed border-primary">
              <Text className="text-4xl">📷</Text>
              <Text className="text-xs text-primary font-medium mt-1">เพิ่มรูป</Text>
            </TouchableOpacity>
          </View>

          {/* Name input */}
          <Text className="text-sm font-semibold text-gray-700 mb-2">ชื่อของคุณ</Text>
          <View className="border border-gray-300 rounded-xl px-4 h-[52px] justify-center">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="ใส่ชื่อของคุณ"
              placeholderTextColor="#9ca3af"
              className="text-base text-gray-900 p-0"
              returnKeyType="done"
            />
          </View>
          <Text className="text-xs text-gray-400 mt-2">ชื่อที่แสดงในแอปจะเป็นชื่อนี้</Text>
        </ScrollView>

        <View className="px-7 pb-12">
          <Button
            label="ดำเนินการต่อ"
            onPress={() => navigation.navigate('Gender')}
            disabled={name.trim().length < 2}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;
