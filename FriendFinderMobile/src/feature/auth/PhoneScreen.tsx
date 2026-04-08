// ─── PhoneScreen ──────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppLogo from '../../components/common/AppLogo';
import Button from '../../components/common/Button';

const PhoneScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity className="px-5 pt-3" onPress={() => navigation.goBack()}>
          <Text className="text-3xl text-primary font-bold leading-8">‹</Text>
        </TouchableOpacity>

        <View className="flex-1 px-6">
          <View className="items-center my-6">
            <AppLogo size="md" />
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-6">หมายเลขโทรศัพท์ของคุณ</Text>

          {/* Input row */}
          <View className="flex-row gap-3 items-center">
            {/* Country code */}
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-full px-3.5 h-[52px] gap-1.5">
              <Text className="text-base text-gray-900 font-medium">+66</Text>
              <Text className="text-xs text-gray-500">▼</Text>
            </TouchableOpacity>

            {/* Phone number */}
            <View className="flex-1 border border-gray-300 rounded-full px-4 h-[52px] justify-center">
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="ใส่หมายเลขที่นี่"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                maxLength={10}
                className="text-base text-gray-900 p-0"
              />
            </View>
          </View>
        </View>

        <View className="px-6 pb-8">
          <Button
            label="ดำเนินการต่อ"
            onPress={() => navigation.navigate('OtpVerification', { phone: `+66${phone}` })}
            disabled={phone.length < 9}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneScreen;
